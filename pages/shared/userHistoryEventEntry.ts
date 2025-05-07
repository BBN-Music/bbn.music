import { Empty, Entry, Grid, Label, PrimaryButton } from "webgen/mod.ts";
import { UserHistoryEvent, zAudit } from "../../spec/mod.ts";
import { BasicEntry } from "./mod.ts";
import { sheetStack } from "./helper.ts";

export function userHistoryEventEntry(event: UserHistoryEvent) {
    if (event.type === "action") {
        const audit = zAudit.parse(event.meta);
        switch (audit.action) {
            case "shazam-results":
                return Entry(
                    BasicEntry(
                        `Shazam results`,
                        "Found: " + audit.data.map((x) => x.title).join(", "),
                    ),
                ).onClick(() => {
                    sheetStack.addSheet(
                        Grid(
                            Empty(),
                            ...audit.data.map((x) =>
                                Grid(
                                    Label("Detected Title: " + x.title),
                                    Label("Detected Artist: " + x.artist),
                                    PrimaryButton("Open in Shazam").onClick(() => {
                                        globalThis.open(x.shazamUrl, "_blank");
                                    }),
                                    ...[
                                        x.appleUrl
                                            ? PrimaryButton("Open in Apple Music").onClick(() => {
                                                globalThis.open(x.appleUrl, "_blank");
                                            })
                                            : undefined,
                                        x.deezerUrl
                                            ? PrimaryButton("Open in Deezer").onClick(() => {
                                                globalThis.open(x.deezerUrl, "_blank");
                                            })
                                            : undefined,
                                        x.spotifyUrl
                                            ? PrimaryButton("Open in Spotify").onClick(() => {
                                                globalThis.open(x.spotifyUrl, "_blank");
                                            })
                                            : undefined,
                                        x.youtubeUrl
                                            ? PrimaryButton("Open in Youtube").onClick(() => {
                                                globalThis.open(x.youtubeUrl, "_blank");
                                            })
                                            : undefined,
                                    ].filter((x) => x !== undefined),
                                ).setGap()
                            ),
                        ),
                    );
                }).setWidth("100%").setPadding("0.5rem 0");
            case "drop-type-change":
                return Entry(
                    BasicEntry(
                        "Drop type changed",
                        `from ${audit.data.type} to ${audit.type} by ${event.userId}`,
                    ),
                ).setWidth("100%").setPadding("0.5rem 0");
            case "drop-review":
                return Entry(
                    BasicEntry(
                        "Drop review ",
                        `${audit.action} by ${event.userId} `,
                    ),
                ).setWidth("100%").setPadding("0.5rem 0");
            case "drop-create":
                return Entry(
                    BasicEntry(
                        "Drop created",
                        `by ${event.userId}`,
                    ),
                ).setWidth("100%").setPadding("0.5rem 0");
            default:
                return Entry(
                    BasicEntry(
                        `Unknown action`,
                        JSON.stringify(audit),
                    ),
                ).setWidth("100%").setPadding("0.5rem 0");
        }
    }
    return Entry(
        BasicEntry(
            event.type,
            JSON.stringify(event.meta),
        ),
    ).setWidth("100%").setPadding("0.5rem 0");
}
