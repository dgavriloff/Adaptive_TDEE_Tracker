import { useContext, useEffect, useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
import { ThemeContext } from "./ThemeProvider";

export default ToggleButton = ({
  selected,
  onPress,
  text,
  pressable,
  style,
  id,
}) => {
  const [highlighted, setHighlighted] = useState(selected);
  const {currentTheme} = useContext(ThemeContext);

  useEffect(() => {

    if (selected === id) setHighlighted(true);
    else setHighlighted(false);
  }, [selected]);

  const styles = StyleSheet.create({
    container: {
      margin: 0,
      ...style,
    },
    button: {
      backgroundColor: highlighted ? currentTheme.buttonTextColor : currentTheme.backgroundColor,
      padding: 10,
      borderRadius: 5,
    },
    text: {
      color: pressable ? (highlighted ? currentTheme.foregroundColor : currentTheme.buttonTextColor) : currentTheme.foregroundColor,
      textAlign: "center",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={pressable ? onPress : () => {}}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </View>
  );
};
