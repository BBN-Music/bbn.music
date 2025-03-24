import { sheetStack } from "shared/helper.ts";
import { asRef, asRefRecord, Box, DropDown, Empty, Entry, Grid, Label, List, MaterialIcon, PrimaryButton, RefRecord, SheetHeader, TextInput, WriteSignal } from "webgen/mod.ts";
import { API, Artist, ArtistRef, Song, stupidErrorAlert, zArtistTypes } from "../../../spec/mod.ts";
import "./table.css";

const songSheet = (song: RefRecord<Song>) => {
    return Grid(
        SheetHeader("Edit Song", sheetStack),
        Grid(
            Grid(
                Label("Title").setFontWeight("bold"),
                TextInput(song.title, "Title"),
            ).setTemplateColumns("max-content auto"),
            Grid(
                Label("Description").setFontWeight("bold"),
                TextInput(song.isrc!, "Description"),
            ).setTemplateColumns("max-content auto"),
        ).setGap(),
    );
};

export function ManageSongs(songs: WriteSignal<Song[]>) {
    function SongEntry(song: RefRecord<Song>) {
        return Grid(
            Grid(
                Label(song.title).setTextSize("3xl").setFontWeight("bold"),
                Label("Germany - 2024"),
            )
                .setHeight("max-content")
                .setAlignSelf("center"),
            Grid(Label("-").setTextSize("4xl").setCssStyle("color", "#b91616"), Label("Delete").setCssStyle("color", "#b91616")).setJustifySelf("end").setJustifyItems("center"),
        )
            .setTemplateColumns("max-content auto")
            .setPadding("1rem 0");
    }
    return Grid(
        Grid(
            Empty(),
            Label("Manage your Songs").setFontWeight("bold").setTextSize("2xl").setJustifySelf("center"),
            Grid(
                PrimaryButton("Add existing Song"),
                PrimaryButton("Upload Song"),
            ).setTemplateColumns("auto auto").setGap(),
        ).setTemplateColumns("1fr 1fr 1fr").setGap(),
        List(
            songs,
            100,
            //TODO: hide arrow?
            //TODO: hand refrecord change to writesignal or song arr
            (data, index) => {
                const song = asRefRecord(data);
                return Entry(SongEntry(song)).onClick(() => sheetStack.addSheet(songSheet(song)));
            },
        ),
    ).setGap();
}

export const createArtistSheet = (name?: string) => {
    const promise = Promise.withResolvers<void>();
    const state = asRefRecord({
        name,
        spotify: <string | undefined> undefined,
        apple: <string | undefined> undefined,
    });
    sheetStack.addSheet(
        Grid(
            SheetHeader("Create Artist", sheetStack),
            TextInput(state.name, "Artist Name"),
            TextInput(state.spotify, "Spotify URL"),
            TextInput(state.apple, "Apple Music URL"),
            PrimaryButton("Create")
                .onPromiseClick(async () => {
                    await API.postArtistsByMusic({
                        body: {
                            name: state.name.value!,
                            spotify: state.spotify.value,
                            apple: state.apple.value,
                        },
                    });
                    sheetStack.removeOne();
                    promise.resolve();
                })
                .setDisabled(state.name.map((x) => !x))
                .setJustifySelf("start"),
        )
            .setGap()
            .setWidth("25rem"),
    );

    return promise.promise;
};

export const EditArtistsDialog = (artists: WriteSignal<ArtistRef[]>, provided?: Artist[]) => {
    const artistList = provided ? asRef(provided) : asRef<Artist[]>([]);

    if (!provided) {
        API.getArtistsByMusic().then(stupidErrorAlert).then((x) => artistList.setValue(x));
    }

    return Grid(
        SheetHeader("Edit Artists", sheetStack),
        Box(artistList.map((list) =>
            Grid(
                Grid(
                    Label("Type").setFontWeight("bold"),
                    Label("Name").setFontWeight("bold"),
                    Label("Action").setFontWeight("bold"),
                ).setTemplateColumns("30% 60% 10%"),
                Grid(artists.map((x) =>
                    x.map((artist) => {
                        const refArtist = asRefRecord(artist);
                        refArtist.type.listen((val, oldVal) => {
                            if (oldVal !== undefined) {
                                const newArtist = {
                                    type: val,
                                    name: val === zArtistTypes.enum.PRODUCER || val === zArtistTypes.enum.SONGWRITER ? artist.type === zArtistTypes.enum.PRODUCER || artist.type === zArtistTypes.enum.SONGWRITER ? artist.name : "" : undefined,
                                    _id: val === zArtistTypes.enum.PRIMARY || val === zArtistTypes.enum.FEATURING ? artist.type === zArtistTypes.enum.PRIMARY || artist.type === zArtistTypes.enum.FEATURING ? artist._id : null! : undefined,
                                } as typeof artist;
                                artists.setValue(x.map((x) => x === artist ? newArtist : x));
                            }
                        });
                        if (artist.type === zArtistTypes.enum.SONGWRITER || artist.type === zArtistTypes.enum.PRODUCER) {
                            (refArtist as typeof refArtist & { name: WriteSignal<string> }).name.listen((val, oldVal) => {
                                if (oldVal !== undefined) {
                                    artists.setValue(x.map((x) => x !== artist ? x : { type: artist.type, name: val }));
                                }
                            });
                        } else if (artist.type === zArtistTypes.enum.PRIMARY || artist.type === zArtistTypes.enum.FEATURING) {
                            (refArtist as typeof refArtist & { _id: WriteSignal<string> })._id.listen((val, oldVal) => {
                                if (oldVal !== undefined) {
                                    artists.setValue(x.map((x) => x !== artist ? x : { type: artist.type, _id: val }));
                                }
                            });
                        }
                        return Grid(
                            DropDown(Object.values(zArtistTypes.enum), refArtist.type, "Type"),
                            artist.type == zArtistTypes.enum.PRIMARY || artist.type == zArtistTypes.enum.FEATURING ? DropDown(list.map((x) => x._id), (refArtist as typeof refArtist & { _id: WriteSignal<string> })._id, "Name").setValueRender((id) => artistList.get().find((a) => a._id === id)?.name ?? "Name not found") : TextInput((refArtist as typeof refArtist & { name: WriteSignal<string> }).name, "Name", "change"),
                            PrimaryButton("").addPrefix(MaterialIcon("delete")).onClick(() => {
                                artists.setValue(x.toSpliced(x.indexOf(artist), 1));
                            }),
                        ).setGap().setTemplateColumns("30% 60% auto");
                    })
                )).setGap(),
            ).setGap()
        )),
        PrimaryButton("Add Artist")
            .setJustifySelf("end")
            .onClick(() => artists.setValue([...artists.value, { type: zArtistTypes.enum.PRIMARY, _id: null! }])),
        PrimaryButton("Save")
            .onClick(() => sheetStack.removeOne()),
    )
        .setGap()
        .setWidth("70vh");
};
