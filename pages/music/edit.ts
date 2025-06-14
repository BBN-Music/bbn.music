import { activeUser, allowedImageFormats, ErrorMessage, permCheck, ProfileData, RegisterAuthRefresh, sheetStack, showProfilePicture, streamingImages } from "shared/helper.ts";
import { appendBody, asRef, asRefRecord, Box, Checkbox, Content, createFilePicker, createRoute, css, DateInput, DialogContainer, DropDown, Empty, FullWidthSection, Grid, Image, isMobile, Label, PrimaryButton, SecondaryButton, Spinner, StartRouting, TextAreaInput, TextInput, WebGenTheme } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { AdminDrop, API, Artist, ArtistRef, DropType, FullDrop, Share, Song, stupidErrorAlert, User, UserHistoryEvent, zArtistTypes, zDropType, zObjectId } from "../../spec/mod.ts";

import { userHistoryEventEntry } from "shared/userHistoryEventEntry.ts";
import { templateArtwork } from "../../assets/imports.ts";
import languages from "../../data/language.json" with { type: "json" };
import { uploadArtwork } from "./data.ts";
import { pageThree } from "./validator.ts";
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

const share = asRef(<undefined | Share> undefined);

const drops = asRef(<undefined | AdminDrop[]> undefined);

const events = asRef(<UserHistoryEvent[]> []);
const userProfile = asRef(<User | undefined> undefined);
const userArtists = asRef(<Artist[] | undefined> undefined);

const id = asRef(<string | undefined> undefined);
const mainRoute = createRoute({
    path: "/c/music/edit",
    search: {
        id: zObjectId,
    },
    events: {
        onActive: async () => {
            id.setValue(mainRoute.search.id);
            const adminDrop = isAdmin ? await API.getIdByDropsByAdmin({ path: { id: id.value } }).then(stupidErrorAlert) : undefined;
            const drop = isAdmin ? adminDrop as Partial<FullDrop> : await API.getIdByDropsByMusic({ path: { id: id.value } }).then(stupidErrorAlert);

            creationState.gtin.setValue(drop.gtin);
            creationState.title.setValue(drop.title);
            creationState.release.setValue(drop.release);
            creationState.language.setValue(drop.language);
            creationState.artists.setValue(drop.artists ?? [{ type: zArtistTypes.enum.PRIMARY, _id: null! }]);
            creationState.primaryGenre.setValue(drop.primaryGenre);
            creationState.secondaryGenre.setValue(drop.secondaryGenre);
            creationState.compositionCopyright.setValue(drop.compositionCopyright ?? "bbn.music");
            creationState.soundRecordingCopyright.setValue(drop.soundRecordingCopyright ?? "bbn.music");
            creationState.artwork.setValue(drop.artwork);
            creationState.artworkData.setValue(drop.artwork ? await API.getArtworkByDropByMusic({ path: { dropId: id.value } }).then((x) => URL.createObjectURL(x.data)) : templateArtwork);
            creationState.songs.setValue(drop.songs ?? []);
            creationState.comments.setValue(drop.comments);
            creationState.type.setValue(drop.type);

            disabled.setValue(drop.type !== "PRIVATE" && drop.type !== "UNSUBMITTED");

            API.getGenresByMusic().then(stupidErrorAlert).then((x) => {
                genres.primary.setValue(x.primary);
                genres.secondary.setValue(x.secondary);
            });
            try {
                API.getIdByShareByDropsByMusic({ path: { id: id.value } }).then((req) => stupidErrorAlert(req, false)).then((val) => val ? share.setValue(val) : undefined);
                // deno-lint-ignore no-empty
            } catch (_) {}
            if (isAdmin) {
                events.setValue(adminDrop?.events ?? []);
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
    if (val) {
        if (Object.keys(genres.secondary.value).includes(val) && !genres.secondary.value[val].includes(creationState.secondaryGenre.value ?? "")) {
            creationState.secondaryGenre.setValue(genres.secondary.value[val][0]);
        }
    }
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
        SecondaryButton(prefix + (shareVal?.slug ?? "xxx")).setDisabled(!shareVal).onClick(() => {
            globalThis.open("https://" + prefix + (shareVal?.slug ?? "xxx"), "_blank");
        })
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
                await API.deleteIdByShareByDropsByMusic({ path: { id: id.value } });
                share.setValue(undefined);
            } else {
                share.setValue(await API.postShareByDropsByMusic({ body: { id: id.value } }).then(stupidErrorAlert) as Share);
            }
        }).setMargin("1rem 0 0 0"),
    )
));

const responseText = asRef("");
const titleText = asRef("");
const selectedTemplate = asRef("");
const denyEdits = asRef(false);
const templates = () =>
    ({
        "Copyright bad": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and our Systems detected Copyright Issues with your Drop.\nCould you please send over proof that you own the rights to the Music?\nYou must own 100% of the legal rights to the music you are distributing.\nThis includes all types of samples or remixes.\nI have marked your Drop as rejected for now, until you send over the proof.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Full Songwriter Name": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed missing Metadata. \nYour Drop is missing the Songwriters Full Name.\nPlease correct the names in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Full Producer Name": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed missing Metadata. \nYour Drop is missing the Producers Full Name.\nPlease correct the names in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Mismatched Title": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed incorrect Metadata. \nYour Drop only has one Song but the Song and the Drop have different titles. When a Drop only has one Song the titles need to match.\nPlease update your metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "AI Generated": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the Drop is AI generated.\nWe are currently not accepting AI generated music.\nPlease remove the AI generated music and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Wrong Language": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the language of the Drop and/or Songs is wrong.\nPlease update the language in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Wrong Genre": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the genre of the Drop and/or Songs is wrong.\nPlease update the genre in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Missing Songwriter": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the Songwriter is missing.\nPlease add the Songwriter in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Not Instrumental": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the Drop is not instrumental even though the type is set to instrumental.\nPlease update the type in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Ending with silence": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the Drop ends with silence that is too long.\nPlease remove the silence at the end of the Drop and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Artwork mismatch": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the Artwork is not matching the Metadata.\nPlease update the Artwork in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Artwork already used": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the Artwork is already used in another Drop.\nPlease update the Artwork in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Artwork low quality": [
            `Issue with drop: ${creationState.title.value} [IMPORTANT - Your action required]`,
            `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and noticed that the Artwork is low quality.\nThe Artwork needs to be 3000x3000px and not blurry.\nPlease update the Artwork in the Metadata and resubmit your Drop for review.\n\nBest regards,\n${activeUser.username.value}`,
        ],
        "Takedown Declined": [`${creationState.title.value} Takedown Declined!`, `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Takedown for the Drop ${creationState.title.value} with ID (${id.value}) and I am sorry to inform you that I have declined your request.\nPlease contact us if you have any questions.\n\nBest regards,\n${activeUser.username.value}`],
        "Accepted": [`${creationState.title.value} Accepted!`, `Hey ${userProfile.getValue()?.profile.username},\n\nI just reviewed your Drop ${creationState.title.value} with ID (${id.value}) and I am happy to inform you that it has been accepted.\nYour music will now be sent to the stores.\nIt could take up to 72h for all stores to show your Drop.\n\nBest regards,\n${activeUser.username.value}`],
        "Takedown Accepted": [`${creationState.title.value} Takedown Processed!`, `Hey ${userProfile.getValue()?.profile.username},\n\nI just processed your Takedown for the Drop ${creationState.title.value} with ID (${id.value}). The takedown has been sent to the stores.\nIt could take up to 72h for all stores to process the takedown.\n\nBest regards,\n${activeUser.username.value}`],
    }) as Record<string, [string, string]>;
const action = asRef("");
selectedTemplate.listen((val) => {
    if (val) {
        titleText.setValue(templates()[val][0]);
        responseText.setValue(templates()[val][1]);
    }
});
const ResponseDialog = Grid(
    DropDown(Object.keys(templates()), selectedTemplate),
    TextInput(titleText),
    TextAreaInput(responseText).setHeight("30rem").setWidth("30rem").addStyle(css`
        textarea.input {
            height: 100%;
        }
    `),
    Grid(
        Checkbox(denyEdits),
        Label("Deny Edits"),
    ).setTemplateColumns("min-content auto").setGap(),
    Box(action.map((val) =>
        PrimaryButton(val).onPromiseClick(async () => {
            await API.postReviewByDropByMusic({
                path: { dropId: id.value },
                body: {
                    title: titleText.value,
                    action: action.value,
                    body: responseText.value.replaceAll("\n", "<br>"),
                    denyEdits: denyEdits.value,
                },
            }).then(stupidErrorAlert);
            sheetStack.removeOne();
            location.reload();
        })
    )),
).setGap();

function save() {
    API.patchIdByDropsByMusic({
        path: { id: id.value },
        body: Object.fromEntries(Object.entries(creationState).map((entry) => [entry[0], entry[1].getValue()])),
    }).then(stupidErrorAlert).then(() => {
        location.reload();
    });
}

const disabled = asRef(false);
const errorstate = asRef(<string | undefined> undefined);

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
                            if (isAdmin) {
                                location.href = "/admin?list=reviews";
                            } else {
                                location.href = "/c/music";
                            }
                        }
                    }).setCssStyle("color", "gray"),
                    Label("Edit Drop").setTextSize("3xl").setFontWeight("bold"),
                    Grid(
                        Grid(
                            creationState.artworkData.map((data) =>
                                data === "loading" ? Spinner() : Image(data!, "Drop Artwork").onClick(() => {
                                    API.getFullArtworkByDropByMusic({ path: { dropId: id.value } }).then(stupidErrorAlert).then((x) => {
                                        globalThis.open(URL.createObjectURL(x), "_blank");
                                    });
                                }).setWidth("200px").setHeight("200px").setRadius("large").setCssStyle("cursor", "pointer")
                            ),
                            Box(creationState.type.map((type) => {
                                if (type === "PRIVATE") {
                                    return SecondaryButton("Change Artwork").onClick(() => {
                                        createFilePicker(allowedImageFormats.join(",")).then((file) => uploadArtwork(id.value, file, creationState.artwork, creationState.artworkData));
                                    });
                                }
                                if (type === "PUBLISHED") {
                                    return SecondaryButton(share.map((x) => x ? "Sharing Enabled" : "Sharing Disabled")).onClick(() => sheetStack.addSheet(SharingDialog));
                                }
                                return Empty();
                            })),
                        ).setGap(),
                        Grid(
                            TextInput(creationState.title, "Title").setDisabled(disabled),
                            Grid(
                                DateInput(creationState.release, "Release Date").setDisabled(disabled),
                                DropDown(Object.keys(languages), creationState.language, "Language").setDisabled(disabled).setValueRender((x) => (languages as Record<string, string>)[x]),
                            ).setEvenColumns(isMobile.map((val) => val ? 1 : 2)).setGap(),
                            SecondaryButton("Artists").onClick(() => {
                                sheetStack.addSheet(EditArtistsDialog(creationState.artists, userArtists.value, disabled));
                            }),
                            Box(genres.primary.map((_) =>
                                Grid(
                                    DropDown(genres.primary, creationState.primaryGenre, "Primary Genre").setDisabled(disabled),
                                    Box(genres.secondary.map((secondaryGenres) => secondaryGenres ? Box(creationState.primaryGenre.map((primaryGenre) => DropDown(primaryGenre && secondaryGenres[primaryGenre] ? secondaryGenres[primaryGenre] : [], creationState.secondaryGenre, "Secondary Genre").setDisabled(disabled))) : Empty())), //.setValueRender((x) => (genres.secondary.value[creationState.primaryGenre.value ?? ""])[x] ?? ""),
                                ).setEvenColumns(isMobile.map((val) => val ? 1 : 2)).setGap()
                            )),
                            Grid(
                                TextInput(creationState.compositionCopyright, "Composition Copyright").setDisabled(true),
                                TextInput(creationState.soundRecordingCopyright, "Sound Recording Copyright").setDisabled(true),
                                TextInput(creationState.gtin, "UPC/EAN").setDisabled(disabled),
                            ).setEvenColumns(isMobile.map((val) => val ? 1 : 3)).setGap(),
                        ).setGap(),
                    ).setTemplateColumns(isMobile.map((val) => val ? "auto" : "min-content auto")).setGap("1rem"),
                ).setGap(),
                Box(id.map((id) => ManageSongs(creationState.songs, id, userArtists, disabled))),
                isAdmin ? Box(creationState.songs.map((songs) => Grid(asRef(songs.map((song) => Label(song.filename)))))) : Empty(),
                TextInput(creationState.comments, "Comments").setDisabled(disabled),
                SecondaryButton("Save").setDisabled(disabled).onClick(() => {
                    save();
                }),
                Box(creationState.type.map((val) => {
                    if (val === "PRIVATE") {
                        return PrimaryButton("Submit for Review").onClick(() => {
                            const { error } = pageThree.safeParse(Object.fromEntries(Object.entries(creationState).map((entry) => [entry[0], entry[1].getValue()])));
                            if (error) {
                                console.error(error);
                                errorstate.setValue(`${error.issues[0].path[0]}: ${error.issues[0].message}`);
                                return;
                            }
                            creationState.type.setValue("UNDER_REVIEW");
                            save();
                        });
                    }
                    if (val === "UNDER_REVIEW") {
                        return SecondaryButton("Cancel Review").onClick(() => {
                            creationState.type.setValue("PRIVATE");
                            save();
                        });
                    }
                    if (val === "PUBLISHED") {
                        return SecondaryButton("Request Takedown").onClick(() => {
                            creationState.type.setValue("TAKEDOWN_REQUESTED");
                            save();
                        });
                    }
                    if (val === "TAKEDOWN_REQUESTED") {
                        return SecondaryButton("Cancel Takedown Request").onClick(() => {
                            creationState.type.setValue("PUBLISHED");
                            save();
                        });
                    }
                    return Empty();
                })),
                ErrorMessage(errorstate).setMargin("0.4rem 0 0 0"),
                isAdmin
                    ? Grid(
                        Box(isMobile.map((isMobile) =>
                            Grid(
                                PrimaryButton("Reject").onClick(() => {
                                    action.setValue("REJECT");
                                    if (creationState.type.value === "TAKEDOWN_REQUESTED") {
                                        selectedTemplate.setValue("Takedown Declined");
                                    } else {
                                        selectedTemplate.setValue("Copyright bad");
                                    }
                                    sheetStack.addSheet(ResponseDialog);
                                }),
                                SecondaryButton("Change Droptype").onClick(() => {
                                    sheetStack.addSheet(
                                        Grid(
                                            DropDown(Object.values(zDropType.Values), creationState.type, "Change Type"),
                                        ).setGap().setMargin("0rem 0rem 0rem 0rem"),
                                    );
                                }),
                                SecondaryButton("Request Shazam").onPromiseClick(async () => {
                                    const data = await API.getIdByShazamByMusic({ path: { id: id.value } }).then(stupidErrorAlert);
                                    alert("Result: " + JSON.stringify(data));
                                }),
                                SecondaryButton("Publish").onClick(async () => {
                                    const data = await API.getIdByProviderByPublishByMusic({ path: { id: id.value, provider: "ampsuite" } });
                                    alert("Result: " + JSON.stringify(data));
                                }),
                                SecondaryButton("Reenable Edit").onClick(() => {
                                    disabled.setValue(false);
                                }),
                                PrimaryButton("Accept").onClick((e) => {
                                    if (!(e as PointerEvent).shiftKey) {
                                        const { error } = pageThree.safeParse(Object.fromEntries(Object.entries(creationState).map((entry) => [entry[0], entry[1].getValue()])));
                                        if (error) {
                                            console.error(error);
                                            errorstate.setValue(`${error.issues[0].path[0]}: ${error.issues[0].message}`);
                                            return;
                                        }
                                    }
                                    action.setValue("ACCEPT");
                                    if (creationState.type.value === "TAKEDOWN_REQUESTED") {
                                        selectedTemplate.setValue("Takedown Accepted");
                                    } else {
                                        selectedTemplate.setValue("Accepted");
                                    }
                                    sheetStack.addSheet(ResponseDialog);
                                }),
                            ).setEvenColumns(isMobile ? 1 : 6).setGap()
                        )),
                        Box(isMobile.map((isMobile) =>
                            Grid(
                                Grid(
                                    Grid(
                                        userProfile.map((user) => user ? showProfilePicture(user as unknown as ProfileData) : Spinner()),
                                        Box(userProfile.map((user) => user ? Label(user.profile.username) : Spinner())),
                                        Box(userProfile.map((user) => user ? Label(user.profile.email) : Spinner())),
                                        Box(userProfile.map((user) => user ? Label(user._id as string) : Spinner())),
                                    ).setGap(),
                                    Grid(events.map((val) => val.map(userHistoryEventEntry))),
                                ).setHeight("min-content"),
                                Grid(drops.map((val) => val ? val.map((x) => DropEntry(x, true)) : Spinner())),
                            ).setEvenColumns(isMobile ? 1 : 2).setGap()
                        )),
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
