// utils/validation.js
import { showMessage } from "react-native-flash-message";

export const isNumberWithinRange = (num, min, max, name) => {
  if (num <= max && num >= min) return true;
  else {
    showMessage({
      message: `${name} has to be a number between ${min} and ${max}.`,
      type: "danger",
      titleStyle: { textAlign: "center", fontSize: 18 },
      duration: 2000,
    });
  }
};

export const isInputValid = (value, min, max, name, nullOkay) => {
  if (nullOkay && !value && value != 0) return true;
  return isNumberWithinRange(parseFloat(value), min, max, name);
};

export const isValidNumber = (num) => {
  return typeof num === "number" && !isNaN(num);
};
