import { Empty, Entry, Grid, Label } from "webgen/mod.ts";
import { UserHistoryEvent, zAudit } from "../../spec/mod.ts";
import { sheetStack } from "./helper.ts";
import { BasicEntry } from "./mod.ts";

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
                ).setWidth("100%").setPadding("0.5rem 0");
                //     .onClick(() => {
                //     console.log("aadsd");
                //     sheetStack.addSheet(
                //         Grid(
                //             Empty(),
                //             ...audit.data.map((x) =>
                //                 Grid(
                //                     Label("Detected Title: " + x.title),
                //                     Label("Detected Artist: " + x.artist),
                //                 )
                //             ),
                //         ),
                //     );
                // });
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
