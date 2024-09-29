import { isValidNumber } from "./validation";
import { getWeekFromWeekId } from "./dateUtils";

export const generateWeeklyLogs = (logs, units) => {
  let data = [];

  for (
    let i = logs[logs.length - 1].weekId, weekIndex = 0;
    i <= logs[0].weekId;
    i++, weekIndex++
  ) {
    week = logs.filter(
      (log) =>
        log.weekId === i &&
        isValidNumber(log.calories) &&
        isValidNumber(log.weight)
    );
    if (week[0])
      data.push({
        title: `${getWeekFromWeekId(week[week.length - 1].weekId + 1)}`,
        data: [
          {
            avgCalories: Math.floor(
              week.reduce((sum, log) => {
                return sum + log.calories / week.length;
              }, 0)
            ),
            avgWeight: reduceAvgWeight(week).toFixed(2),
            weightDelta: parseFloat(
              (data[weekIndex - 1]
                ? reduceAvgWeight(week) - data[weekIndex - 1].data[0].avgWeight
                : 0
              ).toFixed(2)
            ),
            weekId: week[0].weekId,
          },
        ],
      });
  }
  data = data.map(({ data, title }) => ({
    title: title,
    data: [
      {
        ...data[0],
        tdee:
          Math.round(
            (units === "lbs"
              ? data[0].weightDelta * -1 * 500 + data[0].avgCalories
              : data[0].weightDelta * -2.20462 * 500 + data[0].avgCalories) / 10
          ) * 10,
      },
    ],
  }));
  console.log("weekly logs generated");
  return data;
};

export const calculateTdee = (weeklyLogs, currTdee) => {
  const tdee = Math.floor(
    weeklyLogs.slice(0, weeklyLogs.length - 2).reduce((sum, log) => {
      return sum + log.data[0].tdee;
    }, 0) /
      (weeklyLogs.length - 2)
  );

  const shownTdee =
    weeklyLogs.length > 2
      ? Math.round(tdee / 50) * 50
      : Math.round(currTdee / 50) * 50;

  return shownTdee;
};

export const calculateWeeklyWeightDelta = (weeklyLogs) => {
  return weeklyLogs.reduce((sum, log) => {
    return sum + log.data[0].weightDelta;
  }, 0);
};

export const reduceAvgWeight = (array) => {
  return (
    array.reduce((sum, log) => {
      return sum + log.weight;
    }, 0) / array.length
  );
};

export const getAverageCalories = (weeklyLogs) => {
  const avg = Math.floor(
    weeklyLogs.reduce((sum, log) => {
      return sum + log.data[0].avgCalories;
    }, 0) / weeklyLogs.length
  );
  return isNaN(avg) ? 0 : avg;
};

export const posOrNeg = (value) => {
  return value < 0 ? value : "+" + value;
};
