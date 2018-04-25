/**
 * @param diametr
 * @param opts{Object}
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export default function (diametr, opts = {}) {
    let {padding = 4, bgColor = 'white'} = opts
    return (canvasImage) => new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas')
        canvas.width = diametr
        canvas.height = diametr

        let ctx = canvas.getContext('2d')
        // set area and area bg color
        ctx.beginPath()
        ctx.rect(0, 0, diametr, diametr)
        ctx.fillStyle = bgColor
        ctx.fill()
        ctx.save()
        // set padding in cropped circle
        let paddingSize = diametr - padding
        let halfSize = Math.round(paddingSize / 2)
        ctx.beginPath()
        ctx.arc(halfSize + (padding / 2), halfSize + (padding / 2), halfSize - (padding / 2), 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        ctx.drawImage(canvasImage, 0, 0, paddingSize, paddingSize)
        ctx.restore()
        resolve(canvas)
    })
}