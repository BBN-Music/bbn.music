import { LoadingSpinner } from "shared/mod.ts";
import { AdvancedImage, asRef, asState, Body, Box, Button, ButtonStyle, Center, CenterV, Color, createFilePicker, Custom, DropAreaInput, DropDownInput, Empty, getErrorMessage, Grid, Horizontal, Image, Label, MediaQuery, Reference, SheetDialog, Spacer, SupportedThemes, TextInput, Validate, Vertical, WebGen } from "webgen/mod.ts";
import { zod } from "webgen/zod.ts";
import "../../assets/css/main.css";
import { DynaNavigation } from "../../components/nav.ts";
import genres from "../../data/genres.json" with { type: "json" };
import language from "../../data/language.json" with { type: "json" };
import { API, ArtistRef, DATE_PATTERN, Song, stupidErrorAlert, zArtistRef, zArtistTypes, zDropType, zSong } from "../../spec/mod.ts";
import { allowedAudioFormats, allowedImageFormats, CenterAndRight, ExistingSongDialog, getSecondary, RegisterAuthRefresh, sheetStack } from "../shared/helper.ts";
import { uploadArtwork, uploadSongToDrop } from "./data.ts";
import { EditArtistsDialog, ManageSongs } from "./views/table.ts";

// Do no move this import
import { sumOf } from "@std/collections";
import { z } from "zod/mod.ts";
import "./newDrop.css";

await RegisterAuthRefresh();

WebGen({
    theme: SupportedThemes.dark,
});
// Because this is a mix of light and dark mode we force dropdowns to be dark
document.querySelector(".wpopover")?.setAttribute("data-theme", "dark");

const params = new URLSearchParams(location.search);

if (!params.has("id")) {
    alert("ID is missing");
    location.href = "/c/music";
}
const dropId = params.get("id")!;

export const creationState = asState({
    loaded: false,
    _id: <string | undefined> undefined,
    gtin: <string | undefined> undefined,
    title: <string | undefined> undefined,
    release: <string | undefined> undefined,
    language: <string | undefined> undefined,
    artists: <ArtistRef[]> [],
    primaryGenre: <string | undefined> undefined,
    secondaryGenre: <string | undefined> undefined,
    compositionCopyright: <string | undefined> undefined,
    soundRecordingCopyright: <string | undefined> undefined,
    artwork: <string | undefined> undefined,
    artworkClientData: <AdvancedImage | undefined> undefined,
    uploadingSongs: <Record<string, number>[]> [],
    songs: <Song[]> [],
    comments: <string | undefined> undefined,
    page: 0,
    validationState: <zod.ZodError | undefined> undefined,
});

API.getIdByDropsByMusic({ path: { id: dropId } }).then(stupidErrorAlert)
    .then((drop) => {
        creationState._id = dropId;
        creationState.gtin = drop.gtin;
        creationState.title = drop.title;
        creationState.release = drop.release;
        creationState.language = drop.language;
        creationState.artists = asState(drop.artists ?? [{ type: zArtistTypes.enum.PRIMARY, _id: null! }]);
        creationState.primaryGenre = drop.primaryGenre;
        creationState.secondaryGenre = drop.secondaryGenre;
        creationState.compositionCopyright = drop.compositionCopyright ?? "BBN Music (via bbn.music)";
        creationState.soundRecordingCopyright = drop.soundRecordingCopyright ?? "BBN Music (via bbn.music)";
        creationState.artwork = drop.artwork;
        creationState.artworkClientData = <AdvancedImage | undefined> (drop.artwork ? <AdvancedImage> { type: "direct", source: () => API.getArtworkByDropByMusic({ path: { dropId: dropId } }).then(stupidErrorAlert) } : undefined);
        creationState.songs = asState(drop.songs ?? []);
        creationState.comments = drop.comments;
    })
    .then(() => creationState.loaded = true);

const additionalDropInformation = SheetDialog(
    sheetStack,
    "Additional Information",
    Vertical(
        Grid(
            TextInput("text", "UPC/EAN").ref(creationState.$gtin),
            TextInput("text", "Composition Copyright").ref(creationState.$compositionCopyright),
            TextInput("text", "Sound Recording Copyright").ref(creationState.$soundRecordingCopyright),
        )
            .setEvenColumns(1)
            .addClass("grid-area")
            .setGap(),
        Horizontal(Spacer(), Button("Save").onClick(() => additionalDropInformation.close())),
    ).setGap(),
);

sheetStack.setDefault(Vertical(
    DynaNavigation("Music"),
    creationState.$loaded.map((loaded) => loaded ? wizard : LoadingSpinner()).asRefComponent(),
));

Body(sheetStack)
    .addClass("fullscreen");
Custom(document.body).setAttribute("data-theme", undefined);

const validator = (page: number) => async () => {
    const { error, validate } = Validate(creationState, pages[page]);

    const data = validate();
    if (error.getValue()) return creationState.validationState = error.getValue();
    if (data) await API.patchIdByDropsByMusic({ path: { id: dropId }, body: data });
    creationState.page++;
    creationState.validationState = undefined;
};

const footer = (page: number) =>
    Horizontal(
        page == 0 ? Button("Cancel").setJustifyContent("center").setStyle(ButtonStyle.Secondary).onClick(() => location.href = "/c/music") : Button("Back").setJustifyContent("center").setStyle(ButtonStyle.Secondary).onClick(() => creationState.page--),
        Spacer(),
        Box(
            creationState.$validationState.map((error) =>
                error
                    ? CenterV(
                        Label(getErrorMessage(error))
                            .addClass("error-message")
                            .setMargin("0 0.5rem 0 0"),
                    )
                    : Empty()
            ).asRefComponent(),
        ),
        Button("Next").setJustifyContent("center").onClick(validator(page)),
    ).addClass("footer");

const wizard = creationState.$page.map((page) => {
    if (page == 0) {
        return Vertical(
            Spacer(),
            MediaQuery("(max-width: 450px)", (small) =>
                Grid(
                    Center(Label("Enter your Album details.").addClass("title")),
                    TextInput("text", "Title").ref(creationState.$title),
                    Grid(
                        TextInput("date", "Release Date").ref(creationState.$release),
                        DropDownInput("Language", Object.keys(language))
                            .setRender((key) => language[<keyof typeof language> key])
                            .ref(creationState.$language),
                    )
                        .setEvenColumns(small ? 1 : 2)
                        .setGap(),
                    Button("Artists")
                        .onClick(() => EditArtistsDialog(creationState.$artists as unknown as Reference<ArtistRef[]>).open()),
                    Center(Label("Set your target Audience").addClass("title")),
                    Grid(
                        DropDownInput("Primary Genre", Object.keys(genres))
                            .ref(creationState.$primaryGenre)
                            .onChange(() => creationState.$secondaryGenre.setValue(undefined)),
                        creationState.$primaryGenre.map((primaryGenre) =>
                            DropDownInput("Secondary Genre", getSecondary(genres, primaryGenre) ?? [])
                                .ref(creationState.$secondaryGenre)
                                .setColor(getSecondary(genres, primaryGenre) ? Color.Grayscaled : Color.Disabled)
                        ).asRefComponent(),
                    )
                        .setGap()
                        .setEvenColumns(small ? 1 : 2),
                    Button("Additional Information")
                        .onClick(() => additionalDropInformation.open()),
                )
                    .setEvenColumns(1)
                    .addClass("grid-area")
                    .setGap()),
            Spacer(),
            footer(page),
        ).addClass("wwizard");
    } else if (page == 1) {
        return Vertical(
            Spacer(),
            Center(
                creationState.$artworkClientData.map((data) =>
                    Vertical(
                        CenterAndRight(
                            Label("Upload your Cover").addClass("title"),
                            Button("Manual Upload")
                                .onClick(() => createFilePicker(allowedImageFormats.join(",")).then((file) => uploadArtwork(dropId, file, creationState.$artworkClientData, creationState.$artwork))),
                        ),
                        DropAreaInput(
                            CenterV(data ? Image(data, "A Music Album Artwork.") : Label("Drop your Artwork here.").setTextSize("xl").setFontWeight("semibold")),
                            allowedImageFormats,
                            ([{ file }]) => uploadArtwork(dropId, file, creationState.$artworkClientData, creationState.$artwork),
                        ).addClass("drop-area"),
                    ).setGap()
                ).asRefComponent(),
            ),
            Spacer(),
            footer(page),
        ).addClass("wwizard");
    } else if (page == 2) {
        creationState.$songs.listen((songs, oldVal) => {
            if (oldVal != undefined) {
                creationState.$songs.setValue(songs);
            }
        });
        const songs = asRef(<undefined | Song[]> undefined);
        const existingSongDialog = ExistingSongDialog(creationState.songs, songs);
        return Vertical(
            Spacer(),
            Horizontal(
                Spacer(),
                Vertical(
                    CenterAndRight(
                        Label("Manage your Music").addClass("title"),
                        Box(
                            Button("Manual Upload")
                                .onClick(() => createFilePicker(allowedAudioFormats.join(",")).then((file) => uploadSongToDrop(creationState.$songs, creationState.artists, creationState.language, creationState.primaryGenre, creationState.secondaryGenre, creationState.$uploadingSongs, file))).setMargin("0 1rem 0 0"),
                            Button("Add an existing Song")
                                .onPromiseClick(async () => {
                                    songs.setValue((await API.getSongsByMusic().then(stupidErrorAlert)).filter((song) => creationState.songs.some((dropsong) => dropsong._id !== song._id)));
                                    existingSongDialog.open();
                                }),
                        ),
                    ),
                    ManageSongs(creationState.$songs as unknown as Reference<Song[]>, creationState.$uploadingSongs, creationState.primaryGenre!),
                ).setGap(),
                Spacer(),
            ),
            Spacer(),
            footer(page),
        ).addClass("wwizard");
    } else if (page == 3) {
        return Vertical(
            Spacer(),
            Horizontal(
                Spacer(),
                Label("Thanks! That's everything we need.").setBalanced().addClass("ending-title"),
                Spacer(),
            ),
            Horizontal(
                Spacer(),
                TextInput("text", "Comments for Review Team").ref(creationState.$comments),
                Spacer(),
            ),
            Spacer(),
            Horizontal(
                Button("Back").setJustifyContent("center").setStyle(ButtonStyle.Secondary).onClick(() => creationState.page--),
                Spacer(),
                Button("Submit").setJustifyContent("center").onPromiseClick(async () => {
                    creationState.loaded = false;
                    await API.patchIdByDropsByMusic({ path: { id: dropId }, body: creationState });

                    await API.postTypeByTypeByDropByMusic({ path: { dropId: dropId, type: zDropType.enum.UNDER_REVIEW } }).then(stupidErrorAlert);
                    location.href = "/c/music";
                }),
            ).addClass("footer"),
        ).addClass("wwizard");
    }
    return LoadingSpinner();
}).asRefComponent();

const pageOne = zod.object({
    title: z.string(),
    artists: zArtistRef.array().refine((x) => x.some(({ type }) => type == "PRIMARY"), { message: "At least one primary artist is required" }).refine((x) => x.some(({ type }) => type == "SONGWRITER"), { message: "At least one songwriter is required" }),
    release: zod.string().regex(DATE_PATTERN, { message: "Not a date" }),
    language: zod.string(),
    primaryGenre: zod.string(),
    secondaryGenre: zod.string(),
    gtin: zod.preprocess(
        (x) => x === "" ? undefined : x,
        zod.string().trim()
            .min(12, { message: "UPC/EAN: Invalid length" })
            .max(13, { message: "UPC/EAN: Invalid length" })
            .regex(/^\d+$/, { message: "UPC/EAN: Not a number" })
            .refine((gtin) => parseInt(gtin.slice(-1), 10) === (10 - (sumOf(gtin.slice(0, -1).split("").map((digit, index) => parseInt(digit, 10) * ((16 - gtin.length + index) % 2 === 0 ? 3 : 1)), (x) => x) % 10)) % 10, {
                message: "UPC/EAN: Invalid checksum",
            }).optional(),
    ),
    compositionCopyright: z.string(),
    soundRecordingCopyright: z.string(),
});

const pageTwo = zod.object({
    artwork: zod.string(),
    artworkClientData: zod.object({
        type: zod.string().refine((x) => x !== "uploading", { message: "Artwork is still uploading" }),
    }).transform(() => undefined),
});

const pageThree = zod.object({
    songs: zSong.omit({ user: true }).array().min(1, { message: "At least one song is required" }).refine((songs) => songs.every(({ instrumental, explicit }) => !(instrumental && explicit)), "Can't have an explicit instrumental song"),
    uploadingSongs: zod.array(zod.string()).max(0, { message: "Some uploads are still in progress" }),
});

export const pages = <zod.AnyZodObject[]> [pageOne, pageTwo, pageThree];
