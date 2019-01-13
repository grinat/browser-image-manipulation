/**
 * @param canvas{HTMLCanvasElement}
 * @param fileName{String}
 * @returns {function(): Promise<{canvas: HTMLCanvasElement, fileName: String}>}
 */
export default function (canvas, fileName) {
    return () => Promise.resolve({canvas, fileName})
}
