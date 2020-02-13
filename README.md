## browser-image-manipulation
Convert and manipulate image on JS in browser. Fluent interface based, at end returning promise.

### Install
```
npm install browser-image-manipulation --save
```

### Examples
[Open](https://grinat.github.io/browser-image-manipulation/examples/index.html) (see in /examples)

### Features
Load image in formats:
- blob (optional, with image orientation detect and correct rotate)
- canvas

Filters:
- grayscale
- pixelize
- gaussian blur (used [StackBlur.js](https://github.com/flozz/StackBlur))

Manipulations:
- rotate
- crop
- crop to circle with resize
- crop to square with resize
- resize by max height/max width (used [pica](https://github.com/nodeca/pica) for correct resize image)
- resize to fit in rectangle (proportion saved, empty space filled by color)
- perspective (change perspective of image)

Draw:
- draw line
- draw polygon
- draw rectangle
- draw text

Output formats:
- blob
- canvas
- base64 image

Info:
- get exif (only for blob)

### Usage
One format:
```js
import BrowserImageManipulation from 'browser-image-manipulation'

new BrowserImageManipulation()
   .loadBlob(e.target.files[0], {
       fixOrientation: true // about problem: https://www.howtogeek.com/254830/why-your-photos-dont-always-appear-correctly-rotated/
   })
   .gaussianBlur()
   .saveAsImage()
   .then(base64 => {
      alert('Blured done!')
   })
   .catch(e => alert(e.toString()))
```
Multi format:
```js
import BrowserImageManipulation from 'browser-image-manipulation'

let picaOptions = {} // optional, see pica options
let iM = new BrowserImageManipulation()
            .loadBlob(e.target.files[0])
            .toCircle(300, {pica: picaOptions})
            .toGrayscale()
            
iM.saveAsBlob().then(blob => {
    if (blob.size > 3000000) {
        return new Error('Max size 3 mb')
    }
    // uploadToServer(blob, 'my circle black and white image')
    return iM.saveAsImage()
}).then(base64 => {
    document.getElementByTag('img')[0].src = base64
}).catch(e => alert(e.toString()))
```

Fluent interface:
```js
new BrowserImageManipulation()
    .loadBlob(e.target.files[0])
    .toCircle(400)
    .toGrayscale()
    .pixelize()
    .rotate(90)
    .saveAsImage()
    .then(base64 => {
        document.getElementById('exampleFluentImg').src = base64
    }).catch(e => alert(e.toString()))
```

### Increase performance
#### Minify
Use wasm features in resize methods:
```js
new BrowserImageManipulation()
    .loadBlob(e.target.files[0])
    .toCircle(400, {
        picaInit: {
            features: ['js', 'wasm'] // <--- set features
        }
    })
    
new BrowserImageManipulation()
    .loadBlob(e.target.files[0])
    .resize(400, 400, {
        picaInit: {
            features: ['js', 'wasm'] // <--- set features
        }
    }) 
   
// ...and etc resize methods    

```

But if use UglifyJs/TerserJS set in compress evaluate to false
```
compress: {
  ...
  evaluate: false
  ...
}
```

Without that, you can see error like:
```
Uncaught ReferenceError: e is not defined
    at t (217c2170-1eb8-41b8-b91c-c3d57f706ea9:1)
```

### Ie 11 support
For work in ie 11 you need some polyfils from core-js
```
import 'core-js/modules/es.object.assign'
import 'core-js/modules/es.promise'
import 'core-js/modules/es.array.iterator'
```

In the versions below, the work was not tested. 
Perhaps everything will work if you add polyfills and use only js features:
```
.resize(400, 400, {
        picaInit: {
            features: ['js'] // <--- only js feature
        }
    }) 
``` 
