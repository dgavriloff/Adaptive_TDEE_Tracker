const getDayofWeekFromDateId = (dateId) => {
  return new Date(dateId.slice(0,4), parseInt(dateId.slice(4,6))-1, parseInt(dateId.slice(6,8)), 0, 0,0,0,);
}

console.log();
console.log(new Date(getDayofWeekFromDateId('20240611').getTime() + 345600000));