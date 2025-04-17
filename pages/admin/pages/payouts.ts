import { BasicEntry } from "shared/components.ts";
import { RegisterAuthRefresh } from "shared/helper.ts";
import { asRef, Box, Content, createPage, createRoute, Empty, Entry } from "webgen/mod.ts";
import { API, PayoutList, stupidErrorAlert } from "../../../spec/mod.ts";
import { PayoutEntry } from "../entries.ts";
import { upload } from "../loading.ts";

await RegisterAuthRefresh();

const payouts = asRef<PayoutList[] | "loading">("loading");

createPage(
    {
        route: createRoute({
            path: "/admin?list=payouts",
            events: {
                onLazyInit: async () => {
                    payouts.setValue(await API.getPayoutsByAdmin().then(stupidErrorAlert));
                },
            },
        }),
        label: "Payouts",
        weight: 5,
    },
    Content(
        Entry(BasicEntry("Upload Payout file (.xlsx)")).onClick(() => upload("manual")),
        Entry(BasicEntry("Sync Mapping with internal Backend")).onPromiseClick(async () => {
            await API.postSyncMappingByAdmin();
        }),
        Box(payouts.map((payoutsdata) => payoutsdata === "loading" ? [Empty()] : payoutsdata.map((payouts) => PayoutEntry(payouts)))),
    ),
);
