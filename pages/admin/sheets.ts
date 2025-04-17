import { sheetStack } from "shared/helper.ts";
import { asRef, asRefRecord, Color, Grid, Image, Label, List, PrimaryButton, SheetHeader, TextInput } from "webgen/mod.ts";
import { templateArtwork } from "../../assets/imports.ts";
import { API, OAuthApp, stupidErrorAlert } from "../../spec/mod.ts";

export function editOAuthSheet(app: OAuthApp) {
    const state = asRefRecord(app);
    return Grid(
        SheetHeader("OAuth App Details", sheetStack),
        Grid(
            TextInput(state.name, "Name"),
            Grid(
                Label("Redirect URIs").setFontWeight("bold").setTextSize("xl").setJustifySelf("center").setCssStyle("position", "absolute"),
                PrimaryButton("Add").setJustifySelf("end").onClick(() => {
                    state.redirect.setValue(state.redirect.getValue().concat(""));
                }),
            ).setTemplateColumns("1fr max-content").setGap(),
            List(state.redirect, 50, (x) => {
                const url = asRef(x);
                url.listen((v) => {
                    const index = state.redirect.getValue().indexOf(x);
                    state.redirect.setValue(state.redirect.getValue().map((y, i) => (i == index ? v : y)));
                });
                return TextInput(url, "URI", "change");
            }).setGap(5),
            Label("Client Details").setFontWeight("bold").setTextSize("xl").setJustifySelf("center"),
            Grid(
                TextInput(state._id, "Client ID").setDisabled(true),
                TextInput(state.secret, "Client Secret").setDisabled(true),
            ).setTemplateColumns("auto auto").setGap(),
        )
            .setGap()
            .setDynamicColumns(45),
        Grid(
            PrimaryButton("Delete").onPromiseClick(async () => {
                await API.deleteIdByApplicationsByOauth({
                    path: {
                        id: app._id,
                    },
                }).then(stupidErrorAlert);
                location.reload();
            }),
            PrimaryButton("Save").setCustomColor(new Color("#4CAF50")).onPromiseClick(async () => {
                await API.patchIdByApplicationsByOauth({
                    path: {
                        id: app._id,
                    },
                    body: {
                        name: state.name.getValue(),
                        redirect: state.redirect.getValue(),
                        icon: state.icon.getValue(),
                    },
                }).then(stupidErrorAlert);
                sheetStack.removeOne();
            }),
        )
            .setGap()
            .setTemplateColumns("1fr 1fr"),
    ).setGap();
}

export function createOAuthSheet() {
    const promise = Promise.withResolvers<void>();
    const state = asRefRecord({
        name: "",
        redirect: [""],
        icon: "",
    });

    sheetStack.addSheet(
        Grid(
            SheetHeader("Create new OAuth Application", sheetStack),
            Grid(
                Grid(
                    Image(templateArtwork, "sdfd"),
                    PrimaryButton("Upload Image"),
                ).setGap(),
                Grid(
                    TextInput(state.name, "Name"),
                    Grid(
                        Label("Redirect URIs").setFontWeight("bold").setTextSize("xl").setJustifySelf("center").setCssStyle("position", "absolute"),
                        PrimaryButton("Add").setJustifySelf("end").onClick(() => {
                            state.redirect.setValue(state.redirect.getValue().concat(""));
                        }),
                    ).setTemplateColumns("1fr max-content").setGap(),
                    List(state.redirect, 50, (x) => {
                        const url = asRef(x);
                        url.listen((v) => {
                            const index = state.redirect.getValue().indexOf(x);
                            state.redirect.setValue(state.redirect.getValue().map((y, i) => (i == index ? v : y)));
                        });
                        return TextInput(url, "URI", "change");
                    }).setGap(5),
                ).setGap(),
            ).setTemplateColumns("auto 1fr").setGap(),
            PrimaryButton("Create").onPromiseClick(async () => {}),
        ).setGap(),
    );

    return promise.promise;
}
