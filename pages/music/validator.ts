import { z } from "zod/mod.ts";
import { ArtistRef, zArtistRef, zSong } from "../../spec/mod.ts";
import { sumOf } from "@std/collections/sum-of";
import { ProWriArtist } from "shared/helper.ts";

const pageOne = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(100, { message: "Title is too long" }),
    artists: zArtistRef.array()
        .refine((x) => x.some(({ type }) => type == "PRIMARY"), { message: "At least one primary artist is required" })
        .refine((x) => x.some(({ type }) => type == "SONGWRITER"), { message: "At least one songwriter is required" })
        .refine((x) => x.some(({ type }) => type == "PRODUCER"), { message: "At least one producer is required" })
        .refine((x) => x.filter<ProWriArtist>((artist): artist is ProWriArtist => artist.type === "SONGWRITER").every(({ name }) => name.split(" ").length > 1), { message: "Songwriters must have a first and last name" })
        .refine((x) => x.filter<ProWriArtist>((artist): artist is ProWriArtist => artist.type === "PRODUCER").every(({ name }) => name.split(" ").length > 1), { message: "Producers must have a first and last name" }),
    release: z.string().regex(/\d\d\d\d-\d\d-\d\d/, { message: "Not a date" }),
    language: z.string(),
    primaryGenre: z.string(),
    secondaryGenre: z.string(),
    gtin: z.preprocess(
        (x) => x === "" ? undefined : x,
        z.string().trim()
            .min(12, { message: "UPC/EAN: Invalid length" })
            .max(13, { message: "UPC/EAN: Invalid length" })
            .regex(/^\d+$/, { message: "UPC/EAN: Not a number" })
            .refine((gtin) => parseInt(gtin.slice(-1), 10) === (10 - (sumOf(gtin.slice(0, -1).split("").map((digit, index) => parseInt(digit, 10) * ((16 - gtin.length + index) % 2 === 0 ? 3 : 1)), (x) => x) % 10)) % 10, {
                message: "UPC/EAN: Invalid checksum",
            }).optional(),
    ),
    compositionCopyright: z.string().min(1, { message: "Composition Copyright is required" }).max(100, { message: "Composition Copyright is too long" }),
    soundRecordingCopyright: z.string().min(1, { message: "Sound Recording Copyright is required" }).max(100, { message: "Sound Recording Copyright is too long" }),
});

const pageTwo = pageOne.and(z.object({
    artwork: z.string(),
    // artworkClientData: z.object({
    //     type: z.string().refine((x) => x !== "uploading", { message: "Artwork is still uploading" }),
    // }).transform(() => undefined),
}));

const normalize = (x: ArtistRef) =>
  "_id" in x ? `${x.type}:${x._id}` : `${x.type}:${x.name}`

export const pageThree = pageTwo.and(z.object({
    songs: zSong.omit({ user: true }).array().min(1, { message: "At least one song is required" })
        .refine((songs) => songs.every(({ instrumental, explicit }) => !(instrumental && explicit)), "Can't have an explicit instrumental song")
        .refine((songs) => songs.every(({ title }) => title.length <= 100), { message: "Song Title is too long" })
        .refine((songs) => songs.every(({ artists }) => artists.length > 0), { message: "At least one artist is required" })
        .refine((songs) => songs.every(({ artists }) => artists.some(({ type }) => type === "PRIMARY")), { message: "At least one primary artist is required" })
        .refine((songs) => songs.every(({ artists }) => artists.some(({ type }) => type === "SONGWRITER")), { message: "At least one songwriter is required" })
        .refine((songs) => songs.every(({ artists }) => artists.some(({ type }) => type === "PRODUCER")), { message: "At least one producer is required" })
        .refine((songs) => songs.every(({ artists }) => artists.filter<ProWriArtist>((artist): artist is ProWriArtist => artist.type === "SONGWRITER").every(({ name }) => name.split(" ").length > 1)), { message: "Songwriters must have a first and last name" })
        .refine((songs) => songs.every(({ artists }) => artists.filter<ProWriArtist>((artist): artist is ProWriArtist => artist.type === "PRODUCER").every(({ name }) => name.split(" ").length > 1)), { message: "Producers must have a first and last name" }),
    uploadingSongs: z.array(z.string()).max(0, { message: "Some uploads are still in progress" }),
}))
    .refine((object) => (object.songs.length === 1 && object.songs[ 0 ].title === object.title) || object.songs.length > 1, { message: "Drop Title and Song Title must be the same for single song drops", path: [ "songs" ] })
    .refine((object) => (object.songs.length === 1 && object.songs[ 0 ].artists.length === object.artists.length && object.artists.map(normalize).toSorted().every((v, i) => v === object.songs[0].artists.map(normalize).toSorted()[i]) || object.songs.length > 1), { message: "All artists must be the same for single song drops", path: [ "songs" ] })
export const pages = <z.AnyZodObject[]> [pageOne, pageTwo, pageThree];
