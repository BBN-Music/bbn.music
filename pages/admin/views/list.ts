import { saveBlob, sheetStack } from "shared/helper.ts";
import { fileCache } from "shared/mod.ts";
import { asRef, Box, Button, Cache, Color, Entry, Grid, IconButton, Image, MIcon, ref, SheetDialog, TextInput } from "webgen/mod.ts";
import { templateArtwork } from "../../../assets/imports.ts";
import { API, File, OAuthApp, stupidErrorAlert, Wallet } from "../../../spec/mod.ts";
import { state } from "../state.ts";

export function entryWallet(wallet: Wallet) {
    return Entry({
        title: ref`${wallet.userName} - ${((wallet.balance?.restrained ?? 0) + (wallet.balance?.unrestrained ?? 0)).toFixed(2).toString()}`,
        subtitle: `${wallet.email} - ${wallet.user} - ${wallet._id} - ${wallet.cut}% - ${wallet.balance?.restrained.toFixed(2)}/${wallet.balance?.unrestrained.toFixed(2)}`,
    }).addClass("small");
}

/* export function entryTranscript(transcript: Transcript) {
    return Entry({
        title: ref`Ticket with ${transcript.with}`,
        subtitle: `${transcript.closed} - ${new Date(transcript.messages[0].timestamp).toISOString()}`,
    }).addClass("small");
} */

export function entryOAuth(app: OAuthApp) {
    return Entry({
        title: app.name,
        subtitle: app._id,
    })
        .addPrefix(Cache(`appicon-${app._id}`, () => API.getDownloadByFileByFilesByAdmin({ path: { fileId: app.icon } }), (type, val) => {
            const imageSource = type == "loaded" && app.icon !== "" && val && !val.error ? Image({ type: "direct", source: () => Promise.resolve(val.data) }, "O-Auth Icon") : Image(templateArtwork, "A Placeholder Artwork.");
            return Box(imageSource)
                .addClass("image-square");
        }))
        .addSuffix(
            IconButton(MIcon("delete"), "delete").setColor(Color.Critical).onClick(() => {
                API.deleteIdByApplicationsByOauth({ path: { id: app._id } }).then(async () => state.oauth = await API.getApplicationsByOauth().then(stupidErrorAlert));
            }),
        )
        .addSuffix(
            Button("View").onClick(() => {
                oAuthViewDialog(app).open();
            }),
        )
        .addClass("small");
}

const oAuthViewDialog = (oauth: OAuthApp) => {
    const sheet = SheetDialog(
        sheetStack.setSheetWidth("30rem"),
        "OAuth App Details",
        Grid(
            TextInput("text", "Name").ref(asRef(oauth.name)).setColor(Color.Disabled),
            TextInput("text", "Client ID").ref(asRef(oauth._id)).setColor(Color.Disabled),
            TextInput("text", "Client Secret").ref(asRef(oauth.secret)).setColor(Color.Disabled),
            TextInput("text", "Redirect URI").ref(asRef(oauth.redirect.join(","))).setColor(Color.Disabled),
            Button("Close").onClick(() => {
                sheet.close();
            }).setJustifySelf("end"),
        ).setGap(),
    );

    return sheet;
};

export function entryFile(file: File) {
    return Entry({
        title: file.filename,
        subtitle: file._id,
    }).addPrefix(Cache(`file-icon-${file._id}`, () => loadFilePreview(file._id), (type, val) => {
        if (type == "cache") {
            return Image({ type: "loading" }, "Loading");
        }
        const imageSource = type == "loaded" && file.metadata.type.startsWith("image/") && val ? Image({ type: "direct", source: () => Promise.resolve(val) }, "A Song Artwork") : Image(templateArtwork, "A Placeholder Artwork.");
        return Box(imageSource)
            .addClass("image-square");
    })).addSuffix(
        IconButton(MIcon("download"), "download").onClick(async () => {
            const blob = await API.getDownloadByFileByFilesByAdmin({ path: { fileId: file._id } }).then(stupidErrorAlert);
            saveBlob(blob, file.filename);
        }),
    ).addSuffix(
        IconButton(MIcon("delete"), "delete").setColor(Color.Critical).onClick(() => {
            API.deleteIdByFilesByAdmin({ path: { id: file._id } });
        }),
    );
}

export async function loadFilePreview(id: string) {
    const cache = await fileCache();
    if (await cache.has(`file-icon-${id}`)) return await cache.get(`file-icon-${id}`);
    const blob = await API.getDownloadByFileByFilesByAdmin({ path: { fileId: id } }).then(stupidErrorAlert);
    cache.set(`file-icon-${id}`, blob);
    return blob;
}
