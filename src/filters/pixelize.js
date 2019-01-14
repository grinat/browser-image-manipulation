/**
 * @param threshold{Number}
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export function pixelize (threshold) {
    return (canvasImage) => new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = canvasImage.width
        canvas.height = canvasImage.height

        // resize img to small
        let smallW = canvasImage.width * threshold
        let smallH = canvasImage.height * threshold
        disableSmooth(ctx)
        ctx.drawImage(canvasImage, 0, 0, smallW, smallH)

        // and resize to full
        disableSmooth(ctx)
        ctx.drawImage(canvas, 0, 0, smallW, smallH, 0, 0, canvasImage.width, canvasImage.height)

        resolve(canvas)
    })
}

function disableSmooth (ctx) {
    ctx.webkitImageSmoothingEnabled = false
    ctx.mozImageSmoothingEnabled = false
    ctx.msImageSmoothingEnabled = false
    ctx.imageSmoothingEnabled = false
}
