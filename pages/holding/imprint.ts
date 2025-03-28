import { Footer } from "shared/footer.ts";
import { RegisterAuthRefresh } from "shared/helper.ts";
import { Body, Box, Grid, Label, WebGen } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import "./flowText.css";
WebGen();
await RegisterAuthRefresh();

Body(Box(
    DynaNavigation("Home"),
    Box(
        Label("Imprint", "h2"),
        Grid(
            Label("Phone:"),
            Label("+49 175 9295753"),
            Label("EMail:"),
            Label("support@bbn.music"),
            Label("Internet:"),
            Label("bbn.music"),
            Label("Address:"),
            Label("BBN Music Gmbh\nRosa-Luxemburg-Str. 37\n14482 Potsdam\nGermany"),
            Label("Commercial register:"),
            Label("Potsdam Local Court\nHRB 39134 P"),
            Label("EUID"),
            Label("DEG1312.HRB39134P"),
            Label("VAT ID:"),
            Label("DE370194161"),
            Label("Managing Directors:"),
            Label("Maximilian Arzberger\nGregor Bigalke"),
            Label("Responsible for content:"),
            Label("Maximilian Arzberger, Gregor Bigalke\nRose-Luxemburg-Str. 37\n14482 Potsdam\nGermany"),
        ).setEvenColumns(2).setGap().setCssStyle("whiteSpace", "pre-wrap"),
        Label(`Alternative dispute resolution`, "h3"),
        Label(
            `The European Commission provides a platform for the out-of-court resolution of disputes (ODR platform), which can be viewed under ec.europa.eu/odr`,
        ).addClass("block"),
        Label(`We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.`),
    ).addClass("flow-text"),
    Footer(),
));
