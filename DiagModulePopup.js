#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/colorSettings.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "ObservablePopup.js"

class DiagModulePopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')

    }

    setupSignalsPath() {
        this.statePath = `${this.rootPath}`;
        this.mstatusPath = `${this.rootPath}.MStatus`;
        this.TCPath = `${this.rootPath}.Status1`;
        this.config.Sensorname = accessData.stringValue(`${this.rootPath}.Sensor_Name`);
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.code =  'codes.DIAG';
        this.config.code2 = 'codes.DCPU';
        
            }

initialize() {
        head.title.setStringValue(accessData.stringValue(`${this.rootPath}.Description`), "Text");
        this.sw=1;
        this.count1=0;
         layer.setVisible("Channels2", false);
           layer.setVisible("Errors", false);
            layer.setVisible("Channels", true);
}

    readStatepoints() {
        let readSET = (name) => {
            return {
                value       : accessData.doubleValue(`${this.statePath}.${name}`),
                Desc        : accessData.stringValue(`${this.statePath}.${name}.Description`),
                Ch          : accessData.stringValue(`${this.statePath}.${name}.CompSignalID`),
                Clem        : accessData.stringValue(`${this.statePath}.${name}.Name_Object1`),
                Field       : accessData.stringValue(`${this.statePath}.${name}.Name_Object`),
                fracdigits  : accessData.intValue(`${this.statePath}.${name}.FracDigits`),
                eunit       : accessData.stringValue(`${this.statePath}.${name}.EUnit`),


            }
        }

     const result = {};
    for (let i = 1; i <= 64; i++) {
        result[`channel${i}`] = readSET(`channel${i}`);
    }
    return result;
    }

    processStateErr() {
        let mstatus = accessData.doubleValue(this.mstatusPath);
        if (mstatus === null || mstatus === undefined) return; 
        
        let defineCLR = (name, actCLR) => {
            let sts = !!(mstatus & accessData.intValue(`${this.config.code}.MStatus.${name}`))
            return { sts, clr: sts ? actCLR : colors.SERVICE.Flt.inact}
        }
 
        return {
            NoUpdate       :   defineCLR('NoUpdate', colors.SERVICE.Flt.actAlm),
            ErrMod         :   defineCLR('ErrMod', colors.SERVICE.Flt.actAlm),
            ErrSysID       :   defineCLR('ErrSysID', colors.SERVICE.Flt.actAlm),
            ErrProgID      :   defineCLR('ErrProgID', colors.SERVICE.Flt.actAlm),
            ErrNameMod     :   defineCLR('ErrNameMod', colors.SERVICE.Flt.actAlm),
            ErrNameSoft    :   defineCLR('ErrNameSoft', colors.SERVICE.Flt.actAlm),
            ErrVersion     :   defineCLR('ErrVersion', colors.SERVICE.Flt.actAlm),
            Res1           :   defineCLR('Res1', colors.SERVICE.Flt.actAlm),
            ErrIntRAM      :   defineCLR('ErrIntRAM', colors.SERVICE.Flt.actAlm),
            ErrExtRAM      :   defineCLR('ErrExtRAM', colors.SERVICE.Flt.actAlm),
            ErrFlash       :   defineCLR('ErrFlash', colors.SERVICE.Flt.actAlm),
            Err            :   defineCLR('Err', colors.SERVICE.Flt.actAlm),
            ErrConfig      :   defineCLR('ErrConfig', colors.SERVICE.Flt.actAlm),
            ErrRT          :   defineCLR('ErrRT', colors.SERVICE.Flt.actAlm),
            Res2           :   defineCLR('Res2', colors.SERVICE.Flt.actAlm),
            Res3           :   defineCLR('Res3', colors.SERVICE.Flt.actAlm),
            
        }
    }

    processStateTC() {
        let tc = accessData.doubleValue(this.TCPath);
        if (tc === null || tc === undefined) return; 
        
        let defineCLR = (name, actCLR) => {
            let sts = !!(tc & accessData.intValue(`${this.config.code2}.Status1.${name}`))
            return { sts, clr: sts ? actCLR : colors.SERVICE.Flt.inact}
        }
 
        return {
            Active         :   defineCLR('Active', colors.SERVICE.Flt.actAlm),
            NoUpdate       :   defineCLR('NoUpdate', colors.SERVICE.Flt.actAlm),
            ErrMod         :   defineCLR('ErrMod', colors.SERVICE.Flt.actAlm),
            ErrID          :   defineCLR('ErrID', colors.SERVICE.Flt.actAlm),
            ErrProgID      :   defineCLR('ErrProgID', colors.SERVICE.Flt.actAlm),
            ErrNameMod     :   defineCLR('ErrNameMod', colors.SERVICE.Flt.actAlm),
            ErrNameProg    :   defineCLR('ErrNameProg', colors.SERVICE.Flt.actAlm),
            ErrVer         :   defineCLR('ErrVer', colors.SERVICE.Flt.actAlm),
            Reserv         :   defineCLR('Reserv', colors.SERVICE.Flt.actAlm),
            FltIntRAM      :   defineCLR('FltIntRAM', colors.SERVICE.Flt.actAlm),
            FltExtRAM      :   defineCLR('FltExtRAM', colors.SERVICE.Flt.actAlm),
            FltFlash       :   defineCLR('FltFlash', colors.SERVICE.Flt.actAlm),
            FltKoef        :   defineCLR('FltKoef', colors.SERVICE.Flt.actAlm),
            ErrParam       :   defineCLR('ErrParam', colors.SERVICE.Flt.actAlm),
 
            
        }
    }
    
    processStateBits() {
    let defineCLR = (name, actCLR) => {
        let sts = accessData.boolValue(`${this.statePath}.${name}`)
        return { sts, clr: sts ? actCLR : colors.SERVICE.Flt.inact }
    }

    let result = {}
    for (let i = 1; i <= 64; i++) result[`channel${i}`] = defineCLR(`channel${i}`, colors.SERVICE.Flt.actinf)
    return result
            
}



    publish_updateChannelText(object, prefix) {
            if (!object.observerAction1) {
                object.observerAction1 = publisher.register([`${this.statePath}.${prefix}`
                                                        ], 
                    (newValue) => {this.updateChannelText(newValue.value, newValue.tag, prefix, this, object)})
                }
            else {}
        }
    
    publish_updateErrText(object, errn) {
            if (!object.observerAction1) {
                object.observerAction1 = publisher.register([this.mstatusPath], 
                    (newValue) => {this.updateErrText(newValue.quality, errn, this, object)})
                }
            else {}
        }
    publish_updateTCText(object, errn) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.TCPath], 
                    (newValue) => {this.updateTCText(newValue.quality, errn, this, object)})
                }
            else {}
        }

    publish_updateAlarmsChannel(object, prefix) {
    if (!object.observerAction) {
        object.observerAction = publisher.register([`${this.statePath}.${prefix}`],
            (newValue) => {this.updateAlarmsChannel(newValue.value, newValue.tag, prefix, this, object)})
    }
}
    publish_updateAlarms(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.mstatusPath}.${prefix}`
                                                    ],
                (newValue) => {this.updateAlarms(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }

    publish_updateTC(object, prefix) {
        if (!object.observerAction1) {
            object.observerAction1 = publisher.register([`${this.TCPath}.${prefix}`
                                                    ],
                (newValue) => {this.updateAlarmsTC(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }

    updateChannelText(value, state, prefix, context, object) {
    //if(getSignalQuality(state)) {
        let SET = context.readStatepoints();
        if(object.Value) {
            object.Value.setStringValue(SET[prefix].value.toFixed(3), "Text");
        }
        if(object.Desc) {
            object.Desc.setStringValue(SET[prefix].Desc, "Text");
        }
        if(object.Clem) {
            object.Clem.setStringValue(SET[prefix].Clem, "Text");
        }
        if(object.Field) {
            object.Field.setStringValue(SET[prefix].Field, "Text");
        }
        if(object.Ch) {
            object.Ch.setStringValue(SET[prefix].Ch, "Text");
        }
    //}
    else {

    }
}
    updateErrText(quality, errn, context, object) {
         if (quality) {
            object.ErrText.setStringValue(accessData.stringValue(`${this.statePath}.MStatus.${errn}.Description`), "Text");
         }
        else {
        }
    
    }

    updateTCText(quality, errn, context, object) {
         if (quality) {
            object.ErrText.setStringValue(accessData.stringValue(`${this.statePath}.Status1.${errn}.Description`), "Text");
         }
        else {
        }
    
    }

    updateAlarmsChannel(value, state, prefix, context, object) {
    if(getSignalQuality(state)) {
        let color = context.processStateBits()
        if (color && color[prefix]) {
            RGBAColoring(object.status, color[prefix].clr, "FillColor")
        } else {
            RGBAColoring(object.status, colors.SERVICE.Flt.inact, "FillColor")
        }
    }
    else {
        RGBAColoring(object.status, colors.SERVICE.Flt.inact, "FillColor")
    }
}
 
   updateAlarms(value, mstatus, prefix, context, object) {
        if(getSignalQuality(mstatus)) {
           let color = context.processStateErr()
           if (color && color[prefix]) {
            RGBAColoring(object.ErrBit, color[prefix].clr, "FillColor")
           } else {
            RGBAColoring(object.ErrBit, colors.SERVICE.Flt.inact, "FillColor")
        }
    }
        else {
            RGBAColoring(object.ErrBit, colors.SERVICE.Badqual.field, "FillColor")

        }
    }

    updateAlarmsTC(value, tc, prefix, context, object) {
        if(getSignalQuality(tc)) {
           let color = context.processStateTC()
           if (color && color[prefix]) {
            RGBAColoring(object.ErrBit, color[prefix].clr, "FillColor")
           } else {
            RGBAColoring(object.ErrBit, colors.SERVICE.Flt.inact, "FillColor")
        }
    }
        else {
            RGBAColoring(object.ErrBit, colors.SERVICE.Badqual.field, "FillColor")

        }
    }

    updatePopupText(value, state) {
            if (getSignalQuality(state)) {
                this.initialize();
            }
            else {
                head.title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            }
        }
    
button(object, objectName, layerName) {
    let mouseEvent;
    mouseEvent = clickRelease(object, objectName);
    let count = 0;
    
    if(mouseEvent.action == 'release') {
        layer.setVisible("Channels", false);
        layer.setVisible("Channels2", false);
        layer.setVisible("Errors", false);
        layer.setVisible(layerName, true);       
    }
    
    // Исправленная логика окрашивания кнопки
    if(layerName == 'Errors') {
        let hasError = false;
        
        // Получаем состояние всех ошибок
        let errorStates = this.processStateErr();
        
        // Проверяем, есть ли хотя бы одна активная ошибка
        if (errorStates) {
            for (let key in errorStates) {
                if (errorStates[key].sts) {
                    hasError = true;
                    break; // Достаточно одной ошибки
                }
            }
        }
        
        // Окрашиваем кнопку в зависимости от наличия ошибок
        if (hasError) {
            RGBAColoring(object.field, colors.DIAG.state.alm, "FillColor");
        } else {
            RGBAColoring(object.field, colors.DIAG.lines.buttonFill, "FillColor");
        }
    }
    
    if(layer.isVisible(layerName))  
        object.field.access.setIntegerValue(3, "LineWidth");
    else
        object.field.access.setIntegerValue(1, "LineWidth");    
}
}