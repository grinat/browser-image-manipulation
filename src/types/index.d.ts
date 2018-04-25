export interface BrowserImageManipulation {
    loadBlob(imageFile: File): this;
    toSquare(length: number, opts: Object): this;
    resize(maxWidth: number, maxHeight: number, opts: Object): this;
    rotate(degrees: number, opts: Object): this;
    toGrayscale(opts: Object): this;
    centerInRectangle(maxWidth: number, maxHeight: number, opts: Object): this;
    toCircle(diametr: number, opts: Object): this;
    saveAsBlob(mimeType: string, q: string): Promise<File>;
    saveAsBlob(mimeType: string, q: string): Promise<HTMLCanvasElement>;
    saveAsImage(mimeType: string, q: string): Promise<HTMLImageElement>;
}

declare global {
    interface Window {
        BrowserImageManipulation: BrowserImageManipulation;
    }
}

export default BrowserImageManipulation;
