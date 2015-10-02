var Sound = function()
{
    // Create all the sound effects for the game manually
    this.deathSound = new Howl
    ({
        urls: ["sounds/death.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });
    this.enterSound = new Howl
    ({
        urls: ["sounds/enter.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });
    this.fallSound = new Howl
    ({
        urls: ["sounds/fall.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });
    this.longFallSound = new Howl
    ({
        urls: ["sounds/longfall.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });
    this.screamSound = new Howl
    ({
        urls: ["sounds/scream.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });
    this.selectSound = new Howl
    ({
        urls: ["sounds/select.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });
    this.shiftSound = new Howl
    ({
        urls: ["sounds/shift.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });

    this.stepSounds = [];
    this.stepSounds[0] = new Howl
    ({
        urls: ["sounds/step_0.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });
    this.stepSounds[1] = new Howl
    ({
        urls: ["sounds/step_1.wav"],
        volume: 1.0,
        autoplay: false,
        buffer: true
    });

    this.menuMusic = new Howl
    ({
        urls: ["sounds/music/menu.mp3"],
        volume: 1.0,
        autoplay: true,
        buffer: true,
        fadein: true,
        looped: true
    });
    this.gameMusic = new Howl
    ({
        urls: ["sounds/music/game.mp3"],
        volume: 1.0,
        autoplay: false,
        buffer: true,
        fadein: true,
        looped: true
    });

    // Set up step sound index
    this.stepSoundIndex = 0;
    this.stepSoundIndexMax = this.stepSounds.length;
}

Sound.prototype.playStepSound = function()
{
    this.stepSounds[this.stepSoundIndex].play();

    this.stepSoundIndex++;
    if (!(this.stepSoundIndex < this.stepSoundIndexMax)) this.stepSoundIndex = 0;

    console.log("New step sound index: " + this.stepSoundIndex);
}