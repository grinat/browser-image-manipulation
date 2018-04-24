export default function (degrees, opts = {}) {
    let {bgColor = 'white'} = opts

    return (canvasImage) => new Promise((resolve, reject) => {
        let outputCanvas = null
        let radians = degrees * (Math.PI / 180)
        let canvas = document.createElement('canvas')

        // TODO: calc size
        let maxSize = canvasImage.width > canvasImage.height
            ? canvasImage.width
            : canvasImage.height
        canvas.width = maxSize
        canvas.height = maxSize
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
        ctx.rotate(radians)
        ctx.drawImage(canvasImage, -(canvasImage.width / 2), -(canvasImage.height / 2))
        ctx.restore()

        resolve(canvas)
    })
}