import { RegisterAuthRefresh } from "shared/helper.ts";
import { asRef, Content, createPage, createRoute, Label } from "webgen/mod.ts";
import { AdminWallet, API, stupidErrorAlert } from "../../../spec/mod.ts";
import { WalletEntry } from "../entries.ts";

await RegisterAuthRefresh();

const wallets = asRef<AdminWallet[] | "loading">("loading");

createPage(
    {
        route: createRoute({
            path: "/admin?list=wallets",
            events: {
                onLazyInit: async () => {
                    wallets.setValue(await API.getWalletsByAdmin().then(stupidErrorAlert));
                },
            },
        }),
        label: "Wallets",
        weight: 7,
    },
    Content(
        wallets.map((wallets) => wallets === "loading" ? Label("Loading...") : wallets.map((wallet) => WalletEntry(wallet))),
    ),
);
