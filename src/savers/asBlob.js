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
            // edge doesnt suppot new File, create Blob and set file.name
            let fileOfBlob = new Blob([blob], {type: mimeType})
            fileOfBlob.name = fileExtByMimeType(fileName, mimeType)
            resolve(fileOfBlob)
        }, mimeType, q)
    })
}
