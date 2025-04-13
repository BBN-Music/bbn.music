import { activeUser, dateFromObjectId, permCheck, ProfileData, RegisterAuthRefresh, sheetStack, showPreviewImage, showProfilePicture, streamingImages } from "shared/helper.ts";
import { appendBody, asRef, asRefRecord, Box, Content, createRoute, css, DateInput, DialogContainer, DropDown, Empty, FullWidthSection, Grid, isMobile, Label, PrimaryButton, SecondaryButton, Spinner, StartRouting, TextAreaInput, TextInput, WebGenTheme } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { AdminDrop, API, Artist, ArtistRef, DropType, FullDrop, Share, Song, stupidErrorAlert, User, zArtistTypes, zDropType, zObjectId } from "../../spec/mod.ts";

import languages from "../../data/language.json" with { type: "json" };
import { DropEntry } from "./views/list.ts";
import { EditArtistsDialog, ManageSongs } from "./views/table.ts";

await RegisterAuthRefresh();

const isAdmin = permCheck(
    "/hmsys/user/manage",
    "/bbn/manage",
);

const creationState = asRefRecord({
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

const share = asRef(<undefined | Share> undefined);

const drops = asRef(<undefined | AdminDrop[]> undefined);

const events = asRef(<object[]> []);
const userProfile = asRef(<User | undefined>undefined);
const userArtists = asRef(<Artist[] | undefined>undefined);

let id: string;
const mainRoute = createRoute({
    path: "/c/music/edit",
    search: {
        id: zObjectId,
    },
    events: {
        onActive: async () => {
            id = mainRoute.search.id;
            const adminDrop = isAdmin ? await API.getIdByDropsByAdmin({ path: { id: id } }).then(stupidErrorAlert) : undefined;
            const drop = isAdmin ? adminDrop as Partial<FullDrop> : await API.getIdByDropsByMusic({ path: { id: id } }).then(stupidErrorAlert);

            creationState.gtin.setValue(drop.gtin);
            creationState.title.setValue(drop.title);
            creationState.release.setValue(drop.release);
            creationState.language.setValue(drop.language);
            creationState.artists.setValue(drop.artists ?? [{ type: zArtistTypes.enum.PRIMARY, _id: null! }]);
            creationState.primaryGenre.setValue(drop.primaryGenre);
            creationState.secondaryGenre.setValue(drop.secondaryGenre);
            creationState.compositionCopyright.setValue(drop.compositionCopyright ?? "BBN Music (via bbn.music)");
            creationState.soundRecordingCopyright.setValue(drop.soundRecordingCopyright ?? "BBN Music (via bbn.music)");
            creationState.artwork.setValue(drop.artwork);
            creationState.songs.setValue(drop.songs ?? []);
            creationState.comments.setValue(drop.comments);
            creationState.type.setValue(drop.type);

            API.getGenresByMusic().then(stupidErrorAlert).then((x) => {
                genres.primary.setValue(x.primary);
                genres.secondary.setValue(x.secondary);
            });
            try {
                API.getIdByShareByDropsByMusic({ path: { id: id } }).then((req) => stupidErrorAlert(req, false)).then((val) => share.setValue(val));
                // deno-lint-ignore no-empty
            } catch (_) {}
            if (isAdmin) {
                events.setValue(adminDrop?.events as object[] ?? []);
                userProfile.setValue(adminDrop?.userInfo);
                userArtists.setValue(adminDrop?.artistList);
                API.getDropsByAdmin({ query: { user: drop.user! } }).then(stupidErrorAlert).then((val) => {
                    drops.setValue(val);
                });
            }
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

const prefix = "bbn.music/share?s=";
const SharingDialog = Box(share.map((shareVal) =>
    Grid(
        Label("Your Link:").setTextSize("xl").setCssStyle("color", shareVal ? "" : "gray"),
        SecondaryButton(prefix + (shareVal?.slug ?? "xxx")).setDisabled(!shareVal)
            .addClass("link"),
        Label("Services Found:").setTextSize("xl").setCssStyle("color", shareVal ? "" : "gray"),
        Grid(
            asRef(
                Object.keys(shareVal ? shareVal.services : { spotify: "", deezer: "", tidal: "", apple: "" }).map((img) =>
                    streamingImages[img]
                        .setHeight("1.5rem")
                        .setWidth("1.5rem")
                        .setCssStyle("filter", shareVal ? "brightness(0) invert(1)" : "brightness(0) invert(1) brightness(0.1)")
                ),
            ),
        ).setEvenColumns(shareVal ? Object.keys(shareVal.services).length : 4).setGap("1rem").setJustifyContent("start").setPadding("0 .3rem"),
        PrimaryButton(shareVal ? "Disable Link Sharing" : "Enable Link Sharing").onPromiseClick(async () => {
            if (shareVal) {
                await API.deleteIdByShareByDropsByMusic({ path: { id: id } });
                share.setValue(undefined);
            } else {
                share.setValue(await API.postShareByDropsByMusic({ body: { id: id } }).then(stupidErrorAlert) as Share);
            }
        }).setMargin("1rem 0 0 0"),
    )
));

const responseText = asRef("");
const selectedTemplate = asRef("");
const templates = () =>
    ({
        "Copyright bad": `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop and our Systems detected Copyright Issues with your Drop.\nCould you please send over proof that you own the rights to the Music?\nYou must own 100% of the legal rights to the music you are distributing.\nThis includes all types of samples or remixes.\nI have marked your Drop as rejected for now, until you send over the proof.\n\nBest regards,\n${activeUser.username.value}`,
        "Accepted": `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop and I am happy to inform you that it has been accepted.\nYou can now start distributing your music.\n\nBest regards,\n${activeUser.username.value}`,
    }) as Record<string, string>;
const action = asRef("");
selectedTemplate.listen((val) => {
    if (val) {
        responseText.setValue(templates()[val]);
    }
});
const ResponseDialog = Grid(
    DropDown(Object.keys(templates()), selectedTemplate),
    TextAreaInput(responseText).setHeight("30rem").setWidth("30rem").addStyle(css`
        textarea.input {
            height: 100%;
        }
    `),
    Box(action.map((val) =>
        PrimaryButton(val).onClick(() => {
            if (action.value === "REJECT") {
                console.log("Reject with Email:", responseText.value);
            }
            if (action.value === "ACCEPT") {
                console.log("Accept with Email:", responseText.value);
            }
        })
    )),
);

appendBody(
    WebGenTheme(
        DialogContainer(sheetStack.visible(), sheetStack),
        Content(
            FullWidthSection(
                DynaNavigation("Music"),
            ),
            Grid(
                Grid(
                    Label("< Go Back").setTextSize("2xl").setCssStyle("cursor", "pointer").onClick(() => {
                        try {
                            history.back();
                        } catch (_) {
                            location.href = "/c/music";
                        }
                    }).setCssStyle("color", "gray"),
                    Label("Edit Drop").setTextSize("3xl").setFontWeight("bold"),
                    Grid(
                        Grid(
                            creationState.artwork.map((artwork) => showPreviewImage({ artwork: artwork, _id: id }).setRadius("large").setWidth("200px").setHeight("200px").setCssStyle("overflow", "hidden")),
                            SecondaryButton(share.map((x) => x ? "Sharing Enabled" : "Sharing Disabled")).onClick(() => sheetStack.addSheet(SharingDialog)),
                        ).setGap(),
                        Grid(
                            TextInput(creationState.title, "Title"),
                            Grid(
                                DateInput(creationState.release, "Release Date"),
                                DropDown(Object.keys(languages), creationState.language, "Language").setValueRender((x) => (languages as Record<string, string>)[x]),
                            ).setEvenColumns(isMobile.map((val) => val ? 1 : 2)).setGap(),
                            SecondaryButton("Artists").onClick(() => {
                                sheetStack.addSheet(EditArtistsDialog(creationState.artists, userArtists.value));
                            }),
                            genres.primary.map((_) => DropDown(genres.primary, creationState.primaryGenre, "Primary Genre")).value,
                        ).setGap(),
                    ).setTemplateColumns(isMobile.map((val) => val ? "auto" : "min-content auto")).setGap("1rem"),
                ).setGap(),
                ManageSongs(creationState.songs, id, userArtists),
                TextInput(creationState.comments, "Comments"),
                SecondaryButton("Save").onClick(() => {
                    API.patchIdByDropsByMusic({
                        path: { id },
                        body: Object.fromEntries(Object.entries(creationState).map((entry) => [entry[0], entry[1].getValue()])),
                    }).then(stupidErrorAlert).then(() => {
                        location.reload();
                    });
                }),
                isAdmin
                    ? Grid(
                        Grid(
                            PrimaryButton("Reject").onClick(() => {
                                action.setValue("REJECT");
                                selectedTemplate.setValue("Copyright bad");
                                sheetStack.addSheet(ResponseDialog);
                            }),
                            SecondaryButton("Change Droptype").onClick(() => {
                                sheetStack.addSheet(
                                    Grid(
                                        DropDown(Object.values(zDropType.Values), creationState.type, "Change Type"),
                                    ).setGap().setMargin("0rem 0rem 0rem 0rem"),
                                );
                            }),
                            PrimaryButton("Accept").onClick(() => {
                                action.setValue("ACCEPT");
                                selectedTemplate.setValue("Accepted");
                                sheetStack.addSheet(ResponseDialog);
                            }),
                        ).setEvenColumns(3).setGap(),
                        Grid(
                            Grid(drops.map((val) => val!.map((x) => DropEntry(x, true)))),
                            Grid(
                                Grid(
                                    userProfile.map((user) => user ? showProfilePicture(user as unknown as ProfileData) : Spinner()),
                                    Box(userProfile.map((user) => user ? Label(user.profile.username) : Spinner())),
                                    Box(userProfile.map((user) => user ? Label(user.profile.email) : Spinner())),
                                    Box(userProfile.map((user) => user ? Label(user._id as string) : Spinner())),
                                ).setGap(),
                                Box(events.map((val) => val!.map((x) => Label(`${dateFromObjectId(x._id).toDateString()} ${x.meta.action} to ${x.meta.type} from ${x.userId}`)))),
                            ).setHeight("min-content"),
                        ).setEvenColumns(2).setGap(),
                    )
                    : Empty(),
            ).setGap().setMargin("1rem 0rem 0rem 0rem"),
        ).setContentMaxWidth("1230px"),
    ).addStyle(css`
        :host {
            --wg-primary: rgb(255, 171, 82);
        }
    `),
);

StartRouting();
