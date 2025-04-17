import { sheetStack, showPreviewImage } from "shared/helper.ts";
import { BasicEntry } from "shared/mod.ts";
import { Async, Box, Entry, Image, Label, Spinner } from "webgen/mod.ts";
import { AdminDrop, AdminWallet, API, Group, OAuthApp, PayoutList, stupidErrorAlert } from "../../spec/mod.ts";
import { editOAuthSheet } from "./sheets.ts";

export function ReviewEntry(x: AdminDrop, small: boolean = false) {
    return Entry(
        BasicEntry(
            Box(
                Label(x.title ?? "(no drop name)").setFontWeight("bold").setTextSize(small ? "xl" : "3xl"),
                Label(x.release ?? "(no release date)").setTextSize(small ? "lg" : "2xl").setPadding("0 0 0 0.5rem"),
            ),
            `user: ${x.user} - gtin: ${x.gtin ?? "(no GTIN)"} - id: ${x._id}`,
        )
            .onClick(() => location.href = `/c/music/edit?id=${x._id}`)
            .addPrefix(showPreviewImage(x).setWidth(small ? "50px" : "100px").setRadius("large")),
    );
}

export function WalletEntry(wallet: AdminWallet) {
    return Entry(
        BasicEntry(
            `${wallet.userName} - ${((wallet.balance?.restrained ?? 0) + (wallet.balance?.unrestrained ?? 0)).toFixed(2).toString()}`,
            `${wallet.email} - ${wallet.user} - ${wallet._id} - ${wallet.cut}% - ${wallet.balance?.restrained.toFixed(2)}/${wallet.balance?.unrestrained.toFixed(2)}`,
        ),
    );
}

// deno-lint-ignore no-explicit-any
export function ChatEntry(chat: any) {
    return Entry(BasicEntry(chat.username ? chat.username : chat.wa_id, chat.username ? chat.wa_id : ""));
}

export function GroupEntry(group: Group) {
    return Entry(BasicEntry(group.displayName, `Permissions: ${group.permission.join(", ")}`));
}

export function OAuthEntry(app: OAuthApp) {
    const prefix = Async(API.getDownloadByFileByFilesByAdmin({ path: { fileId: app.icon } }).then(stupidErrorAlert).then((x) => Image(URL.createObjectURL(x as Blob), "App Icon").setWidth("100px").setCssStyle("display", "block").setRadius("large")), Spinner());
    return Entry(
        BasicEntry(app.name, app._id)
            .addPrefix(prefix),
    ).onClick(() => sheetStack.addSheet(editOAuthSheet(app)));
}

export function PayoutEntry(payout: PayoutList) {
    return Entry(BasicEntry(payout.period, `£ ${payout.sum}`));
}
