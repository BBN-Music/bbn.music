import { showImage, streamingImages } from "shared/helper.ts";
import { appendBody, asRef, Box, Content, Empty, Grid, Label, PrimaryButton, WebGenTheme } from "webgen/mod.ts";
import { API, stupidErrorAlert } from "../../spec/mod.ts";
import "./share.css";

const params = new URLSearchParams(location.search);
const data = Object.fromEntries(params.entries());
if (!data.s) {
    data.s = location.pathname.replace("/", "");
    if (!data.s) {
        location.href = "https://bbn.music/";
    }
}

const share = asRef(
    <undefined | {
        services: Record<string, string>;
        title: string;
        artistNames: string[];
        artwork: string;
    }> undefined,
);

const reqShare = await API.getSlugByShareByMusic({ path: { slug: data.s } });
if (reqShare.error !== undefined) {
    location.href = "https://bbn.music/";
}
// @ts-ignore fuck missing types on rest
share.setValue(stupidErrorAlert(reqShare));

appendBody(
    WebGenTheme(
        Content(
            Grid(
                showImage(API.getArtworkBySlugByShareByMusic({ path: { slug: data.s } }).then(stupidErrorAlert) as Promise<Blob>, "Drop Artwork"),
                Box(share.map((shareVal) =>
                    shareVal
                        ? Grid(
                            Grid(
                                showImage(API.getArtworkBySlugByShareByMusic({ path: { slug: data.s } }).then(stupidErrorAlert) as Promise<Blob>, "Drop Artwork")
                                    .setMinHeight("250px").setMinWidth("250px").setRadius("mid"),
                                Label(shareVal.title).setCssStyle("textAlign", "center").setTextSize("2xl").setMargin("0 10px 0 0"),
                                Label(shareVal.artistNames.join(", ")).setCssStyle("textAlign", "center"),
                                Grid(
                                    Empty(),
                                    ...Object.entries(shareVal.services).map(([key, val]) =>
                                        PrimaryButton("").addPrefix(
                                            Grid(
                                                // @ts-ignore fuck const record
                                                streamingImages[key]
                                                    .setHeight("1.5rem")
                                                    .setWidth("1.5rem")
                                                    .setMargin("0 10px 0 0"),
                                                Label(key[0].toUpperCase() + key.slice(1)).setTextSize("xl"),
                                            ).setTemplateColumns("auto auto"),
                                        ).onClick(() => {
                                            globalThis.open(val, "_blank");
                                        })
                                    ),
                                ).setGap("0.5rem").setMargin("10px 0 0 0"),
                                Label("Powered by BBN Music").setCssStyle("textAlign", "center").setMargin("10px 0 0 0"),
                            ).addClass("share").setPadding("1rem").setRadius("mid"),
                        )
                        : Empty()
                )),
            ),
        ),
    ),
);
