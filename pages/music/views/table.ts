import { Audio } from "shared/audio.ts";
import { allowedAudioFormats, ExistingSongDialog, sheetStack } from "shared/helper.ts";
import { asRef, asRefRecord, Box, Checkbox, createFilePicker, DropDown, Empty, Entry, Grid, Label, List, MaterialIcon, PrimaryButton, ref, RefRecord, SecondaryButton, SheetHeader, TextInput, WriteSignal } from "webgen/mod.ts";
import countries from "../../../data/countries.json" with { type: "json" };
import genres from "../../../data/genres.json" with { type: "json" };
import languages from "../../../data/language.json" with { type: "json" };
import { API, Artist, ArtistRef, Song, stupidErrorAlert, zArtistTypes } from "../../../spec/mod.ts";
import { uploadSong } from "../data.ts";
import "./table.css";

const songSheet = (song: RefRecord<Song>, save: (song: RefRecord<Song>) => void) => {
    const yearRef = asRef(song.year.value.toString());
    yearRef.listen((val) => song.year.setValue(parseInt(val)));
    if (!song.country) {
        song.country = asRef("DE");
    }
    const blobRef = asRef<Blob | undefined>(undefined);
    return Grid(
        SheetHeader("Edit Song", sheetStack),
        Grid(
            TextInput(song.title, "Title").setMinWidth("30rem"),
            PrimaryButton("Artists")
                .onClick(() => sheetStack.addSheet(EditArtistsDialog(song.artists))),
            Grid(
                DropDown(genres[song.primaryGenre.value as keyof typeof genres], song.secondaryGenre, "Genre"),
                DropDown(Array.from({ length: 28 }).map((_, i) => (i + new Date().getFullYear() - 25).toString()).toReversed(), yearRef, "Year"),
            ).setGap().setDynamicColumns(15),
            Grid(
                DropDown(Object.keys(countries), song.country, "Country").setValueRender((key) => countries[key as keyof typeof countries]),
                DropDown(Object.keys(languages), song.language, "Language").setValueRender((key) => languages[key as keyof typeof languages]),
            ).setGap().setDynamicColumns(15),
            Grid(
                Grid(
                    Label("Explicit").setFontWeight("bold"),
                    Label("Instrumental").setFontWeight("bold"),
                    Checkbox(song.explicit),
                    Checkbox(song.instrumental),
                ).setTemplateColumns("max-content max-content").setGap().setJustifyItems("center"),
                TextInput(song.isrc!, "ISRC (optional)"),
            ).setGap().setDynamicColumns(15),
            Box(blobRef.map((blob) =>
                blob === undefined
                    ? SecondaryButton("Listen to Song").onPromiseClick(async () => {
                        await API.getDownloadBySongBySongsByMusic({ path: { songId: song._id.value } }).then(stupidErrorAlert).then((blob) => blobRef.setValue(blob));
                    })
                    : Audio(blob).setAutoplay()
            )),
        ).setGap(),
        PrimaryButton("Save").onClick(() => {
            save(song);
            sheetStack.removeOne();
        }),
    ).setGap();
};

export function ManageSongs(songs: WriteSignal<Song[]>, id: string) {
    function SongEntry(song: RefRecord<Song>) {
        return Grid(
            Grid(
                Label(song.title).setTextSize("3xl").setFontWeight("bold"),
                Label(ref`${song.country} - ${song.year}`),
            )
                .setHeight("max-content")
                .setAlignSelf("center"),
            Grid(MaterialIcon("delete").setCssStyle("color", "#b91616")).setJustifySelf("end").setJustifyItems("center").onClick((x) => {
                x.stopPropagation();
                songs.setValue(songs.getValue().filter((s) => s._id !== song._id.value));
            }).setCssStyle("backgroundColor", "#844a4a52").setPadding("1em").setCssStyle("borderRadius", "0.5rem"),
        )
            .setTemplateColumns("max-content auto")
            .setPadding("1rem 0");
    }
    return Grid(
        Grid(
            Empty(),
            Label("Manage your Songs").setFontWeight("bold").setTextSize("2xl").setJustifySelf("center"),
            Grid(
                PrimaryButton("Add Song").onPromiseClick(async () => {
                    const userSongs = await API.getSongsByMusic().then(stupidErrorAlert);
                    sheetStack.addSheet(ExistingSongDialog(songs, userSongs));
                }),
                PrimaryButton("Upload Song")
                    .onClick(() => createFilePicker(allowedAudioFormats.join(",")).then((file) => uploadSong(file, songs, id))),
            ).setTemplateColumns("auto auto").setGap(),
        ).setTemplateColumns("1fr 1fr 1fr").setGap(),
        List(
            songs,
            100,
            //TODO: hide arrow?
            //TODO: hand refrecord change to writesignal or song arr
            (data) => {
                const songref = asRefRecord(data);
                return Entry(SongEntry(songref)).onClick(() =>
                    sheetStack.addSheet(songSheet(songref, (x) => {
                        const songobj = Object.fromEntries(Object.entries(x).map((entry) => [entry[0], entry[1].getValue()])) as Song;
                        songs.setValue(songs.getValue().map((song) => song._id === songobj._id ? songobj : song));
                    }))
                );
            },
        ).setGap(10),
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
                                    artists.setValue(x.map((x) => x === artist ? { type: artist.type, name: val } : x));
                                }
                            });
                        } else if (artist.type === zArtistTypes.enum.PRIMARY || artist.type === zArtistTypes.enum.FEATURING) {
                            (refArtist as typeof refArtist & { _id: WriteSignal<string> })._id.listen((val, oldVal) => {
                                if (oldVal !== undefined) {
                                    artists.setValue(x.map((x) => x === artist ? { type: artist.type, _id: val } : x));
                                }
                            });
                        }
                        return Grid(
                            DropDown(Object.values(zArtistTypes.enum), refArtist.type, "Type"),
                            artist.type == zArtistTypes.enum.PRIMARY || artist.type == zArtistTypes.enum.FEATURING ? DropDown(list.map((x) => x._id), (refArtist as typeof refArtist & { _id: WriteSignal<string> })._id, "Name").setValueRender((id) => id == null ? "Select Artist" : artistList.get().find((a) => a._id === id)?.name ?? "Artist not found") : TextInput((refArtist as typeof refArtist & { name: WriteSignal<string> }).name, "Name", "change"),
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
