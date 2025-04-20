import { Grid, Label } from "webgen/mod.ts";

export const placeholder = (title: string, subtitle: string) =>
    Grid(
        Label(title)
            .setTextSize("4xl")
            .setFontWeight("bold")
            .addClass("list-title"),
        Label(subtitle)
            .setTextSize("xl"),
    ).setGap("1rem").setMargin("100px 0 0").setAttribute("align", "center");
