var theCanvas = null;
var canvasWidth = null, canvasHeight=null;

//stage canvas
var stage = null;

//loading screen
var loadScreen = null;

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

	stage.addChild(loadScreen);

	//loading Text
	var loadingTemp = "LOADING";
	var loadingText = new createjs.Text(loadingTemp, "80px Verdana", "#FFFFFF");
	loadingText.textAlign = "center";
	loadingText.x = canvasWidth/2;
	loadingText.y = canvasHeight/2;
	loadingText.textBaseline = "alphabetic";
	stage.addChild(loadingText);
}

function loadAssetsCompleted(){
	stage.removeAllChildren();
}





