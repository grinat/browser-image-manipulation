/**
 * @param canvas{HTMLCanvasElement}
 * @param fileName{String}
 * @returns {function(): Promise<{canvas: HTMLCanvasElement, fileName: String}>}
 */
export function loadCanvas (canvas, fileName) {
    return () => Promise.resolve({canvas, fileName})
}
