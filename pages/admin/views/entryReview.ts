import { API } from "shared";
import { Box, Button, ButtonStyle, Cache, CenterV, Color, Entry, Image, MIcon } from "webgen/mod.ts";
import { templateArtwork } from "../../../assets/imports.ts";
import { Drop, DropType } from "../../../spec/music.ts";
import { loadImage } from "../../_legacy/helper.ts";
import { ReviewDialog, state } from "../dialog.ts";
import { refreshState } from "../loading.ts";

export function ReviewEntry(x: Drop) {
    return Entry({
        title: x.title ?? "(no drop name)",
        subtitle: `${x.release ?? "(no release date)"} - ${x.user} - ${x.upc ?? "(no upc number)"} - ${x._id}`
    })
        .addClass("small")
        .addSuffix(Button("Edit")
            .setStyle(ButtonStyle.Inline)
            .setColor(Color.Colored)
            .addClass("tag")
            .onClick(() => location.href = `/music/edit?id=${x._id}`))
        .addSuffix(Box(...ReviewActions(x)))
        .addPrefix(Cache(`image-preview-${x._id}`, () => Promise.resolve(), (type) => {
            const imageSource = type == "loaded" && x.artwork
                ? Image({ type: "direct", source: async () => await loadImage(x) ?? fetch(templateArtwork).then(x => x.blob()) }, "A Song Artwork")
                : Image(templateArtwork, "A Placeholder Artwork.");

            return Box(imageSource)
                .addClass("image-square");
        }));
}

function ReviewActions(x: Drop) {
    return [
        ...x.type == "UNDER_REVIEW" ? [
            CenterV(
                Button(MIcon("done_all"))
                    .setStyle(ButtonStyle.Inline)
                    .setColor(Color.Colored)
                    .addClass("tag")
                    .onClick(() => {
                        ReviewDialog.open();
                        state.drop = x;
                        ReviewDialog.onClose(() => refreshState());
                    })
            ),
        ] : [],
        ...x.type == "PUBLISHING" ? [
            //TODO: Change this button to a dropdown with options to change the state of the drop.
            CenterV(
                Button(MIcon("bug_report"))
                    .setStyle(ButtonStyle.Inline)
                    .setColor(Color.Colored)
                    .addClass("tag")
                    .onPromiseClick(async () => {
                        await API.music.id(x._id).type.post(DropType.Publishing);
                    })
            ),
        ] : [],
    ];
}