import { delay } from "@std/async";
import { StreamingUploadHandler } from "shared/mod.ts";
import { UploadFilesDialog } from "webgen/mod.ts";
import { API, APITools, stupidErrorAlert, zDropType } from "../../spec/mod.ts";
import { state } from "./state.ts";

export async function refreshState() {
    await Promise.all([
        (async () => state.drops.reviews = await API.getDropsByAdmin({ query: { type: zDropType.enum.UNDER_REVIEW } }).then(stupidErrorAlert))(),
        (async () => state.drops.publishing = await API.getDropsByAdmin({ query: { type: zDropType.enum.PUBLISHING } }).then(stupidErrorAlert))(),
        (async () => state.groups = await API.getGroupsByAdmin().then(stupidErrorAlert))(),
        (async () => state.$payouts.setValue(await API.getPayoutsByAdmin().then(stupidErrorAlert)))(),
        (async () => state.wallets = await API.getWalletsByAdmin().then(stupidErrorAlert))(),
        (async () => state.oauth = await API.getApplicationsByOauth().then(stupidErrorAlert))(),
    ]);
}

const urls = {
    "manual": ["admin/payouts/upload", ".xlsx"],
    "oauth": ["oauth/applications/upload", "image/*"],
};
export function upload(type: keyof typeof urls): Promise<string> {
    const [url, extension] = urls[type];
    return new Promise((resolve) => {
        UploadFilesDialog((list) => {
            StreamingUploadHandler(url, {
                failure: () => alert("Your Upload has failed. Please try a different file or try again later"),
                uploadDone: () => console.log("Upload done"),
                credentials: () => APITools.token() ?? "",
                backendResponse: (id) => resolve(id),
                onUploadTick: async () => await delay(2),
            }, list[0].file);
        }, extension);
    });
}
