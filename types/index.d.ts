declare module "browser-image-manipulation"{
    export default class BrowserImageManipulation {
        constructor();
        loadBlob(imageFile: File, options?: LoadBlobOptions): this;
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
        crop(maxWidth: number, maxHeight: number, offsetX?: number, offsetY?: number): this;
        drawLine(points: Array<any>, fill?: string, width?: string): this;
        drawPolygon(points: Array<any>, fill?: string, outline?: string, outlineWidth?: string): this;
        drawRectangle(points: Array<any>, fill?: string, outline?: string, outlineWidth?: string): this;
        drawText(xy: Array<any>, text: string, style?: DrawTextStyle): this;
        perspective(points: PerspectivePoints): this;
        getExif(): Exif;
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


interface LoadBlobOptions {
    fixOrientation?: boolean; // fix image orientation by exif info, default false
    readExif?: boolean; // read exif, default false
}

// list of tags https://github.com/hMatoba/piexifjs/blob/19d29763e9c3a293aa4bb8fcd373a0117e729a32/piexif.js#L2147
interface Exif {
    '0th'?: Object;
    '1st'?: Object;
    Exif?: Object;
    GPS?: Object;
    Interop?: Object;
}
