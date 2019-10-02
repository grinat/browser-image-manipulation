import {pointsTo2DArray} from '../helpers/pointsTo2DArray'

/**
 * Inspired by https://pillow.readthedocs.io/en/3.1.x/reference/ImageDraw.html#PIL.ImageDraw.PIL.ImageDraw.Draw.line
 * @param points
 * @param fill
 * @param width
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export function drawLine (points, fill, width) {
    return (canvasImage) => new Promise((resolve, reject) => {
        const points2d = pointsTo2DArray(points)
        const ctx = canvasImage.getContext('2d')
        ctx.save()

        const [x, y] = points2d[0]
        ctx.moveTo(x, y)

        for (let i = 1; i < points2d.length; i++) {
            const [x, y] = points2d[i]
            ctx.lineTo(x, y)
        }

        ctx.strokeStyle = fill
        ctx.lineWidth = width
        ctx.stroke()

        ctx.restore()
        resolve(canvasImage)
    })
}

/**
 * Inspired by https://pillow.readthedocs.io/en/3.1.x/reference/ImageDraw.html#PIL.ImageDraw.PIL.ImageDraw.Draw.polygon
 * @param points
 * @param fill
 * @param outline
 * @param outlineWidth
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export function drawPolygon (points, fill, outline, outlineWidth) {
    return (canvasImage) => new Promise((resolve, reject) => {
        const points2d = pointsTo2DArray(points)
        const ctx = canvasImage.getContext('2d')
        ctx.save()

        ctx.beginPath()

        const [x, y] = points2d[0]
        ctx.moveTo(x, y)

        for (let i = 1; i < points2d.length; i++) {
            const [x, y] = points2d[i]
            ctx.lineTo(x, y)
        }

        ctx.closePath()

        ctx.fillStyle = fill
        ctx.fill()

        ctx.strokeStyle = outline
        ctx.lineWidth = outlineWidth
        ctx.stroke()

        ctx.restore()
        resolve(canvasImage)
    })
}

/**
 * Inspired by https://pillow.readthedocs.io/en/3.1.x/reference/ImageDraw.html#PIL.ImageDraw.PIL.ImageDraw.Draw.rectangle
 * @param points [[left, bottom], [right, top]] or [left, bottom, right, top]
 * @param fill
 * @param outline
 * @param outlineWidth
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export function drawRectangle (points, fill, outline, outlineWidth) {
    return (canvasImage) => new Promise((resolve, reject) => {
        const points2d = pointsTo2DArray(points)

        if (points2d.length < 2) {
            throw new Error('Need points sequence of [[left, bottom], [right, top]] or [left, bottom, right, top]')
        }

        const [left, bottom] = points2d[0]
        const [right, top] = points2d[1]

        const ctx = canvasImage.getContext('2d')
        ctx.save()

        if (fill) {
            ctx.beginPath()
        }

        ctx.moveTo(left, bottom)
        ctx.lineTo(left, top)
        ctx.lineTo(right, top)
        ctx.lineTo(right, bottom)
        ctx.lineTo(left, bottom)

        if (fill) {
            ctx.closePath()
            ctx.fillStyle = fill
            ctx.fill()
        }

        if (outline) {
            ctx.strokeStyle = outline
            ctx.lineWidth = outlineWidth
            ctx.stroke()
        }

        ctx.restore()
        resolve(canvasImage)
    })
}

/**
 * @returns {function(*=): Promise<any>}
 */
export function drawText (xy, text, {
    font = 'helvetica',
    fontSize = null,
    fill = null,
    fillPadding = null,
    rotateAngle = null
} = {}) {
    return (canvasImage) => new Promise(async (resolve, reject) => {
        let fontSizeInPx = 0
        let fillPaddingInPx = 0

        const canvasMaskImage = document.createElement('canvas')
        canvasMaskImage.width = canvasImage.width
        canvasMaskImage.height = canvasImage.height

        const ctx = canvasMaskImage.getContext('2d')
        // append transforms
        // rotate
        if (rotateAngle) {
            const radians = rotateAngle * Math.PI / 180
            ctx.rotate(radians)
        }

        // calc font size
        if (fontSize) {
            if (fontSize.indexOf('%') > -1) {
                fontSizeInPx = Math.floor(canvasMaskImage.height * (parseFloat(fontSize) / 100))
            } else {
                fontSizeInPx = parseFloat(fontSize)
            }

            font = `${fontSizeInPx}px ${font}`.trim()
        }

        // calc padding
        if (fillPadding) {
            if (fillPadding.indexOf('%') > -1) {
                fillPaddingInPx = Math.floor(canvasMaskImage.height * (parseFloat(fillPadding) / 100))
            } else {
                fillPaddingInPx = parseFloat(fillPadding)
            }
        }

        // draw poly
        if (fill) {
            ctx.save()

            if (font) ctx.font = font

            const [x, y] = xy

            let height = parseInt(ctx.font)
            const metrics = ctx.measureText(text)
            const width = metrics.width
            if ('actualBoundingBoxAscent' in metrics) {
                height = metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent
            }

            ctx.restore()

            await drawRectangle([
                x - fillPaddingInPx,
                y + fillPaddingInPx,
                x + width + fillPaddingInPx,
                y - height - fillPaddingInPx
            ], fill, null)(canvasMaskImage)
        }

        // draw text
        ctx.save()

        if (font) ctx.font = font

        const [x, y] = xy
        ctx.fillText(text, x, y)

        ctx.restore()

        // merge images
        const ctxImage = canvasImage.getContext('2d')
        ctxImage.drawImage(canvasMaskImage, 0, 0)

        resolve(canvasImage)
    })
}
