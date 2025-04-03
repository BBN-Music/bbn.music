import { asWebGenComponent, HTMLComponent, Reference } from "webgen/mod.ts";

@asWebGenComponent("audio")
export class AudioComponent extends HTMLComponent {
    constructor(blob: Reference<Blob>) {
        super();
        const audioElement = document.createElement("audio");
        audioElement.controls = true;
        this.shadowRoot!.append(audioElement);

        blob.listen((blob) => {
            const url = globalThis.URL.createObjectURL(blob);
            audioElement.src = url;
        });
    }
}

export function Audio(blob: Reference<Blob>) {
    return new AudioComponent(blob).make();
}
