import degreesToRadian from '../helpers/degreesToRadian.js'

export default function (degrees, opts = {}) {
    let {padding = 0, bgColor = 'red'} = opts

    return (canvasImage) => new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')

        // TODO: calc degree after 90'
        let calcAngle = 90 - degrees
        let angle = degrees

        let degreesRad = degreesToRadian(degrees)
        let calcAngleRad = degreesToRadian(calcAngle)
        let angleRad = degreesToRadian(angle)

        // calc optimal h/w
        canvas.width =  canvasImage.width * Math.cos(angleRad) + canvasImage.height * Math.cos(calcAngleRad) + padding
        canvas.height =  canvasImage.width * Math.sin(angleRad) + canvasImage.height * Math.sin(calcAngleRad) + padding
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