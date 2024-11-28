import { el, group, toggleClass, intInProzent } from './lib.js';
import { timer } from "../modules/timer.js";
import { sequencer } from "../modules/sequencer.js";
import { channelController } from './channelController.js';
import { RotaryControl } from '../js/classes/RotaryControl.class.js';
import { screen } from './screen.js';

// Initialisiere das Projekt und setze Event Listener

export async function init(){

    // ---------------------------------------------- //
    // Sound channels init - 8 channels
    // ---------------------------------------------- //

    channelController.init(); // load channel & Sounds

    // Kanäle und Steps initialisieren

    const channelsElement = group('#channels .channel')
    sequencer.stepNodes = group('#steps button');

    // Event-Listener für Kanalwechsel

    el('#channels').addEventListener('mousedown',(ev) => {

        if(!ev.target.closest('.channel')) return

        channelController.currentChannel = parseInt(ev.target.closest('.channel').getAttribute('data-id')) -1;

        if(ev.target.nodeName === 'BUTTON' && ev.target.classList.contains('channelNumber')){

            channelController.play();

        }
    })

    window.addEventListener('changeChannel', (e) => {
        const { currentChannel, lastCurrentChannel, stepStates } = e.detail;

        channelsElement[lastCurrentChannel].classList.remove('active');
        channelsElement[currentChannel].classList.add('active');

        sequencer.stepNodes.forEach((step, index) => {

            toggleClass(step,"selected", !!stepStates[channelController.currentChannel][index]);

        })
    })

    // Initialisiere Rotary Controls für Volume und Stereo

    channelsElement.forEach((channel, index) => {

        const volumeControl = new RotaryControl({
            element: channel.querySelector('.volume button'),
            callback: (value) => {
                channelController.volume = value
                screen.userInfromation = `${intInProzent(value)}% Vol. Ch.${channelController.currentChannel +1}`;
            },
            rotationMin: -130,
            rotationMax: 130,
            valueMin: 0,
            valueMax: 1
        });

        const panningControl = new RotaryControl({
            element: channel.querySelector('.panel button'),
            callback: (value) => {
                channelController.stereo = value
                screen.userInfromation = `${intInProzent(value)}% Stereo. Ch.${channelController.currentChannel +1}`;
            },
            rotationMin: -130,
            rotationMax: 130,
            valueMin: -1,
            valueMax: 1
        });
    })

    // ---------------------------------------------- //
    // Timer & Sequnzer init
    // ---------------------------------------------- //

    const controllerButton = el('#controller button');
    const bpmInput = el('#inputBpm');
    const parentStepsWrapper = el('#steps');

    timer.controller = controllerButton;    
    timer.bpm = parseInt(bpmInput.value);
    timer.controller.addEventListener('click', controllerToggleEvent);
    bpmInput.addEventListener('input', () => {
        timer.bpm = parseInt(bpmInput.value)
    })

    parentStepsWrapper.addEventListener('click', sequencerStepsEvent)

    // ---------------------------------------------- //
    // keyboard controlls

    window.addEventListener('keypress', (e) => {

        if(e.code === 'Space'){

            timer.controller.click();

        }
    })

    // ---------------------------------------------- //
    // double occupancy - keyboard using

    window.addEventListener('keydown', (e) => {
        if (e.code === 'ShiftLeft') {
            parentStepsWrapper.classList.add('keyPress');  

            if(timer.state){
                controllerToggleEvent();
            }
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (e.code === 'ShiftLeft') {
            parentStepsWrapper.classList.remove('keyPress');
        }
    });

    // ---------------------------------------------- //
    // dispatch Event for UI controll in main.js

    window.addEventListener("timerStopped", () => {
        
        if(sequencer.currentStep -1 > 0 && sequencer.currentStep -1 < sequencer.maxSteps){

            sequencer.stepNodes[sequencer.currentStep -1].classList.remove('play');
        }

        sequencer.resetCurrentStep();

    });

    window.addEventListener("stepChange", (e) => {
        const { newStep, stepStates } = e.detail;

        sequencer.stepNodes.forEach((step, index) => {
            toggleClass(step,"play", index === newStep - 1);
            toggleClass(step,"selected", !!stepStates[channelController.currentChannel][index]);
        });
    });
    
    // ---------------------------------------------- //
    // screen init

    screen.selectionElement = el('#userSelection');
    screen.infoElement = el('#userInformation');
    screen.userInfromation = `Init ready! Have fun ;)`;
}

// Play Stop Button toggle

function controllerToggleEvent() {

    if (!timer.state) {
        timer.play();
        timer.controller.className = 'stop';
    } else {
        timer.stop();
        timer.controller.className = 'play';
    }
}

// Sequencer Step ClickEvent

function sequencerStepsEvent(ev) {
    if (ev.target.nodeName === 'BUTTON') {
        const index = parseInt(ev.target.getAttribute('data-id')) - 1;
        if (isNaN(index) || index < 0) return;

        const channel = channelController.currentChannel;
        const state = sequencer.stepStates[channel][index] === 0 ? 1 : 0;
        sequencer.stepStates = {channel, index, state };
        toggleClass(ev.target,'selected', !!state);
    }
}