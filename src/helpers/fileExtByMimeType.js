/**
 * @param fileName{string}
 * @param mimeType{string}
 * @returns {string}
 */
export default function (fileName, mimeType) {
    let tmp = fileName.split('.')
    let ext = 'jpg'
    if (mimeType.indexOf('png') > -1) {
        ext = 'png'
    } else if (mimeType.indexOf('webp') > -1) {
        ext = 'webp'
    }
    tmp.pop()
    tmp.push(ext)
    return tmp.join('.')
}
