import { getSecondary, getYearList, ProfilePicture, sheetStack } from "shared/helper.ts";
import { Progress, Table2 } from "shared/mod.ts";
import { asRef, asState, Box, Button, Checkbox, Color, DropDownInput, Grid, Horizontal, IconButton, InlineTextInput, Label, MIcon, Reference, SheetDialog, Spacer, TextInput } from "webgen/mod.ts";
import genres from "../../../data/genres.json" with { type: "json" };
import language from "../../../data/language.json" with { type: "json" };
import { API, Artist, ArtistRef, Song, stupidErrorAlert, zArtistTypes } from "../../../spec/mod.ts";
import "./table.css";

export function ManageSongs(songs: Reference<Song[]>, uploadingSongs: Reference<{ [uploadId: string]: number }[]>, primaryGenre: string, artistList?: Artist[]) {
    return new Table2(songs)
        .setColumnTemplate("auto max-content max-content max-content max-content max-content max-content min-content")
        .addColumn("Title", (song) =>
            uploadingSongs.map((x) => {
                if (x.filter((y) => y[song._id] !== undefined).length > 0) {
                    return Progress(x.find((y) => y[song._id] !== undefined)[song._id]);
                }
                const title = asRef(song.title);
                title.listen((newVal, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, title: newVal }));
                return InlineTextInput("text", "blur").addClass("low-level").ref(title);
            }).asRefComponent())
        .addColumn("Artists", (song) =>
            Box(...song.artists.map((artist) => "name" in artist ? ProfilePicture(Label(""), artist.name) : ProfilePicture(Label(""), artist._id)), IconButton(MIcon("add"), "add"))
                .addClass("artists-list")
                .onClick(() => {
                    const artists = asRef(song.artists);
                    artists.listen((newVal, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, artists: newVal }));
                    EditArtistsDialog(artists, artistList).open();
                }))
        .addColumn("Year", (song) => {
            const data = asRef(song.year.toString());
            data.listen((x, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, year: parseInt(x) }));
            return DropDownInput("Year", getYearList())
                .ref(data)
                .addClass("low-level");
        })
        .addColumn("Language", (song) => {
            const data = asRef(song.language);
            data.listen((x, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, language: x }));
            return DropDownInput("Language", Object.keys(language))
                .setRender((key) => language[<keyof typeof language> key])
                .ref(data)
                .addClass("low-level");
        })
        .addColumn("Secondary Genre", (song) => {
            const data = asRef(song.secondaryGenre);
            data.listen((x, oldVal) => (oldVal != undefined) && songs.updateItem(song, { ...song, secondaryGenre: x }));
            return DropDownInput("Secondary Genre", getSecondary(genres, primaryGenre) ?? [])
                .ref(data)
                .addClass("low-level");
        })
        .addColumn("Instrumental", (song) =>
            Checkbox(song.instrumental ?? false)
                .setColor(song.explicit ? Color.Disabled : Color.Grayscaled)
                .onClick((_, value) => songs.updateItem(song, { ...song, instrumental: value }))
                .addClass("low-level"))
        .addColumn("Explicit", (song) =>
            Checkbox(song.explicit ?? false)
                .setColor(song.instrumental ? Color.Disabled : Color.Grayscaled)
                .onClick((_, value) => songs.updateItem(song, { ...song, explicit: value }))
                .addClass("low-level"))
        .addColumn("", (song) => IconButton(MIcon("delete"), "Delete").onClick(() => songs.setValue(songs.getValue().filter((x) => x._id != song._id))))
        .addClass("inverted-class");
}

export const createArtistSheet = (name?: string) => {
    const state = asState({
        name,
        spotify: <string | undefined> undefined,
        apple: <string | undefined> undefined,
    });
    const { promise, resolve } = Promise.withResolvers<void>();
    const dialog = SheetDialog(
        sheetStack,
        "Create Artist",
        Grid(
            TextInput("text", "Artist Name").required().ref(state.$name),
            TextInput("text", "Spotify URL").ref(state.$spotify),
            TextInput("text", "Apple Music URL").ref(state.$apple),
            Button("Create")
                .setJustifySelf("start")
                .onPromiseClick(async () => {
                    await API.postArtistsByMusic({
                        body: state,
                    });
                    dialog.close();
                    resolve();
                })
                .setColor(state.$name.map((x) => x ? Color.Grayscaled : Color.Disabled)),
        )
            .setAlignContent("start")
            .setWidth("400px")
            .setHeight("420px")
            .setGap(),
    );
    dialog.open();
    return promise;
};

export const EditArtistsDialog = (artists: Reference<ArtistRef[]>, provided?: Artist[]) => {
    const artistList = provided ? asRef(provided) : asRef(<Artist[]> []);

    if (!provided) {
        API.getArtistsByMusic().then(stupidErrorAlert)
            .then((x) => artistList.setValue(x));
    }

    const dialog = SheetDialog(
        sheetStack,
        "Manage your Artists",
        artistList.map((list) =>
            new Table2(artists)
                .addClass("artist-table")
                .setColumnTemplate("10rem 12rem min-content")
                .addColumn("Type", (artist) => {
                    const data = asRef(artist.type);
                    data.listen((type, oldVal) => {
                        if (oldVal != undefined) {
                            if (type == zArtistTypes.enum.PRIMARY || type == zArtistTypes.enum.FEATURING) {
                                artists.updateItem(artist, { type, _id: null! } as ArtistRef);
                            } else {
                                artists.updateItem(artist, { type, name: "" } as ArtistRef);
                            }
                        }
                    });
                    return DropDownInput("Type", Object.values(zArtistTypes.Values))
                        .ref(data);
                })
                .addColumn("Name", (artist) => {
                    if (artist.type === zArtistTypes.enum.PRIMARY || artist.type === zArtistTypes.enum.FEATURING) {
                        const data = asRef(artist._id as string);
                        data.listen((_id, oldVal) => (oldVal !== undefined) && artists.updateItem(artist, { ...artist, _id }));
                        return DropDownInput("Select Artist", list.map((y) => y._id))
                            .setRender((data) => {
                                const artist = list.find((y) => y._id === data);
                                return artist ? artist.name : "";
                            })
                            .ref(data)
                            .addAction(MIcon("add"), "Create Artist", () => {
                                createArtistSheet().then(() => {
                                    API.getArtistsByMusic().then(stupidErrorAlert)
                                        .then((x) => {
                                            artistList.setValue(x);
                                        });
                                });
                            });
                    }
                    const data = asRef(artist.name as string);
                    data.listen((name, oldVal) => (oldVal != undefined) && artists.updateItem(artist, { ...artist, name } as ArtistRef));
                    return TextInput("text", "Name", "blur")
                        .ref(data);
                })
                .addColumn("", (data) => IconButton(MIcon("delete"), "Delete").onClick(() => artists.setValue(artists.getValue().filter((_, i) => i != artists.getValue().indexOf(data)))))
        ).asRefComponent(),
        Horizontal(
            Spacer(),
            Button("Add Artist")
                .onClick(() => artists.addItem({ type: zArtistTypes.enum.PRIMARY, _id: null! } as ArtistRef)),
        ).setPadding("0 0 3rem 0"),
        Horizontal(
            Spacer(),
            Button("Save")
                .onClick(() => dialog.close()),
        ),
    );

    return dialog;
};
