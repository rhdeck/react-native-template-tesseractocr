import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import RNFS from "react-native-fs";
import Tesseract from "react-native-tesseract";
import { RNCamera } from "react-native-camera";

async function downloadLanguage(language) {
  await Tesseract.setLanguage(language);
  const tessPath = await Tesseract.setDataPath(
    RNFS.CachesDirectoryPath + "/tessdata"
  );
  const fileName = await Tesseract.getFileNameForLanguage(language);
  const fullPath = tessPath + "/" + fileName;
  const exists = await RNFS.exists(fullPath);
  if (!exists) {
    const url = Tesseract.getURLForLanguage(language);
    const { promise } = RNFS.downloadFile({
      fromUrl: url,
      toFile: fullPath
    });

    await promise;
    const newExists = await RNFS.exists(fullPath);
  }
  return true;
}
export default class App extends Component {
  componentWillMount() {
    (async () => {
      await downloadLanguage("eng");
      this.setState({
        allowPress: true,
        text: "Press the preview image (lower right) to trigger a scan"
      });
    })();
  }
  state = {
    text: "Please wait - initializing",
    uri: null,
    allowPress: false
  };
  camera = null;
  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text
            style={{
              zIndex: 100,
              color: "white",
              backgroundColor: "transparent"
            }}
          >
            {this.state.text}
          </Text>
          <Image
            source={this.state.uri ? { uri: this.state.uri } : null}
            style={{
              width: "100%",
              height: "100%",
              opacity: 0.5,
              position: "absolute"
            }}
          />
          <TouchableOpacity
            style={{
              borderColor: "black",
              borderWidth: 2,
              bottom: 0,
              right: 0,
              width: 100,
              height: 200,
              backgroundColor: "purple",
              position: "absolute",
              zIndex: 200
            }}
            onPress={() => {
              if (this.state.allowPress) {
                (async () => {
                  this.setState({ allowPress: false, text: "Taking picture!" });
                  const { uri } = await this.camera.takePictureAsync();
                  this.setState({ uri });
                  try {
                    this.setState({ text: "Scanning picture" });
                    const text = await Tesseract.recognizeURL(uri);
                    this.setState({ text });
                  } catch (e) {
                    this.setState({ text: "Error with scan" });
                  }
                  this.setState({ allowPress: true });
                })();
              } else {
                this.setState({
                  text: " Cannot press right now because scan in progress!"
                });
              }
            }}
          >
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={{
                width: "100%",
                height: "100%",
                opacity: this.state.allowPress ? 1.0 : 0.5
              }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",

    backgroundColor: "black"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
