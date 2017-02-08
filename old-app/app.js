/* global $,console,document,Handlebars */
$(document).ready(function() {
  //default not avail image
  var IMAGE_NOT_AVAIL = "cover-not-available.png";

  $("#marvelButton").click(function() {
    pullSeriesFromMarvel();
  });

  $("#firebaseButton").click(function() {
    displaySeriesData();
  });

  // $('.subscribeButton').click(function() {
  //   console.log("checked");
  //   var seriesId = $(this).find('label').data('id');
  //   console.log("Series is: " + seriesId);
  //   var user = firebase.auth().currentUser;
  //   if (user != null) {
  //     uid = user.uid;
  //     console.log("User is: " + uid);
  //
  //     subscribe(uid, seriesId);
  //   }
  // });

  function getComicData() {
      var url = "https://gateway.marvel.com:443/v1/public/comics?hasDigitalIssue=true&orderBy=-onsaleDate&limit=100&offset=1&apikey=6b1901269411901652a868c9764ce72f";
      //console.log('Requesting Data');
      return $.get(url);
  }

  function displaySeriesData() {
    var $results = $("#results");
    var $status = $("#status");

    var templateSource = $("#reportTemplate").html();
    var template = Handlebars.compile(templateSource);
    $status.html("");

    var html = template({});

    var seriesRef = firebase.database().ref('series').once('value').then(function(snapshot) {
      //console.log(snapshot.val());

      _.forEach(snapshot.val(), function(series, title) {
        //console.log(series);
        html = template(series);
        $results.append(html);
      });
    });
  }

  function getSeriesData(offset) {
      var url = "https://gateway.marvel.com:443/v1/public/series?limit=100&offset=" + offset + "&apikey=6b1901269411901652a868c9764ce72f";
      //console.log('Requesting Data');
      return $.get(url);
  }

  function getAllSeriesData() {
    var promises = [];
    for (var i = 9000; i < 10000; i+=100) {
      promises.push(getSeriesData(i));
    }
    $.when.apply($,promises).done(function() {

      var args = Array.prototype.slice.call(arguments, 0);

      for(var x=0;x<92;x++) {
        var res = args[x][0];
        if(res.code === 200 || res.code === 304) {
          for(var a=0;a<100;a++) {
            var series = res.data.results[a];
            //console.log(series);


            writeSeriesData(series);
          }
        }
      }
    });
  }

  function pullSeriesFromMarvel() {

      var $results = $("#results");
      var $status = $("#status");

      var templateSource = $("#reportTemplate").html();
      var template = Handlebars.compile(templateSource);

      var promises = [];

      $status.html("<i>Getting comic book data - this will be slow - stand by...</i>");
      //promises.push(getComicData());
      promises.push(getAllSeriesData());
      console.log(promises);

  }
});

function writeSeriesData(series) {
  firebase.database().ref('series/' + series.id).set(series);
}

function subscribe(seriesId) {
  console.log("checked");
  console.log("Series is: " + seriesId);
  var seriesList = "";
  var user = firebase.auth().currentUser;
  if (user != null) {
    uid = user.uid;
    seriesList = user.photoURL;
    console.log("User is: " + uid);
  }
  seriesList += "|";
  seriesList += seriesId;
  console.log("Subscribe function is getting called with user: " + uid + " and series: " + seriesList);
  user.updateProfile({
    photoURL: seriesList // THIS IS THE ONLY PLACE WE CAN STORE CUSTOM USER DATA
  }).then(function() {
    // Update successful.
  }, function(error) {
    // An error happened.
  });
}
