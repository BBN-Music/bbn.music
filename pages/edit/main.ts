import { RegisterAuthRefresh, sheetStack, showPreviewImage } from "shared/helper.ts";
import { appendBody, asRefRecord, Content, createRoute, DateInput, DialogContainer, DropDown, FullWidthSection, Grid, isMobile, Label, RefRecord, SecondaryButton, StartRouting, TextInput, WebGenTheme } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { API, ArtistRef, DropType, Song, stupidErrorAlert, zArtistTypes, zObjectId } from "../../spec/mod.ts";

import { templateArtwork } from "../../assets/imports.ts";
import languages from "../../data/language.json" with { type: "json" };
import { EditArtistsDialog, ManageSongs } from "../music/views/table.ts";

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
    songs: <RefRecord<Song>[]> [],
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
                    creationState.songs.setValue((drop.songs ?? []).map((song) => asRefRecord(song)));
                    creationState.comments.setValue(drop.comments);
                    console.log(creationState.songs.value);
                });
            API.getGenresByMusic().then(stupidErrorAlert).then((x) => {
                genres.primary.setValue(x.primary);
                genres.secondary.setValue(x.secondary);
            });
        },
    },
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
                ManageSongs(creationState.songs, creationState.primaryGenre, genres),
                TextInput(creationState.comments, "Comments"),
                SecondaryButton("Save").onClick(() => {
                    API.patchIdByDropsByMusic({
                        path: { id: id },
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

// appendBody((
//     DynaNavigation("Music"),
//     drop.map((drop) =>
//         drop
//             ? Navigation({
//                 title: drop.title,
//                 children: [
//                     Label(DropTypeToText(drop.type)).setTextSize("2xl"),
//                     {
//                         id: "edit-drop",
//                         title: "Drop",
//                         subtitle: "Change Title, Release Date, ...",
//                         children: [
//                             ChangeDrop(drop),
//                         ],
//                     },
//                     {
//                         id: "edit-songs",
//                         title: "Songs",
//                         subtitle: "Move Songs, Remove Songs, Add Songs, ...",
//                         children: [
//                             ChangeSongs(drop),
//                         ],
//                     },
//                     {
//                         id: "export",
//                         title: "Export",
//                         subtitle: "Download your complete Drop with every Song",
//                         clickHandler: async () => {
//                             const blob = await API.music.id(drop._id).download().then(stupidErrorAlert);
//                             saveBlob(blob, `${drop.title}.tar`);
//                         },
//                     },
//                     Permissions.canCancelReview(drop.type)
//                         ? {
//                             id: "cancel-review",
//                             title: "Cancel Review",
//                             subtitle: "Need to change Something? Cancel it now",
//                             clickHandler: async () => {
//                                 await API.music.id(drop._id).type.post(DropType.Private);
//                                 location.reload();
//                             },
//                         }
//                         : Empty(),
//                     Permissions.canSubmit(drop.type)
//                         ? {
//                             id: "publish",
//                             title: "Publish",
//                             subtitle: "Submit your Drop for Approval",
//                             clickHandler: async () => {
//                                 const releaseDate = new Date(drop.release);
//                                 if (releaseDate.getTime() - Date.now() < 14 * 24 * 60 * 60 * 1000 && releaseDate.getTime() - Date.now() > 0) {
//                                     WarningDialog.open();
//                                 } else {
//                                     await API.music.id(drop._id).type.post(DropType.UnderReview);
//                                     location.reload();
//                                 }
//                             },
//                         }
//                         : Empty(),
//                     Permissions.canTakedown(drop.type)
//                         ? {
//                             id: "takedown",
//                             title: "Takedown",
//                             subtitle: "Completely Takedown your Drop",
//                             clickHandler: async () => {
//                                 await API.music.id(drop._id).type.post(DropType.Private);
//                                 location.reload();
//                             },
//                         }
//                         : Empty(),
//                     drop.type === "PUBLISHED"
//                         ? {
//                             id: "streamingservices",
//                             title: "Open",
//                             subtitle: "Navigate to your Drop on Streaming Services",
//                             clickHandler: async () => {
//                                 if (services.getValue() === undefined) {
//                                     services.setValue(await API.music.id(drop._id).services().then(stupidErrorAlert));
//                                 }
//                                 StreamingServiesDialog.open();
//                             },
//                         }
//                         : Empty(),
//                     drop.type === "PUBLISHED"
//                         ? {
//                             id: "share",
//                             title: "Sharing Link",
//                             subtitle: "Show your music to all your listeners",
//                             clickHandler: async () => {
//                                 share.setValue(await API.music.id(drop._id).share.get().then(stupidErrorAlert));
//                                 SharingDialog.open();
//                             },
//                         }
//                         : Empty(),
//                 ],
//             })
//                 .addClass(
//                     isMobile.map((mobile) => mobile ? "mobile-navigation" : "navigation"),
//                     "limited-width",
//                 )
//                 .setHeader((menu) =>
//                     isMobile.map((mobile) => {
//                         const list = Vertical(
//                             menu.path.map((x) => x == "-/" ? Grid(showPreviewImage(drop).addClass("image-preview")).setEvenColumns(1, "10rem") : Empty()).asRefComponent(),
//                             createBreadcrumb(menu),
//                             createTagList(menu),
//                         ).setGap();
//                         if (!mobile) {
//                             return Grid(
//                                 list,
//                                 createActionList(menu),
//                             ).setRawColumns("auto max-content").setGap().setAlignItems("center");
//                         }
//                         return list;
//                     }).asRefComponent()
//                 )
//             : LoadingSpinner()
//     ).asRefComponent(),
// ));

// renewAccessTokenIfNeeded().then(async () => {
//     await API.music.id(data.id).get()
//         .then(stupidErrorAlert)
//         .then((x) => drop.setValue(x));
// });

// const StreamingServiesDialog = SheetDialog(
//     sheetStack,
//     "Streaming Services",
//     services.map((services) =>
//         services === undefined ? Empty() : Vertical(
//             ...Object.entries(services).map(([key, value]) =>
//                 Button("Open in " + key[0].toUpperCase() + key.slice(1))
//                     .onClick(() => globalThis.open(value, "_blank"))
//                     .addPrefix(
//                         streamingImages[key]
//                             .setHeight("1.5rem")
//                             .setWidth("1.5rem")
//                             .setMargin("0 0.35rem 0 -0.3rem"),
//                     )
//             ),
//             Object.values(services).every((x) => !x) ? Label("No Links available :(").setTextSize("2xl") : Empty(),
//         ).setGap("0.5rem")
//     ).asRefComponent(),
// );
// const WarningDialog = SheetDialog(
//     sheetStack,
//     "Warning",
//     Vertical(
//         Label("You are about to publish your Drop which is scheduled to be released in less than 14 days.").setTextSize("xl"),
//         Label("There is a high chance that your Drop will not be released on time by all Streaming Services.").setTextSize("xl"),
//         Label("Do you want to continue?").setTextSize("xl"),
//         Horizontal(
//             Button("Cancel").onClick(() => {
//                 WarningDialog.close();
//             }),
//             Button("Publish Anyway").onPromiseClick(async () => {
//                 await API.music.id(drop.getValue()!._id).type.post(DropType.UnderReview);
//                 location.reload();
//                 WarningDialog.close();
//             }),
//         ).setJustifyContent("end").setGap("1rem"),
//     ),
// );
// //const prefix = "bbn.music/";
// const prefix = "bbn.one/share?s=";
// const SharingDialog = SheetDialog(
//     sheetStack,
//     "Manage Sharing Link",
//     share.map((shareVal) =>
//         shareVal
//             ? Vertical(
//                 Label("Your Link:").setTextSize("xl").setCssStyle("color", shareVal.slug ? "" : "gray"),
//                 LinkButton(prefix + (shareVal.slug ?? "xxx"), "https://" + prefix + (shareVal.slug ?? "xxx"), "_blank")
//                     .addClass("link")
//                     .setStyle(ButtonStyle.Inline).setColor(shareVal.slug ? Color.Colored : Color.Disabled),
//                 Label("Services Found:").setTextSize("xl").setCssStyle("color", shareVal.slug ? "" : "gray"),
//                 Horizontal(
//                     ...Object.keys(shareVal.slug ? shareVal.services : { spotify: "", deezer: "", tidal: "", apple: "" }).map((img) =>
//                         streamingImages[img]
//                             .setHeight("1.5rem")
//                             .setWidth("1.5rem")
//                             .setCssStyle("filter", shareVal.slug ? "brightness(0) invert(1)" : "brightness(0) invert(1) brightness(0.1)")
//                     ),
//                 ).setGap("1rem").setJustifyContent("start").setPadding("0 .3rem"),
//                 Button(shareVal.slug ? "Disable Link Sharing" : "Enable Link Sharing").onPromiseClick(async () => {
//                     if (shareVal.slug) {
//                         await API.music.id(drop.getValue()!._id).share.remove();
//                         share.setValue({ slug: undefined });
//                     } else {
//                         share.setValue(await API.music.id(drop.getValue()!._id).share.create().then(stupidErrorAlert));
//                     }
//                 }).setMargin("1rem 0 0 0"),
//             )
//             : Empty()
//     ).asRefComponent(),
// );
