var imagePath = "./assets/images/";

//image instances
var imgPanda = new Image();
var imgBgTrees = new Image();
var imgBgRocks = new Image();
var imgBgCactus = new Image();

//loading image queue
var queueImage = new createjs.LoadQueue();

function loadMainImages() {
	queueImage.addEventListener("complete", imagesLoadComplete);
	queueImage.addEventListener("progress", getImagesProgress);
	queueImage.loadManifest([
		{ id: "panda", src: imagePath + "panda.png" },
		{ id: "trees1", src: imagePath + "trees1.png" },
		{ id: "trees2", src: imagePath + "trees2.png" },
		{ id: "rocks1", src: imagePath + "rocks1.png" },
		{ id: "rocks2", src: imagePath + "rocks2.png" },
		{ id: "mountain1", src: imagePath + "mountain1.png" },
		{ id: "mountain2", src: imagePath + "mountain2.png" },
		{ id: "egyptee", src: imagePath + "egyptee.png" },
		{ id: "appleslime", src: imagePath + "appleslime.png" },
		{ id: "headman", src: imagePath + "headman.png" },
		{ id: "dragon", src: imagePath + "dragon.png" },
		{ id: "maguro", src: imagePath + "maguro.png" },
		{ id: "pom", src: imagePath + "pom.png" },
		{ id: "orbs", src: imagePath + "orbs.png" },//kaetayo
		{ id: "redPanda", src: imagePath + "panda_red.png" }//kaetayo
	]);
}

function imagesLoadComplete() {
	imgPanda = queueImage.getResult("panda");
	imgDragon = queueImage.getResult("dragon");
	imgEgyptee = queueImage.getResult("egyptee");
	imgAppleSlime = queueImage.getResult("appleslime");
	imgHeadman = queueImage.getResult("headman");
	imgMaguro = queueImage.getResult("maguro");
	imgBgTrees1 = queueImage.getResult("trees1");
	imgBgTrees2 = queueImage.getResult("trees2");
	imgBgRocks1 = queueImage.getResult("rocks1");
	imgBgRocks2 = queueImage.getResult("rocks2");
	imgBgMountain1 = queueImage.getResult("mountain1");
	imgBgMountain2 = queueImage.getResult("mountain2");
	imgLogo = queueImage.getResult("pom");
	imgOrbs = queueImage.getResult("orbs");//kaetayo
	imgRedPanda = queueImage.getResult("redPanda");//kaetayo


	//load sound
	loadMainAudio();
}

function getImagesProgress(progress) {
	console.log(progress.loaded);
	imageLoadProgress = Math.floor(progress.loaded * 100);
}
