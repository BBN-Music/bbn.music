import { delay } from "@std/async";
import { StreamingUploadHandler } from "shared/mod.ts";
import { API } from "shared/restSpec.ts";
import { createFilePicker } from "webgen/mod.ts";

const urls = {
    "manual": ["admin/payouts/upload", ".xlsx"],
    "oauth": ["oauth/applications/upload", "image/*"],
};
export function upload(type: keyof typeof urls): Promise<string> {
    const [url, extension] = urls[type];
    return new Promise((resolve) => {
        createFilePicker(extension).then((file) => {
            StreamingUploadHandler(url, {
                failure: (message) => alert("Your Upload has failed. Please try a different file or try again later. " + message),
                uploadDone: () => console.log("Upload done"),
                credentials: () => API.getToken(),
                backendResponse: (id) => resolve(id),
                onUploadTick: async () => await delay(2),
            }, file);
        });
    });
}
