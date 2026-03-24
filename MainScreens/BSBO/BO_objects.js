#INCLUDE "ObservableObject.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
active = true;
class DpBO extends ObservableObject {
    setupSignalPaths() {
        this.bOpen = this.config.bOpen;
        this.bClose = this.config.bClose;
        this.statePath = `${this.config.rootPath}`;
        this.openPath = `${this.statePath}.${this.bOpen}`;
        this.closePath = `${this.statePath}.${this.bClose}`;
        this.config.qualityTag = this.statePath;   
        this.config.popup = 'VLV_KSH';
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            open: accessData.boolValue(this.openPath),
            close: accessData.boolValue(this.closePath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.type, "ID2.Text");
        // this.object.setStringValue(accessData.stringValue(`${this.statePath}.${this.bit}.Description`), "desc.Text");
        // this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("????????", "ID2.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "left.FillColor");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "right.FillColor");
    }

    updateVisuals() {
        if(accessData.boolValue(this.openPath))
        {
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "right.FillColor");
        }
        else if (accessData.boolValue(this.closePath)){
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "right.FillColor");
        } 
        else {
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "left.FillColor");
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "right.FillColor");
        }
    }
    
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                   this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
                // this.checkForFlashing();
                return false;
            }
            else {
                clickClear(this.object, this.object.name + ".click")
                this.updateBadQuality()
                this.currentState = this.getInitialState()
            }
        }
        else return;
    }
        openPopup() {
        let mouseEvent = clickRelease(this.object, this.object.name + '.click');  
        
        if((this.config.rootPath).includes("KSPG.BO")){
            var on = 'Cmd1';
            var off = 'Cmd2';
        } else {
            var on = 'Cmd1';
            var off = 'Cmd0';
        }

        if(mouseEvent.action == 'click'){this.object.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: this.config.popup,
                posX: this.object.clickRespons['globalPosX'],
                posY: this.object.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
                bWork : this.bOpen,
                bAlarm : this.bClose,
                cmd_on: on,
                cmd_off: off,
                bStart : 'codes.BO.cmd',
                bStop : this.config.bStop
            });
        }
    }
}
    

class PumpBO extends ObservableObject {
    setupSignalPaths() {
        this.bWork = this.config.bWork;
        this.bAlarm = this.config.bAlarm;
        this.statePath = `${this.config.rootPath}.s11`;
        this.workPath = `${this.statePath}.${this.bWork}`;
        this.alarmPath = `${this.statePath}.${this.bAlarm}`;
        this.config.qualityTag = this.statePath;   
         this.config.popup = 'AGT_BO';
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            work: accessData.boolValue(this.workPath),
            alarm: accessData.boolValue(this.alarmPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.id, "ID.Text");
        // this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
   //     this.object.setStringValue("????????", "ID.Text");
    this.object.setStringValue(this.config.id, "ID.Text");
        RGBAColoring(this.object.circle, colors.AP.Fillstate.field, "FillColor");
        RGBAColoring(this.object.treangle, colors.AP.Fillstate.field, "FillColor");
    }

    updateVisuals() {
        if (accessData.boolValue(this.alarmPath)){
            RGBAColoring(this.object.circle, colors.VLV.Fillstate.avar, "FillColor");
           RGBAColoring(this.object.treangle, colors.VLV.Fillstate.avar, "FillColor");
        }
        else if(accessData.boolValue(this.workPath))
        {
            RGBAColoring(this.object.circle, colors.VLV.Fillstate.open, "FillColor");
            RGBAColoring(this.object.treangle, colors.VLV.Fillstate.open, "FillColor");
        }
        else {
            RGBAColoring(this.object.circle, colors.VLV.Fillstate.close, "FillColor");
            RGBAColoring(this.object.treangle, colors.VLV.Fillstate.close, "FillColor");
        }
       
    }
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        this.updateVisuals();
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                  this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
                // this.checkForFlashing();
                return false;
            }
            else {
                clickClear(this.object, this.object.name + ".click")
                this.updateBadQuality()
                this.currentState = this.getInitialState()
            }
        }
        else return;
    }
    openPopup() {
        let mouseEvent = clickRelease(this.object.param_1, this.object.name + '.click');  
        if(mouseEvent.action == 'click'){this.object.param_1.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: this.config.popup,
                posX: this.object.param_1.clickRespons['globalPosX'],
                posY: this.object.param_1.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
                inputTag2: this.config.rootPath,
                bWork : this.config.bWork,
                bAlarm : this.config.bAlarm,
                cmd_on: this.config.cmd_on,
                cmd_off: this.config.cmd_off,
                bStart : this.config.bStart,
                bStop : this.config.bStop
            });
        }
    }

}
class AnalogBO extends ObservableObject {
    setupSignalPaths() {
        if(this.config.type =='FT'){
            this.valuePath = `${this.config.rootPath}.mass`;
             this.config.ID = this.config.unit;
             this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.mass.EUnit`);
        }    
        else{
            this.valuePath = `${this.config.rootPath}.val`;
            this.config.ID = accessData.stringValue(`${this.config.rootPath}.val.ID`);
            this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.val.EUnit`);
        }
           
        this.statePath = `${this.config.rootPath}.state`;
        //this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.val.EUnit`);
       
        this.config.FracDigits = 2;
        this.config.qualityTag = this.valuePath;

    }

    	initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        if(this.config.type=='YS'|| this.config.type=='CK')
            this.config.popup = 'AP_BO_YS';
        else if(this.config.type=='FT')
            this.config.popup = 'AP_Drain'
        else
            this.config.popup = 'AP_BO';
        this.config.name = this.object.name;
        this.currentState = this.getInitialState();
        this.setupSignalPaths();
        this.copyState(this.currentState, this.previousState);
    }

    getInitialState() {
        var state = super.getInitialState();
        return state;
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
        };
        return newState;
    }


    updateText() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.EUnit, "VALUE.eUnit.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        //this.object.setStringValue("????????", "ID.Text");
          this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue("", "VALUE.eUnit.Text");
        this.object.setStringValue("", "VALUE.Value.Text");
        // this.object.setStringValue("", "AW_text.Text");
        this.object.setStringValue("", "click.Tooltip");
        this.changeColor(this.object.VALUE.state, colors.ElemAT.Fillstate.default, "FillColor");
        this.changeColor(this.object.STATE, colors.ElemAT.Fillstate.default, "FillColor");
          this.changeVisibility(this.object.off,false)
    }

    updateVisuals() {
        this.processStateBits();
        this.color = this.determineColor()
        this.changeValue(this.object.VALUE.Value, this.currentState.value);
        this.changeColor(this.object.VALUE.Value,    this.color.value_text, "TextColor");
         this.changeColor(this.object.VALUE.eUnit,    this.color.value_text, "TextColor");
        this.changeColor(this.object.VALUE.state,  this.color.value_state, "FillColor");
        this.changeVisibility(this.object.off, false)
    }
     checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
                return false;
            }
            else {
                clickClear(this.object, this.object.name + ".click")
                this.updateBadQuality()
                this.currentState = this.getInitialState()
            }
        }
        else return;
    }
    openPopup() {
        let mouseEvent = clickRelease(this.object, this.object.name + '.click');  
        if(mouseEvent.action == 'click'){this.object.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: this.config.popup,
                posX: this.object.clickRespons['globalPosX'],
                posY: this.object.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
                cmd_on: this.config.cmd_on,
                cmd_off: this.config.cmd_off,
                type : this.config.type
            });
        }
    }
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
 
    changeValue(child, parameter) {
        if (child) {
            child.access.setStringValue(parameter.toFixed(this.config.FracDigits), "Text");
        }
    }

  
    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }   
    changeText(object, value) {
            if (object) {
                object.access.setStringValue(value, "Text");
            }
        }

     processStateBits() {
        let state = this.currentState.state;
        // let fault = this.currentState.fault;
        if ((state === null || state === undefined)) return;

        this.state = {
            noerr     :   !!(state == 0),
            flt_1      :   !!(state == 1),
            flt_2      :   !!(state == 2),
            flt_3      :   !!(state == 3),
            off        :    !!(state == 4),
            mask        :   !!(state == 5)
        }
        
    }

    determineColor() {
        return {
            value_text
            : this.state.flt_1 || this.state.flt_2 ? colors.AP.SimCol.whiteCol
            : this.state.mask ? colors.AP.SimCol.blackCol
            : colors.AP.SimCol.blackCol,

            value_state
            : this.state.flt_1 || this.state.flt_2 ? colors.AP.SimCol.redCol
            : this.state.off || this.state.flt_3 || this.state.mask ? colors.AP.ScalePopup.Badqual
            : colors.AP.SimCol.greenCol,

            field_state
            : this.state.off ? colors.AP.SimCol.blackCol
            : colors.AP.SimCol.greenCol,
        }
    }


}
class AnalogBOalg extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.state`;
         this.statusPath = `${this.config.rootPath}.status`;
        this.faultPath = `${this.config.rootPath}.flt`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.qualityTag = `${this.config.rootPath}.state`;
        if(this.config.type=='CK')
            this.config.popup = 'AP_BO_algTT';
        else if(this.config.type=='FT')
            this.config.popup = 'AP_BO_algFT'
        else
             this.config.popup = 'AP_BO_alg'
        this.setpointPaths = {
            AH: this.config.rootPath + '.xa.set_AH_Lim',
            WH: this.config.rootPath + '.xa.set_WH_Lim',
            TH: this.config.rootPath + '.xa.set_TH_Lim',
            TL: this.config.rootPath + '.xa.set_TL_Lim',
            WL: this.config.rootPath + '.xa.set_WL_Lim',
            AL: this.config.rootPath + '.xa.set_AL_Lim'
        };
    }

    getInitialState() {
        return {
            quality: null,
            value: null,
            state: null,
            status: null,
            fault: null,
            timestamp: null
        };
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
             status: accessData.doubleValue(this.statusPath),
            fault: accessData.doubleValue(this.faultPath),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
            setpoints: this.readSetpoints()
        };
        return newState;
    }
    hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.status !== this.currentState.status ||
            newState.fault !== this.currentState.fault ||
            newState.priority !== this.currentState.priority ||
            newState.quality !== this.currentState.quality) {
            return true;
        }
        
        return false;
    }

    readSetpoints() {
        return {
            AH: accessData.doubleValue(this.setpointPaths.AH),
            WH: accessData.doubleValue(this.setpointPaths.WH),
            TH: accessData.doubleValue(this.setpointPaths.TH),
            TL: accessData.doubleValue(this.setpointPaths.TL),
            WL: accessData.doubleValue(this.setpointPaths.WL),
            AL: accessData.doubleValue(this.setpointPaths.AL)
        };
    }

    updateText() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.EUnit, "unit.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        //this.object.setStringValue("????????", "ID.Text");
        this.object.setStringValue("", "unit.Text");
        this.object.setStringValue("", "value.Text");
        this.object.setStringValue("", "AW_text.Text");
        this.object.setStringValue("", "click.Tooltip");
        this.changeVisibility(this.object.off);
        this.changeVisibility(this.object.hi);
        this.changeVisibility(this.object.lo);
        this.changeVisibility(this.object.test);
        this.changeVisibility(this.object.imit);
        this.changeColor(this.object.value_field, colors.ElemAT.Fillstate.default, "FillColor");
         this.changeColor(this.object.field, colors.ElemAT.Fillstate.default, "FillColor");
          this.changeColor(this.object.value_field, colors.ElemAT.Fillstate.default, "LineColor");
        // this.changeColor(this.object.VALUE.state, colors.AP.Fillvalue.norm, "FillColor");
        // this.changeColor(this.object.STATE, colors.AP.Fillstate.field, "FillColor");

    }

    updateVisuals() {

        this.processStateBits();
        this.color = this.determineColor()
        this.mode = this.determineMode();
        this.setpoint1 = this.determineSetpoint1();
        this.setpoint2 = this.determineSetpoint2();
        this.changeValue(this.object.value, this.currentState.value);
        this.changeText(this.object.AW_text, this.mode);
        this.changeText(this.object.lo.lo_Text, this.setpoint1);
        this.changeText(this.object.hi.hi_Text, this.setpoint2);
        this.changeVisibility(this.object.off, false);
        this.changeVisibility(this.object.imit, this.state.imit);
        this.changeVisibility(this.object.test, this.state.test);
        this.changeVisibility(this.object.AW, this.state.flt || this.state.bad);
        this.changeVisibility(this.object.lo, this.state.AL_Act || this.state.WL_Act);
        this.changeVisibility(this.object.hi, this.state.AH_Act || this.state.WH_Act);
        this.changeColor(this.object.AW,  this.color.AW_state, "FillColor");
        this.changeColor(this.object.AW,  this.color.AWback_state, "BackgroundColor");
        this.changeColor(this.object.AW_text,  this.color.AWstate_text, "TextColor");
        this.changeColor(this.object.value,    this.color.value_text, "TextColor");
        this.changeColor(this.object.value_field,  this.color.value_state, "FillColor");
        this.changeColor(this.object.hi.background,  this.color.hi_state, "FillColor");
        this.changeColor(this.object.hi.background,  this.color.hiback_state, "BackgroundColor");
        this.changeColor(this.object.lo.background,  this.color.lo_state, "FillColor");
        this.changeColor(this.object.lo.background,  this.color.loback_state, "BackgroundColor");
        this.changeColor(this.object.value_field,    this.color.field_state, "LineColor");
        this.changeColor(this.object.field, colors.AP.SimCol.whiteCol, "FillColor");
     
    }
    
    checkForFlashing() {
         if (this.state.kvit) {
            this.flashingColor(this.object.value_field, this.color.value_state, colors.AP.Fillvalue.kvit, "FillColor");

    }
}

    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
 
    changeValue(child, parameter) {
        if (child) {
            child.access.setStringValue(parameter.toFixed(this.config.FracDigits), "Text");
        }
    }

  
    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }


    flashingColor (child, color1, color2, property) {
        if (child) {
            flashing(child, color1, color2, property)
        }
    }

   
    changeText(object, value) {
            if (object) {
                object.access.setStringValue(value, "Text");
            }
        }

     processStateBits() {
        let state = this.currentState.state;
        let fault = this.currentState.fault;
         let status = this.currentState.status;
        if ((state === null || state === undefined) || (fault === null || fault === undefined)) return;

        this.state = {
            mask        :   (status == 5),
            noerr       :   (status == 0),
            break       :   (status == 1),
            kz          :   (status == 2),
            adcerr      :   (status == 3),
            off         :   (status == 4),
            field       :   !!(state & (S(`${this.config.code}.Status1.Field`))),
            imit        :   !!(state & (S(`${this.config.code}.Status1.Imit`))),
            msgOff      :   !!(state & (S(`${this.config.code}.Status1.MsgOff`))),
            bad         :   !!(state & (S(`${this.config.code}.Status1.Bad`))),
            test        :   !!(state & (S(`${this.config.code}.Status1.Test`))),
            norm        :   !!(state & (S(`${this.config.code}.Status1.Norm`))),
            kvit        :   !!(state & (S(`${this.config.code}.Status1.Kvit`))),
            AH_Act      :   !!(state & (S(`${this.config.code}.Status1.AH_Act`))),
            WH_Act      :   !!(state & (S(`${this.config.code}.Status1.WH_Act`))),
            WL_Act      :   !!(state & (S(`${this.config.code}.Status1.WL_Act`))),
            AL_Act      :   !!(state & (S(`${this.config.code}.Status1.AL_Act`))),
            flt         :   !!(S(`${this.config.rootPath}.flt`) > 0),
            ChFlt       :   !!(S(`${this.config.rootPath}.flt`) & (S(`${this.config.code}.Status2.ChFlt`))),
            modFlt      :   !!(S(`${this.config.rootPath}.flt`) & (S(`${this.config.code}.Status2.ModFlt`))),
            sensFlt     :   !!(S(`${this.config.rootPath}.flt`) & (S(`${this.config.code}.Status2.SensFlt`))),
            extFlt      :   !!(S(`${this.config.rootPath}.flt`) & (S(`${this.config.code}.Status2.ExtFlt`))),
            hme         :   !!(S(`${this.config.rootPath}.flt`) & (S(`${this.config.code}.Status2.HightMeasureErr`))),
            lme         :   !!(S(`${this.config.rootPath}.flt`) & (S(`${this.config.code}.Status2.LowMeasureErr`)))
        }
    }

    determineColor() {
        return {
            AW_state
            : this.state.flt ? colors.AP.SimCol.redCol
            : this.state.bad ? colors.AP.SimCol.blackCol
            : colors.AP.Fillstate.field,

            AWback_state
            : this.state.flt ? colors.AP.SimCol_back.redCol_back
            : this.state.bad ? colors.AP.SimCol_back.grayCol_back
            : colors.AP.Fillstate.field,

            AWstate_text
            : this.state.flt ? colors.AP.SimCol.whiteCol
            : this.state.bad ? colors.AP.SimCol.yellCol
            : colors.AP.Fillvalue.norm,

            value_text
            : this.state.flt ? colors.AP.SimCol.whiteCol
            : this.state.bad ? colors.AP.SimCol.yellCol
            : this.state.AH_Act || this.state.AL_Act || this.state.break || this.state.kz ? colors.AP.SimCol.whiteCol
            : this.state.WH_Act || this.state.WL_Act || this.state.adcerr || this.state.off ? colors.AP.SimCol.blackCol
            : this.state.mask ? colors.AP.SimCol.whiteCol
            : this.state.norm || this.state.noerr ? colors.AP.SimCol.blackCol
            : colors.AP.SimCol.blackCol,

            value_state
            : this.state.flt ? colors.AP.SimCol.redCol
            : this.state.bad ? colors.AP.SimCol.blackCol
            : this.state.AH_Act || this.state.AL_Act || this.state.break || this.state.kz ? colors.AP.SimCol.redCol
            : this.state.WH_Act || this.state.WL_Act || this.state.adcerr || this.state.off ? colors.AP.SimCol.yellCol
            : this.state.mask ? colors.AP.SimCol_back.grayCol_back
            : this.state.norm ? colors.AP.SimCol.greenCol
            : colors.AP.SimCol.greenCol,

            hi_state
            : this.state.bad ? colors.AP.SimCol.blackCol
            : this.state.AH_Act ? colors.AP.SimCol.redCol
            : this.state.WH_Act ? colors.AP.SimCol.yellCol
            : colors.AP.Fillstate.field,

            hiback_state
            : this.state.bad ? colors.AP.SimCol_back.grayCol_back
            : this.state.AH_Act ? colors.AP.SimCol_back.redCol_back
            : this.state.WH_Act ? colors.AP.Fillvalue.warn
            : colors.AP.Fillstate.field,

            lo_state
            : this.state.bad ? colors.AP.SimCol.blackCol
            : this.state.AL_Act ? colors.AP.SimCol.redCol
            : this.state.WL_Act ? colors.AP.Fillvalue.warn
            : colors.AP.Fillstate.field,

            loback_state
            : this.state.bad ? colors.AP.SimCol_back.grayCol_back
            : this.state.AL_Act ? colors.AP.SimCol_back.redCol_back
            : this.state.WL_Act ? colors.AP.Fillvalue.warn
            : colors.AP.Fillstate.field,

            field_state
            : this.state.bad ? colors.AP.SimCol.blackCol
            : this.state.AH_Act || this.state.AL_Act || this.state.break || this.state.kz ? colors.AP.SimCol.redCol
            : this.state.WH_Act || this.state.WL_Act || this.state.adcerr || this.state.off || this.state.mask ? colors.AP.ScalePopup.Badqual
            : this.state.norm || this.state.noerr ? colors.AP.SimCol.greenCol
            : colors.AP.SimCol.greenCol,
        }
    }

    determineMode() {
        return this.state.flt ? "A"
            : this.state.bad ? "S"
            : "";
    }

    determineSetpoint1() {
        return this.state.AL_Act ? "LL"
            : this.state.WL_Act ? "L"
            : "";
    }

    determineSetpoint2() {
        return this.state.AH_Act ? "HH"
            : this.state.WH_Act ? "H"
            : "";
    }
    openPopup() {
        let mouseEvent = clickRelease(this.object, this.object.name + '.click');  
        if(mouseEvent.action == 'click'){this.object.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: this.config.popup,
                posX: this.object.clickRespons['globalPosX'],
                posY: this.object.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
                cmd_on: this.config.cmd_on,
                cmd_off: this.config.cmd_off,
                type : this.config.type
            });
        }
    }

}
function dp_BO(object, bOpen, bClose, type, bStop) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DpBO(object, {bOpen : bOpen, bClose : bClose, type : type, bStop : bStop});
    }
    object.parameter.checkForUpdates();
}
function pump_B0(object, bWork, bAlarm, id, cmd_on, cmd_off, bStart, bStop) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new PumpBO(object, {bWork : bWork, bAlarm : bAlarm, id : id, cmd_on : cmd_on, cmd_off : cmd_off, bStart : bStart, bStop : bStop});
    }
    object.parameter.checkForUpdates();
}
function ap_BO(object, cmd_on, cmd_off, type, unit) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AnalogBO(object, {cmd_on : cmd_on, cmd_off : cmd_off, type : type,unit : unit});
    }
    object.parameter.checkForUpdates();
}


 function  buttonMode(object, objectName, cm, descr)
 {
   runAccessBox(object, objectName + '.click', {value: cm, postfix:`` , inputTag: `KSPG.CK.comReqMode`, desc: descr})
 }
 
function openPopupAlg(object,objectName) {
    let mouseEvent = clickRelease(object, objectName + '.click');  
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup(
            {
                alias: 'PumpAlg',
                popupName: 'BHOSpeedShipChoicePopup',
                posX: 800,
                posY: 400
            },
            {
                inputTag: 'KSPG.ALG.ALGBHO'
            });
        }
}
function algBoAP(object,cmd_on, cmd_off, type, unit) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AnalogBOalg(object, {cmd_on : cmd_on, cmd_off : cmd_off, type : type,unit : unit});
    }
    object.parameter.checkForUpdates();
}
