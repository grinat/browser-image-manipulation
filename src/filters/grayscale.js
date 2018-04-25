/**
 * @param opts{Object}
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export default function (opts = {}) {
    let {rQ = 0.34, gQ = 0.5, bQ = 0.16} = opts

    return (canvasImage) => new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        canvas.width = canvasImage.width
        canvas.height = canvasImage.height

        let ctx = canvas.getContext('2d')
        ctx.drawImage(canvasImage, 0, 0)

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        let data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
            let brightness = rQ * data[i] + gQ * data[i + 1] + bQ * data[i + 2]

            data[i] = brightness
            data[i + 1] = brightness
            data[i + 2] = brightness
        }

        ctx.putImageData(imageData, 0, 0)

        resolve(canvas)
    })
}
