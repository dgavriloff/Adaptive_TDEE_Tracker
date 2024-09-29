
export const calculateGoalDate = (userData) => {
    if (userData.dailyCalorieDelta === 0) return null;
  
    const weightDelta = Math.abs(userData.currentWeight - userData.goalWeight);
    const daysUntilGoal =
      userData.weightUnits === "lbs"
        ? (weightDelta * 3500) / userData.dailyCalorieDelta
        : (weightDelta * 2.20462 * 3500) / userData.dailyCalorieDelta;
  
    return new Date(new Date().getTime() + 86400000 * daysUntilGoal)
      .toDateString()
      .slice(3);
  };
  