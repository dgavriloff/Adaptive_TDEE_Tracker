import { useEffect, useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";

export default ToggleButton = ({
  selected,
  onPress,
  text,
  pressable,
  style,
  id,
}) => {
  const [highlighted, setHighlighted] = useState(selected);

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
      backgroundColor: highlighted ? "#007AFF" : "#f0f0f0",
      padding: 10,
      borderRadius: 5,
    },
    text: {
      color: pressable ? (highlighted ? "#fff" : "#007AFF") : "#fff",
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
