//import data from "../assets/data/warrant-data.json"
var currentModel = []

var models = {
  getCurrentModel(){
    return currentModel;
  },

  loadFilterModel(topicModel){
    var fileName = topicModel.filters;

    var jsonData = require.context('../../assets/data/', false, /\.json$/)
    var loaded = jsonData('./' + fileName)

    return JSON.parse(JSON.stringify(loaded));
  },

  //will sort data so it will displayed on x, y axis
  //
  getDataBy(dataFile, x, y){
    var jsonData = require.context('../../assets/data/', false, /\.json$/)
    var loaded = jsonData('./' + dataFile)

    var data = JSON.parse(JSON.stringify(loaded));

    //var combined = require('../../assets/data/real/filtered-charges-sentences.csv')
    //var combined = require('../../assets/data/real/filtered-def.csv')
    //var data = require('../../assets/data/real/filtered-charges-sentences.csv')
    // console.log("---loading from data file: " + dataFile + "---");
    // var data = require('../../assets/data/real/' + dataFile);


    var sorted = {}

    var counter = 0;
    for (var i in data){
      var item = data[i];
      var value = item[y];
      if (sorted[value] == null){
        console.log("missing y value for dataset: " + y)
        sorted[value] = [];
      }

      var xCategory;

      if (x.includes("DATE") && Date.parse(item[x]) !== Number.NaN){
        // var date = new Date(Date.parse(item["fileDate"]));
          var date = new Date(Date.parse(item[x]));
          if (item[x]){
            var dateString = date.toISOString();
            if (dateString.split('T').length > 0){
              xCategory = date.toISOString().split('T')[0]; //"+" + date.getFullYear().toString();
              //console.log(xCategory)
            }
          }
      }
      // else{
      //   xCategory = item[x];
      // }

      if (sorted[value][xCategory] == null){
        sorted[value][xCategory] = 0;
      }
      sorted[value][xCategory] += 1;
      }

      // if (x == "year"){
      //   for (var type in sorted){
      //     //console.log(sorted[type]);
      //     sorted[type] = sorted[type].sort((a, b) => (a[x] > b[x]) ? 1 : -1);
      //   }
      // }

    var output = {};
    var firstYear, lastYear = 0;

    for (var type in sorted){
      var formatted = [];
      var xValues = sorted[type];

      for (var xValue in xValues){

        if (x.includes("DATE") && Date.parse(item[x]) !== Number.NaN){

          formatted.push({"x" : xValue, "y" : xValues[xValue]})

          // var correctedYear = xValue.slice(1);
          // if (correctedYear < firstYear){
          //   firstYear = correctedYear;
          // }
          // if (correctedYear > lastYear){
          //   lastYear = correctedYear;
          // }
          //
          // var convertedYear = Number(correctedYear);
          //
          // if (convertedYear >= 2000 && convertedYear <= 2020){
          // formatted.push({"x" : correctedYear, "y" : xValues[xValue]})
          //
          //   // if (counter < 100){
          //   //   console.log("correctedYear: " + correctedYear);
          //   //   counter++;
          //   // }
          // }

        }
        else{
          formatted.push({"x" : xValue, "y" : xValues[xValue]})
        }
        //console.log(correctedYear);
      }

      //formatted.sort((a, b) => (a.x > b.x) ? 1 : -1);

      output[type] = formatted;

    }

    // console.log(output);
    // if (x === "year"){
    //   fillEmptyYears(output);
    // }
    currentModel = output;
    console.log(output)
    return output;



  },

  // fillEmptyYears(dataset){
  //
  //
  //   for (var type in dataset){
  //     var xValues = dataset[type];
  //     var currentYear;
  //
  //     for (var xValue in xValues){
  //       if (!currentYear){
  //         currentYear =
  //       }
  //     }
  // },

  getByDate(dateModel){
    console.log("getByDate...")
    //console.log(dateModel[1]);
    var startDate = dateModel.start;
    //var startDate = new Date(start.year, start.month);
    console.log(startDate)

    var endDate = dateModel.end;
    //var endDate = new Date(end.year, end.month);
    console.log(endDate)

    var output = {};
    console.log(currentModel)
    for (var type in currentModel){
      var filteredArray = [];
      var array = currentModel[type];

      for (var i in array){
        //console.log("date: " + array[i].x);
        var currentDate = new Date(array[i].x);
        //console.log(currentDate)

        if (currentDate >= startDate && currentDate <= endDate){
          filteredArray.push(array[i]);
        }
      }

      output[type] = filteredArray;
    }

    console.log(output);
    return output;
  }
}

export default models;
