import { asRef, Reference } from "webgen/mod.ts";
import { APITools } from "../../spec/mod.ts";

export type StreamingUploadEvents = {
    credentials: () => string;
    onUploadTick: (percentage: number) => Promise<void>;
    uploadDone: () => void;
    backendResponse: (id: string) => void;
    failure: (message: string) => void;
};

export function ProgressTracker(percentage: Reference<number>, expectedSize: number) {
    let bytesUploaded = 0;

    return new TransformStream({
        transform(chunk, controller) {
            bytesUploaded += chunk.length;
            percentage.value = (bytesUploaded / expectedSize) * 100;
            controller.enqueue(chunk);
        },
    });
}

export function StreamingUploadHandler(path: string, events: StreamingUploadEvents, file: File) {
    try {
        const ws = new WebSocket(`${(`${APITools.baseUrl()}api/@bbn/`).replace("https", "wss").replace("http", "ws")}${path}`);
        const progress = asRef(0);
        progress.listen((percentage) => {
            events.onUploadTick(percentage);
        });

        const stream = file
            .stream()
            .pipeThrough(ProgressTracker(progress, file.size));
        ws.onopen = () => {
            ws.send(`JWT ${events.credentials()}`);
        };
        const reader = stream.getReader();

        ws.onmessage = async ({ data }) => {
            if (data.startsWith("failed")) {
                console.log("Looks like we failed.");
                events.failure(data);
            } else if (data == "file") {
                ws.send(`file ${JSON.stringify({ filename: file.name, type: file.type })}`);
            } else if (data == "next") {
                const read = await reader.read();
                if (read.value) {
                    ws.send(read.value);
                }
                if (read.done) {
                    ws.send("end");
                    events.uploadDone();
                }
            } else {
                reader.releaseLock();
                events.backendResponse(data);
            }
        };
    } catch (error) {
        console.error(error);
        alert("There was an error uploading your files...\n\nPlease try again later");
    }
}
