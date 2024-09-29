export const getWeekIdFromDateId = (dateId) => {
  return Math.floor(
    (getDateFromDateId(dateId).getTime() + 259200000) / 604800000
  );
};

export const getDateFromDateId = (dateId) => {
  return new Date(
    dateId.slice(0, 4),
    parseInt(dateId.slice(4, 6)) - 1,
    parseInt(dateId.slice(6, 8)),
    0,
    0,
    0,
    0
  );
};

export const getDateIdFormat = (date) => {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    0
  )}${String(date.getDate()).padStart(2, 0)}`;
};

export const getWeekFromWeekId = (weekId) => {
  const sunday = new Date(weekId * 604800000 - 259200000);
  const monday = new Date(weekId * 604800000 - 259200000 - 518400000);
  return `${String(monday.getMonth() + 1).padStart(2, 0)}/${String(
    monday.getDate()
  ).padStart(2, 0)}/${monday.getFullYear().toString().slice(2)} to ${String(
    sunday.getMonth() + 1
  ).padStart(2, 0)}/${String(sunday.getDate()).padStart(2, 0)}/${sunday
    .getFullYear()
    .toString()
    .slice(2)}`;
};
