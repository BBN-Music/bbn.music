import { BasicEntry } from "shared/components.ts";
import { ProfileData, RegisterAuthRefresh, sheetStack, showProfilePicture } from "shared/helper.ts";
import { placeholder } from "shared/mod.ts";
import { asRef, Box, Content, createPage, createRoute, DateInput, DropDown, Empty, Entry, Grid, Label, PrimaryButton, SheetHeader, Spinner, TextInput, WriteSignal } from "webgen/mod.ts";
import { API, PaymentType, SearchReturn, stupidErrorAlert, User, Wallet, zAccountType } from "../../../spec/mod.ts";
import { WalletView } from "../../wallet/component.ts";
import { ReviewEntry } from "../entries.ts";

await RegisterAuthRefresh();

const searchString = new WriteSignal<string | undefined>(undefined);
const search = asRef<SearchReturn[] | "loading" | undefined>(undefined);

searchString.listen(async (val) => {
    if (val) {
        search.setValue("loading");
        search.setValue(
            await API.getQueryBySearchByAdmin({
                path: {
                    query: val,
                },
            }).then(stupidErrorAlert),
        );
    } else {
        search.setValue(undefined);
    }
});

const userSheet = async (user: User) => {
    const drops = await API.getDropsByAdmin({ query: { user: user._id } }).then(stupidErrorAlert);
    const wallet = await API.getIdByWalletsByAdmin({ path: { id: user._id } }).then(stupidErrorAlert);
    return Grid(
        SheetHeader("User", sheetStack),
        Grid(
            showProfilePicture(user as ProfileData).setHeight("100px").setWidth("100px"),
            Grid(
                Label(`Id: ${user._id}`),
                Label(`Username: ${user.profile.username}`),
                Label(`Email: ${user.profile.email} (${user.profile.verified ? "" : "un"}verified)`),
                Label(`Groups: ${user.groups.join(", ")}`),
            ),
            Grid(
                Label("Wallet"),
                Label(`Restrained: ${wallet.balance?.restrained.toFixed(2) ?? "No wallet"}`),
                Label(`Unrestrained: ${wallet.balance?.unrestrained.toFixed(2) ?? "No wallet"}`),
                Label(`Generated: ${wallet.transactions?.filter((t) => t.amount > 0).map((t) => t.amount).reduce((a, b) => a + b, 0).toFixed(2) ?? "No wallet"}`),
                PrimaryButton("View Transactions").setDisabled(!wallet._id).onClick(() => {
                    sheetStack.addSheet(Box(walletSheet(asRef(wallet))));
                }),
            ),
        ).setTemplateColumns("auto 1fr 1fr").setGap(),
        Grid(
            Label("Drops").setTextSize("2xl").setFontWeight("bold"),
            ...drops.map((drop) => ReviewEntry(drop, true)),
        ),
    ).setGap();
};

const walletSheet = (wallet: WriteSignal<Wallet>) => {
    const selectedAccountType = asRef(wallet.getValue().accountType);
    selectedAccountType.listen(async (val, oldVal) => {
        if (!oldVal) {
            return;
        }
        await API.patchIdByWalletsByAdmin({ path: { id: wallet.getValue()._id }, body: { accountType: val } }).then(stupidErrorAlert);
        wallet.setValue({ ...wallet.getValue(), accountType: val });
    });

    const selectedCut = asRef(String(wallet.getValue().cut));
    selectedCut.listen(async (val, oldVal) => {
        if (!oldVal) {
            return;
        }
        await API.patchIdByWalletsByAdmin({ path: { id: wallet.getValue()._id }, body: { cut: val } }).then(stupidErrorAlert);
        wallet.setValue({ ...wallet.getValue(), cut: Number(val) });
    });
    return Grid(
        SheetHeader("Wallet", sheetStack),
        Grid(
            DropDown(Object.values(zAccountType.Values), selectedAccountType, "AccountType"),
            TextInput(selectedCut, "Cut", "change"),
            PrimaryButton("Add Transaction").onClick(() => sheetStack.addSheet(addTransactionSheet(wallet))),
        ).setEvenColumns(3).setGap(),
        wallet.map((wallet) => WalletView(wallet)).value,
    );
};

const addTransactionSheet = (wallet: WriteSignal<Wallet>) => {
    const amount = asRef("0");
    const type = asRef<PaymentType>("UNRESTRAINED");
    const timestamp = asRef(new Date().toISOString());
    const description = asRef("PayPal Payout");
    const counterParty = asRef("PayPal");
    return Grid(
        SheetHeader("Add Transaction", sheetStack),
        Grid(
            DateInput(timestamp, "Date"),
            TextInput(amount, "Amount"),
            DropDown(["UNRESTRAINED", "RESTRAINED"], type, "TransactionType"),
            TextInput(description, "Description"),
            TextInput(counterParty, "Counter Party"),
            PrimaryButton("Add Transaction").onPromiseClick(async () => {
                const walletobj = wallet.getValue();
                walletobj.transactions.push({
                    amount: Number(amount.getValue()),
                    type: type.getValue(),
                    timestamp: String(new Date(timestamp.getValue() + "T00:00:00.000Z").getTime()),
                    description: description.getValue(),
                    counterParty: counterParty.getValue(),
                });
                await API.patchIdByWalletsByAdmin({ path: { id: walletobj._id }, body: { transactions: walletobj.transactions } });
                wallet.setValue(walletobj);
                sheetStack.removeOne();
            }),
        ).setDynamicColumns(20).setGap(),
    ).setGap();
};

createPage(
    {
        route: createRoute({
            path: "/admin?list=search",
        }),
        label: "Search",
        weight: 2,
    },
    Content(
        TextInput(searchString, "Search"),
        Box(search.map((search) =>
            Grid(
                search === "loading" ? Spinner() : Empty(),
                search === undefined ? placeholder("Start Searching", "Type in the search bar to get started") : Empty(),
                ...(search !== "loading" && search !== undefined
                    ? search.map((it) => {
                        switch (it._index) {
                            case "drops":
                                return ReviewEntry(it._source);
                            case "users":
                                return Entry(BasicEntry(it._source.profile.username, `${it._source._id} - ${it._source.profile.email}`)).onPromiseClick(async () => {
                                    sheetStack.addSheet(await userSheet(it._source));
                                });
                            case "songs":
                                return Entry(BasicEntry(it._source.title ?? "(no title)", `Id: ${it._source._id} User: ${it._source.user}`));
                            case "wallets":
                                return Entry(BasicEntry(it._source.user, `${it._source.balance?.restrained ?? 0} + ${it._source.balance?.unrestrained ?? 0}`));
                            default:
                                return Empty();
                        }
                    })
                    : [Empty()]),
            )
        )),
    ),
);
