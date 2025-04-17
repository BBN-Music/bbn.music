import { fail } from "@std/assert/fail";
import { LruCache, memoize } from "@std/cache";
import { asRef, asRefRecord, Async, Box, Component, DropDown, Empty, Grid, Image, Label, PrimaryButton, Reference, SheetHeader, Sheets, Spinner, WriteSignal } from "webgen/mod.ts";
import { templateArtwork } from "../../assets/imports.ts";
import { loginRequired } from "../../components/pages.ts";
import { API, APITools, ObjectId, Permission, Song, stupidErrorAlert } from "../../spec/mod.ts";

// @deno-types="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/custom.d.ts"
import spotify from "../music-landing/assets/spotify.svg";
// @deno-types="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/custom.d.ts"
import deezer from "../music-landing/assets/deezer.svg";
// @deno-types="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/custom.d.ts"
import tidal from "../music-landing/assets/tidal.svg";
// @deno-types="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/custom.d.ts"
import apple from "../music-landing/assets/apple.svg";

export const allowedAudioFormats = ["audio/flac", "audio/wav", "audio/mp3"];
export const allowedImageFormats = ["image/png", "image/jpeg"];

export type ProfileData = {
    _id: string;
    profile: {
        email: string;
        phone?: string;
        verified?: {
            email?: boolean;
            phone?: boolean;
        };
        username: string;
        avatar?: string;
    };
    permissions: Permission[];
    groups: string[];
};

export function IsLoggedIn(): ProfileData | null {
    try {
        return localStorage["access-token"] ? JSON.parse(b64DecodeUnicode(localStorage["access-token"].split(".")[1])).user : null;
    } catch (_) {
        // Invalid state. We gonna need to say goodbye to that session
        resetTokens();
        return null;
    }
}

export function getSecondary(secondary: Record<string, string[]>, primaryGenre?: Reference<string | undefined>) {
    return primaryGenre ? primaryGenre.map((x) => x ? secondary[x] : null).value : null;
}

function b64DecodeUnicode(value: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(value).split("").map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(""));
}
function rawAccessToken() {
    return JSON.parse(b64DecodeUnicode(localStorage["access-token"].split(".")[1]));
}

export const activeUser = asRefRecord({
    emailVerified: <boolean | undefined> undefined,
    email: <string | undefined> undefined,
    phone: <string | undefined> undefined,
    username: <string> "--",
    avatar: <string | undefined> undefined,
    permission: <Permission[]> [],
    id: <string | undefined> undefined,
});

export function permCheck(...per: Permission[]) {
    return APITools.isPermitted(per, activeUser.permission.value);
}

export function updateActiveUserData() {
    try {
        const user = IsLoggedIn();
        if (!user) return;
        activeUser.emailVerified.setValue(user.profile.verified?.email);
        activeUser.username.setValue(user.profile.username);
        activeUser.email.setValue(user.profile.email);
        activeUser.phone.setValue(user.profile.phone);
        activeUser.avatar.setValue(user.profile.avatar);
        activeUser.id.setValue(user._id);
        activeUser.permission.setValue(user.permissions);
    } catch (_) {
        // Session should be invalid
        logOut();
    }
}

function checkIfRefreshTokenIsValid() {
    const token = localStorage["refresh-token"];
    if (!token) return;
    const tokenData = JSON.parse(b64DecodeUnicode(token.split(".")[1]));
    if (isExpired(tokenData.exp)) {
        logOut();
        return;
    }
}
export function logOut(goal?: string) {
    if (location.pathname.startsWith("/signin")) return;
    resetTokens();
    location.href = "/signin";
    localStorage.goal = goal ?? "/c/music";
}

export function resetTokens() {
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("access-token");
    localStorage.removeItem("goal");
}

export function gotoGoal() {
    location.href = localStorage.goal || "/c/music";
}

export async function renewAccessTokenIfNeeded() {
    if (!localStorage.getItem("access-token")) return;
    const { exp } = rawAccessToken();
    if (!exp) return logOut();
    // We should renew the token 30s before it expires
    if (isExpired(exp)) {
        await forceRefreshToken();
    }
}

export const tokens = asRefRecord({
    accessToken: localStorage["access-token"],
    refreshToken: localStorage["refresh-token"],
});

export function dateFromObjectId(objectId: ObjectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

export async function forceRefreshToken() {
    try {
        const access = await API.postRefreshAccessTokenByAuth({ headers: { "Authorization": localStorage["refresh-token"] } }).then(stupidErrorAlert) as { token: string };
        localStorage["access-token"] = access.token;
        tokens.accessToken.setValue(access.token);
    } catch (_) {
        // TODO: Make a better offline support
        location.href = "/";
    }
}

function isExpired(exp: number) {
    return exp * 1000 < new Date().getTime() + (0.5 * 60 * 1000);
}

export async function RegisterAuthRefresh() {
    if (!IsLoggedIn()) return shouldLoginPage();
    try {
        updateActiveUserData();
        checkIfRefreshTokenIsValid();
        await renewAccessTokenIfNeeded();
        setInterval(() => renewAccessTokenIfNeeded(), 1000);
    } catch (error) {
        console.error(error);
    }
}

export const ErrorMessage = (message: WriteSignal<string | undefined>) => Box(message.map((x) => x ? Label(x).setPadding("var(--wg-button-padding, 5px 10px)").setCssStyle("color", "red").setCssStyle("borderRadius", "var(--wg-checkbox-border-radius, var(--wg-radius-tiny))").setCssStyle("backgroundColor", "#2e0000") : Empty()));

function shouldLoginPage() {
    if (!loginRequired.find((x) => location.pathname.startsWith(x))) {
        return;
    }
    localStorage.goal = location.pathname + location.search;
    location.href = "/signin";
    throw "aborting javascript here";
}

export const sheetStack = Sheets();

sheetStack
    .setMinWidth("auto")
    .setWidth("auto");

export function getYearList(): string[] {
    return new Array(new Date().getFullYear() - 2000 + 1)
        .fill(1)
        .map((_, i) => (new Date().getFullYear()) - i)
        .map((x) => x.toString());
}

export function saveBlob(blob: Blob, fileName: string) {
    const a = document.createElement("a");
    const url = globalThis.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    globalThis.URL.revokeObjectURL(url);
}

export function showPreviewImage(x: { artwork?: string; _id?: string } | undefined) {
    return x?.artwork ? showImage(API.getArtworkByDropByMusic({ path: { dropId: x._id! } }).then(stupidErrorAlert) as Promise<Blob>, "Drop Artwork") : Image(templateArtwork, "A Placeholder Artwork.");
}

export function showImage(blob: Promise<Blob>, alt: string) {
    return Async(
        blob.then((blob) => Image(URL.createObjectURL(blob), alt)),
        Spinner(),
    ).setCssStyle("overflow", "hidden");
}

export function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += (`00${value.toString(16)}`).slice(-2);
    }
    return color;
}

export function ProfilePicture(component: Component, name: string) {
    const ele = component.draw();
    ele.style.backgroundColor = stringToColor(name);
    return Grid({
        draw: () => ele,
    })
        .setCssStyle("overflow", "hidden")
        .setRadius("mid");
}

export function getNameInital(name: string) {
    if (name.includes(", ")) {
        return name.split(", ").map((x) => x.at(0)?.toUpperCase()).join("");
    }
    if (name.includes(",")) {
        return name.split(",").map((x) => x.at(0)?.toUpperCase()).join("");
    }
    if (name.includes(" ")) {
        return name.split(" ").map((x) => x.at(0)?.toUpperCase()).join("");
    }
    return name.at(0)!.toUpperCase();
}

const cache = new LruCache<unknown, Promise<Blob>>(10);

const getPicture = memoize(async (id: string) => {
    const image = await API.getPictureByUserByUser({ path: { userId: id } });
    if (image.error === undefined) {
        return image.data as Blob;
    }
    fail("Failed to load image");
}, { cache });

export function showProfilePicture(x: ProfileData) {
    return ProfilePicture(
        showImage(getPicture(x._id), "Profile picture"),
        x.profile.username,
    );
}

export const streamingImages = {
    spotify: Image(spotify, "Spotify"),
    deezer: Image(deezer, "Deezer"),
    tidal: Image(tidal, "Tidal"),
    apple: Image(apple, "Apple Music"),
};

export const ExistingSongDialog = (dropSongs: WriteSignal<Song[]>, songs: Song[]) => {
    const selected = asRef(undefined);
    return Grid(
        SheetHeader("Add Existing Song", sheetStack),
        DropDown(songs.map((x) => x._id), selected, "Select Song").setValueRender((x) => songs.find((y) => y._id == x)?.title ?? "Unknown"),
        PrimaryButton("Add").setMargin("1rem 0 0 0").onClick(() => {
            const selectedSong = selected.getValue();
            if (selectedSong) {
                dropSongs.setValue(dropSongs.value.concat(songs.find((x) => x._id == selectedSong)!));
            }
            sheetStack.removeOne();
            selected.setValue(undefined);
        }),
    );
};

export function randomInteger(lower: number, upper: number): number {
    return lower + Math.floor(Math.random() * (upper - lower + 1));
}
