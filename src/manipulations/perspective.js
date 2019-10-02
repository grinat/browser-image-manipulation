// Based on https://github.com/wanadev/perspective.js/blob/b332d6167b2ea9b0921c14f8716539e374496199/src/perspective.js by futomi  http://www.html5.jp/ and  Fabien LOISON <http://www.flozz.fr/>

/**
 * @param warpPoints
 * @returns {function(*=): Promise<any>}
 */
export function perspective (warpPoints = {}) {
    return (canvasImage) => new Promise((resolve, reject) => {
        const ctxDestination = canvasImage.getContext('2d')
        const {width, height} = canvasImage

        const {
            xy0 = ['0%', '0%'],
            xy1 = ['100%', '0%'],
            xy2 = ['100%', '100%'],
            xy3 = ['0%', '100%']
        } = warpPoints

        const points = convertRelativePointsToAbsolute([xy0, xy1, xy2, xy3], width, height)

        const ctxOut = createCanvasContext(width, height)
        ctxOut.drawImage(canvasImage, 0, 0, width, height)

        // prepare a <canvas> for the transformed image
        const ctxTransformed = createCanvasContext(width, height)

        // specify the index of which dimension is longest
        const baseIndex = getBaseIndex(points, width, height)

        const step = 2
        const coverStep = step * 5

        ctxTransformed.clearRect(0, 0, ctxTransformed.canvas.width, ctxTransformed.canvas.height)
        if (baseIndex % 2 === 0) { // top or bottom side
            transformSide(points, {
                ctxTransformed,
                sideSize: height,
                otherSizeSize: width,
                ctxOut,
                coverStep,
                step
            })
        } else if (baseIndex % 2 === 1) { // right or left side
            transformSide(points, {
                ctxTransformed,
                sideSize: width,
                otherSizeSize: height,
                ctxOut,
                coverStep,
                step
            })
        }
        // set a clipping path and draw the transformed image on the destination canvas.
        ctxDestination.save()
        ctxDestination.drawImage(ctxTransformed.canvas, 0, 0)
        applyMask(ctxDestination, points)
        ctxDestination.restore()

        resolve(ctxDestination.canvas)
    })
}

function convertRelativePointsToAbsolute (points = [], width, height) {
    const out = []
    for (let i = 0; i < points.length; i++) {
        out[i] = [
            convertRelativePointValue(points[i][0], width),
            convertRelativePointValue(points[i][1], height)
        ]
    }
    return out
}

function convertRelativePointValue (point, sizeSize) {
    let absPointVal = 0
    if (point.toString().indexOf('%') > -1) {
        absPointVal = Math.floor(sizeSize * (parseFloat(point) / 100))
    } else {
        absPointVal = point
    }

    return absPointVal
}

function createCanvasContext (w, h) {
    let canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    return canvas.getContext('2d')
}

function getBaseIndex (points, width, height) {
    const [[d0x, d0y], [d1x, d1y], [d2x, d2y], [d3x, d3y]] = points

    // compute the dimension of each side
    const dims = [
        Math.sqrt(Math.pow(d0x - d1x, 2) + Math.pow(d0y - d1y, 2)), // top side
        Math.sqrt(Math.pow(d1x - d2x, 2) + Math.pow(d1y - d2y, 2)), // right side
        Math.sqrt(Math.pow(d2x - d3x, 2) + Math.pow(d2y - d3y, 2)), // bottom side
        Math.sqrt(Math.pow(d3x - d0x, 2) + Math.pow(d3y - d0y, 2)) // left side
    ]

    // specify the index of which dimension is longest
    let baseIndex = 0
    let maxScaleRate = 0
    let zeroNum = 0
    for (let i = 0; i < 4; i++) {
        let rate = 0
        if (i % 2) {
            rate = dims[i] / width
        } else {
            rate = dims[i] / height
        }
        if (rate > maxScaleRate) {
            baseIndex = i
            maxScaleRate = rate
        }
        if (dims[i] === 0) {
            zeroNum++
        }
    }
    if (zeroNum > 1) {
        return 0
    }

    return baseIndex
}

function transformSide (points, {ctxTransformed, sideSize, otherSizeSize, ctxOut, coverStep, step}) {
    const [[d0x, d0y], [d1x, d1y], [d2x, d2y], [d3x, d3y]] = points

    const ctxWide = createCanvasContext(otherSizeSize, coverStep)
    ctxWide.globalCompositeOperation = 'copy'

    for (let y = 0; y < sideSize; y += step) {
        let r = y / sideSize
        let sx = d0x + (d3x - d0x) * r
        let sy = d0y + (d3y - d0y) * r
        let ex = d1x + (d2x - d1x) * r
        let ey = d1y + (d2y - d1y) * r
        let ag = Math.atan((ey - sy) / (ex - sx))
        let sc = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2)) / otherSizeSize
        ctxWide.setTransform(1, 0, 0, 1, 0, -y)
        ctxWide.drawImage(ctxOut.canvas, 0, 0)

        ctxTransformed.translate(sx, sy)
        ctxTransformed.rotate(ag)
        ctxTransformed.scale(sc, sc)
        ctxTransformed.drawImage(ctxWide.canvas, 0, 0)

        ctxTransformed.setTransform(1, 0, 0, 1, 0, 0)
    }
}

function applyMask (ctx, points) {
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1])
    }
    ctx.closePath()
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
}
