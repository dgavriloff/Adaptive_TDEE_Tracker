import { useState } from "react";
import ToggleButton from "./ToggleButton";
import { View } from "react-native";

export default MultipleToggleButtons = ({
  values,
  action,
  containerStyle,
  defaultValue,
  buttonStyle
}) => {
  const [selectedButton, setSelectedButton] = useState(defaultValue.short);
  return (
    <View style={{ ...containerStyle,}}>
      {values.map((log, index) => {
        return (
          <ToggleButton
            text={log.value.short}
            key={index}
            selected={selectedButton}
            id={log.key}
            onPress={() => {
              setSelectedButton(log.key);
              action(log.key);
            }}
            pressable={log.pressable}
            style={buttonStyle}
          />
        );
      })}
    </View>
  );
};
