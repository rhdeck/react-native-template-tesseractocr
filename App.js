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
const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

async function downloadLanguage(language) {
  await Tesseract.setLanguage(language);
  const tessPath = await Tesseract.setDataPath(
    RNFS.CachesDirectoryPath // + "/tessdata"
  );
  const fileName = await Tesseract.getFileNameForLanguage(language);
  const fullPath = tessPath + "/" + fileName;
  const exists = await RNFS.exists(fullPath);
  if (exists) await RNFS.unlink(fullPath);
  if (true) {
    const url = Tesseract.getURLForLanguage(language);
    console.log("Downloading from url", url);
    const { promise } = RNFS.downloadFile({
      fromUrl: url,
      toFile: fullPath
    });

    await promise;
    console.log("Saved to file", fullPath);
    const newExists = await RNFS.exists(fullPath);
    console.log("Does it exit now?", newExists);
    const stats = await RNFS.stat(fullPath);
    console.log("statistics", stats);
  }
  return true;
}
export default class App extends Component {
  componentWillMount() {
    (async () => {
      await downloadLanguage("eng");
      this.setState({ allowPress: true });
    })();
  }
  state = {
    text: "Nothing captured so far, dude",
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
                  console.log(this.camera);
                  const { uri } = await this.camera.takePictureAsync();
                  this.setState({ uri });
                  try {
                    this.setState({ text: "Scanning picture" });
                    const text = await Tesseract.recognizeURL(uri);
                    this.setState({ text });
                  } catch (e) {
                    console.log("Got an error");
                    this.setState({ text: "Error with scan" });
                    console.log(e);
                  }
                  this.setState({ allowPress: true });
                })();
              } else {
                console.log("Not allowing press right now");
              }
            }}
          >
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={{ width: "100%", height: "100%" }}
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
