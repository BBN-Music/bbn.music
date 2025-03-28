import { asRef, asState, Box, Button, CenterV, createFilePicker, Empty, getErrorMessage, Grid, Horizontal, Label, Spacer, Validate } from "webgen/mod.ts";
import { zod } from "webgen/zod.ts";
import { API, Artist, FullDrop, Song, stupidErrorAlert, zSong } from "../../../spec/mod.ts";
import { allowedAudioFormats, ExistingSongDialog } from "../../shared/helper.ts";
import { uploadSongToDrop } from "../data.ts";
import { ManageSongs } from "./table.ts";

export function ChangeSongs(drop: FullDrop, artistList?: Artist[]) {
    const state = asState({
        uploadingSongs: <string[]> [],
        validationState: <zod.ZodError | undefined> undefined,
    });

    const { data, error, validate } = Validate(
        asState(drop),
        zod.object({
            songs: zSong.omit({ user: true, file: true }).array().min(1, { message: "At least one song is required" }),
        }),
    );

    const songs = asRef(<Song[]> []);
    const existingSongDialog = ExistingSongDialog(data.songs, songs);

    return Grid(
        Horizontal(
            Box(
                state.$validationState.map((error) =>
                    error
                        ? CenterV(
                            Label(getErrorMessage(error))
                                .addClass("error-message")
                                .setMargin("0 0.5rem 0 0"),
                        )
                        : Empty()
                ).asRefComponent(),
            ),
            Spacer(),
            Button("Save")
                .onClick(async () => {
                    const validation = validate();
                    if (error.getValue()) return state.validationState = error.getValue();
                    if (validation) await API.patchIdByDropsByMusic({ path: { id: data._id! }, body: validation });
                    location.reload(); // Handle this Smarter => Make it a Reload Event.
                }),
        ),
        ManageSongs(data.$songs, state.$uploadingSongs, data.primaryGenre, artistList),
        Horizontal(
            Spacer(),
            Button("Add a new Song")
                .onClick(() =>
                    createFilePicker(allowedAudioFormats.join(","))
                        .then((file) => uploadSongToDrop(data.$songs, drop.artists, drop.language, drop.primaryGenre, drop.secondaryGenre, state.$uploadingSongs, file))
                ).setMargin("0 1rem 0 0"),
            Button("Add an existing Song")
                .onPromiseClick(async () => {
                    songs.setValue((await API.getSongsByMusic().then(stupidErrorAlert)).filter((song) => !data.songs.some((dropsong) => dropsong._id === song._id)));
                    existingSongDialog.open();
                }),
        ),
    )
        .setGap("15px")
        .setPadding("15px 0 0 0");
}
