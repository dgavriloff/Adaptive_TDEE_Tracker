import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ flex: 1 }}>{children}</View>
  </TouchableWithoutFeedback>
);

export default DismissKeyboard;
