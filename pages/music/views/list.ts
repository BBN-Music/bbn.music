import { BasicEntry } from "shared/components.ts";
import { showPreviewImage } from "shared/helper.ts";
import { placeholder } from "shared/list.ts";
import { asRef, Empty, Entry, Grid, Image, Label } from "webgen/mod.ts";
import { templateArtwork } from "../../../assets/imports.ts";
import { type Artist, Drop, DropType, zDropType } from "../../../spec/mod.ts";

export function PillSuffix(text: string) {
    return Label(text)
        .setCssStyle("backgroundColor", "#3b3a3a")
        .setCssStyle("borderRadius", "var(--wg-entry-radius, var(--wg-radius-large))")
        .setPadding("0.75rem")
        .setMargin("0 1rem 0 0")
        .setHeight("max-content")
        .setAlignSelf("center");
}

export function DropEntry(x: Partial<Drop>, showAll: boolean = false) {
    return Entry(
        BasicEntry(x.title ?? "(no drop name)", x.release ?? "(no release date)")
            .addPrefix(showPreviewImage(x).setWidth("100px").setRadius("large"))
            .addSuffix((() => {
                if (x.type == zDropType.enum.UNDER_REVIEW) {
                    return PillSuffix("Under Review");
                }

                if (x.type == zDropType.enum.REVIEW_DECLINED) {
                    return PillSuffix("Declined");
                }

                if (showAll && x.type == zDropType.enum.PUBLISHED) {
                    return PillSuffix("Published");
                }

                if (showAll && x.type == zDropType.enum.PRIVATE) {
                    return PillSuffix("Private");
                }

                if (showAll && x.type == zDropType.enum.UNSUBMITTED) {
                    return PillSuffix("Draft");
                }

                return Empty();
            })()),
    ).onClick(() => location.href = x.type === zDropType.enum.UNSUBMITTED ? `/c/music/new-drop?id=${x._id}` : `/c/music/edit?id=${x._id}`);
}

export function ArtistEntry(x: Artist) {
    return Entry(BasicEntry(x.name).addPrefix(Image(templateArtwork, "Artist Profile Picture").setWidth("100px").setRadius("large")));
    // TODO: Add used on x songs, x drops, maybe even streams?
    // Label("Used on ")
    //TODO: links
    // .addSuffix(
    //     Horizontal(
    //         LinkButton("Spotify", "fdgdf"),
    //         LinkButton("Apple Music", "fdgdf"),
    //     ).setGap(),
    // )
}

export const musicList = (list: Drop[], type: DropType) =>
    Grid(
        CategoryRender(
            list.filter((_, i) => i == 0),
            "Latest Drop",
        ),
        CategoryRender(
            list.filter((_, i) => i > 0),
            "History",
        ),
        list.length == 0 ? placeholder("No Drops", `You don’t have any ${EnumToDisplay(type)} Drops`) : Empty(),
    )
        .setGap("20px");

export function CategoryRender(dropList: Drop[], title: string) {
    if (dropList.length == 0) {
        return Empty();
    }
    return Grid(
        Label(title).setFontWeight("bold").setTextSize("4xl"),
        Grid(asRef(dropList.map((x) => DropEntry(x)))).setGap(),
    ).setGap();
}

export function EnumToDisplay(state: DropType) {
    return state === "PUBLISHED" ? "published" : "";
}

export function DropTypeToText(type: DropType) {
    return (<Record<DropType, string>> {
        "PRIVATE": "Private",
        "PUBLISHED": "Published",
        "UNDER_REVIEW": "Under Review",
        "UNSUBMITTED": "Draft",
        "REVIEW_DECLINED": "Rejected",
    })[type];
}
