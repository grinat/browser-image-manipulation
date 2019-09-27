/**
 * Get [[x0, y0], [x1, y1] ...] or [x0, y0, x1, y1 ...]
 * and convert to [[x0, y0], [x1, y1] ...]
 * @param points
 * @returns {Array}
 */
export function pointsTo2DArray (points = []) {
    if (points.length < 1) {
        throw new Error('We need points')
    }

    const out = []
    for (let i = 0; i < points.length; i++) {
        if (Array.isArray(points[i])) {
            out.push(points[i])
        } else {
            const lastIndex = out.length - 1
            if (lastIndex === -1) {
                out.push([points[i]])
            } else if (out[lastIndex] && out[lastIndex].length === 2) {
                out.push([points[i]])
            } else {
                out[lastIndex].push(points[i])
            }
        }
    }

    return out
}
