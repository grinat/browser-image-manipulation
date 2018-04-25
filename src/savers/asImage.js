/**
 * @param canvas{HTMLCanvasElement}
 * @param mimeType
 * @param q
 * @returns {Promise<HTMLImageElement.src>}
 */
export default function (canvas, mimeType, q) {
    return new Promise((resolve, reject) => {
        let image = canvas.toDataURL(mimeType, q)
        resolve(image)
    })
}