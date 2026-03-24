#INCLUDE "ObservablePopup.js"

/**
 * Класс окна ошибки
 * @class ErrorParameterPopup
 * @extends ObservablePopup
 */
class errorBoxPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        this.initialize();
    }

    initialize () {
         this.keys = {
            0x01000004: "ent", //return
            0x01000005: "ent", //enter
            0x00000020: "ent"  //space
            //0x01000000: "esc", //esc
            //0x00000060: "tab", // тильда
            //0x00000401: "tab" // ё
            //0x01000001: "tab" //tab
        }
        this.inputKey = 0;
        message.setStringValue(wrapText(this.config.message, 110), "Text")
    }

    buttonYes(object, objectName){
        let mouseEvent;

        if(this.keys[this.inputKey] == 'ent'){
            mouseEvent = clickRelease(object, objectName, true);
        }
        else{
            mouseEvent = clickRelease(object, objectName);
        }

        if (mouseEvent.action == 'release'){
            diagram.close();
        }
    }
}