// Klasse zur Steuerung eines Drehreglers mit Maus-Ereignissen

export class RotaryControl {
    constructor({ element, callback, debug = false, rotationMin = -130, rotationMax = 130, valueMin = 0, valueMax = 1, rotationSensity = 2 }) {
        this.el = element;
        this.onChangeCallback = callback;
        this.debug = debug;

        // CSS-Rotationsbereich für den Regler
        this.rotationMin = rotationMin;
        this.rotationMax = rotationMax;

        // Wertebereich für die Funktionalität (z. B. Volume oder Panning)
        this.valueMin = valueMin;
        this.valueMax = valueMax;

        this.rotationSensity = -rotationSensity;
        this.normalizedValue = 0;
        this.newRotation = 0;

        this.pos = 0;
        this.currentRotation = 0;
        this.startY = null;

        // Event-Handler binden        
        this.mouseDownHandler = this.mouseDown.bind(this);
        this.mouseMoveHandler = this.mouseMove.bind(this);
        this.mouseUpHandler = this.mouseUp.bind(this);
        this.mouseOutHandler = this.mouseOut.bind(this);

        if(!this.el){
            console.log('RotaryControl needs a Dom Element');
            return;
        }

        // Initialisiere Event-Listener
        this.el.addEventListener('mouseover', this.mouseOver.bind(this));
        this.el.addEventListener('mouseout', this.mouseOutHandler);
        this.el.addEventListener('dblclick', this.resetRotation.bind(this));
    }

    mouseOver() {
        if (this.debug) console.log('mouseOver');
        this.el.addEventListener('mousedown', this.mouseDownHandler);
    }

    mouseOut() {
        this.el.removeEventListener('mousedown', this.mouseDownHandler);
    }

    mouseDown(ev) {
        if (this.debug) console.log('mousedown');
        this.startY = ev.screenY;

        // Aktuelle Rotation des Reglers aus dem CSS-Stil (wenn vorhanden)
        this.currentRotation = parseFloat(this.el.style.rotate) || 0;

        // Füge Mouse-Move- und Mouse-Up-Listener hinzu
        window.addEventListener('mousemove', this.mouseMoveHandler);
        window.addEventListener('mouseup', this.mouseUpHandler);
    }

    mouseMove(ev) {
        this.rotate(this.startY, ev.screenY);
    }

    mouseUp() {
        if (this.debug) console.log('mouseUp');
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        window.removeEventListener('mouseup', this.mouseUpHandler);
    }

    rotate(pointer, screenY) {
        // Berechnung der relativen Rotation basierend auf der Mausbewegung
        const delta = (screenY - pointer) * this.rotationSensity;
        this.newRotation = this.clamp(this.currentRotation + delta, this.rotationMin, this.rotationMax);

        if (this.debug) console.log('rotate() => CSS-Rotation:', this.newRotation);

        // Setze CSS-Rotation des Elements
        this.setElementRotation(this.newRotation)

        // Normalisiere die Rotation auf den Wertebereich (Volume oder Panning)
        const normalizedValue = Math.floor( this.mapRange(this.newRotation, this.rotationMin, this.rotationMax, this.valueMin, this.valueMax) *100 ) / 100;
        if (this.debug) console.log('Mapped Value:', normalizedValue);

        if (this.onChangeCallback) this.onChangeCallback(normalizedValue);
    }
        // Setzt auf den default zurück
    resetRotation() {
        this.normalizedValue = (this.valueMin + this.valueMax) / 2;
        this.newRotation = (this.rotationMin + this.rotationMax) / 2;
        this.setElementRotation(this.newRotation);
        if (this.onChangeCallback) this.onChangeCallback(this.normalizedValue);
    }

    mapRange(value, inMin, inMax, outMin, outMax) {
        // Mapping der Werte von CSS-Rotationsbereich auf den Zielbereich (z. B. Volume/Panning)
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    setElementRotation(rotation){
        this.el.style.rotate = `${rotation}deg`;
    }
}
