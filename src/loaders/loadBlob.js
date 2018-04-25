/**
 * @param imageFile{File}
 * @returns {function(): Promise<HTMLCanvasElement>}
 */
export default function (imageFile) {
    return () => new Promise((resolve, reject) => {
        let image = document.createElement('img')
        let reader = new FileReader()
        reader.onload = (data) => {
            image.src = data.target.result
        }
        image.onload = (data) => {
            let canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            resolve({canvas, fileName: imageFile.name})
        }
        reader.readAsDataURL(imageFile)
    })
}