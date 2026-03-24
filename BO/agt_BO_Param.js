#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class AGTBOPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}.s11`;
        this.statePath = `${this.rootPath}.s12`;
        //this.config.qualityTag = `${this.config.rootPath}.state`;
        let descr = accessData.stringValue(`${this.rootPath}.s11.${this.config.bWork}.Description`).replace("в работе","Состояние насоса. БО")
        this.config.Title = descr
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.EUnit = accessData.stringValue(`${this.rootPath}.val.EUnit`);
        this.config.Code = `codes.BO_cmd.cmd`;
        // this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.FracDigits = 2;

    }

    initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
        this.cl1=0;
    }


    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.valuePath);
        let state2 = accessData.doubleValue(this.statePath);
        if ((state === null || state === undefined)) return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            b09       :   !!(state & 512),
            b10       :   !!(state & 1024),
            b11       :   !!(state & 2048),
            b12       :   !!(state & 4096),
            b04     :   !!(state2 & 16),
            b05      :   !!(state2 & 32),
            b06     :   !!(state2 & 64),
            b07      :   !!(state2 & 128)
        }
    }

    // /** Устанавливает биты/цвета аварий*/
     processFaultBits() {
 
        //Биты аварий
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            b09  :             colors.EO.State.off_front,
            b10  :             colors.AP.Flt.act,
            b11  :             colors.EO.State.off_front,
            b12  :             colors.AP.Flt.act,
            b04  :             colors.EO.State.off_front,
            b05  :             colors.EO.State.off_front,
            b06  :             colors.EO.State.off_front,
            b07  :             colors.EO.State.off_front,
        }
    }


//#region PublishFunctions
    //#region object_timestamp
    publish_updateTimeStamp(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath], 
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
    publish_updateElements(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.valuePath,
                                                        this.statePath
                                                    ],
                (newValue) => {this.updateElements(newValue.value, newValue.tag, this, object)})
            }
        else {}
    }
    //#endregion
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

    updateElements(value, flt, context, object) {
        if(getSignalQuality(`${this.valuePath}`) || getSignalQuality(`${this.statePath}`) ) {
            if(accessData.boolValue(`${this.valuePath}.${this.config.bAlarm}`)){
                RGBAColoring(object.circle, colors.VLV.Fillstate.avar, "FillColor")
            }
            else if(accessData.boolValue(`${this.valuePath}.${this.config.bWork}`))
                RGBAColoring(object.circle, colors.VLV.Fillstate.open, "FillColor")
            else{
                RGBAColoring(object.circle, colors.VLV.Fillstate.close, "FillColor")
            }
        }
        else {
            RGBAColoring(object.circle, colors.AP.Fillstate.field, "FillColor");
        }
    }
    //аварии
    updateAlarms(value, flt, context, object, num) {
        if(getSignalQuality(`${this.valuePath}`) || getSignalQuality(`${this.statePath}`) ) {
            let prefix
            if(num==1)
                prefix = this.config.bWork;
            else if(num==2)
                prefix = this.config.bAlarm;
            else if(num==3)
                prefix = this.config.bStart;   
            else if(num==4)
                prefix = this.config.bStop;
            let color = context.processFaultBits()
            let st = context.processStateBits();
            if(st[prefix]){
                RGBAColoring(object.indicator, color[prefix], "FillColor")
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                // object.text.setStringValue(accessData.stringValue(`${this.statePath}.${prefix}.Description`), "Text");
            }
            else{
                RGBAColoring(object.indicator, colors.AP.Flt.inact, "FillColor")
                // RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
            }
                
        }
        else {
            RGBAColoring(alarms.name, colors.SERVICE.Popup.headDEF, "FillColor")
            RGBAColoring(object.indicator, colors.SERVICE.Badqual.field, "FillColor")
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")

        }
    }
    button(object, objectName, st){
        if(getSignalQuality(this.valuePath) || getSignalQuality(this.statePath)){
            if(st=='on'){
                environment.logInfo(`${this.statePath}.${this.config.bStop}`);
                environment.logInfo(accessData.boolValue(`${this.statePath}.${this.config.bStop}`));
            if(accessData.boolValue(`${this.statePath}.${this.config.bStop}`)){
                environment.logInfo(`${this.statePath}.${this.config.bStop}`);
                RGBAColoring(object.field, colors.SERVICE.buttons.act, "FillColor")
                runAccessBox(object, objectName + '.click', {postfix:``, codes: `${this.config.Code}.${this.config.cmd_on}`, inputTag: `KSPG.BO.State.s6`});
            }
            else
                RGBAColoring(object.field, colors.SERVICE.buttons.inact, "FillColor")
        }
        else{
            if(accessData.boolValue(`${this.statePath}.${this.config.bStart}`)){
                RGBAColoring(object.field, colors.SERVICE.buttons.act, "FillColor")
                runAccessBox(object, objectName + '.click', {postfix:``, codes: `${this.config.Code}.${this.config.cmd_off}`, inputTag: `KSPG.BO.State.s6`})
            }
             else
                RGBAColoring(object.field, colors.SERVICE.buttons.inact, "FillColor")
        }
        }
        else
         RGBAColoring(object.field, colors.SERVICE.Badqual.field, "FillColor")
        
    }
    blockCmdBtn(value, state, blockCondition, context, object) {
            if (getSignalQuality(state)) {
                let status = context.processStateBits();
                let block = blockCondition.some(item => {
                                        const isNegated = item.startsWith('!');
                                        const key = isNegated ? item.slice(1) : item;
                                        const value = key in status ? status[key] : false;
                                        return isNegated ? !value : value;
                                        });
                if (!block) {
                    RGBAColoring(object.field, colors.SERVICE.buttons.act, "FillColor")
                }
                else {
                    RGBAColoring(object.field, colors.SERVICE.buttons.inact, "FillColor")
                }
            }
            else {
                RGBAColoring(object.field, colors.SERVICE.Badqual.field, "FillColor")
            }
        }

    SendTU(object, objectName, prefix){
            if (getSignalQuality(this.statePath)) {
                runAccessBox(object, objectName + '.click', {codes: `${this.config.Code}.cmd.${prefix}`, inputTag: this.rootPath})
            }
            else {
                clickClear(object, objectName + '.click')
            }
        }

    SendTU2(object, objectName, prefix, blockCondition = []){
            if (getSignalQuality(this.statePath)) {
                let status = this.processStateBits();
                let block = blockCondition.some(item => {
                                        const isNegated = item.startsWith('!');
                                        const key = isNegated ? item.slice(1) : item;
                                        const value = key in status ? status[key] : false;
                                        return isNegated ? !value : value;
                                        });
                if (!block) {
                    runAccessBox(object, objectName + '.click', {codes: `${this.config.code}.cmd.${prefix}`, inputTag: this.rootPath})
                }
                else {
                    clickClear(object, objectName + '.click')
                }
            }
            else {
                clickClear(object, objectName + '.click')
            }   
        }

    updateMsgState(value, state, context, object) {
        if (getSignalQuality(state)) {
            object.point.setVisible(!context.processStateBits().msgOff)
            RGBAColoring(object.back, colors.SERVICE.Goodqual.field, "FillColor")
        }
        else {
            object.point.setVisible(false);
            RGBAColoring(object.back, colors.SERVICE.Badqual.field, "FillColor")
        }
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
    
    

