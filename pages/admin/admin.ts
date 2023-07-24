import { Vertical, View, WebGen } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { RegisterAuthRefresh, permCheck, renewAccessTokenIfNeeded } from "../_legacy/helper.ts";
import { changeThemeColor } from "../_legacy/misc/common.ts";

import '../../assets/css/main.css';
import './admin.css';
import { refreshState } from "./loading.ts";
import { adminMenu } from "./views/menu.ts";

await RegisterAuthRefresh();

if (!permCheck(
    "/hmsys/user/manage",
    "/bbn/manage"
)) {
    location.href = "/";
}

WebGen({
    events: {
        themeChanged: changeThemeColor()
    }
});

View(() => Vertical(...DynaNavigation("Admin"), adminMenu)).appendOn(document.body);

renewAccessTokenIfNeeded()
    .then(() => refreshState());