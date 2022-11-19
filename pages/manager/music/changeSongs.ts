import { Button, Horizontal, Page, Spacer, Table, Vertical, View, Wizard } from "webgen/mod.ts";
import { allowedAudioFormats, UploadTable } from "../helper.ts";
import { ActionBar } from "../misc/actionbar.ts";
import { changePage, HandleSubmit, setErrorMessage } from "../misc/common.ts";
import { API, Drop } from "../RESTSpec.ts";
import { EditViewState } from "./types.ts";
import { DeleteFromForm, FormToRecord } from "../data.ts";
import { TableData } from "../types.ts";
import { TableDef } from "./table.ts";
import { uploadFilesDialog } from "../upload.ts";
import { addSongsByDrop } from "./data.ts";

export function ChangeSongs(drop: Drop, update: (data: Partial<EditViewState>) => void) {
    return Wizard({
        submitAction: async ([ { data: { data } } ]) => {
            await API.music(API.getToken())
                .id(drop._id)
                .put(data);
            location.reload(); // Handle this Smarter => Make it a Reload Event.
        },
        buttonArrangement: ({ PageValid, Submit }) => {
            setErrorMessage();
            return ActionBar("Songs", undefined, {
                title: "Update", onclick: HandleSubmit(PageValid, Submit)
            }, [ { title: drop.title || "(no title)", onclick: changePage(update, "main") } ]);
        },
        buttonAlignment: "top",
    }, () => [
        Page({
            song: drop.song
        }, data => [
            View(({ update }) => Vertical(
                data.getAll("song").filter(x => x).length ?
                    Table<TableData>(
                        TableDef(data, update),
                        FormToRecord(data, "song", [])
                            .map(x => ({ Id: x.id }))
                    )
                        .setDelete(({ Id }) => {
                            DeleteFromForm(data, "song", (x) => x != Id);
                            update({});
                        })
                        .addClass("limited-width", "light-mode")
                    : UploadTable(TableDef(data, update), (list) => addSongsByDrop(drop, list, data, update))
                        .addClass("limited-width", "light-mode"),
                Horizontal(
                    Spacer(),
                    Button("Manual Upload")
                        .onClick(() => uploadFilesDialog((list) => addSongsByDrop(drop, list, data, update), allowedAudioFormats.join(",")))
                ).addClass("limited-width").setMargin("1rem auto 0")
            )).asComponent()
        ]).setValidator((v) => v.object({
            loading: v.void(),
            song: v.string().or(v.array(v.string()))
        }))
    ]
    );
}