// JavaScript code for the Arduino Beon example app.
// Application object.
var app = {};

model = new QuizModel();
const allQuestions = model.getAllQuestions();
const historyQuestions = allQuestions[0].history;
const scienceQuestions = allQuestions[0].science;
const sportsQuestions = allQuestions[0].sports;



function startQuiz(subject) {
  if (subject == 'history') {
    loadInQuiz(historyQuestions);
  } else if (subject == 'science') {
    loadInQuiz(scienceQuestions);
  } else {
    loadInQuiz(sportsQuestions);
  }
};

function loadInQuiz(questions) {
  const firstQuestion = questions[0];
  const secondQuestion = questions[1];
  const thirdQuestion = questions[2];
  let newElement = document.createElement("h2");

  // LOAD IN FIRST QUESTION
  let alternatives = firstQuestion.alternatives;

  let question1 = document.getElementById('question1');
  let alt1 = document.getElementById('question1alt1');
  let alt2 = document.getElementById('question1alt2');
  let alt3 = document.getElementById('question1alt3');
  let alt4 = document.getElementById('question1alt4');

  let alt1div = document.getElementById('q1a1');
  let alt2div = document.getElementById('q1a2');
  let alt3div = document.getElementById('q1a3');
  let alt4div = document.getElementById('q1a4');

  question1.innerHTML = firstQuestion.question;
  alt1.innerHTML = alternatives.one.alt;
  alt2.innerHTML = alternatives.two.alt;
  alt3.innerHTML = alternatives.three.alt;
  alt4.innerHTML = alternatives.four.alt;

  // Add right or wrong answer
  alt1div.classList.add(alternatives.one.answer);
  alt2div.classList.add(alternatives.two.answer);
  alt3div.classList.add(alternatives.three.answer);
  alt4div.classList.add(alternatives.four.answer);

  // LOAD IN SECOND QUESTION
  alternatives = secondQuestion.alternatives;

  let question2 = document.getElementById('question2');
  alt1 = document.getElementById('question2alt1');
  alt2 = document.getElementById('question2alt2');
  alt3 = document.getElementById('question2alt3');
  alt4 = document.getElementById('question2alt4');

  alt1div = document.getElementById('q2a1');
  alt2div = document.getElementById('q2a2');
  alt3div = document.getElementById('q2a3');
  alt4div = document.getElementById('q2a4');

  question2.innerHTML = secondQuestion.question;
  alt1.innerHTML = alternatives.one.alt;
  alt2.innerHTML = alternatives.two.alt;
  alt3.innerHTML = alternatives.three.alt;
  alt4.innerHTML = alternatives.four.alt;

  // Remove previous classes
  alt1div.className = '';
  alt1div.className = '';
  alt1div.className = '';
  alt1div.className = '';

  // Add right or wrong answer
  alt1div.classList.add(alternatives.one.answer);
  alt2div.classList.add(alternatives.two.answer);
  alt3div.classList.add(alternatives.three.answer);
  alt4div.classList.add(alternatives.four.answer);

  // LOAD IN THIRD QUESTION
  alternatives = thirdQuestion.alternatives;

  let question3 = document.getElementById('question3');
  alt1 = document.getElementById('question3alt1');
  alt2 = document.getElementById('question3alt2');
  alt3 = document.getElementById('question3alt3');
  alt4 = document.getElementById('question3alt4');

  alt1div = document.getElementById('q3a1');
  alt2div = document.getElementById('q3a2');
  alt3div = document.getElementById('q3a3');
  alt4div = document.getElementById('q3a4');

  question3.innerHTML = thirdQuestion.question;
  alt1.innerHTML = alternatives.one.alt;
  alt2.innerHTML = alternatives.two.alt;
  alt3.innerHTML = alternatives.three.alt;
  alt4.innerHTML = alternatives.four.alt;

  // Add right or wrong answer
  alt1div.classList.add(alternatives.one.answer);
  alt2div.classList.add(alternatives.two.answer);
  alt3div.classList.add(alternatives.three.answer);
  alt4div.classList.add(alternatives.four.answer);
}

function showStartScreen() {
  $("#startpage").show();
  $("#game").hide();
  $("#navbar").show();
}

function showGameScreen() {
  $("#startpage").hide();
  $("#game").show();
}
// FOR TESTING -------------
// startQuiz('science');
// -------------------------
// Regions that define which pa to show for each beacon.
app.beaconRegions = [
  {
    id: "firstQuestion",
    uuid: "b9407f30-f5f8-466e-aff9-25556b57fe6d",
    major: 56506,
    minor: 14941
  },
  {
    id: "secondQuestion",
    uuid: "b9407f30-f5f8-466e-aff9-25556b57fe6d",
    major: 57272,
    minor: 20467
  },
  {
    id: "thirdQuestion",
    uuid: "b9407f30-f5f8-466e-aff9-25556b57fe6d",
    major: 22460,
    minor: 60720
  }
];

// Currently displayed page.
app.currentPage = "page-default";

app.initialize = function () {
  document.addEventListener("deviceready", app.onDeviceReady, false);
  app.gotoPage(app.currentPage);
};

// Called when Cordova are plugins initialised,
// the iBeacon API is now available.
app.onDeviceReady = function () {
  // Specify a shortcut for the location manager that
  // has the iBeacon functions.
  window.locationManager = cordova.plugins.locationManager;

  // Start tracking beacons!
  app.startScanForBeacons();
};

app.startScanForBeacons = function () {
  //console.log('startScanForBeacons')

  // The delegate object contains iBeacon callback functions.
  var delegate = new cordova.plugins.locationManager.Delegate();

  delegate.didDetermineStateForRegion = function (pluginResult) {
    //console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
  };

  delegate.didStartMonitoringForRegion = function (pluginResult) {
    //console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
  };

  delegate.didRangeBeaconsInRegion = function (pluginResult) {
    //console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
    app.didRangeBeaconsInRegion(pluginResult);
  };

  // Set the delegate object to use.
  locationManager.setDelegate(delegate);

  // Start monitoring and ranging our beacons.
  for (var r in app.beaconRegions) {
    var region = app.beaconRegions[r];

    var beaconRegion = new locationManager.BeaconRegion(
      region.id,
      region.uuid,
      region.major,
      region.minor
    );

    // Start monitoring.
    locationManager
      .startMonitoringForRegion(beaconRegion)
      .fail(console.error)
      .done();

    // Start ranging.
    locationManager
      .startRangingBeaconsInRegion(beaconRegion)
      .fail(console.error)
      .done();
  }
};

// Display pages depending of which beacon is close.
app.didRangeBeaconsInRegion = function (pluginResult) {
  //console.log('numbeacons in region: ' + pluginResult.beacons.length)

  // There must be a beacon within range.
  if (0 == pluginResult.beacons.length) {
    return;
  }

  // Our regions are defined so that there is one beacon per region.
  // Get the first (and only) beacon in range in the region.
  var beacon = pluginResult.beacons[0];

  // The region identifier is the page id.
  var pageId = pluginResult.region.identifier;

  // console.log("ranged beacon: " + pageId + " " + beacon.major);

  // If the beacon is close and represents a new page, then show the page.
  if (
    beacon.proximity == "ProximityImmediate" &&
    app.currentPage == "page-default"
  ) {
    app.gotoPage(pageId);
    return;
  }

  // If the beacon represents the current page but is far away,
  // then show the default pe.
  if (
    (beacon.proximity == "ProximityFar" ||
      beacon.proximity == "ProximityNear") &&
    app.currentPage == pageId
  ) {
    app.gotoPage("page-default");
    return;
  }
};

app.gotoPage = function (pageId) {
  app.hidePage(app.currentPage);
  app.showPage(pageId);
  app.currentPage = pageId;
};

app.showPage = function (pageId) {
  document.getElementById(pageId).style.display = "block";
  $('.questions').css('color', 'black');
  $('.questions').css('background-color', 'white');
  $('.questions').css('font-weight', 'normal');
};

app.hidePage = function (pageId) {
  document.getElementById(pageId).style.display = "none";
};

// Set up the application.

app.initialize();
showStartScreen();

document.getElementById('historyQuiz').addEventListener("click", function () {
  startQuiz('history');
  showGameScreen();
});
document.getElementById('scienceQuiz').addEventListener("click", function () {
  startQuiz('science');
  showGameScreen();
});
document.getElementById('sportsQuiz').addEventListener("click", function () {
  startQuiz('sports');
  showGameScreen();
});
