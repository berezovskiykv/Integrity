#INCLUDE "ObservablePopup.js"

#ONCE_EXECUTION_BEGIN
CompName = environment.readFile("/proc/sys/kernel/hostname", "").replace("\n","");

#ONCE_EXECUTION_END
/**
 * Класс окна подтверждения для алгоритмов кспг
 * @class acessBoxPopup
 * @extends ObservablePopup
 */
class algconfirmBoxPopupPump extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.initialize();
       // publisher.register([this.statePathPopup], (newValue) => {context.closePopup(newValue.value, newValue.quality, newValue.tag)})

    }

    initialize () {
        if(this.config.conf == 2) {
            let n = accessData.intValue(`${this.config.rootPath}.PopupNum`)
            message.setStringValue(wrapText(accessData.stringValue(`codes.ALGBHO.PopupNum.p${n}.Description`), 110), "Text");
             this.YESvalue = accessData.intValue(`${this.config.code}.Yes`);
             this.CANCELvalue = accessData.intValue(`${this.config.code}.Cancel`);
             no.setVisible(false);
             yes.button.setStringValue(accessData.stringValue(`${this.config.code}.Yes.Description`), "Text")
        }
        else if(this.config.conf == 4) {
            let n = accessData.intValue(`${this.config.rootPath}.PopupNum`)
            this.YESvalue = accessData.intValue(`${this.config.code}.Yes`);
            this.NOvalue = accessData.intValue(`${this.config.code}.${this.config.cmd2}`);
            no.button.setStringValue(accessData.stringValue(`${this.config.code}.${this.config.cmd2}.Description`), "Text")
            yes.button.setStringValue(accessData.stringValue(`${this.config.code}.Yes.Description`), "Text")
            this.CANCELvalue = accessData.intValue(`${this.config.code}.Cancel`);
            no.setVisible(true)
            message.setStringValue(wrapText(accessData.stringValue(`codes.ALGBHO.PopupNum.p${n}.Description`), 110), "Text");
        }
        else if(this.config.conf == 5) {
            let n = accessData.intValue(`${this.config.rootPath}.PopupNum`)
            this.YESvalue = accessData.intValue(`${this.config.code}.Yes`);
            this.CANCELvalue = accessData.intValue(`${this.config.code}.${this.config.cmd2}`);
            cancel.button.setStringValue(accessData.stringValue(`${this.config.code}.${this.config.cmd2}.Description`), "Text")
            yes.button.setStringValue(accessData.stringValue(`${this.config.code}.Yes.Description`), "Text")
            no.setVisible(false)
            message.setStringValue(wrapText(accessData.stringValue(`codes.ALGBHO.PopupNum.p${n}.Description`), 110), "Text");
        }
        else if(this.config.conf == 6) {
            let n = accessData.intValue(`${this.config.rootPath}.PopupNum`)
            this.YESvalue = accessData.intValue(`${this.config.code}.Yes`);
            yes.button.setStringValue(accessData.stringValue(`${this.config.code}.Yes.Description`), "Text")
            no.setVisible(false);
            cancel.setVisible(false)
            message.setStringValue(wrapText(accessData.stringValue(`codes.ALGBHO.PopupNum.p${n}.Description`), 110), "Text");
        }
        else if(this.config.conf == 7) {
            let n = accessData.intValue(`${this.config.rootPath}.PopupNum`)
            this.YESvalue = accessData.intValue(`${this.config.code}.Yes`);
            yes.button.setStringValue(accessData.stringValue(`${this.config.code}.Yes.Description`), "Text")
             this.CANCELvalue = accessData.intValue(`${this.config.code}.Cancel`);
            no.setVisible(false);
            cancel.setVisible(true)
        }
        else {
            this.YESvalue = accessData.intValue(`${this.config.code}.${this.config.cmd1}`);
            this.NOvalue = accessData.intValue(`${this.config.code}.${this.config.cmd2}`);
            this.CANCELvalue = accessData.intValue(`${this.config.code}.Cancel`);  
            no.setVisible(true)
            yes.button.setStringValue(accessData.stringValue(`${this.config.code}.${this.config.cmd1}.Description`), "Text")
            no.button.setStringValue(accessData.stringValue(`${this.config.code}.${this.config.cmd2}.Description`), "Text")

            message.setStringValue(wrapText(this.config.message, 110), "Text")
        }
         this.tag = `${this.rootPath}.cmd`;
       
    }

    buttonClick(object, objectName, val) {
        let mouseEvent;
        mouseEvent = clickRelease(object, objectName);
        if(mouseEvent.action == 'release') {
            accessData.setDoubleValue(val, this.tag);
            switch(val) {
                case (this.YESvalue):
                    this.alarm = `${this.config.alarm}. ${this.config.message} - Да/Подтверждено [${securityAgent.currentUserLogin()}/${CompName}]`
                    RGBAColoring(yes.button, colors.AP.SimCol_back.grayCol_back, "FillColor")
                    RGBAColoring(no.button, colors.SERVICE.buttons.act, "FillColor")
                     RGBAColoring(cancel.button, colors.SERVICE.buttons.act, "FillColor")
                    break;
                case (this.NOvalue):
                    this.alarm = `${this.config.alarm}. ${this.config.message} - Нет/Ввести вручную [${securityAgent.currentUserLogin()}/${CompName}]`
                    RGBAColoring(no.button, colors.AP.SimCol_back.grayCol_back, "FillColor")
                     RGBAColoring(yes.button, colors.SERVICE.buttons.act, "FillColor")
                     RGBAColoring(cancel.button, colors.SERVICE.buttons.act, "FillColor")
                    break;
                case (this.CANCELvalue):
                    this.alarm = `${this.config.alarm}. ${this.config.message} - Отмена [${securityAgent.currentUserLogin()}/${CompName}]`
                    RGBAColoring(cancel.button, colors.AP.SimCol_back.grayCol_back, "FillColor")
                     RGBAColoring(yes.button, colors.SERVICE.buttons.act, "FillColor")
                      RGBAColoring(no.button, colors.SERVICE.buttons.act, "FillColor")
                    break;
                default:
                    this.alarm = ''
                     RGBAColoring(object.button, colors.SERVICE.buttons.act, "FillColor")
                    break;
            }
            generateAlarms(this.alarm, 4);
            if(this.config.conf == 2 || this.config.conf == 4 || this.config.conf == 5 || this.config.conf == 6 || this.config.conf == 7)
                 diagram.close();
            
        }
    }

}