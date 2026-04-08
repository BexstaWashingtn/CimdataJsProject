// Sequencer zur Verwaltung der Schritte

export const sequencer = {
  _maxSteps: 16,
  _currentStep: 0,
  _stepNodes: [],
  _stepStates: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],

  set currentStep(value) {
    this._currentStep = value;
    this.onStepPlayStateChange(value);
  },
  onStepPlayStateChange(newStep) {
    if (newStep) {
      const event = new CustomEvent("stepChange", {
        detail: { newStep, stepStates: this._stepStates },
      });

      window.dispatchEvent(event);
    }
  },
  get currentStep() {
    return this._currentStep;
  },
  set stepNodes(value) {
    this._stepNodes = value;
  },
  get stepNodes() {
    return this._stepNodes;
  },
  set stepStates({ channel, index, state }) {
    this._stepStates[channel][index] = state;
  },
  get stepStates() {
    return this._stepStates;
  },
  get maxSteps() {
    return this._maxSteps;
  },
  resetCurrentStep() {
    this._currentStep = 0;
  },
};
