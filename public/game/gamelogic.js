//todo - stop sound problem with bgm

//sprite animation speed
var spriteSpeed = 0.3;

//sound off or not
var soundOn = true;

function initMainGame(){
	//check sound plugin
	checkSoundPlugin();

	titleGame();
}

//enter titleGame
function titleGame(){
	cleanStage();

	playBGMForestSound();

	stage.enableMouseOver(60);

	createjs.Touch.enable(stage);

	//init main game container
	var titleCont = new createjs.Container();
	titleCont.x=0;
	stage.addChild(titleCont);

	var bg = new createjs.Shape();
	bg.graphics.beginLinearGradientFill(["#2468bd","#d2ebff"], [0, 1], 0, 0, 0, canvasHeight/2).drawRect(0,0,canvasWidth,canvasHeight);
	titleCont.addChild(bg);

	//Title Card
	var titleCard = "THE LOST PANDA";
	var titleText = new createjs.Text(titleCard, "80px Helvetica", "#FFFFFF");
	titleText.textAlign = "center";
	titleText.x = canvasWidth/2;
	titleText.y = canvasHeight*(30/100);
	titleText.textBaseline = "alphabetic";
	titleCont.addChild(titleText);

	//subtitle card
	var subtitle = "Don't question why. Just play it.";
	var subtitleText = new createjs.Text(subtitle, "30px Helvetica", "#FFFFFF");
	subtitleText.textAlign = "left";
	subtitleText.x = 55;
	subtitleText.y = canvasHeight*(38/100);
	subtitleText.textBaseline = "alphabetic";
	titleCont.addChild(subtitleText);

	// Menu
	var play = new createjs.Text("Play Game", "45px Helvetica", "#2C3E50");
	play.textAlign = "right";
	play.x = 750;
	play.y = canvasHeight*(70/100);

	var playHit = new createjs.Shape();
	playHit.graphics.beginFill("#000").drawRect(-play.getMeasuredWidth(), 0, play.getMeasuredWidth(), play.getMeasuredHeight());
	//titleCont.addChild(playHit);
	play.hitArea = playHit;

	//event listeners
	// play.on("mouseover", function(event){
	// 	event.target.alpha = 0.5;
	// });
	// play.on("mouseout", function(event){
	// 	event.target.alpha = 1;
	// });

	play.addEventListener("mouseover", function(e){
		e.target.alpha = 0.5;
	});
	play.addEventListener("mouseout", function(e){
		e.target.alpha = 1;
	});

	play.addEventListener('mousedown', function(e) {
		e.target.alpha = 0.7;
	}, false);

	play.addEventListener('pressup', function(e){
		startGame();
	}, false);

	titleCont.addChild(play);

	// Sound On
	var sound = new createjs.Text("Sound On", "45px Helvetica", "#2C3E50");
	sound.textAlign = "right";
	sound.x = 750;
	sound.y = canvasHeight*(80/100);
	titleCont.addChild(sound);

	var soundHit = new createjs.Shape();
	soundHit.graphics.beginFill("#000").drawRect(-sound.getMeasuredWidth(), 0, sound.getMeasuredWidth(), sound.getMeasuredHeight());
	//titleCont.addChild(soundHit);
	sound.hitArea = soundHit;

	sound.addEventListener("mouseover", function(e){
		e.target.alpha = 0.5;
	});
	sound.addEventListener("mouseout", function(e){
		e.target.alpha = 1;
	});

	sound.addEventListener('mousedown', function(e) {
		e.target.alpha = 0.7;
	}, false);

	sound.addEventListener('pressup', function(e){
		createjs.Sound.stop();
		if(soundVol > 0){
			soundVol=0;
			sound.text = "Sound OFF";
			soundOn = false;
		}else{
			soundVol = 0.5;
			playBGMForestSound();
			sound.text = "Sound ON";
			soundOn = true;
		}

	}, false);

	// fog attributes
	var fog = [];
	var fogArea = canvasHeight*(50/100);
	var fogSpeed = [];

	for(var i=0; i<20; i++){
		//Transparent fog
		//position and speed of the fogs are randomized
		fog.push(new createjs.Shape());
		fog[i].graphics.beginFill("#FFF").drawRect(0, Math.floor(Math.random() * fogArea), 50, Math.floor(Math.random()*20)+1);
		fog[i].x = canvasWidth+Math.floor(Math.random() * canvasWidth);
		fog[i].alpha = Math.random();
		titleCont.addChild(fog[i]);

		//randomized fog speed
		fogSpeed.push(Math.floor(Math.random()*2)+1);
	}

	//Add Title Animation
	createjs.Ticker.addEventListener("tick", titleTick);
	createjs.Ticker.userRAF = true;
	createjs.Ticker.setFPS(60);

	function titleTick(){
		for(var i=0; i<fog.length; i++){
			fog[i].x -= fogSpeed[i];
			if((fog[i].x+51)<0)
				fog[i].x = canvasWidth+Math.floor(Math.random() * canvasWidth);
		}

		stage.update();
	}
}

function startGame(){
	cleanStage();

	//play BGM
	playBGMSound();

	//platform height - 20% above the ground
	var platHeight = canvasHeight-canvasHeight*(20/100);

	// background speed
	var bgSpeed = 4;

	//distance (score)
	var distanceScore = 0;

	// kill (score)
	var killScore = 0;

	//ready state
	var gameState = "ready";

	// hold collidable game objects
	var colObjects = [];

	// seconds
	var sec = 60;

	// enemies list
	var enemiesList = ["egyptee", "dragon", "appleslime", "headman"];

	//kaetayo
	//red panda wo ugokasu tame no kansuu.
	var PandaPi = 0;
	//item no jikkou jikan
	var duration = [];	
	var duration2 = [];

	duration[0] = 100;	//blackOrb
	duration[1] = 300;	//blueOrb
	duration[2] = 300;	//greenOrb
	duration[3] = 30;	//redOrb
	duration[4] = 1000;	//Star

	for(var i=0; i<5; i++){
		duration2[i]=duration[i];
	}

	//item flags
	var getBlackOrb = false;
	var getBlueOrb = false;
	var getGreenOrb = false;
	var getRedOrb = false;
	var getStar = false;

	var PreSpeed = 0;
	
	//mou sude ni orb ga shutsugen shiteiru baai, false ni naru.
	var orbFlag = true;	

	//0=blackOrb  1=blueOrb  2=greenOrb  3=redOrb  4=star
	var itemSwitch = -1;

	//gravity 
	var ggg = 1;

	//Jump count
	var jumpCount = 0;

	//switch you no yatsu.
	var aiueo = 10;

	//barrier wo motteiru ka douka. totteireba, true. nakereba false.
	var barrierFlag = false;	

	//-kaetayo

	// get collidable objects
	function getColObjects(){ return colObjects; }

	//character sprite
	var pandaSS = new createjs.SpriteSheet({
		images: [imgPanda], // image to be used
		frames: {width: 128, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			walk: {
				frames: [45,46,47,48,49,50,51,52],
				next: "walk",
				speed: spriteSpeed
			},
			jump: {
				frames: [30,31,32,33,34,35],
				next: "midair",
				speed: spriteSpeed
			},
			midair: {
				frames: [35],
				next: "midair",
				speed: spriteSpeed
			},
			dead:{
				frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
				next: "lay",
				speed: spriteSpeed
			},
			lay:{
				frames:[14],
				next:"lay",
				speed:spriteSpeed
			}
		}
	});

	//enemies sprites
	var dragonSS = new createjs.SpriteSheet({
		images: [imgDragon], // image to be used
		frames: {width: 128, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			fly: {
				frames: [20,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],
				next: "fly",
				speed: spriteSpeed
			},
			dead:{
				frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
				speed: spriteSpeed
			}
		}
	});

	var egypteeSS = new createjs.SpriteSheet({
		images: [imgEgyptee], // image to be used
		frames: {width: 128, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			walk: {
				frames: [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],
				next: "walk",
				speed: spriteSpeed
			},
			dead:{
				frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
				speed: spriteSpeed
			}
		}
	});

	var appleslimeSS = new createjs.SpriteSheet({
		images: [imgAppleSlime],
		frames: {width: 128, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			roll: {
				frames: [13,14,15,16,17,18,19,20,21,22,23,24,25],
				next: "roll",
				speed: spriteSpeed
			},
			dead: {
				frames: [0,1,2,3,4,5,6,7,8,9,10,11,12],
				speed: spriteSpeed
			}
		}
	});

	var headmanSS = new createjs.SpriteSheet({
		images: [imgHeadman],
		frames: {width: 128, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			walk: {
				frames: [15,16,17,18,19,20,21,22,23,24,25,26,27],
				next: "walk",
				speed: spriteSpeed
			},
			dead: {
				frames: [0,1,2,3,4,5,6,7,8,9,10],
				speed: spriteSpeed
			}
		}
	});

	var maguroSS = new createjs.SpriteSheet({
		images: [imgMaguro],
		frames: {width: 256, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			walk: {
				frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],
				next: "walk",
				speed: spriteSpeed
			}
		}
	});

	//kaetayo 
	var spriteSheetOrbs = new createjs.SpriteSheet({
		images: [imgOrbs], // image to be used
		frames: {width: 128, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			blackOrb: {
				frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
				next: "blackOrb",
				speed: spriteSpeed
			},
			blueOrb:{
				frames:[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],
				next: "blueOrb",
				speed: spriteSpeed
			},
			greenOrb:{
				frames:[40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],
				next: "greenOrb",
				speed: spriteSpeed
			},
			redOrb:{
				frames:[60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79],
				next: "redOrb",
				speed: spriteSpeed
			},
			star:{
				frames:[80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99],
				next: "star",
				speed: spriteSpeed
			}			
		}
	});

	var spriteSheetRedPanda = new createjs.SpriteSheet({
		images: [imgRedPanda], // image to be used
		frames: {width: 128, height: 128, regX: 0, regY:0, spacing: 0},
		animations: {
			walk: {
				frames: [45,46,47,48,49,50,51,52],
				next: "walk",
				speed: spriteSpeed*7
			}
		}
	});



	//-kaetayo

	//character class
	function MainCharacter(spriteSheet){
		this.initialize(spriteSheet);
	}

	MainCharacter.prototype = new createjs.Sprite();
	MainCharacter.prototype.Sprite_initialize = MainCharacter.prototype.initialize;

	MainCharacter.prototype.initialize = function (spriteSheet) {
		this.Sprite_initialize(spriteSheet);
		this.gotoAndPlay("walk");

		this.scaleChar = 1;
		this.scaleX = this.scaleChar;
		this.scaleY = this.scaleChar;
		this.name = "Panda";
		this.velocity = {x:0,y:12};
		this.direction = 90;
		this.vX = 3|0.5;
		this.vY = 0;
		this.onGround = false;
		this.doubleJump = false;
		this.ableJump = 2;

		//character position
		this.x = theCanvas.width*(1/100);
		this.y = 300;

		// state 0 for jump
		this.stateRun = 1;

		this.snapToPixel = true;
	}

	MainCharacter.prototype.tick = function () {
		// fall down
		this.velocity.y += 0.6*ggg;	//kaetayo

		// for debugging purposes
		if(sec==0){
			console.log(this.y);
			sec = 120;
		}else if(sec>0){
			sec-=1;
			
		}

		var moveBy = {x:0, y:this.velocity.y},
        collision = null,
        collideables = getColObjects();
 
	    collision = calculateCollision(this, 'y', collideables, moveBy);
	    // moveBy is now handled by 'calculateCollision'
	    // and can also be 0 - therefore we won't have to worry
	    this.y += moveBy.y;

	    //console.log("preCollision moveby y = "+moveBy.y)
	 
	    if ( !collision ) {
	        if ( this.onGround ) {
	        	//play midair animation
	        	if(this.currentAnimation != "jump")
	        		this.gotoAndPlay("midair");
	            this.onGround = false;
	            this.doubleJump = true;
	        }
	    } else {

	        // if the player just landed
	        if(!this.onGround){

	        	this.gotoAndPlay("walk");
	        		
	        }
				
	        this.onGround = true;
	        this.doubleJump = false;
	        this.ableJump = 2;

	        this.velocity.y = 0;
	    }

	    // and now handle the x-movement
	    moveBy = {x:this.velocity.x, y:0};
	    collision = calculateCollision(this, 'x', collideables, moveBy);
	    this.x += moveBy.x;
	        
	    // if the main character run out of bounds
	    if(this.y >= canvasHeight || this.x < theCanvas.width*(1/100)){
	    	gameOverState();
	    }
	}

	MainCharacter.prototype.jump = function () {
		jumpCount++;	//kaetayo
		if(this.ableJump > 0 ){
			this.stateRun = 0;
			this.gotoAndPlay("jump");
			this.velocity.y=-12;
			this.doubleJump = true;
			playJumpSound();
		}
		this.ableJump--;
	}

	MainCharacter.prototype.reset = function () {
		this.y = platHeight-this.diff;
	}

	MainCharacter.prototype.getCustomBounds = function () {
		var temp = getBounds(this);
		return temp;
	}

	//init main game container
	var mainGame = new createjs.Container();
	mainGame.x=0;
	stage.addChild(mainGame);

	// *** BACKGROUNDS ***
	var bg = new createjs.Shape();
	bg.graphics.beginLinearGradientFill(["#2468bd","#d2ebff"], [0, 1], 0, 0, 0, canvasHeight/2).drawRect(0,0,canvasWidth,canvasHeight);
	mainGame.addChild(bg);

	// background mountain
	var bgMountain = new createjs.Bitmap(imgBgMountain1);
	var bgMountainScale = 2;
	var bgMountainHeight = 200*bgMountainScale;
	var bgMountainWidth = 800*bgMountainScale;
	bgMountain.x = 0;
	bgMountain.y = platHeight - bgMountainHeight;
	bgMountain.scaleX = bgMountainScale;
	bgMountain.scaleY = bgMountainScale;
	mainGame.addChild(bgMountain);
	var bgMountainDup = new createjs.Bitmap(imgBgMountain2);
	bgMountainDup.x = bgMountainWidth;
	bgMountainDup.y = platHeight-bgMountainHeight;
	bgMountainDup.scaleX = bgMountainScale;
	bgMountainDup.scaleY = bgMountainScale;
	mainGame.addChild(bgMountainDup);

	// fog attributes
	var fog = [];
	var fogArea = canvasHeight*(50/100);
	var fogSpeed = [];

	for(var i=0; i<20; i++){
		//Transparent fog
		//position and speed of the fogs are randomized
		fog.push(new createjs.Shape());
		fog[i].graphics.beginFill("#FFF").drawRect(0, Math.floor(Math.random() * fogArea), 50, Math.floor(Math.random()*20)+1);
		fog[i].x = canvasWidth+Math.floor(Math.random() * canvasWidth);
		fog[i].alpha = Math.random();
		mainGame.addChild(fog[i]);

		//randomized fog speed
		fogSpeed.push(Math.floor(Math.random()*2)+1);
	}

	//rocks
	var bgRocks = new createjs.Bitmap(imgBgRocks1);
	var bgRocksScale = 2;
	var bgRocksHeight = 200*bgRocksScale;
	var bgRocksWidth = 800*bgRocksScale;
	bgRocks.x = 0;
	bgRocks.y = platHeight-bgRocksHeight;
	bgRocks.scaleX = bgRocksScale;
	bgRocks.scaleY = bgRocksScale;
	mainGame.addChild(bgRocks);
	var bgRocksDup = new createjs.Bitmap(imgBgRocks2);
	bgRocksDup.x = bgRocksWidth;
	bgRocksDup.y = platHeight-bgRocksHeight;
	bgRocksDup.scaleX = bgRocksScale;
	bgRocksDup.scaleY = bgRocksScale;
	mainGame.addChild(bgRocksDup);

	// ground
	var ground = new createjs.Shape();
	ground.graphics.beginFill("#aa4f00").drawRect(0, platHeight, canvasWidth, platHeight);
	mainGame.addChild(ground);

	// trees
	var bgTrees = new createjs.Bitmap(imgBgTrees1);
	var bgTreesScale = 1.5;
	var bgTreesHeight = 200*bgTreesScale;
	var bgTreesWidth = 800*bgTreesScale;
	bgTrees.x = 0;
	bgTrees.y = platHeight-bgTreesHeight;
	bgTrees.scaleX = bgTreesScale;
	bgTrees.scaleY = bgTreesScale;
	mainGame.addChild(bgTrees);
	var bgTreesDup = new createjs.Bitmap(imgBgTrees2);
	bgTreesDup.x = bgTreesWidth;
	bgTreesDup.y = platHeight-bgTreesHeight;
	bgTreesDup.scaleX = bgTreesScale;
	bgTreesDup.scaleY = bgTreesScale;
	mainGame.addChild(bgTreesDup);

	//character
	character = new MainCharacter(pandaSS);
	mainGame.addChild(character);

	// water
	var water = new createjs.Shape();
	var waterHeight = platHeight+50;
	water.graphics.beginFill("#4DA7D9").drawRect(0, waterHeight, canvasWidth, platHeight);
	water.alpha = 0.9;
	mainGame.addChild(water);

	//making platforms
	var platforms = [];
	var platTops = [];
	var platGaps = [];
	var currentPlatPoint = 0;

	//platform
	var platform = new createjs.Shape();
	platform.graphics.beginFill("#c27229").drawRect(0, platHeight, canvasWidth, platHeight);
	platform.setBounds(0, platHeight, canvasWidth, platHeight);
	//push platform to object
	colObjects.push(platform);
	mainGame.addChild(platform);

	//platform top
	var platTopHeight = platHeight*(5/100);
	var platTop = new createjs.Shape();
	platTop.graphics.beginFill("#d7ab79").drawRect(0, platHeight, canvasWidth, platHeight*(5/100));
	platTop.setBounds(0, platHeight, canvasWidth, platTopHeight);
	//Objects.push(platTop);
	mainGame.addChild(platTop);

	//generate platforms
	for(i=0; i< 10; i++){
		var platletHeight = platHeight;
		var platletWidth = getRand(100,500);
		var gap = getRand(150,250);

		//platform
		platforms.push(new createjs.Shape());
		platforms[i].graphics.beginFill("#c27229").drawRect(0, platletHeight, platletWidth, platletHeight);
		platforms[i].name="platform";
		platforms[i].x = currentPlatPoint;
		platforms[i].setBounds(0, platletHeight, platletWidth, platletHeight);

		//push platform to object
		colObjects.push(platforms[i]);
		mainGame.addChild(platforms[i]);

		//platform top
		var platTopHeight = platletHeight*(5/100);
		platTops.push(new createjs.Shape());
		platTops[i].graphics.beginFill("#d7ab79").drawRect(0, platletHeight, platletWidth, platTopHeight);
		platTops[i].x = currentPlatPoint;
		platTops[i].setBounds(0, platletHeight, platletWidth, platTopHeight);
		mainGame.addChild(platTops[i]);

		//debugRect(stage, platforms[i]);

		currentPlatPoint += (gap + platletWidth);
		platGaps.push(gap);
	}

	currentPlatPoint -= platGaps[platGaps.length-1];

	//Make looping objects
	// platform specks
	var specks = []
	var specksArea = (canvasHeight-platHeight)-platHeight*(5/100);

	//specks loop
	for(var i=0; i<30; i++){
		//specks

		specks.push(new createjs.Shape());
		specks[i].graphics.beginStroke("#b86d2a");
		specks[i].graphics.setStrokeStyle(1);
		specks[i].snapToPixel = true;
		specks[i].graphics.beginFill("#7b421d").drawCircle(0, platHeight + platHeight*(5/100) + Math.floor(Math.random() * specksArea)+10,
			getRand(2,4));
		
		specks[i].x = getRand(0, canvasWidth);
		specks[i].alpha = Math.random();
		mainGame.addChild(specks[i]);
	}

	//kaetayo
	//BlackOrb wo hyouji suru.
	var orb = new createjs.Sprite(spriteSheetOrbs);	
	orb.name = "orb";
	orb.x = -100;
	orb.y = getRand(150,380);
	orb.setBounds(71,47,30,37);
	colObjects.push(orb);

	//red panda wo hyouji suru.
	var redPanda = new createjs.Sprite(spriteSheetRedPanda);	//orb ha, red orb no koto dayo.
	redPanda.gotoAndPlay("walk");
	redPanda.x = character.x;
	redPanda.y = -300;
	mainGame.addChild(redPanda);

	//duration wo visible ni suru
	//blackOrb
	var durationVisibleBlack = [];
	for(var i=0;i<duration[0];i++){
		durationVisibleBlack.push(new createjs.Shape());
		durationVisibleBlack[i].graphics.beginFill("#500000").drawRect(0,0, 128-(i*128/duration[0]), 10);
		durationVisibleBlack[i].alpha = 1 - (i/duration[0]);
	}
	//blueOrb
	var durationVisible = [];
	for(var i=0;i<duration[1];i++){
		durationVisible.push(new createjs.Shape());
		durationVisible[i].graphics.beginFill("#0027A7").drawRect(0,0, 128-(i*128/duration[1]), 10);
		durationVisible[i].alpha = 1 - (i/duration[1]);
	}
	//greenOrb
	var durationVisibleGreen = [];
	for(var i=0;i<duration[2];i++){
		durationVisibleGreen.push(new createjs.Shape());
		durationVisibleGreen[i].graphics.beginFill("#00A727").drawRect(0,0, 128-(i*128/duration[2]), 10);
		durationVisibleGreen[i].alpha = 1 - (i/duration[2]);
	} 
	//redOrb
	var durationVisibleRed = [];
	for(var i=0;i<duration[3];i++){
		durationVisibleRed.push(new createjs.Shape());
		durationVisibleRed[i].graphics.beginFill("#A72700").drawRect(0,0, 128-(i*128/duration[3]), 10);
		durationVisibleRed[i].alpha = 1 - (i/duration[3]);
	} 
	
	var durationVisibleStar = [];
	for(var i=0;i<duration[4];i++){
		durationVisibleStar.push(new createjs.Shape());
		durationVisibleStar[i].graphics.beginFill("#A7A700").drawRect(0,0, 128-(i*128/duration[4]), 10);
		durationVisibleStar[i].alpha = 1 - (i/duration[4]);
	} 

	var barrier = new createjs.Shape();
	barrier.graphics.beginFill("#a0a080").drawRect(0, 0, 128, 128);
	barrier.alpha = 0.5;

	//-kaetayo

	//Enemy
	//dragon
	var dragon = new createjs.Sprite(dragonSS);
	var dragonLoc = getRand(500,1000);
	var dragonWidth = 90;
	dragon.name = "dragon";
	dragon.gotoAndPlay("fly");
	dragon.x = -200;	//kaetayo2
	dragon.y = 128;
	dragon.setBounds(20,20,90,78);
	colObjects.push(dragon);
	mainGame.addChild(dragon);

	//Egyptee
	var egyptee = new createjs.Sprite(egypteeSS);
	var egypteeLoc = getRand(1000,2000);
	var egypteeWidth = 128;
	var egypteeHeight = 128;
	var egypteeSpeed = 0.2
	egyptee.name = "egyptee";
	egyptee.gotoAndPlay("walk");
	egyptee.x = -200;	//kaetayo2
	egyptee.y = platHeight-egypteeHeight;
	egyptee.setBounds(40,20,40,100);
	colObjects.push(egyptee);
	mainGame.addChild(egyptee);

	//Apple Slime
	var appleSlime = new createjs.Sprite(appleslimeSS);
	var appleSlimeLoc = getRand(2000,3000);
	var appleSlimeWidth = 128;
	var appleSlimeHeight = 128;
	var appleSlimeSpeed = 2
	appleSlime.name = "appleslime";
	appleSlime.gotoAndPlay("roll");
	appleSlime.x = -200;	//kaetayo2
	appleSlime.y = platHeight-appleSlimeHeight;
	appleSlime.setBounds(45,90,35,30);
	colObjects.push(appleSlime);
	mainGame.addChild(appleSlime);

	//Headman
	var headman = new createjs.Sprite(headmanSS);
	var headmanLoc = getRand(2000,3000);
	var headmanWidth = 128;
	var headmanHeight = 128;
	var headmanSpeed = 0.2
	headman.name = "headman";
	headman.gotoAndPlay("walk");
	headman.x = -200;	//kaetayo2
	headman.y = platHeight-headmanHeight;
	headman.setBounds(42,60,44,78);
	colObjects.push(headman);
	mainGame.addChild(headman);

	var maguro = new createjs.Sprite(maguroSS);
	var maguroLoc = getRand(2000,3000);
	var maguroWidth = 256;
	var maguroHeight = 128;
	var maguroSpeed = 0.2
	maguro.name = "maguro";
	maguro.gotoAndPlay("walk");
	maguro.x = -2000;	//kaetayo2
	maguro.y = platHeight-maguroHeight;
	maguro.setBounds(5,30,246,103);
	colObjects.push(maguro);
	mainGame.addChild(maguro);

	var charDebug = debugRect(mainGame, maguro);
	mainGame.addChild(charDebug);

	/*TESTINGGGGG*/

	//create GUI

	//Score border
	var scoreBorder = new createjs.Shape();
	scoreBorder.graphics.beginStroke("#AED8F2");
	scoreBorder.graphics.setStrokeStyle(5);
	scoreBorder.snapToPixel = true;
	scoreBorder.graphics.beginFill("#0387A8").drawRect(25, 25, 200, 60);
	mainGame.addChild(scoreBorder);

	//Score
	var distTextTemp = "SCORE\n";
	var distanceText = new createjs.Text(distTextTemp +String(distanceScore), "20px Verdana", "#AED8F2");
	distanceText.x = 35;
	distanceText.y = 50;
	distanceText.textBaseline="alphabetic";
	mainGame.addChild(distanceText);

	//Ready Text
	var readyTextTemp = "READY";
	var readyText = new createjs.Text(readyTextTemp, "80px Verdana", "#FFFFFF");
	readyText.textAlign = "center";
	readyText.x = -100;
	readyText.y = canvasHeight/2;
	//readyText.outline = 5;
	readyText.textBaseline = "alphabetic";
	mainGame.addChild(readyText);

	//Score border
	var scoreBorder2 = new createjs.Shape();
	scoreBorder2.graphics.beginStroke("#AED8F2");
	scoreBorder2.graphics.setStrokeStyle(5);
	scoreBorder2.snapToPixel = true;
	scoreBorder2.graphics.beginFill("#0387A8").drawRect(250, 25, 200, 60);
	mainGame.addChild(scoreBorder2);

	//Score
	var killTextTemp = "KILL SCORE\n";
	var killText = new createjs.Text(killTextTemp +String(killScore), "20px Verdana", "#AED8F2");
	killText.x = 265;
	killText.y = 50;
	killText.textBaseline="alphabetic";
	mainGame.addChild(killText);

	//character bound space - DEBUG
	// var charDebug = new createjs.Shape();
	// charDebug.graphics.beginStroke("#000");
	// charDebug.graphics.setStrokeStyle(1);
	// charDebug.snapToPixel = true;
	// var cBD = character.getCustomBounds();
	// charDebug.graphics.beginFill("#FFF").drawRect(0, 0, cBD.width, cBD.height);
	// charDebug.alpha = Math.random();
	// mainGame.addChild(charDebug);

	//Animation - MAIN PART
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.userRAF = true;
	createjs.Ticker.setFPS(60);

	//water wave var
	var waveT = 0;
	var speedUp = 50;
	var prevBgSpeed = bgSpeed;

	//ready movement coeff
	var readyV = 10;
	var readySec = 100;
	var goSec = 60;
	var remSec = 60;
	var gameOverSec = 3*60; //5 seconds before back to title screen

	var fadeOut = new createjs.Shape();
	fadeOut.graphics.beginFill("#FFFFFF").drawRect(0,0,canvasWidth,canvasHeight);
	fadeOut.alpha = 0; // fade out effect
	mainGame.addChild(fadeOut);

	//sound gameover
	var playOnceGO = 1;

	function handleTick(){
		//animate fog and specks
		for(var i=0; i<fog.length; i++){
			fog[i].x -= fogSpeed[i];
			if((fog[i].x+51)<0)
				fog[i].x = canvasWidth+Math.floor(Math.random() * canvasWidth);
		}

		for(var i=0; i<specks.length; i++){

			specks[i].x -= bgSpeed;
			if((specks[i].x+20) < 0)
				specks[i].x = canvasWidth+30;
		}

		//animate platforms
		for(var i=0; i<platforms.length; i++){
			platforms[i].x -= bgSpeed;
			platTops[i].x -= bgSpeed;
			//console.log(platforms[i].getTransformedBounds().x);

			var platBefore = i == 0 ? platforms.length-1 : i-1;

			if((platforms[i].x+platforms[i].getTransformedBounds().width)<0){
				var gapScale = bgSpeed/4.0;
				platGaps[platBefore] = getRand(150+(gapScale*10),250+(gapScale)*10);
				platforms[i].x = (platforms[platBefore].x+platforms[platBefore].getTransformedBounds().width)+platGaps[platBefore];
				platTops[i].x = (platforms[platBefore].x+platforms[platBefore].getTransformedBounds().width)+platGaps[platBefore];
			}
		}

		animateBackground();

		//state changes
		if(gameState === "ready"){
			//animate ready text for 2000
			if(readyText.x <= parseInt(canvasWidth/2)){
				readyText.x += 20;
			}else{
				readySec -= 1;
				if(readySec == 0){
					gameState = "running";
					readyText.text = "GO!";
				}
			}

			//animate character
			character.tick();
		}else if(gameState === "running"){
			//move ready platform
			platform.x -= bgSpeed;
			platTop.x -= bgSpeed;
			//move ready text
			if(goSec > 0){
				goSec--;
			}
			else{
				readyText.alpha -=0.05;
			}

			//kaetayo2
			//enemy procedures
			function enemies(enemyName){
				if (enemyName === "appleslime"){
					appleSlime.x = canvasWidth + 100;
					appleSlime.gotoAndPlay("roll");
				}
				else if(enemyName === "egyptee"){
					egyptee.x = canvasWidth + 100;
					egyptee.gotoAndPlay("walk");
					//dragon combo (by using an egyptee, kill an dragon)
					var dragonCombo = getRand(0,3);
					if(dragonCombo>=0 && dragonCombo <=1){
						dragon.x = canvasWidth + 65 * bgSpeed - bgSpeed*1.3;
						dragon.gotoAndPlay("fly");
					}
				}
				else if (enemyName === "maguro"){
					maguro.x = canvasWidth + 100;
					maguro.gotoAndPlay("walk");
				}

				else if (enemyName === "headman"){
					headman.x = canvasWidth + 100;
					headman.gotoAndPlay("walk");
				}

			}

			var shutsugenRate = 5000/bgSpeed;	//koko no atai wo kaetara, shutsu gen ritsu wo kaereru.
			var abc = getRand(0,shutsugenRate);	
			if(abc >= 0 && abc < 5 &&((appleSlime.currentAnimation==="dead"&&appleSlime.x < -200)||appleSlime.x < -200))
				enemies("appleslime");
			if(abc >= 5 && abc < 7 &&((egyptee.currentAnimation === "dead"&&egyptee.x < -200)||egyptee.x < -200)&&((dragon.currentAnimation === "dead"&&dragon.x < -200)||dragon.x < -200))
				enemies("egyptee");
			if(abc >= 7 && abc < 8 &&((maguro.currentAnimation === "dead"&&maguro.x < -300)||maguro.x < -300))
				enemies("maguro");
			if(abc >= 8 && abc < 11 &&((headman.currentAnimation === "dead"&&headman.x < -200)||headman.x < -200))
				enemies("headman");
			
			//ORB PROCEDURES
			//kaetayo
			//orb wo random ni hassei saseru.
			orbs();
			
			//BlackOrb ga gamen no soto ni itta toki, orbFlag wo true ni suru.
			if(orb.x <=-128&&(getBlackOrb==false&&getGreenOrb==false&&getBlueOrb==false&&getRedOrb==false)){
				orbFlag=true;
			}

			//BlackOrb wo totta toki no shori.
			if(getBlackOrb&&duration[0]>0){

				if(duration[0]!=duration2[0])
					mainGame.removeChild(durationVisibleBlack[duration2[0]-1-duration[0]]);
				durationVisibleBlack[duration2[0]-duration[0]].x = redPanda.x;
				durationVisibleBlack[duration2[0]-duration[0]].y = redPanda.y+140;
				mainGame.addChild(durationVisibleBlack[duration2[0]-duration[0]]);

				duration[0]--;
				redPanda.y = 300 + 50*Math.sin(-duration[0]*25/180);
				redPanda.x = character.x + 50*Math.cos(-duration[0]*25/180);
				character.velocity.y = 0;
				character.y = -300;
			//	mainGame.addChild(character);
			}
			else{
				if(getBlackOrb){
					
					bgSpeed = PreSpeed;
					character.x=theCanvas.width*(1/100);
					mainGame.addChild(character);
					mainGame.removeChild(durationVisible[duration2[0]]);
					orbFlag=true;
					getBlackOrb=false;

					stopBoostSound();

					eraseAllEnemies();

					character.y=300;

					character.ableJump = 1;

				}
				duration[0]=duration2[0];
				redPanda.y = -300;
				getBlackOrb = false;
			}


			if(getBlueOrb&&duration[1]>0){
				if(duration[1]!=duration2[1])
					mainGame.removeChild(durationVisible[duration2[1]-1-duration[1]]);
				durationVisible[duration2[1]-duration[1]].x = character.x;
				durationVisible[duration2[1]-duration[1]].y = character.y+140;
				mainGame.addChild(durationVisible[duration2[1]-duration[1]]);
				duration[1]--;
			}
			else{
				if(getBlueOrb){
					orbFlag=true;
					mainGame.removeChild(durationVisible[duration2[1]]);
				}
				duration[1]=duration2[1];
				ggg=1;
				getBlueOrb = false;
			}

			if(getGreenOrb&&duration[2]>0){
				if(duration[2]!=duration2[2])
					mainGame.removeChild(durationVisibleGreen[duration2[2]-1-duration[2]]);
				durationVisibleGreen[duration2[2]-duration[2]].x = character.x;
				durationVisibleGreen[duration2[2]-duration[2]].y = character.y+140;
				mainGame.addChild(durationVisibleGreen[duration2[2]-duration[2]]);

				if(character.onGround){
					character.ableJump = 3;
					character.onGround = false;
				}

				duration[2]--;
			}
			else{
				if(getGreenOrb){
					orbFlag=true;
					mainGame.removeChild(durationVisibleGreen[duration[2]]);
					character.ableJump=2;
				}
				duration[2]=duration2[2];
				getGreenOrb = false;
			}

			if(getRedOrb&&duration[3]>0){
				if(duration[3]!=duration2[3])
					mainGame.removeChild(durationVisibleRed[duration2[3]-1-duration[3]]);
				durationVisibleRed[duration2[3]-duration[3]].x = character.x;
				durationVisibleRed[duration2[3]-duration[3]].y = character.y+140;
				mainGame.addChild(durationVisibleRed[duration2[3]-duration[3]]);

				duration[3]--;
			}
			else{
				if(getRedOrb){
					orbFlag=true;
					mainGame.removeChild(durationVisibleRed[duration[3]]);
					//move every visible enemy out of the screen

					eraseAllEnemies();

				}
				duration[3]=duration2[3];
				getRedOrb = false;
			}

			if(getStar&&duration[4]>0){
				if(barrierFlag==false){
					getStar=false;
					orbFlag=true;
				}
				if(duration[4]!=duration2[4])
					mainGame.removeChild(durationVisibleStar[duration2[4]-1-duration[4]]);
				durationVisibleStar[duration2[4]-duration[4]].x = character.x;
				durationVisibleStar[duration2[4]-duration[4]].y = character.y+140;
				if(getBlackOrb||getBlueOrb||getGreenOrb||getRedOrb)
					durationVisibleStar[duration2[4]-duration[4]].y = character.y+150;
				mainGame.addChild(durationVisibleStar[duration2[4]-duration[4]]);

				duration[4]--;
				barrierFlag=true;

			}
			else{
				if(getStar){
					orbFlag=true;
					mainGame.removeChild(durationVisibleStar[duration[4]]);
				}
				for(var i=0;i<duration[4];i++){
					mainGame.removeChild(durationVisibleStar[i]);
				}
				duration[4]=duration2[4];
				barrierFlag = false;
				getStar = false;
				mainGame.removeChild(barrier);
			}

			if(barrierFlag){
				mainGame.addChild(barrier)
				barrier.x = character.x;
				barrier.y = character.y;
			}

			//-kaetayo

			//animate character
			character.tick();

			// make the panda run faster according to score
			distanceScore += bgSpeed/100;

			//update GUI
			distanceText.text = distTextTemp+String(parseInt(distanceScore)+" METERS");
			killText.text = killTextTemp+String(parseInt(killScore))+" POINTS";

			//Speed up
			if(distanceScore > speedUp){
				distTextTemp = "SPEED UP!\n"
				bgSpeed += 0.05;
				var speedDiff = (bgSpeed-prevBgSpeed)
				if( speedDiff <= 1.01 && speedDiff >= 0.99){
					speedUp *= 2;
					prevBgSpeed = bgSpeed;
				}
			}else {
				distTextTemp = "SCORE\n"
			}			
		}else if(gameState === "gameover"){
			if(remSec > 0){
				remSec--;
			}else{
				mainGame.removeChild(character);
				character.y = 1000;
			}

			//move ready platform
			platform.x -= bgSpeed;
			platTop.x -= bgSpeed;

			//animate character
			character.tick();

			character.x -= bgSpeed;
			if(playOnceGO){
				playGameOverSound();
				character.gotoAndPlay("dead");
				playOnceGO = 0;
			}
			distanceText.text = "TRY AGAIN!\n"+String(parseInt(distanceScore)+" METERS");



			if(gameOverSec>0){
				gameOverSec--;
				fadeOut.alpha +=0.007;
			}else{
				//setAndInvokeHighScore(parseInt(distanceScore)+parseInt(killScore));
				var score = parseInt(distanceScore)+parseInt(killScore);
				angular.element(document.querySelector('#canvas-cont')).scope().openModal(score);
				titleGame();
			}
		}

		dragon.x -= bgSpeed;
		egyptee.x -= bgSpeed+egypteeSpeed;
		appleSlime.x -= bgSpeed+appleSlimeSpeed;
		headman.x -= bgSpeed+headmanSpeed;
		maguro.x -= bgSpeed+maguroSpeed;
		//Orb wo ugokasu.
		orb.x-=bgSpeed;

		// draw bounds - DEBUG
		// var cBD = maguro.getTransformedBounds();
		// charDebug.x=cBD.x;
		// charDebug.y=cBD.y;

		stage.update();
	}

	function eraseAllEnemies(){
		var enemyLeftEdge = canvasWidth+1000;

		maguro.x = getRand(enemyLeftEdge,3000);
		dragon.x = getRand(enemyLeftEdge,3000);
		appleSlime.x = getRand(enemyLeftEdge,3000);
		headman.x = getRand(enemyLeftEdge,3000);
		egyptee.x = getRand(enemyLeftEdge,3000);

		//in case if the animation didnt change
		if(maguro.currentAnimation==="dead")
			maguro.gotoAndPlay("walk");
		if(dragon.currentAnimation==="dead")
			dragon.gotoAndPlay("walk");
		if(appleSlime.currentAnimation==="dead")
			appleSlime.gotoAndPlay("walk");
		if(headman.currentAnimation==="dead")
			headman.gotoAndPlay("walk");
		if(egyptee.currentAnimation==="dead")
			egyptee.gotoAndPlay("walk");
	}

	function animateBackground(){
		//animate background
		bgMountain.x -= bgSpeed*0.2;
		bgMountainDup.x -= bgSpeed*0.2;
		if(parseInt(bgMountain.x) <= -1*bgMountainWidth)
			bgMountain.x = bgMountainDup.x+bgMountainWidth;
		if(parseInt(bgMountainDup.x) <= -1*bgMountainWidth)
			bgMountainDup.x = bgMountain.x+bgMountainWidth;

		bgTrees.x -= bgSpeed*0.9;
		bgTreesDup.x -= bgSpeed*0.9;
		if(bgTrees.x < -1*bgTreesWidth-5)
			bgTrees.x = bgTreesDup.x+bgTreesWidth;
		if(bgTreesDup.x < -1*bgTreesWidth-5)
			bgTreesDup.x = bgTrees.x+bgTreesWidth;

		bgRocks.x -= bgSpeed*0.3;
		bgRocksDup.x -= bgSpeed*0.3;
		if(bgRocks.x < -1*bgRocksWidth)
			bgRocks.x = bgRocksDup.x+bgRocksWidth;
		if(bgRocksDup.x < -1*bgRocksWidth-20)
			bgRocksDup.x = bgRocks.x+bgRocksWidth;

		//animate water
		water.y = (10*Math.sin(waveT));
		waveT+=(1.0/30);
	}

	//check possible user inputs
	if('ontouchstart' in document.documentElement) {
		theCanvas.addEventListener('touchstart', function(e) {
			handleKeyDown();
		}, false);

		theCanvas.addEventListener('touchend', function(e){
			handleKeyUp();
		}, false);
	} else {
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;
		theCanvas.onmousedown = handleKeyDown;
		theCanvas.onmouseup = handleKeyUp;
	}

	function handleKeyDown(e){
		//handle only if the game is not over
		if(gameState === "running")
			character.jump();

		// if(e.keyCode == 66)
		// 	aiueo=0;
		// if(e.keyCode == 67)
		// 	aiueo=1;
		// if(e.keyCode == 68)
		// 	aiueo=2;
		// if(e.keyCode == 69)
		// 	aiueo=3;
		// if(e.keyCode == 70)
		// 	aiueo=4;
	}

	function handleKeyUp(e){

	}

	//calculate collisions
	function calculateCollision(obj, direction, collideables, moveBy){
	    moveBy = moveBy || {x:0,y:0};
	    if ( direction != 'x' && direction != 'y' ) {
	    	direction = 'x';
	    }
	    var measure = direction == 'x' ? 'width' : 'height',
	        oppositeDirection = direction == 'x' ? 'y' : 'x',
	        oppositeMeasure = direction == 'x' ? 'height' : 'width',
	 
	        bounds = getBounds(obj),
	        cbounds,
	        collision = null,
	        cc = 0;

	    var prevBounds = null;

	    // modify bounds
		bounds.x += 40;
		bounds.width -=70;
		bounds.y += 20;
		bounds.height -= 20;

	    // for each collideable object we will calculate the
	    // bounding-rectangle and then check for an intersection
	    // of the hero's future position's bounding-rectangle
	    while ( !collision && cc < collideables.length ) {
	      	cbounds = collideables[cc].getTransformedBounds();

	      	if ( collideables[cc].isVisible ) {
	        	collision = calculateIntersection(bounds, cbounds, bgSpeed, moveBy.y, prevBounds);

	        	if(! collision){
	        		// previous bounds info for attack checking
	        		bounds.height = bounds.height != null ? bounds.height : 108; 
	    			prevBounds = bounds.y+bounds.height;
	 
	        	}
	        	//console.log("inside col"+collision);
	      	}
	 
	      	if ( !collision && collideables[cc].isVisible ) {
		        // if there was NO collision detected, but somehow
		        // the hero got onto the "other side" of an object (high velocity e.g.),
		        // then we will detect this here, and adjust the velocity according to
		        // it to prevent the Hero from "ghosting" through objects
		        // try messing with the 'this.velocity = {x:0,y:125};'
		        // -> it should still collide even with very high values
		        var wentThroughForwards  = ( bounds[direction] < cbounds[direction] && bounds[direction] + moveBy[direction] > cbounds[direction] ),
		          wentThroughBackwards = ( bounds[direction] > cbounds[direction] && bounds[direction] + moveBy[direction] < cbounds[direction] ),
		          withinOppositeBounds = !(bounds[oppositeDirection]+bounds[oppositeMeasure] < cbounds[oppositeDirection])
		                    && !(bounds[oppositeDirection] > cbounds[oppositeDirection]+cbounds[oppositeMeasure]);
	 
	        	if ( (wentThroughForwards || wentThroughBackwards) && withinOppositeBounds ) {
	         		moveBy[direction] = cbounds[direction] - bounds[direction];
	        	} else {
	          		cc++;
	        	}
	      	}
	    }

	    if ( collision ) {
	    	if(collideables[cc].name === "orb"){
	    		console.log("SHIITTTT = orb, " + orb.y + ", char = "+character.y);
	    		playGetItemSound();
				switch (itemSwitch){
				  case 0:
				    boost();
				    break;
				  case 1:
				  	gravity();
				    break;
				  case 2:
				  	tripleJump();
				    break;
				   case 3:
				   	killAll();
				   	break;
				   case 4:
				   	getBarrier();
				   	break;
				}

				collideables[cc].y = -100;

				collision.width = 0;
				collision.height = character.velocity.y;
				moveBy.y = character.velocity.y;

				return null;

	    	} else {
		    	//game over if collided with enemies or platform on x axis
		    	//console.log(collideables[cc].name);
		    	if(direction === "x" && (collideables[cc].name === "platform" || collideables[cc].name === "maguro")){
		    		if(barrierFlag && collideables[cc].name === "maguro"){
		    			collideables[cc].x = -1000;
		    			calculateKill(collideables[cc].name);
		    			barrierFlag = false;
		    			playDamageSound();

		    			return collision;
		    		}
		    		
		    		gameOverState();
		    	}else if(!(collideables[cc].name === "platform" && collideables[cc].name === "maguro") && enemiesList.indexOf(collideables[cc].name) > -1){
		    		// if it was an attack
		    		if(collision.status === "attack"){
		    			obj.velocity.y = -12;
		    			obj.ableJump = 1;
		    			collideables[cc].gotoAndPlay("dead");
		    			calculateKill(collideables[cc].name);
		    			collision = null;
		    			playDamageSound();
		    		}else if(barrierFlag){
		    			collideables[cc].x = -100;
		    			calculateKill(collideables[cc].name);
		    			barrierFlag = false;
		    			playDamageSound();
		    			return collision;
		    		}else{
		    			gameOverState();
		    		}
		    	}

			    var sign = Math.abs(moveBy[direction]) / moveBy[direction];
			    if(moveBy[direction]==0)
			    	sign = 1;
			    //console.log(collision[measure]+" "+sign+" "+moveBy[direction]);

			    moveBy[direction] -= collision[measure] * sign;
			    //console.log(collision[measure]+" "+sign+"="+moveBy[direction]);
			}
	    }
	 
	    return collision;

	    function moveChar(){

	    }
	}

	function gameOverState(){
		if(barrierFlag)
			barrierFlag=false;
		else
			gameState = "gameover";

	}

	//ORBS FUNCTIONS
	//kaetayo
	//blackOrb wo totta toki, kono function wo jikkou suru.
	function boost(){

		PreSpeed = bgSpeed;
		bgSpeed=30;
		playBoostSound();
		orb.y = -300;
		getBlackOrb = true;
		mainGame.removeChild(character);
		mainGame.removeChild(orb);
	}
	//gravity wo hikuku suru.
	function gravity(){
		getBlueOrb = true;
		ggg=1/2;
		mainGame.removeChild(orb);

	}
	//tripleJump wo tsukaeru you ni suru.
	function tripleJump(){
		getGreenOrb = true;
		mainGame.removeChild(orb);
	}

	//subete no teki wo korosu.
	function killAll(){
		getRedOrb = true;
		mainGame.removeChild(orb);
	}

	//Barrier wo haru.
	function getBarrier(){
		getStar = true;
		barrierFlag=true;
		mainGame.removeChild(orb);
	}

	//random de, orb wo hassei saseru.
	function orbs(){

		//kokode hassei kakuritsu wo chosei.
		var aiueo = getRand(0,5000);	

		if(aiueo<5&&orbFlag){
			orbFlag = false;
			if(aiueo>=0&&aiueo<1){
				orb.gotoAndPlay("blackOrb");	
				itemSwitch=0;
			}
			else if(aiueo>=1&&aiueo<2){
				orb.gotoAndPlay("blueOrb");
				itemSwitch=1;
			}
			else if(aiueo>=2&&aiueo<3){
				orb.gotoAndPlay("greenOrb");
				itemSwitch=2;
			}
			else if(aiueo>=3&&aiueo<4){
				orb.gotoAndPlay("redOrb");
				itemSwitch=3;
			}
			else if(aiueo>=4&&aiueo<5){
				orb.gotoAndPlay("star");
				itemSwitch=4;
			}

			orb.x=theCanvas.width+100;
			orb.y=getRand(150,380);
			mainGame.addChild(orb);

			//aiueo = 10;	//kaetayo
		}
	}
	//-kaetayo

	function calculateKill(enemyName){
		if(enemyName === "egyptee"){
			killScore += 3;
		} else if(enemyName === "appleslime"){
			killScore += 1;
		} else if(enemyName === "maguro"){
			killScore += 5;
		} else if(enemyName === "dragon"){
			killScore += 5;
		} else if(enemyName === "headman"){
			killScore += 2;
		}
	}
}

//debug rectangle
function debugRect(stage, object){
	//character bound space - DEBUG
	var charDebug = new createjs.Shape();
	charDebug.graphics.beginStroke("#000");
	charDebug.graphics.setStrokeStyle(1);
	charDebug.snapToPixel = true;
	var cBD = object.getTransformedBounds();
	charDebug.graphics.beginFill("#FFF").drawRect(0, 0, cBD.width, cBD.height);
	charDebug.x = cBD.x;
	charDebug.y = cBD.y;
	charDebug.alpha = 0.5;
	return charDebug
}

//calculate intersection between two rects
function calculateIntersection(rect1, rect2, bgSpeed, y, prevBounds){
	bgSpeed = bgSpeed || 0; y = y || 0;

	var dx, dy, r1={}, r2={};
	var r1w, r2w;
	var result = {width:0, height:0, status:"normal"};

	r1.cx = rect1.x + (r1.hw = (rect1.width/2));
	r1.cy = rect1.y + y + (r1.hh = (rect1.height/2));
	r2.cx = rect2.x - bgSpeed + (r2.hw = (rect2.width /2));
	r2.cy = rect2.y + (r2.hh = (rect2.height/2));

	dx = Math.abs(r1.cx-r2.cx) - (r1.hw + r2.hw);
	dy = Math.abs(r1.cy-r2.cy) - (r1.hh + r2.hh);

	r1w = rect1.y+rect1.height;
	r1w = rect2.y+rect2.height;

	result.width = -dx;
	result.height = -dy;

	if (dx < 0 && dy < 0){
		//if previous pos is higher than collided object's origin, it's an attack
		if(prevBounds < rect2.y && y>0)
			result.status = "attack";

		//if its impossible to get back up, don't change the y movement
		if(rect1.y > rect2.y ||
			(rect1.y < rect2.y && (r1w > rect2.y))){
			result.height = y;

			return result;
		}
		// still to be done
		// if(rect1.x < rect2.x && rect1.y > rect2.y)
		// 	return {width:-dx, height:y};
		return result;
	} else {
		return null;
	}
}

/*
 * Calculated the boundaries of an object.
 *
 * @method getBounds
 * @param {DisplayObject} the object to calculate the bounds from
 * @return {Rectangle} The rectangle describing the bounds of the object
 */
function getBounds(obj) {
  	var bounds={x:Infinity,y:Infinity,width:0,height:0};
  	if ( obj instanceof createjs.Container ) {
    	var children = obj.children, l=children.length, cbounds, c;
    	for ( c = 0; c < l; c++ ) {
      		cbounds = getBounds(children[c]);
      		if ( cbounds.x < bounds.x ) bounds.x = cbounds.x;
      		if ( cbounds.y < bounds.y ) bounds.y = cbounds.y;
      		if ( cbounds.width > bounds.width ) bounds.width = cbounds.width;
      		if ( cbounds.height > bounds.height ) bounds.height = cbounds.height;
   		}
  	} else {
    	var gp,gp2,gp3,gp4,imgr;
    	if ( obj instanceof createjs.Bitmap ) {
      		imgr = obj.image;
    	} else if ( obj instanceof createjs.Sprite ) {
      		if ( obj.spriteSheet._frames && obj.spriteSheet._frames[obj.currentFrame] && obj.spriteSheet._frames[obj.currentFrame].image )
        		imgr = obj.spriteSheet.getFrame(obj.currentFrame).rect;
      		else
        		return bounds;
    	} else {
      		return bounds;
    	}

	    gp = obj.localToGlobal(0,0);
	    gp2 = obj.localToGlobal(imgr.width,imgr.height);
	    gp3 = obj.localToGlobal(imgr.width,0);
	    gp4 = obj.localToGlobal(0,imgr.height);

	    bounds.x = Math.min(Math.min(Math.min(gp.x,gp2.x),gp3.x),gp4.x);
	    bounds.y = Math.min(Math.min(Math.min(gp.y,gp2.y),gp3.y),gp4.y);
	    bounds.width = Math.max(Math.max(Math.max(gp.x,gp2.x),gp3.x),gp4.x) - bounds.x;
	    bounds.height = Math.max(Math.max(Math.max(gp.y,gp2.y),gp3.y),gp4.y) - bounds.y;
  	}

  	return bounds;
}

// get random number from a range
function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



