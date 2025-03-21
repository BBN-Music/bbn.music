import { Footer } from "shared/footer.ts";
import { activeUser, getNameInital, logOut, ProfilePicture, RegisterAuthRefresh } from "shared/helper.ts";
import { LoadingSpinner } from "shared/mod.ts";
import { asState, Body, Box, Button, ButtonStyle, Color, Content, FullWidthSection, Grid, Horizontal, Image, isMobile, Label, MIcon, Spacer, Vertical, WebGen } from "webgen/mod.ts";
import "../../assets/css/main.css";
import { dots, templateArtwork } from "../../assets/imports.ts";
import { DynaNavigation } from "../../components/nav.ts";
import "./oauth.css";
import "./signin.css";
import { API, APITools, OAuthScopes, stupidErrorAlert } from "../../spec/mod.ts";

await RegisterAuthRefresh();

const oauthScopes = {
    "profile": "See your profile information",
    "email": "See your email address",
    "phone": "See your phone number",
} satisfies Record<OAuthScopes, string>;

const para = new URLSearchParams(location.search);
const params = {
    clientId: para.get("client_id"),
    scope: para.get("scope"),
    state: para.get("state"),
    redirectUri: para.get("redirect_uri"),
    prompt: para.get("prompt"),
};

if (!params.clientId || !params.scope || !params.redirectUri) {
    alert("Invalid OAuth Request");
    throw new Error("Invalid OAuth Request");
}

WebGen();

const state = asState({
    loaded: false,
    name: "",
    icon: "",
});

Body(
    Content(
        FullWidthSection(DynaNavigation("Home"), Box().addClass("background-image")),
        state.$loaded.map((loaded) =>
            loaded
                ? Grid(
                    isMobile.map((small) =>
                        Label("Connect Now!")
                            .setMargin("5rem 0 .8rem")
                            .addClass(small ? "no-custom" : "line-header", "header")
                            .setFontWeight("extrabold")
                            .setTextSize(small ? "6xl" : "7xl")
                    ).asRefComponent().removeFromLayout(),
                    Label("CONNECTION")
                        .addClass("label-small"),
                    Grid(
                        Grid(
                            Image(state.icon || templateArtwork, "New Connection"),
                            Label(state.name || "---")
                                .setJustifySelf("center")
                                .addClass("label-small"),
                        ),
                        Image(dots, "dots"),
                        Grid(
                            ProfilePicture(
                                activeUser.avatar ? Image(activeUser.avatar, "Profile Picture") : Label(getNameInital(activeUser.username)),
                                activeUser.username,
                            ),
                            Label(activeUser.username)
                                .setJustifySelf("center")
                                .addClass("label-small"),
                        ),
                    ).addClass("linkage"),
                    Label("PERMISSIONS")
                        .addClass("label-small"),
                    Vertical(
                        params.scope!.split(",").map((e) =>
                            Grid(
                                MIcon("check"),
                                Label(oauthScopes[e as OAuthScopes]),
                            ).addClass("permission")
                        ),
                    ),
                    Button("Connect")
                        .setWidth("100%")
                        .setJustifyContent("center")
                        .setMargin("1rem 0 0")
                        .onPromiseClick(async () => await authorize()),
                    Horizontal(
                        Label("Wrong account?"),
                        Button("Switch it here")
                            .setStyle(ButtonStyle.Inline)
                            .setColor(Color.Colored)
                            .onClick(() => logOut(location.pathname + location.search))
                            .addClass("link"),
                        Spacer(),
                    )
                        .setMargin("1rem 0 0"),
                )
                : LoadingSpinner()
        ).asRefComponent().addClass("auth-area").setCssStyle("display", "grid"),
        FullWidthSection(Footer()),
    ),
);

async function authorize() {
    await API.postAuthorizeByOauth({ body: { id: params.clientId!, scope: params.scope!, redirect_uri: params.redirectUri! } })
        .then(stupidErrorAlert);
    const url = new URL(params.redirectUri!);
    url.searchParams.set("code", APITools.token() ?? "");
    url.searchParams.set("state", params.state!);
    globalThis.location.href = url.toString();
}

API.oauth.validate(params.clientId, params.scope, params.redirectUri)
    .then(stupidErrorAlert)
    .then(async (e) => {
        if (params.prompt !== "consent" && e.authorized) {
            await authorize();
            return;
        }
        state.name = e.name;
        state.icon = e.icon ? URL.createObjectURL(await API.getDownloadByClientByApplicationsByOauth({ path: { clientId: params.clientId! } }).then(stupidErrorAlert)) : "";
        state.loaded = true;
    });
