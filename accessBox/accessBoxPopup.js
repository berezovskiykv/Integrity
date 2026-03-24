#INCLUDE "ObservablePopup.js"

/**
 * Класс окна подтверждения
 * @class acessBoxPopup
 * @extends ObservablePopup
 */
class accessBoxPopup extends ObservablePopup {
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
            // 0x01000001: "tab" //tab
        }
        this.inputKey = 0;

        // myFocus = 1; //есть какой то прикол с переключением фокуса на кнопки по табу, пока не уловил суть

        this.value = this.config.value;
                //можно сделать подачу команды в несколько тегов
            // if(Value.split(';').length == 2){
            //     Value = Value.split(';');
            // }

        this.tag = this.rootPath;
            // if(tag.split(';').length == 2){
            //     tag = tag.split(';');
            // }

        this.Quit = (this.config.message.includes("закрыть приложение")) ? true : false
        message.access.setStringValue(/*wrapText(this.config.message, 110)*/this.config.message, "Text")
    }

    buttonYes(object, objectName) {
        //let objFocus = 1;
        let mouseEvent;

        if(this.keys[this.inputKey] == 'ent' /*&& this.myFocus == objFocus*/){
            mouseEvent = clickRelease(object, objectName, true);
        }
        // else if(this.myFocus == objFocus){
        //     mouseEvent = clickRelease(object, objectName, false, false, true);
        // }
        else{
            mouseEvent = clickRelease(object, objectName);
        }
        
        if(mouseEvent.action == 'release') {
            if(this.Quit) {
                environment.quit();
            }
            else { //
                // if(Array.isArray(Value)){
                //     for(let i=0; i < Value.length; i++){
                //         accessData.setDoubleValue(Value[i], tag[i]);
                //     }
                // }
                // else{
                    accessData.setDoubleValue(this.value, this.tag);
                }
                // }
            if (this.value == 15) {
                accessData.setBoolValue(true, 'HMIVariable.alarmsKvit.needKvit')
                accessData.setStringValue(this.config.filter, 'HMIVariable.alarmsKvit.msgFilter')
            }
            else {};
            if(this.tag.includes("GLOB_KVIT")){
                accessData.setBoolValue(true, 'HMIVariable.alarmsKvit.needGlobKvit');
                
            }
            // if(this.config.message.includes("Выбор первой очередености")){
            //     accessData.setBoolValue(true, 'HMIVariable.algbhio');
            // }
            // else if(this.config.message.includes("Выбор второй очередености")){
            //     accessData.setBoolValue(false, 'HMIVariable.algbhio');
            // }
            else {};
            generateAlarms(this.config.alarm, 4);
            diagram.close();
        }
    }

    buttonNo(object, objectName) {
       // let objFocus = 0;
        let mouseEvent;

        if(this.keys[this.inputKey] == 'esc' /*|| (this.keys[this.inputKey] == 'ent' && this.myFocus == objFocus)*/){
            mouseEvent = clickRelease(object, objectName, true);
        }
        // else if(this.myFocus == objFocus){
        //     mouseEvent = clickRelease(object, objectName, false, false, true);
        // }
        else{
            mouseEvent = clickRelease(object, objectName);
        }
        
        if(mouseEvent.action == 'release') {
            diagram.close();
        }
    }
}