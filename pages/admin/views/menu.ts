import { debounce } from "@std/async";
import { sumOf } from "@std/collections";
import loader from "https://esm.sh/@monaco-editor/loader@1.4.0";
import { activeUser, sheetStack, showProfilePicture } from "shared/helper.ts";
import { HeavyList, loadMore, Navigation, placeholder } from "shared/mod.ts";
import { asRef, asState, Box, Button, Color, Custom, Entry, Grid, Horizontal, isMobile, lazy, ref, SheetDialog, Spacer, Table, TextInput } from "webgen/mod.ts";
import { API, stupidErrorAlert } from "../../../spec/mod.ts";
import { upload } from "../loading.ts";
import { state } from "../state.ts";
import { ReviewEntry } from "./entryReview.ts";
import { GroupEntry } from "./entryUser.ts";
import { entryFile, entryOAuth, entryWallet } from "./list.ts";

const lazyMonaco = lazy(() => loader.init());

export const adminMenu = Navigation({
    title: ref`Hi ${activeUser.$username} 👋`,
    categories: [
        {
            id: "overview",
            title: `Overview`,
            children: state.$payouts.map((it) =>
                it === "loading" || it.status === "rejected"
                    ? [
                        HeavyList(state.$payouts, () => Box()),
                    ]
                    : [
                        {
                            id: "streams",
                            title: "Total Streams",
                            subtitle: it ? `${sumOf(it.value, (payouts) => sumOf(payouts, (payout) => sumOf(payout.entries, (entry) => sumOf(entry.data, (data) => data.quantity)))).toLocaleString()} Streams` : "Loading...",
                        },
                        {
                            id: "revenue",
                            title: "Calculated Revenue",
                            subtitle: it ? `£ ${sumOf(it.value, (payouts) => sumOf(payouts, (payout) => sumOf(payout.entries, (entry) => sumOf(entry.data, (data) => data.revenue)))).toFixed(2)}` : "Loading...",
                        },
                        {
                            id: "bbnmoney",
                            title: "BBN Revenue",
                            subtitle: state.$wallets.map((it) => it == "loading" ? `---` : it.status == "rejected" ? "(failed)" : `£ ${sumOf(Object.values(it.value.find((wallet) => wallet.user === "62ea6fa5321b3702e93ca21c")?.balance!), (e) => e).toFixed(2)}` ?? 0),
                        },
                    ]
            ),
        },
        {
            id: "search",
            title: `Search`,
            children: [
                TextInput("text", "Search").onChange(debounce(async (data) => {
                    if (!data) return;
                    state.$search.setValue("loading");
                    state.$searchQuery.setValue(data);
                    await API.getQueryBySearchByAdmin({ path: { query: data } }).then(stupidErrorAlert).then((x) => state.$search.setValue(x));
                }, 1000)),
                HeavyList(state.$search, (it) => {
                    switch (it._index) {
                        case "transcripts":
                            return Entry(
                                {
                                    title: it._source.with,
                                    subtitle: it._index,
                                },
                            );
                        case "drops":
                            return ReviewEntry(it._source);
                        case "users":
                            return Entry({
                                title: it._source.profile.username,
                                subtitle: `${it._source._id} - ${it._source.profile.email}`,
                            })
                                .addClass("small")
                                .onPromiseClick(async () => {
                                    const monaco = await lazyMonaco();
                                    const box = document.createElement("div");
                                    monaco.editor.create(box, {
                                        value: JSON.stringify(it._source, null, 2),
                                        language: "json",
                                        theme: "vs-dark",
                                        automaticLayout: true,
                                    });

                                    SheetDialog(sheetStack, "User", Custom(box).setHeight("800px").setWidth("1200px")).open();
                                })
                                .addPrefix(showProfilePicture(it._source));
                        case "files":
                            return entryFile(it._source);
                        case "user-events":
                            return Entry({
                                title: it._source.type,
                                subtitle: `${it._source.userId} - ${it._source.ip}`,
                            });
                        case "empty":
                            return placeholder("Start Searching", "Type in the search bar to get started");
                        case "none":
                            return placeholder("No Results", "Try a different search term");
                    }
                })
                    .enablePaging((offset, limit) => loadMore(state.$search, () => API.admin.search(state.searchQuery, offset, limit))),
            ],
        },
        {
            id: "drops",
            title: ref`Drops`,
            children: [
                {
                    id: "reviews",
                    title: ref`Reviews`,
                    children: [
                        HeavyList(state.drops.$reviews, (it) => ReviewEntry(it))
                            .setPlaceholder(placeholder("No Drops", "Welcome! Create a server to get going. 🤖🛠️")),
                    ],
                },
                {
                    id: "publishing",
                    title: ref`Publishing`,
                    children: [
                        HeavyList(state.drops.$publishing, (it) => ReviewEntry(it))
                            .setPlaceholder(placeholder("No Drops", "Welcome! Create a server to get going. 🤖🛠️")),
                    ],
                },
            ],
        },
        {
            id: "groups",
            title: ref`Groups`,
            children: [
                HeavyList(state.$groups, (val) => GroupEntry(val)),
            ],
        },
        {
            id: "payouts",
            title: ref`Payout`,
            children: state.$payouts.map((payoutsdata) => [
                {
                    title: "Upload Payout File (.xlsx)",
                    id: "upload+manual",
                    clickHandler: () => {
                        upload("manual");
                    },
                },
                {
                    title: "Sync Mapping with internal Backend",
                    id: "sync",
                    clickHandler: async () => {
                        await API.admin.drops.sync();
                    },
                },
                ...payoutsdata === "loading" ? [Box()] : payoutsdata.map((payout) => ({
                    title: payout.period,
                    id: `payouts${payout.period}`,
                    subtitle: `£ ${payout.sum.toFixed(2)}`,
                })),
            ]),
        },
        {
            id: "oauth",
            title: ref`OAuth`,
            children: state.$oauth.map((it) =>
                it === "loading" || it.status === "rejected" ? [HeavyList(state.$oauth, entryOAuth)] : [
                    {
                        title: "Create new OAuth Application",
                        id: "add+oauth",
                        clickHandler: () => addOAuthDialog.open(),
                    },
                    HeavyList(state.$oauth, entryOAuth),
                ]
            ),
        },
        {
            id: "wallets",
            title: ref`Wallets`,
            children: [
                HeavyList(state.$wallets, entryWallet),
            ],
        },
    ],
})
    .addClass(
        isMobile.map((mobile) => mobile ? "mobile-navigation" : "navigation"),
        "limited-width",
    );

const oAuthData = asState({
    name: "",
    redirectURI: [""],
    image: "",
});

const addOAuthDialog = SheetDialog(
    sheetStack,
    "Create new OAuth Application",
    Grid(
        TextInput("text", "Name").ref(oAuthData.$name),
        oAuthData.$redirectURI.map((x) =>
            Grid(
                Table([
                    ["URI", "auto", (_, index) =>
                        TextInput("text", "URI", "blur")
                            .ref(asRef(x[index]))
                            .onChange((data) => {
                                x[index] = data ?? "";
                            })],
                ], x)
                    .setDelete((_, index) => {
                        oAuthData.redirectURI = asState(x.filter((_, i) => i != index));
                    }),
                Horizontal(
                    Spacer(),
                    Button("Add URI")
                        .onClick(() => {
                            x.push("");
                        }),
                ),
            )
                .setGap()
        ).asRefComponent(),
        Button("Upload Image").onPromiseClick(async () => {
            oAuthData.image = await upload("oauth");
        }),
        oAuthData.$image.map((img) =>
            Button("Submit")
                .setColor(img === "" ? Color.Disabled : Color.Grayscaled)
                .onClick(() => {
                    API.postApplicationsByOauth({ body: { name: oAuthData.name, redirect: oAuthData.redirectURI, icon: oAuthData.image } })
                        .then(async () => {
                            oAuthData.name = "";
                            oAuthData.redirectURI = asState([""]);
                            oAuthData.image = "";
                            addOAuthDialog.close();
                            state.oauth = await API.getApplicationsByOauth().then(stupidErrorAlert);
                        });
                })
        ).asRefComponent(),
    ).setGap(),
);
