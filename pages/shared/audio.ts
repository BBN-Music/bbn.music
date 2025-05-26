import { asWebGenComponent, HTMLComponent } from "webgen/mod.ts";

@asWebGenComponent("audio")
export class AudioComponent extends HTMLComponent {
    audioElement: HTMLAudioElement;
    constructor(blob: Blob | MediaSource) {
        super();
        this.audioElement = document.createElement("audio");
        this.audioElement.controls = true;
        this.shadowRoot!.append(this.audioElement);

        const url = globalThis.URL.createObjectURL(blob);
        this.audioElement.src = url;
    }

    override make() {
        const obj = {
            ...super.make(),
            setAutoplay: () => {
                this.audioElement.autoplay = true;
                return obj;
            }
        }
        return obj;
    }
}

export function Audio(blob: Blob | MediaSource) {
    return new AudioComponent(blob).make();
}
