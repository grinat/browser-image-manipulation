declare module "browser-image-manipulation"{
    export default class BrowserImageManipulation {
        constructor();
        loadBlob(imageFile: File): this;
        loadCanvas(canvas: HTMLCanvasElement, saveAsFileName?: string): this;
        toSquare(length: number, opts?: Object): this;
        resize(maxWidth: number, maxHeight: number, opts?: Object): this;
        rotate(degrees: number, opts?: Object): this;
        toGrayscale(opts?: Object): this;
        pixelize(threshold?: number): this;
        gaussianBlur(radius?: number): this;
        centerInRectangle(maxWidth: number, maxHeight: number, opts?: Object): this;
        toCircle(diametr: number, opts?: Object): this;
        saveAsBlob(mimeType?: string, q?: string): Promise<File>;
        saveAsCanvas(): Promise<HTMLCanvasElement>;
        saveAsImage(mimeType?: string, q?: string): Promise<HTMLImageElement>;
        setFileName(newFileName: string);
        crop(maxWidth: number, maxHeight: number, offsetX?: number, offsetY?: number);
    }

    global {
        interface Window {
            BrowserImageManipulation: BrowserImageManipulation;
        }
    }
}
