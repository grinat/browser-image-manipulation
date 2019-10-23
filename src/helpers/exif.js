import piexif from 'piexifjs'

export function getExifTags (base64Image) {
    const allMetaData = {}

    try {
        const exifObj = piexif.load(base64Image)

        for (const ifd in exifObj) {
            if (ifd === 'thumbnail') {
                continue
            }
            allMetaData[ifd] = {}

            for (const tag in exifObj[ifd]) {
                allMetaData[ifd][piexif.TAGS[ifd][tag]['name']] = exifObj[ifd][tag]
            }
        }
    } catch (e) {
        console.warn('Error on read exif data')
    }

    return allMetaData
}
