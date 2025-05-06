import "./pages/chats.ts";
import "./pages/groups.ts";
import "./pages/oauth.ts";
import "./pages/overview.ts";
import "./pages/payouts.ts";
import "./pages/publishing.ts";
import "./pages/reviews.ts";
import "./pages/search.ts";
import "./pages/wallets.ts";
import "./pages/takedown.ts";

import { RegisterAuthRefresh, sheetStack } from "shared/helper.ts";
import { Navigation } from "shared/navigation.ts";
import { activeRoute, appendBody, Box, Content, createRoute, css, DialogContainer, FullWidthSection, PrimaryButton, StartRouting, WebGenTheme } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { oauthPage } from "./pages/oauth.ts";
import { overviewPage } from "./pages/overview.ts";
import { createOAuthSheet } from "./sheets.ts";

await RegisterAuthRefresh();

createRoute({
    path: "/admin",
    events: {
        onActive: () => {
            overviewPage.route.navigate({}, { history: "replace" });
        },
    },
});

appendBody(
    WebGenTheme(
        DialogContainer(sheetStack.visible(), sheetStack),
        Content(
            FullWidthSection(
                DynaNavigation("Admin"),
            ),
        ),
        Navigation(
            Box(
                activeRoute.map((route) => route === oauthPage.route.entry)
                    .map((x) =>
                        x
                            ? PrimaryButton("New App")
                                .onClick(async () => {
                                    await createOAuthSheet();
                                    location.reload();
                                })
                            : []
                    ),
            ),
        ),
    ).addStyle(css`
        :host {
            --wg-primary: #f81919;
            --content-max-width: 1200px;
        }
    `),
);

StartRouting();
