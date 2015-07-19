var theCanvas = null;
var canvasWidth = null, canvasHeight=null;

//stage canvas
var stage = null;

//loading screen
var loadScreen = null;

//images progress
var imageLoadProgress = 0;

var loadingProgress = null, loadingPText = null;

window.addEventListener("load", eventWindowLoaded, false);

var Debugger = function () { };
Debugger.log = function (message) {
	try {
		console.log(message);
	} catch (exception) {
		return;
	}
}

function eventWindowLoaded () {
	getCanvas();

	//init stage
	stage = new createjs.Stage("theCanvas");

	loadingScreen();

	loadMainImages();
}

function getCanvas(){
	//canvas size
	//get canvas by id
	theCanvas = document.getElementById("theCanvas");

	//get canvas width and height
	canvasWidth = theCanvas.width;
	canvasHeight = theCanvas.height;
}

function loadingScreen(){
	loadScreen = new createjs.Shape();
	loadScreen.graphics.beginFill("#333333").drawRect(0, 0, canvasWidth, canvasHeight);

	Debugger.log(canvasWidth);

	stage.addChild(loadScreen);

	//loading Text
	var loadingTemp = "LOADING";
	var loadingText = new createjs.Text(loadingTemp, "80px Verdana", "#FFFFFF");
	loadingText.textAlign = "center";
	loadingText.x = canvasWidth/2;
	loadingText.y = canvasHeight/2;
	loadingText.textBaseline = "alphabetic";
	stage.addChild(loadingText);

	//add loading progress
	loadingProgress = "Loading Images 0%";
	loadingPText = new createjs.Text(loadingProgress, "40px Verdana", "#FFFFFF");
	loadingPText.textAlign = "center";
	loadingPText.x = canvasWidth/2;
	loadingPText.y = canvasHeight*(90/100);
	loadingPText.textBaseline = "alphabetic";
	stage.addChild(loadingPText);

	//Add Loading Animation
	createjs.Ticker.addEventListener("tick", loadingTick);
	createjs.Ticker.userRAF = true;
	createjs.Ticker.setFPS(60);

	
}

function loadingTick(){
	console.log("hairuu");

	loadingProgress = "Loading Images "+imageLoadProgress;
	loadingPText.Text = loadingProgress;

	console.log(imageLoadProgress);

	stage.update();
}

function loadAssetsCompleted(){
	createjs.Ticker.removeAllEventListeners();
	stage.removeAllChildren();
}





