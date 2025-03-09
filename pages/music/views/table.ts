import { getYearList, ProfilePicture, sheetStack } from "shared/helper.ts";
import { asRef, asRefRecord, Box, Checkbox, Component, DropDown, Empty, Grid, InlineInput, Label, MaterialIcon, PrimaryButton, SheetHeader, TextInput, WriteSignal } from "webgen/mod.ts";
import languages from "../../../data/language.json" with { type: "json" };
import { API, Artist, ArtistRef, Song, stupidErrorAlert, zArtistTypes } from "../../../spec/mod.ts";
import "./table.css";

export function ManageSongs(songs: WriteSignal<Song[]>, primaryGenre: WriteSignal<string>, genres: { primary: WriteSignal<string[]>; secondary: WriteSignal<Record<string, string[]>> }) {
    const refs = songs.map((songsval) =>
        songsval.map((song) => {
            const ref = asRefRecord(song);
            Object.entries(ref).forEach(([key, value]) => {
                value.listen((newVal, oldVal) => {
                    if (oldVal !== undefined) {
                        songs.setValue(songs.value.map((x) => x !== song ? x : { ...song, [key]: newVal }));
                    }
                });
            });
            return ref;
        })
    );
    return Grid(
        Label("Manage your Songs").setTextSize("2xl"),
        Grid(
            refs.map((refs) =>
                Object.entries({
                    "Title": (ref) => InlineInput(ref.title, "Title"),
                    "Artists": (ref) => Box(ref.artists.map((artists) => Box(Empty(), ...artists.map((artist) => "name" in artist ? ProfilePicture(Label(""), artist.name) : ProfilePicture(Label(""), artist._id)), PrimaryButton("+")))),
                    // @ts-ignore
                    "Year": (ref) => DropDown(getYearList().map(Number), ref.year, "Year").setValueRender((x) => x.toString()),
                    "Language": (ref) => DropDown(Object.keys(languages), ref.language, "Language").setValueRender((key) => (languages as Record<string, string>)[key]),
                    "Genre": (ref) => DropDown(primaryGenre.map((primaryGenre) => genres.secondary.map((secondary) => secondary[primaryGenre]).value), ref.secondaryGenre, "Secondary Genre"),
                    "Instrumental": (ref) => Checkbox(ref.instrumental ?? false),
                    "Explicit": (ref) => Checkbox(ref.explicit ?? false),
                    "": (ref) => PrimaryButton("").addPrefix(MaterialIcon("delete")),
                } as Record<string, (ref: { [Key in keyof Song]: WriteSignal<Song[Key]> }) => Component>).map(([key, value]) =>
                    Grid(
                        Label(key),
                        Box(Empty(), ...refs.map(value)),
                    ).setEvenColumns(1)
                )
            ),
        ).setTemplateColumns("auto max-content 6rem 10rem 10rem max-content max-content min-content").setGap(),
    ).setGap();
    // return Table(songs);
    // return new Table2(songs)
    //     .setColumnTemplate("auto max-content max-content max-content max-content max-content max-content min-content")
    //     .addColumn("Title", (song) =>
    //         uploadingSongs.map((x) => {
    //             if (x.filter((y) => y[song._id] !== undefined).length > 0) {
    //                 return Progress(x.find((y) => y[song._id] !== undefined)[song._id]);
    //             }
    //             const title = asRef(song.title);
    //             title.listen((newVal, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, title: newVal }));
    //             return InlineTextInput("text", "blur").addClass("low-level").ref(title);
    //         }).asRefComponent())
    //     .addColumn("Artists", (song) =>
    //         Box(...song.artists.map((artist) => "name" in artist ? ProfilePicture(Label(""), artist.name) : ProfilePicture(Label(""), artist._id)), IconButton(MIcon("add"), "add"))
    //             .addClass("artists-list")
    //             .onClick(() => {
    //                 const artists = asRef(song.artists);
    //                 artists.listen((newVal, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, artists: newVal }));
    //                 EditArtistsDialog(artists, artistList).open();
    //             }))
    //     .addColumn("Year", (song) => {
    //         const data = asRef(song.year.toString());
    //         data.listen((x, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, year: parseInt(x) }));
    //         return DropDownInput("Year", getYearList())
    //             .ref(data)
    //             .addClass("low-level");
    //     })
    //     .addColumn("Language", (song) => {
    //         const data = asRef(song.language);
    //         data.listen((x, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, language: x }));
    //         return DropDownInput("Language", Object.keys(language))
    //             .setRender((key) => language[<keyof typeof language> key])
    //             .ref(data)
    //             .addClass("low-level");
    //     })
    //     .addColumn("Secondary Genre", (song) => {
    //         const data = asRef(song.secondaryGenre);
    //         data.listen((x, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, secondaryGenre: x }));
    //         return DropDownInput("Secondary Genre", getSecondary(genres, primaryGenre) ?? [])
    //             .ref(data)
    //             .addClass("low-level");
    //     })
    //     .addColumn("Instrumental", (song) =>
    //         Checkbox(song.instrumental ?? false)
    //             .setColor(song.explicit ? Color.Disabled : Color.Grayscaled)
    //             .onClick((_, value) => songs.updateItem(song, { ...song, instrumental: value }))
    //             .addClass("low-level"))
    //     .addColumn("Explicit", (song) =>
    //         Checkbox(song.explicit ?? false)
    //             .setColor(song.instrumental ? Color.Disabled : Color.Grayscaled)
    //             .onClick((_, value) => songs.updateItem(song, { ...song, explicit: value }))
    //             .addClass("low-level"))
    //     .addColumn("", (song) => IconButton(MIcon("delete"), "Delete").onClick(() => songs.setValue(songs.getValue().filter((x) => x._id != song._id))))
    //     .addClass("inverted-class");
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
                Box(artists.map((x) =>
                    x.map((artist) => {
                        const refArtist = asRefRecord(artist);
                        refArtist.type.listen((val, oldVal) => {
                            if (oldVal !== undefined) {
                                const newArtist = {
                                    type: val,
                                    name: val === zArtistTypes.enum.PRODUCER || val === zArtistTypes.enum.SONGWRITER ? artist.type === zArtistTypes.enum.PRODUCER || artist.type === zArtistTypes.enum.SONGWRITER ? artist.name : "" : undefined,
                                    _id: val === zArtistTypes.enum.PRIMARY || val === zArtistTypes.enum.FEATURING ? artist.type === zArtistTypes.enum.PRIMARY || artist.type === zArtistTypes.enum.FEATURING ? artist._id : null! : undefined,
                                } as typeof artist;
                                artists.setValue(x.map((x) => x !== artist ? x : newArtist));
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
                        ).setGap().setTemplateColumns("30% 60% 10%");
                    })
                )),
            ).setGap()
        )),
        PrimaryButton("Add Artist")
            .setJustifySelf("end")
            .onClick(() => artists.setValue([...artists.value, { type: zArtistTypes.enum.PRIMARY, _id: null! }])),
        PrimaryButton("Save")
            .onClick(() => sheetStack.removeOne()),
    )
        .setGap();
};
