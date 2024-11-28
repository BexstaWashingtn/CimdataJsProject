// Klasse zur Steuerung der Benutzerinformationen

export const screen = {

    _selectionElement : null,
    _infoElement : null,
    _userInformation : '',
    _informationTimeout : null,
    _timeoutTime : 5000,
    _timeout : null,

    set selectionElement(element){
        this._selectionElement = element;
    },
    set infoElement(element){
        this._infoElement = element;
    },
    set userInfromation(value){
        this._userInformation = value;
        this._infoElement.innerText = value;
        this.onInformationTimeOut();
    },
    onInformationTimeOut : function(){
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = window.setTimeout(()=>{
            this._infoElement.innerText = '';
        }, this._timeoutTime)
    }

}