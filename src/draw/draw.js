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

        const [x, y] = points2d[0]
        ctx.moveTo(x, y)

        for (let i = 1; i < points2d.length; i++) {
            const [x, y] = points2d[i]
            ctx.lineTo(x, y)
        }

        ctx.strokeStyle = fill
        ctx.lineWidth = width
        ctx.stroke()

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

        resolve(canvasImage)
    })
}
