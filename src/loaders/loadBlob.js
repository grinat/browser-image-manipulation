/**
 * @param imageFile{File}
 * @returns {function(): Promise<{canvas: HTMLCanvasElement, fileName: String}>}
 */
export function loadBlob (imageFile) {
    return () => new Promise((resolve, reject) => {
        let image = document.createElement('img')
        let reader = new FileReader()
        reader.onload = (data) => {
            image.src = data.target.result
        }
        reader.onerror = () => {
            reject(new Error('Image read error'))
        }
        image.onload = () => {
            let canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            resolve({canvas, fileName: imageFile.name})
        }
        image.onerror = () => {
            reject(new Error('Invalid image'))
        }
        reader.readAsDataURL(imageFile)
    })
}
