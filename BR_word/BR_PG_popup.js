#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа 
 * @class PG_popup
 * @extends ObservablePopup
 */
class PG_popup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.statePath = `${this.rootPath}.work`;
        this.faultPath = `${this.rootPath}.Alm`;
        this.config.FracDigits = 2;
        this.shurpg = this.config.codes;
    }

    initialize() {
       title.access.setStringValue(accessData.stringValue(`${this.statePath}.Name_Object`), "Text"); 
        subtitle.access.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "Text"); 
        sensorname.access.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "Text"); 
    }

 
//#region PublishFunctions
  
    //#region object_Value
    publish_updateValue(object, bit) {
        if (!object.observerAction1) {
            object.observerAction1 = publisher.register([`${this.shurpg}.REM_CmdOnMb`
                                                    ], 
                (newValue) => {this.updateValue(newValue.value, `${this.shurpg}.REM_CmdOnMb`, this, object, bit)})
        }
        else {}
    }
      //#region object_TextState
        publish_updateTextState(object, bit) {
            if (!object.observerAction2) {
                object.observerAction2 = publisher.register([`${this.shurpg}.${bit}`
                                                        ], 
                    (newValue) => {this.updateTextState(newValue.value, newValue.tag, this, object, bit)})
            }
            else {}
        }
            //#region object_alarms
    publish_updateAlarms(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.${prefix}`
                                                    ],
                (newValue) => {this.updateAlarms(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
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

//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {
           title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            subtitle.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
           
        }
    }
    //вывод значения
    updateValue(value, path, context, object, bit) {
            if (getSignalQuality(path)) {
                if(value==0)
                {
                  RGBAColoring(object.off.indicator, colors.VLV.Fillstate.open, "FillColor");
                  RGBAColoring(object.man.indicator, colors.SERVICE.Flt.inact, "FillColor");
                  RGBAColoring(object.dist.indicator, colors.SERVICE.Flt.inact, "FillColor")
                }
                else if(value==1){
                    RGBAColoring(object.man.indicator, colors.VLV.Fillstate.open, "FillColor");
                    RGBAColoring(object.off.indicator, colors.SERVICE.Flt.inact, "FillColor");
                    RGBAColoring(object.dist.indicator, colors.SERVICE.Flt.inact, "FillColor")
                }
                    
                else if(value==2) {
                    RGBAColoring(object.dist.indicator, colors.VLV.Fillstate.open, "FillColor");
                    RGBAColoring(object.off.indicator, colors.SERVICE.Flt.inact, "FillColor");
                    RGBAColoring(object.man.indicator, colors.SERVICE.Flt.inact, "FillColor");
                }
               else{
                    RGBAColoring(object.off.indicator, colors.SERVICE.Flt.inact, "FillColor");
                    RGBAColoring(object.man.indicator, colors.SERVICE.Flt.inact, "FillColor");
                     RGBAColoring(object.dist.indicator, colors.SERVICE.Flt.inact, "FillColor")
               }
            }
            else {
                RGBAColoring(object.off.indicator, colors.SERVICE.Badqual.field, "FillColor");
                RGBAColoring(object.man.indicator, colors.SERVICE.Badqual.field, "FillColor");
                RGBAColoring(object.dist.indicator, colors.SERVICE.Badqual.field, "FillColor");
            }
    }
        //текстовое состояние параметра
        updateTextState(value, state, context, object, bit) {
           
            if (getSignalQuality(state)) {
               object.set.value.setStringValue(accessData.doubleValue(`${state}`), "Text");
                object.text.setStringValue(accessData.stringValue(`${state}.Description`).replace("Режим ДИСТ.",""), "Text");
            }
            else {
               object.text.setStringValue("???????????????", "Text");
                object.set.value.setStringValue("????", "Text");
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
    updateAlarms(value, flt, prefix, context, object) {
        if(getSignalQuality(this.statePath)) {
            if(accessData.boolValue(`${this.valuePath}.${prefix}`))
                RGBAColoring(object.indicator, this.DetColor(object,`${this.valuePath}.${prefix}`,context), "FillColor")
            else
                RGBAColoring(object.indicator, colors.SERVICE.Flt.inact, "FillColor")
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor");
            let des = prefix.replace("b03","")
            object.text.setStringValue(accessData.stringValue(`${this.valuePath}.${des}.Description`), "Text");
        }
        else {
            RGBAColoring(object.indicator, colors.SERVICE.Badqual.field, "FillColor")
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
        }
    }
    DetColor(object, bit, context) {
        let colorPath = accessData.doubleValue(`${bit}.Color`)
        let color;
        if (colorPath == 1)
            color = colors.SERVICE.Flt.actAlm;
        else if (colorPath == 2)
            color = colors.SERVICE.Flt.actWrn;
         else if (colorPath == 9)
            color = colors.VLV.Fillstate.open;
        else 
            color = colors.SERVICE.Flt.inact;
            return color;
    } 
    button(object, objectName, cm)
    {
        if(cm=='open'){
            if(accessData.stringValue(`${this.statePath}.ID`).includes("3.2"))
                runAccessBox(object, objectName + '.click', {codes: `codes.BR_Share.cmd.Cmd8`, inputTag: `KSPG.BR.Share`})
            else
                 runAccessBox(object, objectName + '.click', {codes: `codes.BR_Share.cmd.Cmd6`, inputTag: `KSPG.BR.Share`})
        }
        else
        {
             if(accessData.stringValue(`${this.statePath}.ID`).includes("3.2"))
                runAccessBox(object, objectName + '.click', {codes: `codes.BR_Share.cmd.Cmd9`, inputTag: `KSPG.BR.Share`})
            else
                 runAccessBox(object, objectName + '.click', {codes: `codes.BR_Share.cmd.Cmd7`, inputTag: `KSPG.BR.Share`})
        }
        
    }
}
    
    

