/**
 * @param ImageManipulation{ImageManipulation}
 * @returns {Promise<HTMLCanvasElement>}
 */
export default function (ImageManipulation) {
    return new Promise((resolve, reject) => {
        ImageManipulation.runTasks().then(() => {
            resolve(ImageManipulation.getCanvas())
        })
    })
}