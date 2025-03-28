import { delay } from "@std/async";
import { StreamingUploadHandler } from "shared/mod.ts";
import { AdvancedImage, Reference } from "webgen/mod.ts";
import { API, APITools, ArtistRef, Song, stupidErrorAlert } from "../../spec/mod.ts";

export function uploadSongToDrop(songs: Reference<Omit<Song, "user">[]>, artists: ArtistRef[], language: string, primaryGenre: string, secondaryGenre: string, uploadingSongs: Reference<{ [key: string]: number }[]>, file: File) {
    const uploadId = crypto.randomUUID();
    uploadingSongs.addItem({ [uploadId]: 0 });

    const cleanedUpTitle = file.name
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");

    songs.addItem({
        _id: uploadId,
        title: cleanedUpTitle,
        artists,
        language,
        instrumental: false,
        explicit: false,
        primaryGenre,
        secondaryGenre,
        year: new Date().getFullYear(),
        file: undefined!,
    });

    StreamingUploadHandler(`music/songs/upload`, {
        failure: (message) => {
            songs.setValue(songs.getValue().filter((x) => x._id != uploadId));
            uploadingSongs.setValue(uploadingSongs.getValue().map((x) => ({ ...x, [uploadId]: -1 })));
            alert("Your Upload has failed. Please try a different file or try again later. Error: "+message);
        },
        uploadDone: () => {
            uploadingSongs.setValue(uploadingSongs.getValue().map((x) => ({ ...x, [uploadId]: 100 })));
        },
        credentials: () => APITools.token() ?? "",
        backendResponse: async (response) => {
            uploadingSongs.setValue(uploadingSongs.getValue().filter((x) => !x[uploadId]));
            if (response.startsWith("duplicate:")) {
                alert(`You already uploaded this song. Please use the add existing song button instead.`);
                songs.setValue(songs.getValue().filter((x) => x._id !== uploadId));
                // TODO: Open Dropover to automatically add the song using split at :
                return;
            }
            const song = await API.postSongsByMusic({
                body: {
                    title: cleanedUpTitle,
                    artists,
                    language,
                    instrumental: false,
                    explicit: false,
                    primaryGenre,
                    secondaryGenre,
                    year: new Date().getFullYear(),
                    file: response,
                },
            }).then(stupidErrorAlert);
            songs.setValue(songs.getValue().map((x) => x._id == uploadId ? { ...x, _id: song.id, file: response } : x));
        },
        // deno-lint-ignore require-await
        onUploadTick: async (percentage) => {
            uploadingSongs.setValue(uploadingSongs.getValue().map((x) => ({ ...x, [uploadId]: percentage })));
        },
    }, file);
}

export function uploadArtwork(id: string, file: File, artworkClientData: Reference<AdvancedImage | undefined>, artwork: Reference<string | undefined>) {
    const blobUrl = URL.createObjectURL(file);
    artworkClientData.setValue({ type: "uploading", filename: file.name, blobUrl, percentage: 0 });

    setTimeout(() => {
        StreamingUploadHandler(`music/drops/${id}/upload`, {
            failure: () => {
                artworkClientData.setValue(undefined);
                alert("Your Upload has failed. Please try a different file or try again later");
            },
            uploadDone: () => {
                artworkClientData.setValue({ type: "waiting-upload", filename: file.name, blobUrl });
            },
            credentials: () => APITools.token() ?? "", 
            backendResponse: (id) => {
                artworkClientData.setValue({ type: "direct", source: async () => await file });
                artwork.setValue(id);
            },
            onUploadTick: async (percentage) => {
                artworkClientData.setValue({ type: "uploading", filename: file.name, blobUrl, percentage });
                await delay(2);
            },
        }, file);
    });
}
