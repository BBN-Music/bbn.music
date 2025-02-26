import { ProfileData } from "shared/helper.ts";
import { asState } from "webgen/mod.ts";
import { AdminDrop, AdminWallet, Artist, Drop, FullDrop, Group, OAuthApp, PayoutList, SearchReturn } from "../../spec/mod.ts";

export const state = asState({
    drops: {
        reviews: <AdminDrop[] | "loading"> "loading",
        publishing: <AdminDrop[] | "loading"> "loading",
    },
    groups: <Group[] | "loading"> "loading",
    payouts: <PayoutList[] | "loading"> "loading",
    oauth: <OAuthApp[] | "loading"> "loading",
    wallets: <AdminWallet[] | "loading"> "loading",
    search: <SearchReturn[] | "loading"> "loading",
    searchQuery: <string> "",
});

export const reviewState = asState({
    // deno-lint-ignore no-explicit-any
    drop: <Partial<Drop> & { user: ProfileData; events: any[]; artistList: Artist[] } | undefined> undefined,
    drops: <Partial<Drop>[] | undefined> undefined,
});
