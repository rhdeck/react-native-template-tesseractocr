# react-native-template-tesseractocr

React Native template for demoing functionality in [react-native-tesseract](https://npmjs.com/package/react-native-tesseract)

# Prerequisites

1. Since this is an iOS project, needs to be run on MacOS with XCode installed
2. XCode command line tools need to be installed (usually not a problem)
3. Cocoapods needs to be installed

# Usage

```
react-native init mytestapp --template tesseractocr
```

(Replace `mytestapp` with whatever you want to name your app)

# Required

For whatever reason the [react-native-camera-clean](https://npmjs.com/package/react-native-camera-clean) gets undone at the end of the template install process. So to allow fast delployment, run (from your project root)

```
react-native link
```

# Suggestion

Run following in your package for fast deployment (e.g. not having to set development team in XCode):

```
react-native setdevteam
react-native run-ios --device
```

# Putting it all together

```
react-native init mytesstestapp --template tesseractocr ; \
cd mytesstestapp ; \
react-native link ; \
react-native setdevteam ; \
react-native run-ios --device
```

# Important Note

Like the plugin, this project is iOS only at this time.
