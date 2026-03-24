#INCLUDE "ObservableObject.js"
#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "TS_avar.js"
// active = true;
class AnalogBR extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.State`;
        this.faultPath = `${this.config.rootPath}.flt`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.ID = accessData.stringValue(`${this.config.rootPath}.ID`);
        this.config.FracDigits = 2;
        this.config.qualityTag = `${this.config.rootPath}`;
    }

    	initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.popup = 'AP_BR';
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
        this.object.setStringValue(this.config.EUnit, "unit.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
    //    this.object.setStringValue("????????", "ID.Text");
     this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue("", "unit.Text");
        this.object.setStringValue("", "value.Text");
        this.object.setStringValue("", "AW_text.Text");
        this.object.setStringValue("", "click.Tooltip");
        this.changeVisibility(this.object.hi);
        this.changeVisibility(this.object.lo);
        this.changeVisibility(this.object.filter);
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
        this.changeVisibility(this.object.imit, this.state.imit);
        this.changeVisibility(this.object.filter, this.state.filt);
        this.changeVisibility(this.object.AW, this.state.flt_val || this.state.flt_ch || this.state.flt_ho || this.state.flt_lo || this.state.flt_calc || this.state.rep);
        this.changeVisibility(this.object.lo, this.state.LL_Act || this.state.L_Act);
        this.changeVisibility(this.object.hi, this.state.HH_Act || this.state.H_Act);
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
     checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                (this.config.pop) ? this.openPopup() : clickClear(this.object, this.object.name + ".click");
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
            flt_val     :   !!(state & 1),
            flt_ch      :   !!(state & 2),
            flt_ho      :   !!(state & 4),
            flt_lo      :   !!(state & 8),
            flt_calc    :   !!(state & 16),
            imit        :   !!(state & 32),
            LL_On      :   !!(state & 64),
            L_On       :   !!(state & 128),
            HH_On      :   !!(state & 256),
            H_On       :   !!(state & 512),
            filt        :   !!(state & 1024),
            setpoint    :   !!(state & 2048),
            rep         :   !!(state & 4096),
            HH_Act      :   !!((accessData.doubleValue(`${this.valuePath}.HH`)) <= (accessData.doubleValue(this.valuePath))), 
            H_Act      :   !!((accessData.doubleValue(`${this.valuePath}.H`)) <= (accessData.doubleValue(this.valuePath))),
            L_Act      :   !!((accessData.doubleValue(`${this.valuePath}.L`)) >= (accessData.doubleValue(this.valuePath))),
            LL_Act      :   !!((accessData.doubleValue(`${this.valuePath}.LL`)) >= (accessData.doubleValue(this.valuePath)))
        }
        
        // environment.logInfo("HH_Act " + this.state.HH_Act);
        // environment.logInfo("H_Act " + this.state.H_Act);
        // environment.logInfo("L_Act " + this.state.L_Act);
        // environment.logInfo("LL_Act " + this.state.LL_Act);
    }

    determineColor() {
        return {
            AW_state
            : this.state.flt_val || this.state.flt_ch || this.state.flt_ho || this.state.flt_lo || this.state.flt_calc ? colors.AP.SimCol.redCol
            : this.state.rep ? colors.AP.SimCol.yellCol
            : colors.AP.Fillstate.field,
            
            AWback_state
            : this.state.flt_val || this.state.flt_ch || this.state.flt_ho || this.state.flt_lo || this.state.flt_calc ? colors.AP.SimCol_back.redCol_back
            : this.state.rep ? colors.AP.SimCol_back.grayCol_back
            : colors.AP.Fillstate.field,

            AWstate_text
            : this.state.flt_val || this.state.flt_ch || this.state.flt_ho || this.state.flt_lo || this.state.flt_calc ? colors.AP.SimCol.whiteCol
            : this.state.bad ? colors.AP.SimCol.whiteCol
            : colors.AP.Fillvalue.norm,

            value_text
            : this.state.flt_val || this.state.flt_ch || this.state.flt_ho || this.state.flt_lo || this.state.flt_calc ? colors.AP.SimCol.whiteCol
            : this.state.rep ? colors.AP.SimCol.blackCol
            : this.state.HH_Act || this.state.LL_Act ? colors.AP.SimCol.whiteCol
            : this.state.H_Act || this.state.L_Act ? colors.AP.SimCol.blackCol
            : colors.AP.SimCol.blackCol,

            value_state
            : this.state.flt_val || this.state.flt_ch || this.state.flt_ho || this.state.flt_lo || this.state.flt_calc ? colors.AP.SimCol.redCol
            : this.state.rep ? colors.AP.SimCol.yellCol
            : this.state.HH_Act || this.state.LL_Act ? colors.AP.SimCol.redCol
            : this.state.H_Act || this.state.L_Act ? colors.AP.ScalePopup.warn
            : this.state.imit ? colors.AP.Fillstate.imit
            : colors.AP.SimCol.greenCol,

            hi_state
            : this.state.HH_Act ? colors.AP.SimCol.redCol
            : this.state.H_Act ? colors.AP.ScalePopup.warn
            : colors.AP.Fillstate.field,

            hiback_state
            : this.state.HH_Act ? colors.AP.SimCol_back.redCol_back
            : this.state.H_Act ? colors.AP.SimCol_back.peachCol_back
            : colors.AP.Fillstate.field,

            lo_state
            : this.state.LL_Act ? colors.AP.SimCol.redCol
            : this.state.L_Act ? colors.AP.ScalePopup.warn
            : colors.AP.Fillstate.field,

            loback_state
            : this.state.LL_Act ? colors.AP.SimCol_back.redCol_back
            : this.state.L_Act ? colors.AP.SimCol_back.peachCol_back
            : colors.AP.Fillstate.field,

            field_state
            : this.state.rep ? colors.AP.SimCol.blackCol
            : this.state.HH_Act || this.state.LL_Act ? colors.AP.SimCol.redCol
            : this.state.H_Act || this.state.L_Act ? colors.AP.ScalePopup.warn
            : colors.AP.SimCol.greenCol,
        }
    }

    determineMode() {
        return this.state.flt_val || this.state.flt_ch || this.state.flt_ho || this.state.flt_lo || this.state.flt_calc ? "A"
            : this.state.rep ? "P"
            : "";
    }

    determineSetpoint1() {
        return this.state.LL_Act ? "LL"
            : this.state.L_Act ? "L"
            : "";
    }

    determineSetpoint2() {
        return this.state.HH_Act ? "HH"
            : this.state.H_Act ? "H"
            : "";
    }


}

class vlvBR extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.State`;
        this.config.ID = accessData.stringValue(`${this.config.rootPath}.State.ID`);
        this.config.qualityTag = this.statePath;
    }

    	initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.popup = 'VLV_BR';
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
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
     //   this.object.setStringValue("????????", "ID.Text");
      this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue("", "click.Tooltip");
        // this.changeColor(this.object.VALUE.state, colors.AP.Fillvalue.norm, "FillColor");
        // this.changeColor(this.object.STATE, colors.AP.Fillstate.field, "FillColor");

    }

    updateVisuals() {
        this.processStateBits();
        this.color = this.determineColor()
        this.mode = this.determineMode();
        this.changeVisibility(this.object.off, this.state.rep);
        this.changeVisibility(this.object.alm, this.state.flt);
        this.changeVisibility(this.object.imit, this.state.imit_on);
        this.changeVisibility(this.object.block, this.state.stop);
        this.changeVisibility(this.object.local, this.state.local);
        this.changeVisibility(this.object.auto, this.state.auto); 
        this.changeColor(this.object.body.treangle1,  this.color.value_state1, "FillColor");
        this.changeColor(this.object.body.treangle2,  this.color.value_state2, "FillColor");
        this.changeColor(this.object.body.treangle1,  this.color.value_state1, "BackgroundColor");
        this.changeColor(this.object.body.treangle2,  this.color.value_state2, "BackgroundColor");
    }
     checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                (this.config.pop) ? this.openPopup() : clickClear(this.object, this.object.name + ".click");
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
            reset     :   !!(state & 1),
            open      :   !!(state & 2),
            close     :   !!(state & 4),
            stop      :   !!(state & 8),
            imit_on   :   !!(state & 16),
            imit_off  :   !!(state & 32),
            flt       :   !!(state & 64),
            auto      :   !!(state & 128),
            local     :   !!(state & 256),
            rep       :   !!(state & 512),
            allow_set :   !!(state & 1024),
            apply_set :   !!(state & 2048),
            off_set   :   !!(state & 4096),
        }
        
    }

    determineColor() {
        return {
            text_state
            : this.state.flt ? colors.VLVP.SimCol.whiteCol
            : colors.VLVP.treanglestate1.field,

            value_state1
            : this.state.close ? colors.VLVP.treanglestate1.close
            : (!this.state.close && !this.state.open) ? colors.VLVP.treanglestate1.middle
            : this.state.open ? colors.VLVP.treanglestate1.open
            : this.state.flt ? colors.VLVP.treanglestate1.err
            : colors.VLVP.treanglestate1.field,

            value_state1_back
            : this.state.close ? colors.VLVP.treanglestate1_back.close
            : (!this.state.close && !this.state.open) ? colors.VLVP.treanglestate1_back.middle
            : this.state.open ? colors.VLVP.treanglestate1_back.open
            : this.state.flt ? colors.VLVP.treanglestate1_back.err
            : colors.VLVP.treanglestate1_back.field,

            value_state2
            : this.state.close ? colors.VLVP.treanglestate2.close
            : (!this.state.close && !this.state.open) ? colors.VLVP.treanglestate2.middle
            : this.state.open ? colors.VLVP.treanglestate2.open
            : this.state.flt ? colors.VLVP.treanglestate2.err
            : colors.VLVP.treanglestate2.field,

            value_state2_back
            : this.state.close ? colors.VLVP.treanglestate2_back.close
            : (!this.state.close && !this.state.open) ? colors.VLVP.treanglestate2_back.middle
            : this.state.open ? colors.VLVP.treanglestate2_back.open
            : this.state.flt ? colors.VLVP.treanglestate2_back.err
            : colors.VLVP.treanglestate2_back.field,

        }
    }

    determineMode() {
        return this.state.auto ? "A"
            : this.state.rep ? "Pем"
            : this.state.local ? "P"
            : "";
    }
}

class DpBR extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.faultPath = `KSPG.BR.PE4.Close`;
        this.config.qualityTag = this.statePath;
        this.bit = this.config.bit;
        this.config.popup = 'BR_AGT';
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.${this.bit}.Description`), "desc.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
    //    this.object.setStringValue("????????", "ID.Text");
     this.object.setStringValue(this.config.ID, "ID.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "left.FillColor");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "right.FillColor");
    }

    updateVisuals() {
         if(this.config.type=='pe'){
            if(accessData.boolValue(`${this.statePath}.${this.bit}`)){
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "right.FillColor");
            }
            else if(accessData.boolValue(`${this.faultPath}.${this.bit}`)){
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "right.FillColor");
            }
            else {
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "left.FillColor");
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "right.FillColor");
            }
         }
         else {
 
        if(accessData.boolValue(`${this.statePath}.${this.bit}`))
        {
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "right.FillColor");
        }
        else{
             RGBAColoring(this.object, colors.VLV.Fillstate.close, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "right.FillColor");
        }
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
}

class DpBR2 extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.faultPath = `KSPG.BR.PE4.Close`;
        this.config.qualityTag = this.statePath;
        this.bit = this.config.bit;
        this.config.popup = 'VLV_KSH';
        
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.${this.bit}.Description`), "desc.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
      //  this.object.setStringValue("????????", "ID.Text");
       this.object.setStringValue(this.config.ID, "ID.Text");  
      RGBAColoring(this.object, colors.AP.Fillstate.field, "left.FillColor");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "right.FillColor");
    }

    updateVisuals() {
         if(this.config.type=='pe'){
            if(accessData.boolValue(`${this.statePath}.${this.bit}`)){
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "right.FillColor");
            }
            else if(accessData.boolValue(`${this.faultPath}.${this.bit}`)){
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "right.FillColor");
            }
            else {
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "left.FillColor");
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "right.FillColor");
            }
         }
         else {
 
        if(accessData.boolValue(`${this.statePath}.${this.bit}`))
        {
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "right.FillColor");
        }
        else{
             RGBAColoring(this.object, colors.VLV.Fillstate.close, "left.FillColor");
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "right.FillColor");
        }
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
                bWork : this.bit,
                bAlarm : this.bit,
                cmd_on: this.config.cmd_on,
                cmd_off: this.config.cmd_off,
                bStart : this.config.bStart,
                bStop : this.config.bStop
            });
        }
    }
}

class VentBR extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;
        this.bit = this.config.bit;
        this.alm = "KSPG.BR." + this.config.alm;
        this.faultPath = this.alm;

    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        //this.object.setStringValue("????????", "ID.Text");
         this.object.setStringValue(this.config.ID, "ID.Text");
        RGBAColoring(this.object.body, colors.AP.Fillstate.field, "FillColor");
        RGBAColoring(this.object.body2, colors.AP.Fillstate.field, "FillColor");
    }

    updateVisuals() {
        if(accessData.boolValue(`${this.statePath}.${this.bit}`))
        {
            RGBAColoring(this.object.body, colors.VLV.Fillstate.open, "FillColor");
            RGBAColoring(this.object.body2, colors.VLV.Fillstate.open, "FillColor");
        }
        else if (accessData.boolValue(`${this.alm}.${this.bit}`)){
             RGBAColoring(this.object.body, colors.VLV.Fillstate.avar, "FillColor");
            RGBAColoring(this.object.body2, colors.VLV.Fillstate.avar, "FillColor");
        }
        else {
            RGBAColoring(this.object.body, colors.VLV.Fillstate.close, "FillColor");
            RGBAColoring(this.object.body2, colors.VLV.Fillstate.close, "FillColor");
        }
       
    }
 checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
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
}
class PG extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}.work`;
        this.config.qualityTag = this.statePath;
        this.bit = this.config.bit;
        this.faultPath = `${this.config.rootPath}.Alm`;
        this.config.code = this.config.shupg;
        this.config.popup = 'BR_PG';
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
      //  this.object.setStringValue("????????", "ID.Text");
       this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        RGBAColoring(this.object.vlv.left, colors.AP.Fillstate.field, "FillColor");
        RGBAColoring(this.object.vlv.right, colors.AP.Fillstate.field, "FillColor");
    }

    updateVisuals() {
        if(accessData.boolValue(`${this.statePath}.${this.bit}`))
        {
            RGBAColoring(this.object.vlv.left, colors.VLV.Fillstate.open, "FillColor");
            RGBAColoring(this.object.vlv.right, colors.VLV.Fillstate.open, "FillColor");
        }
        else if (accessData.boolValue(`${this.faultPath}.${this.bit}`)){
             RGBAColoring(this.object.vlv.left, colors.VLV.Fillstate.avar, "FillColor");
            RGBAColoring(this.object.vlv.right, colors.VLV.Fillstate.avar, "FillColor");
        }
        else {
            RGBAColoring(this.object.vlv.right, colors.VLV.Fillstate.close, "FillColor");
            RGBAColoring(this.object.vlv.left, colors.VLV.Fillstate.close, "FillColor");
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
}
class Stage_K extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {

        return true;
    }

    updateBadQuality(){
      //  this.object.setStringValue("????????", "ID.Text");

    }

    updateVisuals() {
        if(accessData.doubleValue(this.statePath)==0){
            num_k31.Rec.access.setIntegerValue(3,"LineWidth");
            RGBAColoring(num_k31.Rec, colors.VLV.Fillstate.open, "LineColor")
            num_k32.Rec.access.setIntegerValue(1,"LineWidth")
            num_k33.Rec.access.setIntegerValue(1,"LineWidth")
            RGBAColoring(num_k33.Rec, colors.AP.Text.alarm, "LineColor")
            RGBAColoring(num_k32.Rec, colors.AP.Text.alarm, "LineColor")
        }
        else if (accessData.doubleValue(this.statePath)==1){
            num_k32.Rec.access.setIntegerValue(3,"LineWidth");
            RGBAColoring(num_k32.Rec, colors.VLV.Fillstate.open, "LineColor")
            num_k31.Rec.access.setIntegerValue(1,"LineWidth")
            num_k33.Rec.access.setIntegerValue(1,"LineWidth")
            RGBAColoring(num_k31.Rec, colors.AP.Text.alarm, "LineColor")
            RGBAColoring(num_k33.Rec, colors.AP.Text.alarm, "LineColor")
        }
        else if (accessData.doubleValue(this.statePath)==2){
            num_k33.Rec.access.setIntegerValue(3,"LineWidth");
            RGBAColoring(num_k33.Rec, colors.VLV.Fillstate.open, "LineColor")
            num_k31.Rec.access.setIntegerValue(1,"LineWidth")
            num_k32.Rec.access.setIntegerValue(1,"LineWidth")
            RGBAColoring(num_k31.Rec, colors.AP.Text.alarm, "LineColor")
            RGBAColoring(num_k32.Rec, colors.AP.Text.alarm, "LineColor")
        }
        else {
            num_k31.Rec.access.setIntegerValue(1,"LineWidth")
            num_k32.Rec.access.setIntegerValue(1,"LineWidth")
            num_k33.Rec.access.setIntegerValue(1,"LineWidth")
            RGBAColoring(num_k31.Rec, colors.AP.Text.alarm, "LineColor")
            RGBAColoring(num_k32.Rec, colors.AP.Text.alarm, "LineColor")
            RGBAColoring(num_k33.Rec, colors.AP.Text.alarm, "LineColor")
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
}
class Stage_N extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {

        return true;
    }

    updateBadQuality(){
      //  this.object.setStringValue("????????", "ID.Text");

    }

    updateVisuals() {
        if(accessData.doubleValue(this.statePath)==1){
            num_n1.Rec.access.setIntegerValue(3,"LineWidth");
            RGBAColoring(num_n1.Rec, colors.VLV.Fillstate.open, "LineColor")
            num_n2.Rec.access.setIntegerValue(1,"LineWidth")
            RGBAColoring(num_n2.Rec, colors.AP.Text.alarm, "LineColor")
        }
        else if (accessData.doubleValue(this.statePath)==2){
            num_n2.Rec.access.setIntegerValue(3,"LineWidth");
            RGBAColoring(num_n2.Rec, colors.VLV.Fillstate.open, "LineColor")
            num_n1.Rec.access.setIntegerValue(1,"LineWidth")
            RGBAColoring(num_n1.Rec, colors.AP.Text.alarm, "LineColor")
        }
        else {
            num_n1.Rec.access.setIntegerValue(1,"LineWidth")
            num_n2.Rec.access.setIntegerValue(1,"LineWidth")
            RGBAColoring(num_n1.Rec, colors.AP.Text.alarm, "LineColor")
            RGBAColoring(num_n2.Rec, colors.AP.Text.alarm, "LineColor")
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
}
class CE extends ObservableObject {

        /** Настраивает пути к сигналам */
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        // this.bit = this.config.bit;
        this.cmd_mode_on = "codes.BR_CE.cmd.Cmd1";
        this.cmd_mode_off = "codes.BR_CE.cmd.Cmd2";
        this.cmd_deblock_on = "codes.BR_CE.cmd.Cmd3";
        this.cmd_deblock_off = "codes.BR_CE.cmd.Cmd4";
        this.statePath = `${this.config.rootPath}.cmd`;
        this.faultPath = `${this.config.rootPath}.delay`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.qualityTag = this.valuePath;
    }
    getInitialState() {
        return {
            quality: null,
            value: null,
            state: null,
            fault: null,
            delay: null,
            timestamp: null
        };
    }
     /**
     * Читает текущее состояние из OPC сервера
     * @returns {Object} Текущее состояние
     */
    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            delay: accessData.doubleValue(`${this.valuePath}.deley`),
            quality: getSignalQuality(this.config.qualityTag),
            timestamp: new Date().getTime(),
        };
        return newState;
    }
    hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.fault !== this.currentState.fault ||
            newState.delay !== this.currentState.delay ||
            newState.quality !== this.currentState.quality) {
            return true;
        }
        return false;
    }


    updateText() {
        // this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(accessData.stringValue(`${this.valuePath}.Description`), "desc.Text");
        //  this.object.setStringValue(this.config.description, "mask.cloc.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        // this.object.setStringValue(accessData.stringValue(`${this.valuePath}.deley.EUnit`), "eunit.Text");
        return true;
    }
    updateBadQuality(){
      //  this.object.setStringValue("??????", "desc.Text")
        this.object.setStringValue(accessData.stringValue(`${this.valuePath}.Description`), "desc.Text");
         RGBAColoring(this.object.deblock.field, colors.AP.Fillstate.field, "FillColor");
          RGBAColoring(this.object.mask.field, colors.AP.Fillstate.field, "FillColor");
    }
/** Обновляет визуальные элементы */
    updateVisuals() {
        // цвет по state на описание и кнопку деблокировать
        if(accessData.boolValue(`${this.valuePath}.b00`))
        {
            RGBAColoring(this.object.deblock.field, colors.VLV.Fillstate.avar, "FillColor"); 
        }
        else
        {
            RGBAColoring(this.object.deblock.field, colors.SERVICE.buttons.act, "FillColor"); 
        }    
        // // цвет на кнопку маскировать
        if(accessData.boolValue(`${this.valuePath}.b01`))
            RGBAColoring(this.object.mask.field, colors.VLV.Fillstate.avar, "FillColor");
        else
            RGBAColoring(this.object.mask.field, colors.SERVICE.buttons.act, "FillColor");   
                // // цвет на alm
        if(accessData.boolValue(`${this.valuePath}.b02`))
            RGBAColoring(this.object.desc, colors.VLV.Fillstate.avar, "FillColor");
        else
            RGBAColoring(this.object.desc, colors.SERVICE.Goodqual.field_act, "FillColor");   
        // // значение уставки
        this.object.set.value.setStringValue(accessData.doubleValue(`${this.valuePath}.deley`),"Text");
    }
checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                

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
    mode(object, objectName) {
        if(accessData.boolValue(`${this.valuePath}.b01`))
            runAccessBox(object.mask, objectName + '.mask.click', {codes: this.cmd_mode_off, inputTag: this.valuePath})
        else
            runAccessBox(object.mask, objectName + '.mask.click', {codes: this.cmd_mode_on, inputTag: this.valuePath})
    }
    deblock(object, objectName){
        if(accessData.boolValue(`${this.valuePath}.b00`))
            runAccessBox(object.deblock, objectName + '.deblock.click', {codes: this.cmd_deblock_off, inputTag: this.valuePath})
        else
            runAccessBox(object.deblock, objectName + '.deblock.click', {codes: this.cmd_deblock_on, inputTag: this.valuePath})
    }
    SetClick(object, objectName){
         runInputWindow(object.set, objectName + '.set.click', {inputTag: this.valuePath, postfix: `.deley`, codes: this.cmd_deblock});
         //clickClear(object.set, objectName + '.set.click');
    }

    /** Изменяет текстовое значение указанного свойства
     * @param {String} child имя дочернего элемента ГО 
     * @param {String} parameter имя свойства
     */


    /** Изменяет цвет указанного свойства
     * @param {String} child имя дочернего элемента ГО 
     * @param {String} property имя свойства
     */
    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }
}
class wordBR extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.ID = accessData.stringValue(`${this.config.rootPath}.Name_Object1`);
         this.config.ID2 = accessData.stringValue(`${this.config.rootPath}.ID`);
        this.config.Description = accessData.stringValue(`${this.config.rootPath}.Description`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.qualityTag = `${this.config.rootPath}`;
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
           this.object.setStringValue(this.config.ID2, "ID2.Text");
        this.object.setStringValue(this.config.Description, "desc.Text");
        this.object.setStringValue(this.config.EUnit, "unit.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
       // this.object.setStringValue("????????", "ID.Text");
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.ID2, "ID2.Text");
        this.object.setStringValue("??????????", "desc.Text");
        this.object.setStringValue("", "unit.Text");
        this.object.setStringValue("", "value.Text");
        RGBAColoring(object, colors.AP.Fillstate.field, "state.FillColor")
    }

    updateVisuals() {
    this.changeValue(this.object.value, this.currentState.value); 
    RGBAColoring(object, colors.AP.SimCol.whiteCol, "state.FillColor")
    }
     checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
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
    changeValue(child, parameter) {
        if (child) {
            child.access.setStringValue(parameter.toFixed(this.config.FracDigits), "Text");
        }
    }

    changeText(object, value) {
            if (object) {
                object.access.setStringValue(value, "Text");
            }
        }
    SetClick(object, objectName){
         runInputWindow(object, objectName + '.click', {inputTag: this.valuePath, codes: this.cmd_deblock});
    }


}
class PrgBR extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
    }
    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.popup = 'BR_popup';
        this.config.code = this.config.num;
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
    
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        RGBAColoring(this.object, colors.SERVICE.inputWindow.noDot, "state.FillColor")
    }

    updateVisuals() {
        // if(this.config.type=='prg1'){
        let alm=0;
        let work=0;
        let wrn=0;
        for(let i=0;i<10;i++){   
            if(accessData.doubleValue(`${this.valuePath}.b0${i}.Color`)==1)
                alm++; 
            else if(accessData.doubleValue(`${this.valuePath}.b0${i}.Color`)==2)
                wrn++; 
            else if(accessData.doubleValue(`${this.valuePath}.b0${i}.Color`)==9)
                work++;
        }
        for(let i=10;i<15;i++){   
            if(accessData.doubleValue(`${this.valuePath}.b${i}.Color`)==1)
                alm++;
            else if(accessData.doubleValue(`${this.valuePath}.b${i}.Color`)==2)
                wrn++; 
            else if(accessData.doubleValue(`${this.valuePath}.b${i}.Color`)==9)
                work++;  
        }
        if(accessData.doubleValue(this.valuePath) == 0){
            RGBAColoring(this.object, colors.SERVICE.buttons.default, "state.FillColor");
            RGBAColoring(this.object, colors.VLV.Modestate.auto, "Text_21.TextColor");
        }
        else if (alm>0){
             RGBAColoring(this.object, colors.VLV.Fillstate.avar, "state.FillColor");
             RGBAColoring(this.object, colors.VLV.Modestate.auto, "Text_21.TextColor");
             alm=0;
        }
        else if(wrn>0){
            RGBAColoring(this.object, colors.VLV.Fillstate.close, "state.FillColor");
            RGBAColoring(this.object, colors.VLV.SimCol.blackCol, "Text_21.TextColor");
            wrn=0;
        }
        else if(work>0){
             RGBAColoring(this.object, colors.VLV.Fillstate.open, "state.FillColor");
             RGBAColoring(this.object, colors.VLV.Modestate.auto, "Text_21.TextColor");
             work=0;
        }
        else
            RGBAColoring(this.object, colors.SERVICE.Badqual.field, "state.FillColor");
    }
     checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.valuePath)) {
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
    changeValue(child, parameter) {
        if (child) {
            child.access.setStringValue(parameter.toFixed(this.config.FracDigits), "Text");
        }
    }

    changeText(object, value) {
            if (object) {
                object.access.setStringValue(value, "Text");
            }
        }
    SetClick(object, objectName){
         runInputWindow(object, objectName + '.click', {inputTag: this.valuePath, codes: this.cmd_deblock});
         clickClear(object, objectName + '.click');
    }


}
class DpBPT extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;
        this.bit = this.config.bit;
   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.${this.bit}.Description`), "desc.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
       // this.object.setStringValue("????????", "ID.Text");
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "left.FillColor");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "right.FillColor");
    }

    updateVisuals() {
        
            if(accessData.doubleValue(`${this.statePath}.${this.bit}.Color`)==1){
            RGBAColoring(this.object, colors.VLV.Fillstate.avar, "left.FillColor");
            }
            else if(accessData.boolValue(`${this.statePath}.${this.bit}`) && accessData.doubleValue(`${this.statePath}.${this.bit}.Color`)==9){
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "left.FillColor");
            }
            else {
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "left.FillColor");
   
            }
    }
 checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
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
    
}
class BR_State extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.faultPath = `${this.statePath}.${this.bit}`;
        this.config.qualityTag = this.statePath;
        this.bit = this.config.bit;
   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        return true;
    }

    updateBadQuality(){
        RGBAColoring(this.object.field, colors.AP.Fillstate.field, "FillColor");
    }

    updateVisuals() {
        if(accessData.boolValue(`${this.statePath}.${this.bit}`)) 
            RGBAColoring(this.object.field, this.DetColor(object,`${this.statePath}.${this.bit}`), "FillColor")
        else {
            RGBAColoring(this.object.field, colors.AP.Fillstate.field, "FillColor")
            }
    }
 checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
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
      DetColor(object, bit) {
        let colorPath = accessData.doubleValue(`${bit}.Color`)
        let color;
        if (colorPath == 1)
            color = colors.SERVICE.Flt.actAlm;
        else if (colorPath == 2)
            color = colors.SERVICE.Flt.actWrn;
         else if (colorPath == 9)
            color = colors.VLV.Fillstate.open;
        else 
            color =  colors.EO.State.no_front;
            return color;
    }
  
 
}
function BR_St(object, bit) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BR_State(object, {bit : bit});
    }
    object.parameter.checkForUpdates();
}
function ap_BR(object, pop=false) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AnalogBR(object, {pop : pop});
    }
    object.parameter.checkForUpdates();
}
function word_BR(object,objectName, pop=false, cm) {
    //environment.logInfo("Pop: " + pop);
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new wordBR(object, {});
    }
    object.parameter.checkForUpdates();
    if (pop)
        object.parameter.SetClick(object, objectName);

}
function dp_BR(object, bit, type) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DpBR(object, {bit : bit, type : type});
    }
    object.parameter.checkForUpdates();
}
function dp_BR2(object, bit, type, cmd_on, cmd_off, bStart, bStop) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DpBR2(object, {bit : bit, type : type, cmd_on : cmd_on, cmd_off : cmd_off, bStart : bStart, bStop : bStop});
    }
    object.parameter.checkForUpdates();
}
function dp_BPT(object, bit) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DpBPT(object, {bit : bit});
    }
    object.parameter.checkForUpdates();
}
function vent_BR(object, bit,alm) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new VentBR(object, {bit : bit, alm : alm});
    }
    object.parameter.checkForUpdates();
}
function PG_BR(object, bit,shupg) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new PG(object, {bit : bit, shupg : shupg});
    }
    object.parameter.checkForUpdates();
}
function st(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new Stage_K(object, {});
    }
    object.parameter.checkForUpdates();
}
function st_n(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new Stage_N(object, {});
    }
    object.parameter.checkForUpdates();
}
function Prg_BR(object, objectName, type, num) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new PrgBR(object, {type : type, num : num});
    }
    object.parameter.checkForUpdates();
}
function ce(object, objectName) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new CE(object, {});

    }
    object.parameter.checkForUpdates();
    object.parameter.mode(object, objectName);
    object.parameter.deblock(object, objectName);
    object.parameter.SetClick(object, objectName);
}
    function button1(object, objectName, cm)
 {
   runAccessBox(object, objectName + '.click', {postfix: '', codes: `codes.BR_Share.cmd.${cm}`, inputTag: `KSPG.BR.Share.cmd`})
 }
     function button2(object, objectName, cm, tag)
 {
   runAccessBox(object, objectName + '.click', {codes: `codes.BR_CE.cmd.${cm}`, inputTag: `KSPG.BR.CE.${tag}`})
 }

 function VLV_BR(object, pop) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new vlvBR(object, {pop : pop});
    }
    object.parameter.checkForUpdates();
}
