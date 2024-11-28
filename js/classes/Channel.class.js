import '../../modules/howler.min.js';

// Klasse zur Steuerung eines Soundkanals
// https://github.com/goldfire/howler.js?tab=readme-ov-file#examples


export class Channel{

    constructor(id, soundUrl){
        this.id = id;
        this.soundUrl = soundUrl;
        this.sound = null;
        this.isInitialized = false;
    }

    // Initialisiere den Sound mit Howler.js
    initSound() {
        this.sound = new Howl({
            src: [this.soundUrl],
            volume: 0.5,
            stereo: 0,
        });
    }

    // Spiele den Sound ab
    soundPlay() {
        if (!this.sound) this.initSound();
        this.sound.play();
    }
}