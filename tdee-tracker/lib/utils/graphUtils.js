import { getDateFromDateId, getDateIdFormat } from "./dateUtils";

export const getRangedData = (rangeInDays, graphData) => {
  const rangedData = graphData
    .slice(-rangeInDays)
    .map((log, index) => ({ y: log.y, x: index, meta: log.meta }));
  const minValue = Math.max(
    Math.floor(Math.min(...rangedData.map((log) => log.y)) / 10) * 10,
    0
  );
  const maxValue =
    Math.ceil(Math.max(...rangedData.map((log) => log.y)) / 10) * 10;
  const minMaxDifference = maxValue - minValue;
  const interval = getInterval(minMaxDifference);

  if (minMaxDifference <= 0)
    return {
      data: rangedData,
      min: minValue - 5,
      max: maxValue + 5,
      yTicks: createRange(10, minValue - 5, interval),
      defaultXTicks: Math.min(7, rangedData.length),
      defaultInterval: interval,
    };

  return {
    data: rangedData,
    min: minValue,
    max: maxValue,
    yTicks: createRange(minMaxDifference, minValue, interval),
    defaultXTicks: Math.min(7, rangedData.length),
    defaultInterval: interval,
  };
}; 

export const createRange = (size, start, interval) => {
  try {
    return [...Array(Math.round(size / interval) + 1).keys()].map(
      (i) => i * interval + start
    );
  } catch (err) {
    console.log("create range error", size, start, interval, err);
  }
};

export const getInterval = (rawSize) => {
  const desiredSize = 6;
  const baseInterval = 2.5;
  let interval = baseInterval;
  let size = rawSize;

  while (size >= desiredSize) {
    size = rawSize;
    Math.floor((size /= interval));
    interval += 2.5;
  }
  return interval;
};

//returns array of data with first index being the oldest entry and with no NaN weights
export const cleanGraphData = (userLogs) => {
  if (userLogs[0]) {
    const cleanData = removeGarbageData(userLogs.toReversed());
    const completeData = replaceGarbageData(cleanData, cleanData[0].weight, 1);
    //console.log(userLogs.map(log => ({x: log.weight, y: log.dateId})))
    return completeData;
  }
};

//replaces chunks of missing data for continuity in graph
export const replaceGarbageData = (data, placeholder, index) => {
  if (index >= data.length) return data;
  if (isNaN(data[index].weight)) {
    data[index].weight = placeholder;
    return replaceGarbageData(data, placeholder, ++index);
  } else return replaceGarbageData(data, data[index].weight, ++index);
};
//removes chunks of missing data at beginning of dataset
export const removeGarbageData = (data) => {
  if (isNaN(data[0]?.weight) && data[0]) {
    return removeGarbageData(data.slice(1));
  }
  return data;
};

export const fillMissingData = (logs) => {
  if (!logs) return [];
  // Helper to format dateId into MM/DD
  const formatDate = (dateId) => {
    return dateId;
  };

  // Helper to get the next day in YYYYMMDD format
  const getNextDay = (dateId) => {
    const date = getDateFromDateId(dateId);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10).replace(/-/g, "");
  };

  // Helper to get the current date in YYYYMMDD format
  const getCurrentDateId = () => {
    return getDateIdFormat(new Date());
  };

  // Sort the logs by dateId
  logs.sort((a, b) => a.dateId.localeCompare(b.dateId));

  // Initialize output array and last known weight
  const result = [];
  let lastWeight = logs[0]?.weight || null;
  let index = 0;

  // Start from the first dateId
  let currentDateId = logs[0].dateId;
  const endDateId = getCurrentDateId(); // Set to the current date

  let i = 0;
  while (currentDateId <= endDateId) {
    // If the current log matches the dateId, use its weight
    if (logs[i] && logs[i].dateId === currentDateId) {
      lastWeight = logs[i].weight; // Update last known weight
      result.push({
        x: index,
        y: logs[i].weight,
        meta: formatDate(logs[i].dateId),
      });
      i++; //
    } else {
      // Use the last known weight for missing dates
      result.push({
        x: index,
        y: lastWeight,
        meta: formatDate(currentDateId),
      });
    }
    // Move to the next date and increment index
    currentDateId = getNextDay(currentDateId);
    index++;
    // Break the loop if we pass the endDateId to prevent infinite loop
    if (currentDateId > endDateId) {
      break;
    }
  }
  //console.log(logs.map((l) => `${l.dateId} ${l.weight}`)); //
  return result;
};
