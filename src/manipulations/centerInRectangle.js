export default function (width, height, opts = {}) {
    let {bgColor} = opts
    return (canvasImage) => new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        let newWidth = canvasImage.width
        let newHeight = canvasImage.height
        // set bg
        if (bgColor) {
            ctx.beginPath()
            ctx.rect(0, 0, width, height)
            ctx.fillStyle = bgColor
            ctx.fill()
            ctx.save()
        }
        // put image
        let dx = 0
        let dy = 0
        let sx = 0
        let sy = 0
        if (newWidth < width) {
            dx = (width - newWidth) / 2
        }
        if (newHeight < height) {
            dy = (height - newHeight) / 2
        }
        ctx.drawImage(canvasImage, sx, sy, newWidth, newHeight, dx, dy, newWidth, newHeight)
        resolve(canvas)
    })
}