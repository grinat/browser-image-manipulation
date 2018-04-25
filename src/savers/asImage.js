/**
 * @param ImageManipulation{ImageManipulation}
 * @param mimeType
 * @param q
 * @returns {Promise<HTMLImageElement.src>}
 */
export default function (ImageManipulation, mimeType, q) {
    return new Promise((resolve, reject) => {
        ImageManipulation.runTasks().then(() => {
            let canvas = ImageManipulation.getCanvas()
            let image = canvas.toDataURL(mimeType, q)
            resolve(image)
        })
    })
}