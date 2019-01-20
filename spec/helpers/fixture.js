const Canvas = require('canvas')
const fs = require('fs')
const path = require('path')
const pixelmatch = require('pixelmatch')
// need mime(<2.0.0) with lookup function
const File = require('file-api').File

export function getFixture (name) {
    const img = new Canvas.Image()
    img.src = fs.readFileSync(path.join(__dirname, '..', 'fixtures', name))

    const cnv = Canvas.createCanvas(img.width, img.height)
    const ctx = cnv.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    return cnv
}

export function getFixtureFile (name) {
    return new File(path.join(__dirname, '..', 'fixtures', name))
}

export function getDiffOfFixture (outCanvas, fixtureName, method) {
    const diffCanvas = Canvas.createCanvas(outCanvas.width, outCanvas.height)
    const diffCtx = diffCanvas.getContext('2d')
    const diffImageData = diffCtx.createImageData(outCanvas.width, outCanvas.height)

    const compareWithCanvas = getFixture(fixtureName)
    const compareWithCtx = compareWithCanvas.getContext('2d')
    const compareWith = compareWithCtx.getImageData(0, 0, compareWithCanvas.width, compareWithCanvas.height)

    const outCanvasCtx = outCanvas.getContext('2d')
    const out = outCanvasCtx.getImageData(0, 0, outCanvas.width, outCanvas.height)

    const diffedPixels = pixelmatch(
        out.data,
        compareWith.data,
        diffImageData.data,
        outCanvas.width,
        outCanvas.height
    )

    diffCtx.putImageData(diffImageData, 0, 0)
    diffCanvas
        .pngStream()
        .pipe(fs.createWriteStream(path.join(__dirname, '..', 'out', + method + '-diff-of-' + fixtureName + '.png')))

    saveCanvas(outCanvas, method)

    return diffedPixels
}

export function saveCanvas (canvas, method) {
    const ctx = canvas.getContext('2d')
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const saveC = Canvas.createCanvas(canvas.width, canvas.height)
    const saveCCtx = saveC.getContext('2d')
    saveCCtx.putImageData(data, 0, 0)
    const buff = saveC.toBuffer()
    fs.writeFileSync(path.join(__dirname, '..', 'out', method + '.png'), buff)
}
