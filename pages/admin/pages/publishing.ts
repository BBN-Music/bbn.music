import { RegisterAuthRefresh } from "shared/helper.ts";
import { Box, Content, createCachedLoader, createIndexPaginationLoader, createPage, createRoute, Label, TextButton } from "webgen/mod.ts";
import { API, stupidErrorAlert } from "../../../spec/mod.ts";
import { ReviewEntry } from "../entries.ts";

await RegisterAuthRefresh();

const loader = createCachedLoader(createIndexPaginationLoader({
    limit: 30,
    loader: (offset, limit) => API.getDropsByAdmin({ query: { type: "PUBLISHING", _offset: offset, _limit: limit } }).then(stupidErrorAlert),
}));

createPage(
    {
        route: createRoute({
            path: "/admin?list=publishing",
            events: {
                onLazyInit: async () => {
                    await loader.next();
                },
            },
        }),
        label: "Publishing",
        weight: 3,
    },
    Content(
        loader.items.map((reviews) => reviews.map((review) => ReviewEntry(review, true))),
        Box(loader.hasMore.map((hasMore) =>
            hasMore
                ? TextButton("Load More").onPromiseClick(async () => {
                    await loader.next();
                })
                : Label("No more publishing")
        )),
    ),
);
