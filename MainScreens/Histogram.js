#INCLUDE "ObservableObject.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"

class HistogramParameter extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.state`;
        this.faultPath = `${this.config.rootPath}.flt`;
        this.mskPath = `${this.rootPath}.msk_set`;
        this.config.qualityTag = `${this.config.rootPath}.state`;
        this.setpointPath = `${this.config.rootPath}.xa`;
    }

    getInitialState() {
        var state = super.getInitialState();
        state.setpoints = {
            AH: null, WH: null, TH: null,
            TL: null, WL: null, AL: null
        };
        return state;
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
            setpoints: this.readSetpoints()
        };
        return newState;
    }


    readSetpoints() {
        return {
            HighEngin: accessData.doubleValue(`${this.setpointPath}.wHighEngin`),
            AH: accessData.doubleValue(`${this.setpointPath}.set_AH_Lim`),
            WH: accessData.doubleValue(`${this.setpointPath}.set_WH_Lim`),
            WL: accessData.doubleValue(`${this.setpointPath}.set_WL_Lim`),
            AL: accessData.doubleValue(`${this.setpointPath}.set_AL_Lim`),
            LowEngin: accessData.doubleValue(`${this.setpointPath}.wLowEngin`),
            hyst: accessData.doubleValue(`${this.setpointPath}.hyst`),
            imit: accessData.doubleValue(`${this.setpointPath}.imit`)
        };
    }

    updateText() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.description + " (" + this.config.ID + ")", "Tooltip");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("", "Tooltip");
    }

    updateVisuals() {
        this.updateScaleValue();
        this.updateScaleColor();
    }

    //Изменение размера шкалы
    updateScaleValue(valuePath, statePath, object) {
        let SET = this.readSetpoints();
        let x;
        var scaleX = 100;
        var scaleY;
        if (getSignalQuality(this.valuePath) || getSignalQuality(this.statePath)) {            
            x = accessData.doubleValue(this.valuePath);
            scaleY = utils.rangeTransform(x, SET.LowEngin, SET.HighEngin, 0, 100);
        }
        else {
            x = SET.HighEngin;
            scaleY = utils.rangeTransform(x, SET.LowEngin, SET.HighEngin, 0, 100);
        }
        this.object.scaleLine.setScaleXY(scaleX, scaleY, 0);
    }
    
    //Цвет шкалы
    updateScaleColor(statePath, object){
        let color = this.determineColor(this.processStateBits());
        if (getSignalQuality(this.statePath)) {
            RGBAColoring(this.object.scaleLine, color.scale, "FillColor");
        }
        else {
            RGBAColoring(this.object.scaleLine, colors.AP.ScalePopup.Badqual, "FillColor");
        }
    }

    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
   
    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }

    checkForFlashing() {
//         if (this.state.kvit) {
//            this.flashingColor(this.object.value_field, this.color.value_state, colors.AP.Fillvalue.kvit, "FillColor");

//    }
}

     processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        let msk = accessData.doubleValue(this.mskPath);
        if ((state === null || state === undefined)  || (msk === null || msk === undefined))  return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            field       :   !!(!(state & (accessData.intValue(`${this.config.Code}.Status1.Disable`)))),
            mask        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Disable`))),
            imit        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Imit`))),
            msgOff      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.MsgOff`))),
            valueOff    :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.ValueOff`))),
            bad         :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Bad`))),
            test        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Test`))),
            kvit        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Kvit`))),
            fltkvit     :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.FltKvit`))),
            AH_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.AH_Act`))),
            WH_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.WH_Act`))),
            WL_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.WL_Act`))),
            AL_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.AL_Act`))),
            AH_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.AH_LimEn`))),
            WH_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.WH_LimEn`))),
            WL_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.WL_LimEn`))),
            AL_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.AL_LimEn`)))
        }
    }

    /**
     * Определяет цвет в зависимости от состояния
     * @returns {Object} Цвет в формате RGBA
     */
        determineColor(status) {
            return {
                scale 
                : status.bad ? colors.AP.ScalePopup.invalid
                : status.AH_Act || status.AL_Act ? colors.AP.ScalePopup.alarm
                : status.WH_Act || status.WL_Act ? colors.AP.ScalePopup.warn
                : colors.AP.ScalePopup.default
            }
        }

}

function histogram(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new HistogramParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
