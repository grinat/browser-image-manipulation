import fileExtByMimeType from '../helpers/fileExtByMimeType'

/**
 * @param canvas{HTMLCanvasElement}
 * @param fileName
 * @param mimeType
 * @param q
 * @returns {Promise<File>}
 */
export default function (canvas, fileName, mimeType, q) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            fileName = fileExtByMimeType(fileName, mimeType)
            let fileOfBlob = new File([blob], fileName)
            resolve(fileOfBlob)
        }, mimeType, q)
    })
}
