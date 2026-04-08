import { sequencer } from "./sequencer.js";
import { channelController } from "./channelController.js";

// Timer zur Steuerung der Sequenzwiedergabe

export const timer = {
  _controllerElement: "", // play - stop button
  _state: false, // timer play state
  _bpm: 120,
  _intervalTime: 500,
  _timeout: false,
  _beatsPerBar: 4,

  set controller(value) {
    this._controllerElement = value;
  },

  get controller() {
    return this._controllerElement;
  },
  set bpm(value) {
    this._bpm = value;
    this._intervalTime = ((60 / value) * 1000) / this._beatsPerBar;
  },
  get state() {
    return this._state;
  },
  play: function () {
    clearInterval(this._timeout);
    this._state = true;
    this._timeout = setTimeout(() => {
      sequencer.currentStep = (sequencer.currentStep % sequencer._maxSteps) + 1;
      channelController.selectedStepInChannelsPlay();
      this.play();
    }, this._intervalTime);
  },
  stop: function () {
    if (this._state) {
      if (this._timeout) clearTimeout(this._timeout);
      this._state = false;

      const event = new CustomEvent("timerStopped");
      window.dispatchEvent(event);
    }
  },
};
