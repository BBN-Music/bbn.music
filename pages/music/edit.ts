import { RegisterAuthRefresh, sheetStack, showPreviewImage } from "shared/helper.ts";
import { appendBody, asRefRecord, Content, createRoute, DateInput, DialogContainer, DropDown, FullWidthSection, Grid, isMobile, Label, SecondaryButton, StartRouting, TextInput, WebGenTheme } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { API, ArtistRef, DropType, Song, stupidErrorAlert, zArtistTypes, zObjectId } from "../../spec/mod.ts";

import { templateArtwork } from "../../assets/imports.ts";
import languages from "../../data/language.json" with { type: "json" };
import { EditArtistsDialog, ManageSongs } from "./views/table.ts";

await RegisterAuthRefresh();

const creationState = asRefRecord({
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
    artworkData: <string | undefined> undefined,
    uploadingSongs: <Record<string, number>[]> [],
    songs: <Song[]> [],
    comments: <string | undefined> undefined,
    user: <string | undefined> undefined,
    type: <DropType | undefined> undefined,
});

const genres = asRefRecord({
    primary: <string[]> [],
    secondary: <Record<string, string[]>> {},
});
let id: string;
const mainRoute = createRoute({
    path: "/c/music/edit",
    search: {
        id: zObjectId,
    },
    events: {
        onActive: () => {
            id = mainRoute.search.id;
            API.getIdByDropsByMusic({ path: { id: id } }).then(stupidErrorAlert)
                .then(async (drop) => {
                    creationState.gtin.setValue(drop.gtin);
                    creationState.title.setValue(drop.title);
                    creationState.release.setValue(drop.release);
                    creationState.language.setValue(drop.language);
                    creationState.artists.setValue(drop.artists ?? [{ type: zArtistTypes.enum.PRIMARY, _id: null! }]);
                    creationState.primaryGenre.setValue(drop.primaryGenre);
                    creationState.secondaryGenre.setValue(drop.secondaryGenre);
                    creationState.compositionCopyright.setValue(drop.compositionCopyright ?? "BBN Music (via bbn.one)");
                    creationState.soundRecordingCopyright.setValue(drop.soundRecordingCopyright ?? "BBN Music (via bbn.one)");
                    creationState.artwork.setValue(drop.artwork);
                    creationState.artworkData.setValue(drop.artwork ? await API.getArtworkByDropByMusic({ path: { dropId: id } }).then((x) => URL.createObjectURL(x.data)) : templateArtwork);
                    creationState.songs.setValue(drop.songs ?? []);
                    creationState.comments.setValue(drop.comments);
                });
            API.getGenresByMusic().then(stupidErrorAlert).then((x) => {
                genres.primary.setValue(x.primary);
                genres.secondary.setValue(x.secondary);
            });
        },
    },
});

creationState.primaryGenre.listen((val) => {
    creationState.songs.setValue(creationState.songs.value.map((song) => {
        if (val) {
            song.primaryGenre = val;
        }
        return song;
    }));
});

creationState.songs.listen((val) => {
    const genre = creationState.primaryGenre.value;
    if (genre && !val.every((x) => x.primaryGenre === genre)) {
        creationState.songs.setValue(creationState.songs.value.map((s) => {
            s.primaryGenre = genre;
            return s;
        }));
    }
});

appendBody(
    WebGenTheme(
        DialogContainer(sheetStack.visible(), sheetStack),
        Content(
            FullWidthSection(
                DynaNavigation("Music"),
            ),
            Grid(
                Grid(
                    Label("< Go Back").setTextSize("2xl").setCssStyle("cursor", "pointer").onClick(() => history.back()).setCssStyle("color", "gray"),
                    Label("Edit Drop").setTextSize("3xl").setFontWeight("bold"),
                    Grid(
                        creationState.artworkData.map((artwork) => showPreviewImage({ artwork: artwork, _id: id })).value.setRadius("large").setWidth("200px").setHeight("200px").setCssStyle("overflow", "hidden"),
                        Grid(
                            TextInput(creationState.title, "Title"),
                            Grid(
                                DateInput(creationState.release, "Release Date"),
                                DropDown(Object.keys(languages), creationState.language, "Language").setValueRender((x) => (languages as Record<string, string>)[x]),
                            ).setEvenColumns(isMobile.map((val) => val ? 1 : 2)).setGap(),
                            SecondaryButton("Artists").onClick(() => {
                                sheetStack.addSheet(EditArtistsDialog(creationState.artists));
                            }),
                            genres.primary.map((_) => DropDown(genres.primary, creationState.primaryGenre, "Primary Genre")).value,
                        ).setGap(),
                    ).setTemplateColumns(isMobile.map((val) => val ? "auto" : "min-content auto")).setGap("1rem"),
                ).setGap(),
                ManageSongs(creationState.songs, id),
                TextInput(creationState.comments, "Comments"),
                SecondaryButton("Save").onClick(() => {
                    API.patchIdByDropsByMusic({
                        path: { id },
                        body: Object.fromEntries(Object.entries(creationState).map((entry) => [entry[0], entry[1].getValue()])),
                    }).then(stupidErrorAlert).then(() => {
                        location.reload();
                    });
                }),
            ).setGap().setMargin("1rem 0rem 0rem 0rem"),
        ).setContentMaxWidth("1230px"),
    ),
);

StartRouting();
