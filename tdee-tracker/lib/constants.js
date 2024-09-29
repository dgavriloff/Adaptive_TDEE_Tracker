export const FLASH_MESSAGE_POSITION = "top";

export const NETWORK_ERROR_MESSAGE = {
  type: "danger",
  message: "Network Error",
  description: "Please check your internet connection and try again.",
  titleStyle: { textAlign: "center", fontSize: 18 },
  duration: 2000,
};

export const PASSWORD_RESET_SUCCESS = (email) => ({
  message: `A link has been sent to ${email}!`,
  type: "success",
  duration: 2500,
  titleStyle: {
    fontSize: 16,
    textAlign: "center",
  },
});

export const userSchema = {
  email: null,
  registrationComplete: null,
  createdAt: null,
  weightUnits: null,
  heightUnits: null,
  gender: null,
  startWeight: null,
  currentWeight: null,
  weeklyWeightDelta: null,
  dailyCalorieDelta: null,
  loseOrGain: null, // false = goal to lose weight, true = goal to gain weight
  goalWeight: null,
  age: null,
  activityLevel: null,
  height: null,
  currentTDEE: null,
  weightDelta: null,
};

export const USER_LOGS_COLLECTION = "user-logs";

