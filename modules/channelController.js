import { loadData } from './lib.js';
import { Channel } from "../js/classes/Channel.class.js";
import { sequencer } from './sequencer.js';
import { screen } from './screen.js';

// Steuerung der Soundkanäle

export const channelController = {

    _maxChannels : 7,
    _channels : [],
    _soundData : {},
    _currentChannel : 0,
    _lastCurrentChannel : null,

    init : async function(){

        this._soundData = await loadData('./data/sounds.json');
        
        for(let i = 0; i <= this._maxChannels; i++ ){

            this._channels.push(new Channel( i + 1 , this._soundData[i].url));
        }
    },
    get channels(){
        return this._channels;
    },
    set volume(value){

        this._channels[this._currentChannel].initSound();
        this._channels[this._currentChannel].sound.volume(value);
    },
    set stereo(value){

        this._channels[this._currentChannel].initSound();
        this._channels[this._currentChannel].sound.stereo(value);
    },
    get currentChannel(){
        return this._currentChannel;
    },
    set currentChannel(newChannel){

        if(this._currentChannel === newChannel) return;

        this._lastCurrentChannel = this._currentChannel;
        this._currentChannel = newChannel;

        this.onChannelChange(newChannel);
    },
    onChannelChange : function(){

        screen.userInfromation = `${this.getSoundName()}`;

        const event = new CustomEvent("changeChannel", {
            detail: { currentChannel : this.currentChannel , lastCurrentChannel : this._lastCurrentChannel, stepStates : sequencer.stepStates }
        });
        window.dispatchEvent(event);
    },
    play : function(){
        this._channels[this._currentChannel].soundPlay();
    },
    selectedStepInChannelsPlay(){
        this._channels.forEach((channel, index) => {
            if(sequencer.stepStates[index][sequencer.currentStep-1]){
                channel.soundPlay();
            }
        })
    },
    getSoundName : function(){
        const soundName = this._channels[this._currentChannel].soundUrl.split('/')
        return soundName[1];
    }
}