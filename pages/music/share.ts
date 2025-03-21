import { asRef, Body, Empty, Horizontal, Image, Label, LinkButton, Vertical, WebGen } from "webgen/mod.ts";
import { API, stupidErrorAlert } from "../../spec/mod.ts";
import { changeThemeColor, sheetStack, streamingImages } from "../shared/helper.ts";
import "./share.css";

WebGen({
    events: {
        themeChanged: changeThemeColor(),
    },
});

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
if (reqShare.error) {
    location.href = "https://bbn.music/";
}

share.setValue(stupidErrorAlert(reqShare));

sheetStack.setDefault(Vertical(
    Image({ type: "direct", source: () => API.getArtworkBySlugByShareByMusic({ path: { slug: data.s } }).then(stupidErrorAlert) }, "Background").addClass("bgImg"),
    share.map((shareVal) =>
        shareVal
            ? Horizontal(
                Vertical(
                    Image({ type: "direct", source: () => API.getArtworkBySlugByShareByMusic({ path: { slug: data.s } }).then(stupidErrorAlert) }, "A Song Artwork")
                        .setMaxHeight("300px").setMaxWidth("300px").setBorderRadius("mid"),
                    Label(shareVal.title).setTextAlign("center").setTextSize("2xl").setMargin("0 10px 0 0"),
                    Label(shareVal.artistNames.join(", ")).setTextAlign("center"),
                    Vertical(
                        ...Object.entries(shareVal.services).map(([key, val]) =>
                            LinkButton(
                                Horizontal(
                                    streamingImages[key]
                                        .setHeight("1.5rem")
                                        .setWidth("1.5rem").setMargin("0 10px 0 0"),
                                    Label(key[0].toUpperCase() + key.slice(1)).setTextSize("xl"),
                                ),
                                val,
                                "_blank",
                            )
                        ),
                    ).setGap("0.5rem").setMargin("10px 0 0 0"),
                    Label("Powered by BBN Music").setTextAlign("center").setMargin("10px 0 0 0"),
                ).addClass("share").setPadding("1rem").setBorderRadius("mid"),
            )
            : Empty()
    ).asRefComponent(),
));

Body(sheetStack);
