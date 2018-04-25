import fileExtByMimeType from '../helpers/fileExtByMimeType'

/**
 * @param ImageManipulation{ImageManipulation}
 * @param mimeType
 * @param q
 * @returns {Promise<File>}
 */
export default function (ImageManipulation, mimeType, q) {
    return new Promise((resolve, reject) => {
        ImageManipulation.runTasks().then(() => {
            let canvas = ImageManipulation.getCanvas()
            canvas.toBlob((blob) => {
                let fileName = fileExtByMimeType(ImageManipulation.getFileName(), mimeType)
                let fileOfBlob = new File([blob], fileName)
                resolve(fileOfBlob)
            }, mimeType, q)
        })
    })
}