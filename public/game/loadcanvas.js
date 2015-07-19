var theCanvas = null;
var canvasWidth = null, canvasHeight=null;

//stage canvas
var stage = null;

//loading screen
var loadScreen = null;

//images progress
var imageLoadProgress = 0;
var soundLoadProgress = 0;

//continue
var continueToGame = false;

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
	loadingText.y = canvasHeight*(20/100);
	loadingText.textBaseline = "alphabetic";
	stage.addChild(loadingText);

	//add loading progress
	var loadingProgress = "Loading Images 0%";
	var loadingPText = new createjs.Text(loadingProgress, "40px Verdana", "#FFFFFF");
	loadingPText.textAlign = "center";
	loadingPText.x = canvasWidth/2;
	loadingPText.y = canvasHeight*(90/100);
	loadingPText.textBaseline = "alphabetic";
	stage.addChild(loadingPText);

	//arc loading progress
	var arcLoad = new createjs.Shape();
	arcLoad.graphics.beginStroke("#FFFFFF").setStrokeStyle(10).arc(0, 0, 50, 0, 2);
	arcLoad.x = canvasWidth/2;
	arcLoad.y = canvasHeight/2;
	stage.addChild(arcLoad);

	//circle
	var circle = new createjs.Shape();
	var circRadius = 30
	circle = new createjs.Shape();
	circle.graphics.beginFill("#FFFFFF").arc(canvasWidth/2, canvasHeight/2, circRadius, 0, Math.PI*2);
	stage.addChild(circle);

	var direction = -1;

	//Add Loading Animation
	createjs.Ticker.addEventListener("tick", loadingTick);
	createjs.Ticker.userRAF = true;
	createjs.Ticker.setFPS(60);

	var circleAnimSec = 60;
	var smooth = 0.1;

	function loadingTick(){
		if(imageLoadProgress < 100)
			loadingProgress = "Loading Images - "+imageLoadProgress+"%";
		else
			loadingProgress = "Loading Sounds - "+soundLoadProgress+"%";
		
		loadingPText.text = loadingProgress;

		arcLoad.rotation += 3;

		//if finished loading then play anim
		if(imageLoadProgress == 100 && soundLoadProgress == 100){
			circle.alpha = 1;
			if(circleAnimSec>0){
				circle.graphics.clear();
				circRadius+=smooth;
				circle.graphics.beginFill("#FFFFFF").arc(canvasWidth/2, canvasHeight/2, circRadius, 0, Math.PI*2);
				circleAnimSec--;
				smooth++;
			}else{
				console.log("yes");
				continueToGame = true;
				loadAssetsCompleted();
			}
		}else{
			//circle fade
			circle.alpha += 0.01*direction;
			if(circle.alpha <= 0.21 && circle.alpha >=0.19)
				direction = 1;
			else if (circle.alpha == 1.0)
				direction = -1;
		}

		stage.update();
	}
}

function loadAssetsCompleted(){
	cleanStage();
	openingGame();
}

//opening animation
function openingGame(){
	var logo = new createjs.Bitmap(imgLogo);
	var logoW = 256;
	var logoH = 256;
	logo.x = (canvasWidth/2)-(logoW/2);
	logo.y = (canvasHeight/2)-(logoH/2);
	logo.alpha = 0;
	stage.addChild(logo);

	//Add Opening Animation
	createjs.Ticker.addEventListener("tick", openingTick);
	createjs.Ticker.userRAF = true;
	createjs.Ticker.setFPS(60);

	var openingSec = 6*60;
	var dir = 1;

	function openingTick(){
		if(openingSec > 0){
			//circle fade
			logo.alpha += 0.01*dir;
			if(logo.alpha <= -0.01 && logo.alpha >=0.01)
				dir = 1;
			else if (logo.alpha >= 1.5)
				dir = -1;

			openingSec--;
		} else {
			afterOpening();
		}

		stage.update();
	}
}

function afterOpening(){
	cleanStage();
	initMainGame();
}

function cleanStage(){
	createjs.Sound.stop();
	createjs.Ticker.removeAllEventListeners();
	stage.removeAllChildren();
}



