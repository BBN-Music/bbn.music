import { createActionList, createBreadcrumb, createTagList, LoadingSpinner, Navigation } from "shared/mod.ts";
import { Body, Button, ButtonStyle, Color, Empty, Entry, Grid, Horizontal, isMobile, Label, Spacer, Vertical, WebGen } from "webgen/mod.ts";
import "../../assets/css/main.css";
import "../../assets/css/music.css";
import { DynaNavigation } from "../../components/nav.ts";
import { API, stupidErrorAlert } from "../../spec/mod.ts";
import { ChangeDrop } from "../music/views/changeDrop.ts";
import { ChangeSongs } from "../music/views/changeSongs.ts";
import { DropTypeToText } from "../music/views/list.ts";
import { changeThemeColor, permCheck, RegisterAuthRefresh, renewAccessTokenIfNeeded, saveBlob, sheetStack, showPreviewImage, showProfilePicture } from "../shared/helper.ts";
import { ApproveDialog, DeclineDialog, dialogState } from "./dialog.ts";
import { reviewState } from "./state.ts";
import { changeState, changeTypeDialog } from "./views/entryReview.ts";

await RegisterAuthRefresh();

if (
    !permCheck(
        "/hmsys/user/manage",
        "/bbn/manage",
    )
) {
    location.href = "/";
}

WebGen({
    events: {
        themeChanged: changeThemeColor(),
    },
});

const params = new URLSearchParams(location.search);
const data = Object.fromEntries(params.entries());
if (!data.id) {
    alert("ID is missing");
    location.href = "/admin";
}

sheetStack.setDefault(Vertical(
    DynaNavigation("Admin"),
    Grid(
        Vertical(
            Label("User Details", "h1").setTextAlign("center"),
            reviewState.$drop.map((drop) =>
                drop
                    ? Vertical(
                        showProfilePicture(drop.user),
                        Label(`Username: ${drop.user.profile.username}`),
                        Label(`Email: ${drop.user.profile.email}`),
                        Label(`ID: ${drop.user._id}`),
                    ).setGap()
                    : LoadingSpinner()
            ).asRefComponent(),
            Label("User's Drops", "h1").setTextAlign("center"),
            reviewState.$drops.map((drops) =>
                drops
                    ? Vertical(
                        ...drops.map((drop) => Entry({ title: drop.title, subtitle: drop.type }).addClass("small")),
                    ).setGap()
                    : LoadingSpinner()
            ).asRefComponent(),
        )
            .setMaxHeight("calc(100vh - 53px)")
            .setCssStyle("overflow", "auto")
            .setCssStyle("border", "solid")
            .setGap()
            .setBorderRadius("tiny"),
        reviewState.$drop.map((drop) =>
            drop
                ? Navigation({
                    title: drop.title,
                    children: [
                        Label(DropTypeToText(drop.type)).setTextSize("2xl"),
                        {
                            id: "edit-drop",
                            title: "Drop",
                            subtitle: "Change Title, Release Date, ...",
                            children: [
                                ChangeDrop(drop, drop.artistList),
                            ],
                        },
                        {
                            id: "edit-songs",
                            title: "Songs",
                            subtitle: "Move Songs, Remove Songs, Add Songs, ...",
                            children: [
                                ChangeSongs(drop, drop.artistList),
                            ],
                        },
                        {
                            id: "export",
                            title: "Export",
                            subtitle: "Download your complete Drop with every Song",
                            clickHandler: async () => {
                                const blob = await API.getDownloadByDropByDropsByMusic({ path: { dropId: drop._id! } }).then(stupidErrorAlert);
                                saveBlob(blob, `${drop.title}.tar`);
                            },
                        },
                    ],
                })
                    .addClass(
                        isMobile.map((mobile) => mobile ? "mobile-navigation" : "navigation"),
                        "limited-width",
                    )
                    .setHeader((menu) =>
                        isMobile.map((mobile) => {
                            const list = Vertical(
                                menu.path.map((x) => x == "-/" ? Grid(showPreviewImage(drop).addClass("image-preview")).setEvenColumns(1, "10rem") : Empty()).asRefComponent(),
                                createBreadcrumb(menu),
                                createTagList(menu),
                            ).setGap();
                            if (!mobile) {
                                return Grid(
                                    list,
                                    createActionList(menu),
                                ).setRawColumns("auto max-content").setGap().setAlignItems("center");
                            }
                            return list;
                        }).asRefComponent()
                    )
                : LoadingSpinner()
        ).asRefComponent(),
        Vertical(
            Label("Drop History", "h1").setTextAlign("center"),
            reviewState.$drop.map((drop) =>
                drop
                    ? Vertical(
                        ...drop.events.map((entry) =>
                            Vertical(
                                Label(entry.meta.action),
                                Label(entry.userId),
                            ).setGap()
                        ),
                    ).setGap()
                    : LoadingSpinner()
            ).asRefComponent(),
            Spacer(),
            Button("Change Drop Type")
                .setStyle(ButtonStyle.Inline)
                .setColor(Color.Colored)
                .addClass("tag")
                .setMargin("var(--gap)")
                .onClick(() => {
                    changeTypeDialog.open();
                    changeState.drop = reviewState.drop;
                    changeState.type = reviewState.drop!.type;
                    changeTypeDialog.setOnClose(() => refreshReviewState());
                }),
            Horizontal(
                Button("Decline")
                    .setStyle(ButtonStyle.Inline)
                    .setColor(Color.Colored)
                    .addClass("tag")
                    .onClick(() => {
                        DeclineDialog.open();
                        dialogState.drop = reviewState.drop!;
                        DeclineDialog.setOnClose(() => refreshReviewState());
                    }),
                Button("Approve")
                    .setStyle(ButtonStyle.Normal)
                    .setColor(Color.Colored)
                    .addClass("tag")
                    .onClick(() => {
                        ApproveDialog.open();
                        dialogState.drop = reviewState.drop!;
                        ApproveDialog.setOnClose(() => refreshReviewState());
                    }),
            ).setGap(),
        )
            .setMaxHeight("calc(100vh - 53px)")
            .setCssStyle("overflow", "auto")
            .setCssStyle("border", "solid")
            .setBorderRadius("tiny"),
    )
        .setGap()
        .setRawColumns("1fr 3fr 1fr"),
));

Body(sheetStack);

renewAccessTokenIfNeeded()
    .then(() => refreshReviewState());

async function refreshReviewState() {
    reviewState.drop = await API.getIdByDropsByAdmin({ path: { id: data.id } }).then(stupidErrorAlert);
    reviewState.drops = await API.getDropsByAdmin({ query: { user: reviewState.drop!.user._id } }).then(stupidErrorAlert);
}
