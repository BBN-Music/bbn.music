import { Box, Component, Grid, Label } from "webgen/core/mod.ts";
import { asRef, BootstrapIcon, Content, css, Image, mediaQueryRef, PrimaryButton, SecondaryButton, TextButton } from "webgen/mod.ts";
import { splash } from "../../assets/imports.ts";

export function Footer() {
    return Content(
        Grid(
            Grid(
                Grid(
                    Label("Looks Dope?\nJoin now!")
                        .setFontWeight("black")
                        .setTextSize("5xl")
                        .setCssStyle("lineHeight", "1.2")
                        .setCssStyle("whiteSpace", "pre-line"),
                    Label("Delivering Excellence. Empowering Businesses and\nIndividuals with Premium Services")
                        .setTextSize("xl")
                        .setCssStyle("whiteSpace", "pre-line"),
                )
                    .setGap("2.5rem")
                    .setDirection("row"),
                PrimaryButton("Get started")
                    .onClick(() => location.href = "/signin")
                    .setWidth("max-content")
                    .addStyle(css`
                        button {
                            height: 50px;
                            padding: 2px 2rem 0;
                            border-radius: 20px;
                            font-size: 1rem;
                        }
                `),
                Image(splash, "Splash Image")
                    .addStyle(css`
                        :host {
                            width: 572px;
                            position: absolute;
                            right: -10px;
                            rotate: -10deg;
                            z-index: -1;
                        }
                        @media (max-width: 1130px) {
                            :host {
                                width: 450px;
                                right: -5rem;
                            }
                        }
                    `),
            )
                .setGap("4rem")
                .setDirection("row")
                .addStyle(css`
                    :host {
                        position: relative;
                    }
                `),
            Box(
                Grid(
                    asRef([
                        ["Company", [
                            ["About Us", "/"],
                            ["Terms and Conditions", "/p/terms"],
                            ["Privacy Policy", "/p/privacy-policy"],
                            ["Imprint", "/p/imprint"],
                        ]] as const,

                        ["Products", [
                            ["Music", "/music"],
                        ]] as const,

                        // ["Use Cases", [
                        //     ["Newcomers", "/music"],
                        //     ["Personal", "/hosting"],
                        //     ["Small Business", "/hosting"],
                        // ]] as const,

                        ["Resources", [
                            ["Status Page", "https://status.bbn.music/"],
                            ["Support", "mailto:support@bbn.music"],
                        ]] as const,
                    ].map(([text, items]) =>
                        Grid(
                            Label(text)
                                .setFontWeight("bold")
                                .setMargin("0 0 1rem"),
                            ...items.map(([title, link]) =>
                                TextButton(title)
                                    .onClick(() => location.href = link)
                                    .addStyle(css`
                                        :host {
                                            margin: 0 0 0 -15px;
                                        }
                                    `)
                            ),
                        )
                            .setJustifyItems("start")
                            .setAlignContent("start")
                    )),
                )
                    .setGap("2rem")
                    .setDynamicColumns(20, "20rem")
                    .setMargin("0 0 5rem"),
                Grid(
                    Grid(
                        ...[
                            ["discord", "https://discord.gg/dJevjw2fCe"],
                            ["instagram", "https://www.instagram.com/bbn.music/"],
                            ["mastodon", "https://chaos.social/@bbn"],
                            ["github", "https://github.com/bbn-music/"],
                        ]
                            .map(([icon, link]) =>
                                TextButton("").addPrefix(BootstrapIcon(icon).setCssStyle("scale", "1.3"))
                                    .onClick(() => location.href = link)
                                    .addStyle(css`
                                        :host {
                                            --wg-button-text-padding: 0;
                                            --wg-button-padding: 0 6px;
                                        }
                                        button {
                                            padding: 12px 12px 7px;
                                            height: unset;
                                            border-radius: var(--wg-radius-large);
                                        }
                                    `)
                            ) as unknown as [Component],
                    )
                        .setGap()
                        .setAutoFlow("column")
                        .setAutoColumn("max-content"),
                    SecondaryButton("Join Now")
                        .onClick(() => location.href = "/signin"),
                    PrimaryButton("Contact Us")
                        .onClick(() => location.href = "mailto:support@bbn.music"),
                )
                    .setGap()
                    .setTemplateColumns(mediaQueryRef("(max-width: 630px)").map((small) => small ? "max-content" : "auto max-content max-content"))
                    .setJustifyContent(mediaQueryRef("(max-width: 630px)").map((small) => small ? "center" : "normal"))
                    .setMargin("5rem 0")
                    .addStyle(css`
                        :host {
                            --wg-button-border-radius: var(--wg-radius-large);
                        }
                    `),
            ),
        )
            .setGap("5rem")
            .setMargin("7rem 0 0"),
    )
        .setContentPadding("2.4rem")
        .setContentMaxWidth("1230px");
}
