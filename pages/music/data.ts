import { delay } from "@std/async";
import { StreamingUploadHandler } from "shared/mod.ts";
import { WriteSignal } from "webgen/mod.ts";
import { templateArtwork } from "../../assets/imports.ts";
import { API, APITools, Song, stupidErrorAlert } from "../../spec/mod.ts";

export function uploadSong(file: File, songs: WriteSignal<Song[]>, dropId: string) {
    const id = crypto.randomUUID();
    const cleanedUpTitle = file.name
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");

    songs.setValue([...songs.value, { _id: id, title: cleanedUpTitle, country: "0%" } as Song]);
    StreamingUploadHandler(`music/songs/upload`, {
        failure: (msg) => {
            //songs.setValue(songs.getValue().filter((x) => x._id != id));
            alert(`Your Upload has failed. Please try a different file or try again later Error: ${msg}`);
        },
        uploadDone: () => {
            songs.setValue(songs.getValue().map((x) => x._id == id ? { ...x, country: "Processing file" } : x));
        },
        credentials: () => APITools.token()!,
        backendResponse: async (res) => {
            if (res.startsWith("duplicate:")) {
                const existingId = res.split(":")[1];
                const song = await API.getIdBySongsByMusic({
                    path: { id: existingId },
                }).then(stupidErrorAlert);
                songs.setValue(songs.getValue().map((x) => x._id == id ? song : x));
                alert(`You've uploaded this song before. We've automatically referenced the existing song to the drop.`);
            } else {
                const song = await API.postDropByDropsByMusic({
                    path: {
                        dropId,
                    },
                    body: {
                        file: res,
                        filename: cleanedUpTitle,
                    },
                }).then(stupidErrorAlert);

                songs.setValue(songs.getValue().map((x) => x._id == id ? song : x));
            }
        },
        // deno-lint-ignore require-await
        onUploadTick: async (percentage) => {
            songs.setValue(songs.getValue().map((x) => x._id == id ? { ...x, country: `${percentage.toFixed()}%` } : x));
        },
    }, file);
}

//wait for AdvancedImage to show progress again
export function uploadArtwork(id: string, file: File, artwork: WriteSignal<string | undefined>, data: WriteSignal<string | undefined>) {
    const blobUrl = URL.createObjectURL(file);
    data.setValue("loading");

    //check if drop specific is needed
    StreamingUploadHandler(`music/drops/${id}/upload`, {
        failure: () => {
            data.setValue(templateArtwork);
            alert("Your Upload has failed. Please try a different file or try again later");
        },
        uploadDone: () => {
        },
        credentials: () => APITools.token()!,
        backendResponse: (id) => {
            data.setValue(blobUrl);
            artwork.setValue(id);
        },
        onUploadTick: async () => {
            await delay(2);
        },
    }, file);
}
