// init sound properties
var audioPath = "./assets/sounds/";
var soundGame = null;
var soundVol = 0.5;
var soundFX = soundVol * (0.8);

//sound variables
var bgmPlay = null, jumpSound = null, damageSound = null, boostSound = null, getItemSound = null, overSound = null;

// loading queue
var queueSound = new createjs.LoadQueue();

function loadMainAudio() {
	// createjs.Sound.alternateExtensions = ["mp3", ""];
	queueSound.installPlugin(createjs.Sound);
	queueSound.addEventListener("progress", getSoundsProgress);
	queueSound.addEventListener("complete", audioLoadComplete);
	queueSound.loadManifest([
		{ id: "BGM", src: audioPath + "HouseBGMLoop.ogg" },
		{ id: "BGMIntro", src: audioPath + "BGMIntro.ogg" },
		{ id: "forest", src: audioPath + "forestBGM.ogg" },
		{ id: "jump", src: audioPath + "jump.ogg" },
		{ id: "damage", src: audioPath + "damage.ogg" },
		{ id: "gameover", src: audioPath + "gameover.ogg" },
		{ id: "gettingitem", src: audioPath + "GettingItem.ogg" },
		{ id: "boost", src: audioPath + "boost.ogg" }
	]);
}

//check sound plugin
function checkSoundPlugin() {
	if (!createjs.Sound.initializeDefaultPlugins()) { return; }
}

// play BGM
function playBGMSound() {
	bgmPlay = createjs.Sound.play("BGMIntro", { loop: 0 });
	bgmPlay.volume = soundVol / 2;
	bgmPlay.on("complete", playBGMLoop);

}

function playBGMLoop() {
	bgmPlay = createjs.Sound.play("BGM", { loop: -1 });
	bgmPlay.volume = soundVol / 2;
}

// play Forest BGM
function playBGMForestSound() {
	bgmPlay = createjs.Sound.play("forest", { loop: -1 });
	bgmPlay.volume = soundVol / 2;
}

//play jump sound
function playJumpSound() {
	updateSoundFX();
	jumpSound = createjs.Sound.play("jump");
	jumpSound.volume = soundFX;
}

function playDamageSound() {
	updateSoundFX();
	damageSound = createjs.Sound.play("damage");
	damageSound.volume = soundFX;
}

function playBoostSound() {
	updateSoundFX();
	boostSound = createjs.Sound.play("boost", { loop: -1 });
	boostSound.volume = soundFX;
}

function stopBoostSound() {
	boostSound.stop();
}

function playGetItemSound() {
	updateSoundFX();
	getItemSound = createjs.Sound.play("gettingitem");
	getItemSound.volume = soundFX;
}

function playGameOverSound() {
	updateSoundFX();
	overSound = createjs.Sound.play("gameover");
	overSound.volume = soundFX;
}

function audioLoadComplete() {
	// loadAssetsCompleted();
}

function getSoundsProgress(progress) {
	console.log(progress.loaded);
	soundLoadProgress = Math.floor(progress.loaded * 100)
}

function updateSoundFX() {
	soundFX = soundVol * (0.8);
}