import { RegisterAuthRefresh } from "shared/helper.ts";
import { BasicEntry } from "shared/mod.ts";
import { asRef, Content, createPage, createRoute, Entry, Label } from "webgen/mod.ts";
import { API, stupidErrorAlert } from "../../../spec/mod.ts";

await RegisterAuthRefresh();

const chats = asRef<object[] | "loading">("loading");

createPage(
    {
        route: createRoute({
            path: "/admin?list=chats",
            events: {
                onLazyInit: async () => {
                    chats.setValue(await API.getChatsByWhatsapp().then(stupidErrorAlert) as object[]);
                },
            },
        }),
        label: "Chats",
        weight: 4,
    },
    Content(
        chats.map((chats) => chats === "loading" ? Label("Loading...") : chats.map((chat) => Entry(BasicEntry(chat.username ? chat.username : chat.wa_id, chat.username ? chat.wa_id : "")))),
    ),
);
