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
        drawLine(points: Array<any>, fill?: string, width?: string);
        drawPolygon(points: Array<any>, fill?: string, outline?: string, outlineWidth?: string);
        drawRectangle(points: Array<any>, fill?: string, outline?: string, outlineWidth?: string);
        drawText(xy: Array<any>, text: string, style?: DrawTextStyle);
        perspective(points: PerspectivePoints)
    }

    global {
        interface Window {
            BrowserImageManipulation: BrowserImageManipulation;
        }
    }
}

interface DrawTextStyle {
    font?: string; // for example 'serif bold'
    fontSize?: string | number; // null or size in % or px
    fill?: string; // null or color use for fill
    fillPadding?: string | number; // null or color use for fill
    rotateAngle?: number; // null or degrees for rotate text
}

interface PerspectivePoints {
    xy0?: Array<string | number>;
    xy1?: Array<string | number>;
    xy2?: Array<string | number>;
    xy3?: Array<string | number>;
}
