#INCLUDE "ObservableObject.js"

class AnalogParameter extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.state`;
        this.faultPath = `${this.config.rootPath}.flt`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.qualityTag = `${this.config.rootPath}.state`;
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
        this.changeVisibility(this.object.off, this.state.mask);
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
        if ((state === null || state === undefined) || (fault === null || fault === undefined)) return;

        this.state = {
            mask        :   !!(state & (S(`${this.config.code}.Status1.Disable`))),
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
            : this.state.AH_Act || this.state.AL_Act ? colors.AP.SimCol.whiteCol
            : this.state.WH_Act || this.state.WL_Act ? colors.AP.SimCol.blackCol
            : this.state.norm ? colors.AP.SimCol.blackCol
            : colors.AP.SimCol.blackCol,

            value_state
            : this.state.flt ? colors.AP.SimCol.redCol
            : this.state.bad ? colors.AP.SimCol.blackCol
            : this.state.AH_Act || this.state.AL_Act ? colors.AP.SimCol.redCol
            : this.state.WH_Act || this.state.WL_Act ? colors.AP.SimCol.yellCol
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
            : this.state.AH_Act || this.state.AL_Act ? colors.AP.SimCol.redCol
            : this.state.WH_Act || this.state.WL_Act ? colors.AP.Fillvalue.warn
            : this.state.norm ? colors.AP.SimCol.greenCol
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


}

function analog(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AnalogParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
