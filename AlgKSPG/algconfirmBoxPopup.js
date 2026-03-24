#INCLUDE "ObservablePopup.js"

#ONCE_EXECUTION_BEGIN
CompName = environment.readFile("/proc/sys/kernel/hostname", "").replace("\n","");

#ONCE_EXECUTION_END
/**
 * Класс окна подтверждения для алгоритмов кспг
 * @class acessBoxPopup
 * @extends ObservablePopup
 */
class algconfirmBoxPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.initialize();
        publisher.register([this.statePathPopup], (newValue) => {context.closePopup(newValue.value, newValue.quality, newValue.tag)})

    }

    initialize () {
        this.statePathPopup = `${this.config.rootPath}.Status.Popup`
        // this.keys = {
        //     0x01000004: "ent", //return
        //     0x01000005: "ent", //enter
        //     0x00000020: "ent",  //space
        //     0x01000000: "esc" //esc
        //     //0x00000060: "tab", // тильда
        //     //0x00000401: "tab" // ё
        //     // 0x01000001: "tab" //tab
        // }
        // this.inputKey = 0;

        // myFocus = 1; //есть какой то прикол с переключением фокуса на кнопки по табу, пока не уловил суть

        this.YESvalue = accessData.intValue(`${this.config.code}.Yes`);
        this.NOvalue = accessData.intValue(`${this.config.code}.No`);
        this.CANCELvalue = accessData.intValue(`${this.config.code}.Cancel`);

        this.tag = `${this.rootPath}.cmd`;

        if(this.config.code.includes('ALGRUN') && Number(this.config.popup_num) > 2) {
            yes.button.setStringValue('Да', "Text")
            no.button.setStringValue('Нет', "Text")
        }
        else {
            yes.button.setStringValue('Подтверждаю', "Text")
            no.button.setStringValue('Не подтверждаю', "Text")
        }


        message.setStringValue(wrapText(this.config.message, 110), "Text")
    }

    buttonClick(object, objectName, val) {
        //let objFocus = 1;
        let mouseEvent;

        // if(this.keys[this.inputKey] == key /*&& this.myFocus == objFocus*/){
        //     mouseEvent = clickRelease(object, objectName, true);
        // }
        // else if(this.myFocus == objFocus){
        //     mouseEvent = clickRelease(object, objectName, false, false, true);
        // }
        //else{
            mouseEvent = clickRelease(object, objectName);
        //}
        
        if(mouseEvent.action == 'release') {
            accessData.setDoubleValue(val, this.tag);
            switch(val) {
                case (this.YESvalue):
                    this.alarm = `${this.config.alarm}. ${this.config.message} - Да/Подтверждено [${securityAgent.currentUserLogin()}/${CompName}]`
                    break;
                case (this.NOvalue):
                    this.alarm = `${this.config.alarm}. ${this.config.message} - Нет/Не подтверждено [${securityAgent.currentUserLogin()}/${CompName}]`
                    break;
                case (this.CANCELvalue):
                    this.alarm = `${this.config.alarm}. ${this.config.message} - Отмена [${securityAgent.currentUserLogin()}/${CompName}]`
                    break;
                default:
                    this.alarm = ''
                    break;
            }
            generateAlarms(this.alarm, 4);
            diagram.close();
        }
    }

    // buttonNo(object, objectName) {
    //    // let objFocus = 0;
    //     let mouseEvent;

    //     if(this.keys[this.inputKey] == 'esc' /*|| (this.keys[this.inputKey] == 'ent' && this.myFocus == objFocus)*/){
    //         mouseEvent = clickRelease(object, objectName, true);
    //     }
    //     // else if(this.myFocus == objFocus){
    //     //     mouseEvent = clickRelease(object, objectName, false, false, true);
    //     // }
    //     else{
    //         mouseEvent = clickRelease(object, objectName);
    //     }
        
    //     if(mouseEvent.action == 'release') {
    //         accessData.setDoubleValue(this.NOvalue, this.tag);
    //         generateAlarms(this.config.alarm, 4);
    //         diagram.close();
    //     }
    // }

    closePopup(value, quality, tag) {
        //LogData(value, 'closePopup_acb')
        
        if(!value || !quality) {
            diagram.close();
        }
    }
}