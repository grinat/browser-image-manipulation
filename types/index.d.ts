declare module "browser-image-manipulation"{
    export default class BrowserImageManipulation {
        constructor();
        loadBlob(imageFile: File): this;
        loadCanvas(canvas: HTMLCanvasElement): this;
        toSquare(length: number, opts: Object): this;
        resize(maxWidth: number, maxHeight: number, opts: Object): this;
        rotate(degrees: number, opts: Object): this;
        toGrayscale(opts: Object): this;
        centerInRectangle(maxWidth: number, maxHeight: number, opts: Object): this;
        toCircle(diametr: number, opts: Object): this;
        saveAsBlob(mimeType: string, q: string): Promise<File>;
        saveAsCanvas(mimeType: string, q: string): Promise<HTMLCanvasElement>;
        saveAsImage(mimeType: string, q: string): Promise<HTMLImageElement>;
    }

    global {
        interface Window {
            BrowserImageManipulation: BrowserImageManipulation;
        }
    }
}
