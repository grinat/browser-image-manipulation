import * as StackBlur from 'stackblur-canvas'
/**
 * @param radius{Number}
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export function gaussianBlur (radius) {
    return (canvasImage) => new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        canvas.width = canvasImage.width
        canvas.height = canvasImage.height

        let ctx = canvas.getContext('2d')
        ctx.drawImage(canvasImage, 0, 0)

        StackBlur.canvasRGBA(canvas, 0, 0, canvasImage.width, canvasImage.height, radius)

        resolve(canvas)
    })
}
