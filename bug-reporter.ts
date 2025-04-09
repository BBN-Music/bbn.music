// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/platform/index.d.ts"
import browser from "https://unpkg.com/platform@1.3.6/platform.js";
import { API } from "./spec/mod.ts";

globalThis.onunhandledrejection = (e) => {
    report(e.reason);
};

globalThis.onerror = (e) => {
    report(typeof e == "string" ? e : (<ErrorEvent> e).error);
};

function report(msg: any) {
    if (["ResizeObserver loop completed with undelivered notifications.", "ResizeObserver loop limit exceeded", "Uncaught aborting javascript here"].includes(msg)) return;

    API.postBugTrack({
        body: {
            type: "web-frontend",
            platform: browser.os?.family,
            platformVersion: browser.os?.version,
            error: msg.message ?? msg,
            errorStack: msg.stack ?? msg,
            browser: browser.name,
            // null safe version of getting the error
            userId: localStorage["access-token"]?.split(".").filter((_: string, i: number) => i <= 1).map((x: string) => JSON.parse(atob(x))).filter((_: string, i: number) => i == 1).map((it: any) => it.userId).join(),
            browserVersion: browser.version,
            location: location.toString(),
        },
    }).catch(() => {
        //
    });
}
