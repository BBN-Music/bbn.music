import { placeholder } from "shared/list.ts";
import { asRef, Box, Content, createPage, createRoute, Grid, Spinner } from "webgen/mod.ts";
import { API, Artist, stupidErrorAlert } from "../../../spec/mod.ts";
import { ArtistEntry } from "../views/list.ts";

const data = asRef<"loading" | Artist[]>("loading");

const source = data.map((data) => data === "loading" ? [] : data);

export const artistsPage = createPage(
    {
        label: "Artists",
        weight: 5,
        route: createRoute({
            path: "/c/music?list=artists",
            events: {
                onLazyInit: async () => {
                    const list = await API.getArtistsByMusic().then(stupidErrorAlert);
                    data.value = list;
                },
            },
        }),
    },
    Content(
        Box(data.map((data) => data === "loading" ? Spinner() : [])),
        Grid(
            source.map((items) => items.length > 0 ? items.map(ArtistEntry) : placeholder("No Artists", `You don’t have any Artists yet.`)),
        ),
    ),
);
