import { delay } from "@std/async";
import { StreamingUploadHandler } from "shared/mod.ts";
import { WriteSignal } from "webgen/mod.ts";
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
            songs.setValue(songs.getValue().filter((x) => x._id != id));
            alert(`Your Upload has failed. Please try a different file or try again later Error: ${msg}`);
        },
        uploadDone: () => {
            songs.setValue(songs.getValue().map((x) => x._id == id ? { ...x, country: "100%" } : x));
        },
        credentials: () => APITools.token()!,
        backendResponse: async (res) => {
            console.log(res);
            if (res.startsWith("duplicate:")) {
                songs.setValue(songs.getValue().filter((x) => x._id != id));
                alert(`You already uploaded this song. Please use the "Add Song" button instead.`);
                // TODO: Open Dropover to automatically add the song using split at :
                return;
            }
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
        },
        // deno-lint-ignore require-await
        onUploadTick: async (percentage) => {
            songs.setValue(songs.getValue().map((x) => x._id == id ? { ...x, country: `${percentage.toFixed()}%` } : x));
        },
    }, file);
}

export function uploadArtwork(id: string, file: File, artwork: WriteSignal<string | undefined>, isUploading: WriteSignal<boolean>, data: WriteSignal<string | undefined>) {
    const blobUrl = URL.createObjectURL(file);
    isUploading.setValue(true);
    data.setValue(blobUrl);

    //check if drop specific is needed
    StreamingUploadHandler(`music/drops/${id}/upload`, {
        failure: () => {
            isUploading.setValue(false);
            alert("Your Upload has failed. Please try a different file or try again later");
        },
        uploadDone: () => {
        },
        credentials: () => APITools.token()!,
        backendResponse: (id) => {
            isUploading.setValue(false);
            artwork.setValue(id);
        },
        onUploadTick: async () => {
            await delay(2);
        },
    }, file);
}
