import { useState } from "react";
import ToggleButton from "./ToggleButton";
import { View } from "react-native";

export default MultipleToggleButtons = ({
  values,
  action,
  containerStyle,
  defaultValue,
}) => {
  const [selectedButton, setSelectedButton] = useState(defaultValue.short);

  return (
    <View style={{ ...containerStyle }}>
      {values.map((log, index) => {
        return (
          <ToggleButton
            text={log.value.short}
            key={index}
            selected={selectedButton}
            onPress={() => {
              setSelectedButton(log.value.short);
              action(log.key);
            }}
            pressable={log.pressable}
          />
        );
      })}
    </View>
  );
};
