import {degreesToRadian} from '../helpers/degreesToRadian.js'

/**
 * @param degrees
 * @param opts{Object}
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export function rotate (degrees, opts = {}) {
    let {padding = 0, bgColor = 'white'} = opts

    return (canvasImage) => new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        let calcAngle = 0

        if (degrees < 0) {
            degrees = 360 + degrees
        }

        // get angle
        if (degrees >= 0 && degrees <= 90) {
            calcAngle = 90 - degrees
        } else {
            calcAngle = 270 - degrees
        }
        // to rad
        let degreesRad = degreesToRadian(degrees)
        let calcAngleRad = degreesToRadian(calcAngle)
        let angleRad = degreesToRadian(degrees)
        // calc sin cos
        let sinCos = {
            cosAngle: Math.cos(angleRad),
            cosCalcAngle: Math.cos(calcAngleRad),
            sinAngle: Math.sin(angleRad),
            sinCalcAngle: Math.sin(calcAngleRad)

        }
        // get module of sin/cos
        for (let key in sinCos) {
            if (sinCos[key] < 0) {
                sinCos[key] = sinCos[key] * -1
            }
        }
        // calc w/h on rotate changes
        canvas.width = canvasImage.width * sinCos.cosAngle + canvasImage.height * sinCos.cosCalcAngle + padding
        canvas.height = canvasImage.width * sinCos.sinAngle + canvasImage.height * sinCos.sinCalcAngle + padding

        let ctx = canvas.getContext('2d')
        // set bg
        if (bgColor) {
            ctx.beginPath()
            ctx.rect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = bgColor
            ctx.fill()
            ctx.save()
        }
        ctx.save()

        // rotate
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(degreesRad)
        ctx.drawImage(canvasImage, -(canvasImage.width / 2), -(canvasImage.height / 2))
        ctx.restore()

        resolve(canvas)
    })
}
