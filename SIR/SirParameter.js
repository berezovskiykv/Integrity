#INCLUDE "ObservableObject.js"

class SirParameter extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}.status1`;
        this.faultPath = `${this.config.rootPath}.status2`;
        this.config.qualityTag = `${this.config.rootPath}.status1`;
        this.colorPath = `${this.config.rootPath}.Color`
    }


    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            priority: accessData.intValue(this.colorPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        //this.object.setStringValue("????????", "ID.Text");
        this.object.setStringValue("", "click.Tooltip");
        this.changeVisibility(this.object.MASK);
        this.changeVisibility(this.object.imit);
        this.changeVisibility(this.object.auto);
        this.changeVisibility(this.object.man);
        this.changeVisibility(this.object.sens);
        this.changeVisibility(this.object.ext);
        this.changeColor(this.object.INDICATOR, colors.SIR.Fillstate.field, "FillColor");
        this.changeColor(this.object.INDICATOR, colors.SIR.Fillstate.field, "BackgroundColor");

    }
    updateVisuals() {
        this.processStateBits();
        this.color = this.determineColor()
        this.changeVisibility(this.object.MASK, this.state.mask);
        this.changeVisibility(this.object.imit, this.state.imit);
        this.changeVisibility(this.object.auto, this.state.aut);
        this.changeVisibility(this.object.man,  this.state.man);
        this.changeVisibility(this.object.sens,  this.state.ModDist || this.state.ModDost || this.state.ErrFbk || this.state.CCEnable );
        this.changeVisibility(this.object.ext,   this.state.Fault|| this.state.CmdFlt);
        this.changeColor(this.object.INDICATOR,  this.color.value_state, "FillColor");
        this.changeColor(this.object.INDICATOR,  this.color.back_state, "BackgroundColor");
  
    }
    
    checkForFlashing() {
        if (this.state.kvit) {
            this.flashingColor(this.object.INDICATOR, this.color.value_state, colors.SIR.Fillstate.kvit, "FillColor");
            this.flashingColor(this.object.INDICATOR, this.color.back_state,  colors.SIR.Backstate.kvit_back, "BackgroundColor");
        }
        else return;
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


    flashingColor (child, color1, color2, property) {
        if (child) {
            flashing(child, color1, color2, property)
        }
    }

     processStateBits() {
        let state = this.currentState.state;
        let fault = this.currentState.fault;
        if ((state === null || state === undefined) || (fault === null || fault === undefined)) return;


        this.state = {
            mask        :   !!(state & (S(`${this.config.code}.Status1.Disable`))),
            imit        :   !!(state & (S(`${this.config.code}.Status1.Imit`))),
            msgOff      :   !!(state & (S(`${this.config.code}.Status1.MsgOff`))),
            man         :   !!(state & (S(`${this.config.code}.Status1.Man`))),
            aut         :   !!(state & (S(`${this.config.code}.Status1.Aut`))),
            bad         :   !!(state & (S(`${this.config.code}.Status1.Bad`))),
            act         :   !!(state & (S(`${this.config.code}.Status1.Act`))),
            Fltkvit     :   !!(state & (S(`${this.config.code}.Status1.FltKvit`))),
            kvit        :   !!(state & (S(`${this.config.code}.Status1.Kvit`))),
            ModDist     :   !!(fault & (S(`${this.config.code}.Status2.ModDISt`))),
            ModDost     :   !!(fault & (S(`${this.config.code}.Status2.ModDOSt`))),
            ErrFbk      :   !!(fault & (S(`${this.config.code}.Status2.ErrFbk`))),
            CCEnable    :   !!(fault & (S(`${this.config.code}.Status2.CCEnable`))),
            Fault       :   !!(fault & (S(`${this.config.code}.Status2.Fault`))),
            CmdFlt      :   !!(fault & (S(`${this.config.code}.Status2.CmdFlt`))),
            MskEnable   :   !!(fault & (S(`${this.config.code}.Status2.MskEnable`))),
            MskDisable  :   !!(fault & (S(`${this.config.code}.Status2.MskDisable`))),
            AutEnable   :   !!(fault & (S(`${this.config.code}.Status2.AutEnable`))),
            AutDisable  :   !!(fault & (S(`${this.config.code}.Status2.AutDisable`))),
            
            
        }
    }

determineColor() {
    return {
        value_state
        : this.state.bad      ? colors.SIR.Fillstate.bad
        : this.state.ModDist  ? colors.SIR.Fillstate.flt
        : this.state.ModDost  ? colors.SIR.Fillstate.flt
        : this.state.ErrFbk   ? colors.SIR.Fillstate.flt
        : this.state.CCEnable ? colors.SIR.Fillstate.flt
        : this.state.Fault    ? colors.SIR.Fillstate.flt
        : this.state.CmdFlt   ? colors.SIR.Fillstate.flt
        : this.state.act && (this.currentState.priority == 1)  ? colors.SIR.Fillstate.act1
        : this.state.act && (this.currentState.priority == 2)  ? colors.SIR.Fillstate.act2 
        : this.state.act && (this.currentState.priority == 9)  ? colors.SIR.Fillstate.act3
        : this.state.act && (this.currentState.priority == 10) ? colors.SIR.Fillstate.act4
        : colors.SIR.Fillstate.field,

        back_state
        : this.state.bad      ? colors.SIR.Backstate.bad_back
        : this.state.ModDist  ? colors.SIR.Backstate.flt_back
        : this.state.ModDost  ? colors.SIR.Backstate.flt_back
        : this.state.ErrFbk   ? colors.SIR.Backstate.flt_back
        : this.state.CCEnable ? colors.SIR.Backstate.flt_back
        : this.state.Fault    ? colors.SIR.Backstate.flt_back
        : this.state.CmdFlt   ? colors.SIR.Backstate.flt_back
        : this.state.act && (this.currentState.priority == 1)  ? colors.SIR.Backstate.act1_back
        : this.state.act && (this.currentState.priority == 2)  ? colors.SIR.Backstate.act2_back 
        : this.state.act && (this.currentState.priority == 9)  ? colors.SIR.Backstate.act3_back
        : this.state.act && (this.currentState.priority == 10) ? colors.SIR.Backstate.act4_back
        : colors.SIR.Backstate.field,
    }
}
}

function sir(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new SirParameter(object, {});
    }
    object.parameter.checkForUpdates();
}