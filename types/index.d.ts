declare module "browser-image-manipulation"{
    export default class BrowserImageManipulation {
        constructor();
        loadBlob(imageFile: File, options?: LoadBlobOptions): this;
        loadCanvas(canvas: HTMLCanvasElement, saveAsFileName?: string): this;
        toSquare(length: number, opts?: ResizeOptions): this;
        resize(maxWidth: number, maxHeight: number, opts?: ResizeOptions): this;
        rotate(degrees: number, opts?: RotateOptions): this;
        toGrayscale(opts?: GrayscaleOptions): this;
        pixelize(threshold?: number): this;
        gaussianBlur(radius?: number): this;
        centerInRectangle(maxWidth: number, maxHeight: number, opts?: CenterInRectOptions): this;
        toCircle(diametr: number, opts?: CircleOptions): this;
        saveAsBlob(mimeType?: string, q?: string): Promise<File>;
        saveAsCanvas(): Promise<HTMLCanvasElement>;
        saveAsImage(mimeType?: string, q?: string): Promise<HTMLImageElement>;
        setFileName(newFileName: string): void;
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

interface ResizeOptions {
    pica?: ResizeOptionsPica;
    picaInit?: ResizeOptionsPicaInit;
}

interface ResizeOptionsPica {
    quality?: number; // 0..3. Default = 3 (lanczos, win=3)
    alpha?: number; // use alpha channel. Default = false.
    unsharpAmount?: number; //  >=0, in percents. Default = 0 (off). Usually between 50 to 100 is good.
    unsharpRadius?: number; // 0.5..2.0. By default it's not set. Radius of Gaussian blur. If it is less than 0.5, Unsharp Mask is off. Big values are clamped to 2.0.
    unsharpThreshold?: number; //  0..255. Default = 0. Threshold for applying unsharp mask.
}

interface ResizeOptionsPicaInit {
    tile?: number; // tile width/height. Images are processed by regions, to restrict peak memory use. Default 1024
    features?: Array<string>; //  list of features to use. Default is [ 'js', 'wasm', 'ww' ]. Can be [ 'js', 'wasm', 'cib', 'ww' ] or [ 'all' ]. Note, resize via createImageBitmap() ('cib') disabled by default due problems with quality.
    idle?: number; // cache timeout, ms. Webworkers create is not fast. This option allow reuse webworkers effectively. Default 2000.
    concurrency?: number; // max webworkers pool size. Default is autodetected CPU count, but not more than 4.
}

interface CenterInRectOptions extends ResizeOptions {
    bgColor?: string; // default white
}

interface CircleOptions extends ResizeOptions {
    padding?: number; // default 4
    bgColor?: string; // default white
}

interface RotateOptions {
    padding?: number; // default 0
    bgColor?: string; // default white
}

interface GrayscaleOptions {
    // used luma coding: https://en.wikipedia.org/wiki/Grayscale#Luma_coding_in_video_systems
    rQ?: number; // default 0.34
    gQ?: number; // default 0.5
    bQ?: number; // default 0.16
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
