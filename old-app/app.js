/* global $,console,document,Handlebars */

//default not avail image
var IMAGE_NOT_AVAIL = "cover-not-available.png";



function getComicData() {
    var url = "https://gateway.marvel.com:443/v1/public/comics?hasDigitalIssue=true&orderBy=-onsaleDate&limit=100&offset=1&apikey=6b1901269411901652a868c9764ce72f";
    console.log('Requesting Data');
    return $.get(url);
}

function getSeriesData(offset) {
    var url = "https://gateway.marvel.com:443/v1/public/series?limit=100&offset=" + offset + "&apikey=6b1901269411901652a868c9764ce72f";
    console.log('Requesting Data');
    return $.get(url);
}

function getAllSeriesData() {
  var promises = [];
  for (var i = 0; i < 9200; i+=100) {
    promises.push(getSeriesData(i));
  }
  $.when.apply($,promises).done(function() {

    var args = Array.prototype.slice.call(arguments, 0);
    var $results = $("#results");
    var $status = $("#status");

    var templateSource = $("#reportTemplate").html();
    var template = Handlebars.compile(templateSource);
    $status.html("");

    var stats = {};
    stats.seriesName = "";
    stats.seriesID = "";
    stats.link = "";
    stats.pics = "";
    stats.description = "";

    var html = template(stats);
    for(var x=0;x<92;x++) {
      var res = args[x][0];
      if(res.code === 200 || res.code === 304) {
        for(var a=0;a<100;a++) {
          var series = res.data.results[a];
          console.log(series);

          if(series.thumbnail && series.thumbnail.path != IMAGE_NOT_AVAIL)  {
            stats.pics = series.thumbnail.path + "." + series.thumbnail.extension;
          }
          else {
            stats.pics = IMAGE_NOT_AVAIL;
          }

          //Set Series Name
          stats.seriesName = series.title;

          //Set Series ID
          stats.seriesID = series.id;

          //Set Comic link
          stats.link = series.resourceURI;

          //Set Comic Description
          stats.description = series.description;

          html = template(stats);
          $results.append(html);
        }
      }
    }
  });
}
// function getAllSeriesData() {
//   var promises = [];
//   promises.push(getSeriesData(0));
//   $.when.apply($,promises).done(function() {
//     var args = Array.prototype.slice.call(arguments, 0);
//     var res = args[0];
//     let firstSeriesSet = res.data;
//     console.log(firstSeriesSet);
//     let seriesCount = firstSeriesSet['count'];
//     let promisesInner = [];
//     for (var i = 100; i < seriesCount; i += 100) {
//       promisesInner.push(getSeriesData(i));
//     }
//     $.when.apply($,promisesInner).done(function() {
//       console.log(promisesInner);
//     });
//   });
// }

$(document).ready(function() {

    var $results = $("#results");
    var $status = $("#status");

    var templateSource = $("#reportTemplate").html();
    var template = Handlebars.compile(templateSource);

    var promises = [];

    $status.html("<i>Getting comic book data - this will be slow - stand by...</i>");
    //promises.push(getComicData());
    promises.push(getAllSeriesData());
    console.log(promises);

    // $.when.apply($,promises).done(function() {
    //   var args = Array.prototype.slice.call(arguments, 0);
    //
    //   $status.html("");
    //
    //   var stats = {};
    //   stats.seriesName = "";
    //   stats.seriesID = "";
    //   //stats.releaseDate = 0;
    //   stats.link = "";
    //   stats.pics = "";
    //   stats.description = "";
    //
    //   var res = args[0];
    //
    //   var html = template(stats);
    //
    //   var d = new Date();
    //   var todaysDate = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    //   //console.log(todaysDate);
    //
    //   if(res.status === 200) {
    //     for(var i=0;i<res.data.results.length;i++) {
    //         var series = res.data.results[i];
    //         //var unlimitedDate = comic.dates[2].date.split("T");
    //         //console.log(unlimitedDate[0]);
    //
    //         //if (unlimitedDate[0] == todaysDate) {//check if it was released today
    //           //Set Thumbnail Path
    //           if(series.thumbnail && series.thumbnail.path != IMAGE_NOT_AVAIL)  {
    //             stats.pics = series.thumbnail.path + "." + series.thumbnail.extension;
    //           }
    //           else {
    //             stats.pics = IMAGE_NOT_AVAIL;
    //           }
    //
    //           //Set Comic Name
    //           //stats.issueName = comic.title;
    //
    //           //Set Series Name
    //           stats.seriesName = series.title;
    //
    //           //Set Series ID
    //           //var seriesURL = comic.series.resourceURI;
    //           stats.seriesID = series.ID;
    //
    //           //Set Release Date
    //           //stats.releaseDate =
    //
    //           //Set Comic link
    //           stats.link = series.resourceURI;
    //
    //           //Set Comic Description
    //           stats.description = series.description;
    //
    //           html = template(stats);
    //           //console.dir(stats);
    //           $results.append(html);
    //
    //     //    }//end check if released today
    //     }
    // }
  // });
});
