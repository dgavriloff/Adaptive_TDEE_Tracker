const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const parseCSV = (filePath) => {
  const results = [];
  return new Promise((res, rej) => {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const newDate = data.Date.replace(/-/g, '');
      results.push({date: newDate, calories: data.Calories})
    })
    .on('end', () => {
      res(results);
    });
  });
};


const parseCSV2 = (filePath) => {
  const results = [];
  return new Promise((res, rej) => {
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const newDate = data.Date.replace(/-/g, '');
      results.push({date: newDate, weight: data.Weight})
    })
    .on('end', () => {
      res(results);
    });
  });
};

const dailyCalories = (data, date, sum) => {
  if(!data[0]){
    return;
  }
  else if(!data[1]){
    return dailyCalories(data.slice(1,data.length), date, sum + parseFloat(data[0].calories))
  }
  else if(data[1].date === date){
    return dailyCalories(data.slice(1,data.length), date, sum + parseFloat(data[0].calories));
  }
  return {cal: sum + parseFloat(data[0].calories), date : data[0].date, newData: data.slice(1,data.length)};
}
const allCalories = (rawData, weightData) => {
  let data = rawData;
  let newData = [];
  while (data) {
    result = dailyCalories(data, data[0].date, 0);
    weightMatch = weightData.find(obj => obj.date === data[0].date);
    newData.push({
      cal: result ? Math.floor(result.cal) : '',
      date: result ? result.date : '',
      weight: weightMatch ? weightMatch.weight : ''
    })
    data = result ? result.newData : null;
  }
  return newData;
}


// Change the file path to the path of your CSV file
const filePath = path.join(__dirname, 'C:../../../../../../../../Users/denis/Downloads/File-Export-2022-09-19-to-2024-06-08/Measurement-Summary-2022-09-19-to-2024-06-08.csv');
let calData = 0;
parseCSV('C:../../../../../../../../Users/denis/Downloads/File-Export-2022-09-19-to-2024-06-08/Nutrition-Summary-2022-09-19-to-2024-06-08.csv').then(calData => {
  parseCSV2('C:../../../../../../../../Users/denis/Downloads/File-Export-2022-09-19-to-2024-06-08/Measurement-Summary-2022-09-19-to-2024-06-08.csv').then(weightData => {
    console.log(allCalories(calData.slice(100), weightData)); 
  }) 
});

