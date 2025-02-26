import { changeThemeColor, RegisterAuthRefresh, renewAccessTokenIfNeeded, sheetStack } from "shared/helper.ts";
import { Body, Vertical, WebGen } from "webgen/mod.ts";
import "../../assets/css/main.css";
import "../../assets/css/music.css";
import { DynaNavigation } from "../../components/nav.ts";
import { API, DropType, stupidErrorAlert, zDropType } from "../../spec/mod.ts";
import { menuState, musicMenu } from "./views/menu.ts";

await RegisterAuthRefresh();
WebGen({
    events: {
        themeChanged: changeThemeColor(),
    },
});

sheetStack.setDefault(Vertical(DynaNavigation("Music"), musicMenu));

Body(sheetStack);

renewAccessTokenIfNeeded()
    .then(async () => {
        const list = await API.getDropsByMusic().then(stupidErrorAlert);

        menuState.published = list.filter((x) => x.type === zDropType.enum.PUBLISHED);
        menuState.drafts = list.filter((x) => x.type === zDropType.enum.UNSUBMITTED);
        menuState.unpublished = list.filter((x) =>
            x.type === zDropType.enum.UNDER_REVIEW ||
            x.type === zDropType.enum.PRIVATE ||
            x.type === zDropType.enum.REVIEW_DECLINED
        );
        menuState.payouts = await API.getPayoutsByPayment().then(stupidErrorAlert);
        menuState.artists = await API.getArtistsByMusic().then(stupidErrorAlert);
    });
