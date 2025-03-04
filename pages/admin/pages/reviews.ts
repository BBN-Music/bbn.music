import { RegisterAuthRefresh } from "shared/helper.ts";
import { Box, Content, createCachedLoader, createIndexPaginationLoader, createPage, createRoute, Empty, TextButton } from "webgen/mod.ts";
import { API, stupidErrorAlert } from "../../../spec/mod.ts";
import { ReviewEntry } from "../../music/views/list.ts";

await RegisterAuthRefresh();

const loader = createCachedLoader(createIndexPaginationLoader({
    limit: 30,
    loader: (offset, limit) => API.getDropsByAdmin({ query: { type: "UNDER_REVIEW", _offset: offset, _limit: limit } }).then(stupidErrorAlert),
}));

createPage(
    {
        route: createRoute({
            path: "/admin?list=reviews",
            events: {
                onLazyInit: async () => {
                    await loader.next();
                },
            },
        }),
        label: "Reviews",
        weight: 3,
    },
    Content(
        loader.items.map((reviews) => reviews.map((review) => ReviewEntry(review, true))),
        Box(loader.hasMore.map((hasMore) =>
            hasMore
                ? TextButton("Load More").onPromiseClick(async () => {
                    await loader.next();
                })
                : Empty()
        )),
    ),
);
