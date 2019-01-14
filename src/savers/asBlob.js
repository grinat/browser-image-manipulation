import {fileExtByMimeType} from '../helpers/fileExtByMimeType'

/**
 * @param canvas{HTMLCanvasElement}
 * @param fileName
 * @param mimeType
 * @param q
 * @returns {Promise<File>}
 */
export function asBlob (canvas, fileName, mimeType, q) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            fileName = fileExtByMimeType(fileName, mimeType)
            let fileOfBlob = new File([blob], fileName, {type: mimeType})
            resolve(fileOfBlob)
        }, mimeType, q)
    })
}
