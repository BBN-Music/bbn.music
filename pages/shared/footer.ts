import { BIcon, Box, ButtonStyle, Grid, IconButton, Image, Label, LinkButton } from "webgen/mod.ts";
import { splash } from "../../assets/imports.ts";
import "./footer.css";

export function Footer() {
    return Box(
        Box(
            Image(splash, "Splash Image").addClass("splash-image"),
            Box(
                Box(
                    Label("Looks Dope?\nJoin now!").addClass("title"),
                    Label("Delivering Excellence. Empowering Businesses and\nIndividuals with Premium Services")
                        .addClass("subtitle"),
                ).addClass("text-section"),
                LinkButton("Get started", "/signin")
                    .addClass("round-button", "large-button"),
            ).addClass("area-fg"),
            Box(
                Box(
                    ...[
                        ["Company", [
                            ["About Us", "/"],
                            ["Terms and Conditions", "/p/terms"],
                            ["Privacy Policy", "/p/privacy-policy"],
                            ["Imprint", "/p/imprint"],
                        ]] as const,

                        ["Products", [
                            ["Music", "/music"],
                        ]] as const,

                        ["Resources", [
                            // ["Blog", "https://blog.bbn.music/"],
                            ["Status Page", "https://status.bbn.music/"],
                            // ["Open Source", "https://github.com/bbn-holding/"],
                            ["Support", "mailto:support@bbn.music"],
                        ]] as const,
                    ].map(([text, items]) =>
                        Grid(
                            Label(text)
                                .addClass("title"),
                            ...items.map(([title, link]) =>
                                LinkButton(title, link)
                                    .addClass("link")
                                    .setStyle(ButtonStyle.Inline)
                            ),
                        ).addClass("column")
                    ),
                ).addClass("grouped-links"),
                Grid(
                    Grid(
                        ...[
                            // ["youtube", "Youtube", "https://www.youtube.com/@bbn6775"],
                            // ["twitter", "Twiter", "https://twitter.com/BBN_Holding"],
                            // ["facebook", "Facebook", "https://www.facebook.com/bbn.holding/"],
                            ["discord", "Discord", "https://discord.gg/dJevjw2fCe"],
                            ["instagram", "Instagram", "https://www.instagram.com/bbn.music/"],
                            ["mastodon", "Mastodon", "https://chaos.social/@bbn"],
                            // ["github", "GitHub", "https://github.com/bbn-holding/"],
                        ]
                            .map(([icon, aria, link]) =>
                                IconButton(BIcon(icon), aria)
                                    .addClass("icon")
                                    .asLinkButton(link)
                            ),
                    ).addClass("icons"),
                    LinkButton("Join Now", "/signin")
                        .setStyle(ButtonStyle.Secondary)
                        .addClass("round-button"),
                    LinkButton("Contact Us", "mailto:support@bbn.music")
                        .addClass("round-button"),
                )
                    .addClass("icon-bar"),
            ).addClass("area-bg"),
        ).addClass("footer"),
    ).addClass("footer-space");
}
