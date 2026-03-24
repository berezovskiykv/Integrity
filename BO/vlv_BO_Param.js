#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class VLVBOPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.valuePath], (newValue) => {context.updatePopupText(newValue.quality, context.valuePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.statePath = `${this.rootPath}.s12`;
        //this.config.qualityTag = `${this.config.rootPath}.state`;
       
         if(accessData.stringValue(`${this.valuePath}.ID`).includes("КЛ")|| accessData.stringValue(`${this.valuePath}.ID`).includes("КПО")) {
            this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
            this.config.Title = accessData.stringValue(`${this.rootPath}.ID`)
            this.config.sensorname = accessData.stringValue(`${this.rootPath}.ID`)
         }
        else {
            this.config.Subtitle = accessData.stringValue(`${this.config.bStop}.Name_Object1`)
            this.config.Title = accessData.stringValue(`${this.config.bStop}.ID`)
             this.config.sensorname = accessData.stringValue(`${this.config.bStop}.ID`)
        } 
           
        this.config.EUnit = accessData.stringValue(`${this.rootPath}.val.EUnit`);
        this.config.Code = `codes.BO_cmd.cmd`;
        // this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.FracDigits = 2;

    }

    initialize() {
        title.access.setStringValue(this.config.Title, "Text");
       subtitle.access.setStringValue(this.config.Subtitle, "Text");
       sensorname.access.setStringValue(this.config.sensorname, "Text");
        this.cl1=0;
    }
//#region PublishFunctions
    //#region object_timestamp
    publish_updateTimeStamp(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.valuePath], 
                (newValue) => {this.updateTimeStamp(newValue.value, newValue.tag, this, object)})
        }
        else {}
    }

    //#endregion
    publish_updateCustomTag(object, tagSuffix) {
    if (!object.observerAction) {
        object.observerAction = publisher.register([`${this.rootPath}${tagSuffix}`], 
            (newValue) => {this.updateCustomTag(newValue.value, newValue.tag, this, object)}
        );
    }
}

    publish_blockCmdBtn(object, blockCondition = []) {  
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            this.faultPath
                                                        ],
                    (newValue) => {this.blockCmdBtn(newValue.value, newValue.tag, blockCondition, this, object)})
            }
            else {}
        }

    //#region object_alarms
    publish_updateAlarms(object, num) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.valuePath,
                                                        this.statePath
                                                    ],
                (newValue) => {this.updateAlarms(newValue.value, newValue.tag, this, object, num)})
            }
        else {}
    }
    //#endregion

    //#region object_msgOffBox
    publish_updateMsgState(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath
                                                    ],
                (newValue) => {this.updateMsgState(newValue.value, newValue.tag, this, object)})
            }
        else {}
    }

//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {
            
            title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            subtitle.access.setStringValue('????????????????????????????????????????????????????????', "Text");
        
        }
    }

    //метка времени
    updateTimeStamp(value, state, context, object) {
        if (getSignalQuality(state)) {
                let date = new Date(accessData.sourceTime(state));
                object.value.setStringValue(getDate(date), "Text");
            }
            else {
                object.value.setStringValue('??.??.???? ??:??', "Text");
        }
    }


    //аварии
    updateAlarms(value, flt, context, object, num) {
        if(getSignalQuality(`${this.valuePath}`)) {
            if(num==1){
                if(accessData.boolValue(`${this.valuePath}.${this.config.bWork}`)){
                RGBAColoring(alarm1.indicator, colors.VLV.Fillstate.open, "FillColor")
                RGBAColoring(alarm1.text, colors.SERVICE.Goodqual.text, "TextColor")
                // object.text.setStringValue(accessData.stringValue(`${this.statePath}.${prefix}.Description`), "Text");
            }
                else{
                RGBAColoring(alarm1.indicator, colors.AP.Flt.inact, "FillColor")
                // RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                }
            }
            else {
                let cond;
                if(accessData.stringValue(`${this.valuePath}.ID`).includes("КЛ")|| accessData.stringValue(`${this.valuePath}.ID`).includes("КПО"))
                {
                    cond=!accessData.boolValue(`${this.valuePath}.${this.config.bAlarm}`)
                }
                else
                    cond=accessData.boolValue(`${this.valuePath}.${this.config.bAlarm}`)
                if(cond){
                RGBAColoring(alarm3.indicator, colors.VLV.Fillstate.open, "FillColor")
                RGBAColoring(alarm3.text, colors.SERVICE.Goodqual.text, "TextColor")
                // object.text.setStringValue(accessData.stringValue(`${this.statePath}.${prefix}.Description`), "Text");
            }
                else{
                RGBAColoring(alarm3.indicator, colors.AP.Flt.inact, "FillColor")
                // RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                }
            }
                
        }
        else {
            RGBAColoring(alarm1.indicator, colors.SERVICE.Badqual.field, "FillColor")
            RGBAColoring(alarm1.text, colors.SERVICE.Badqual.text, "TextColor")
            RGBAColoring(alarm3.indicator, colors.SERVICE.Badqual.field, "FillColor")
            RGBAColoring(alarm3.text, colors.SERVICE.Badqual.text, "TextColor")

        }
    }
    button(object, objectName, st){
        if(getSignalQuality(this.valuePath) || getSignalQuality(this.statePath)){
            if(st=='on'){
                //RGBAColoring(object.field, colors.SERVICE.buttons.act, "FillColor")
                runAccessBox(object, objectName + '.click', {postfix: '',codes: `${this.config.bStart}.${this.config.cmd_on}`, inputTag: this.config.bStop});
        }
        else{
            //    RGBAColoring(object.field, colors.SERVICE.buttons.act, "FillColor")
                runAccessBox(object, objectName + '.click', {postfix: '',codes: `${this.config.bStart}.${this.config.cmd_off}`, inputTag: this.config.bStop})
        }
        }
        else
         RGBAColoring(object.field, colors.SERVICE.Badqual.field, "FillColor")
        
    }
   

updateCustomTag(value, path, context, object) {
    if (getSignalQuality(path)) {
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(value !== null ? value.toString() : "", "Text");
        } 
        else if (object.setStringValue) {
            object.setStringValue(value !== null ? value.toString() : "", "Text");
        }
    }
    else {
        }
}
//#endregion
}
    
    

