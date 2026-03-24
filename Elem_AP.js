#INCLUDE "ObservableObjectLsu.js"
class ElemTIParameter extends ObservableObjectLsu {
   
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}.val`;
        this.statePath = `${this.config.rootPath}.state`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.state.EUnit`);
        this.config.Description = accessData.stringValue(`${this.config.rootPath}.state.ID`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.val.FracDigits`)
        this.config.qualityTag1= `${this.config.rootPath}.state`;
        this.config.qualityTag2 = `${this.config.rootPath}.val`;
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            state_quality: accessData.stringValue(this.config.qualityTag1),
            value_quality: accessData.stringValue(this.config.qualityTag2),
            timestamp: new Date().getTime(),
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.Description, "ID.Text");
        this.object.setStringValue(this.config.EUnit, "VALUE.eUnit.Text");
        return true;
    }

    updateBadQuality(){
        //this.object.setStringValue("????????", "ID.Text");
        this.object.setStringValue(this.config.Description, "ID.Text");
        this.object.setStringValue("", "VALUE.eUnit.Text");
        this.object.setStringValue("", "VALUE.Value.Text")
        this.changeColor(this.object.VALUE.state, colors.ElemAP.Fillstate.field, "FillColor");
        this.changeVisibility(this.object.hi, false);
        this.changeVisibility(this.object.lo, false);
        this.changeVisibility(this.object.err, false);
        this.changeColor(this.object.value_field, colors.ElemAT.Fillstate.default, "FillColor");
        this.changeColor(this.object.field, colors.ElemAT.Fillstate.default, "FillColor");
        this.changeColor(this.object.value_field, colors.ElemAT.Fillstate.default, "LineColor");

    }
    
    updateGoodQuality() {
    this.updateText();
    this.updateVisuals();
}

hasStateChanged(newState) {
    const qualityChanged = 
        (getSignalQuality(this.config.qualityTag1) !== getSignalQuality(newState.state_quality)) ||
        (getSignalQuality(this.config.qualityTag2) !== getSignalQuality(newState.value_quality));
    
    return qualityChanged || 
           newState.value !== this.currentState.value ||
           newState.state !== this.currentState.state;
}

   
    updateVisuals() {
        this.processStateBits();
        this.changeVisibility(this.object.hi, (this.state == 4 || this.state == 5));
        this.changeVisibility(this.object.lo, (this.state == 2 || this.state == 3));
        this.changeVisibility(this.object.err, (this.state == 8 || this.state == 9 || this.state == 10));
        this.changeValue(this.object.VALUE.Value, this.currentState.value);
        this.color = this.determineColor();
        this.xa = this.determineText();
        this.changeColor(this.object.VALUE.state,   this.color.value_state, "FillColor");
        this.changeColor(this.object.hi.background, this.color.setpoint_state, "FillColor");
        this.changeColor(this.object.lo.background, this.color.setpoint_state, "FillColor");
        this.changeColor(this.object.err.background, this.color.value_state, "FillColor");
        this.changeColor(this.object.hi.background, this.color.back_state, "BackgroundColor");
        this.changeColor(this.object.lo.background, this.color.back_state, "BackgroundColor");
        this.changeColor(this.object.err.background, this.color.value_state, "BackgroundColor");
        this.object.setStringValue(this.xa.TextHi, "hi.hi_Text.Text");
        this.object.setStringValue(this.xa.TextLo, "lo.lo_Text.Text");
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
       
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }

     processStateBits() {
        let state = this.currentState.state;
        if (state === null || state === undefined) return;

        this.state = state;
    }

determineColor() {
    return {
        value_state: this.state == 0 ? colors.ElemAP.Fillstate.link
            : this.state == 2 ? colors.ElemAP.Fillsetpoint.lolo
            : this.state == 3 ? colors.ElemAP.Fillsetpoint.lo
            : this.state == 4 ? colors.ElemAP.Fillsetpoint.hi
            : this.state == 5 ? colors.ElemAP.Fillsetpoint.hihi
            : this.state == 8 ? colors.ElemAP.Fillstate.avar
            : this.state == 9 ? colors.ElemAP.Fillstate.avar
            : this.state == 10 ? colors.ElemAP.Fillstate.avar
            : colors.ElemAP.Fillstate.field,

        setpoint_state: this.state == 2 ? colors.ElemAP.Fillsetpoint.lolo
            : this.state == 3 ? colors.ElemAP.Fillsetpoint.lo
            : this.state == 4 ? colors.ElemAP.Fillsetpoint.hi
            : this.state == 5 ? colors.ElemAP.Fillsetpoint.hihi
            : colors.ElemAP.Fillstate.field,

        back_state: this.state == 2 ? colors.ElemAP.Fillsetpoint_back.lolo
            : this.state == 3 ? colors.ElemAP.Fillsetpoint_back.lolo
            : this.state == 4 ? colors.ElemAP.Fillsetpoint_back.hi
            : this.state == 5 ? colors.ElemAP.Fillsetpoint_back.hihi
            : colors.ElemAP.Fillstate.field
    };
}

determineText() {
    return {
        TextLo: this.state == 2 ? "LL"
            : this.state == 3 ? "L"
            :"",
        TextHi: this.state == 4 ? "H"
            : this.state == 5 ? "HH"
            : "",
    };
}

}
function elemti(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new ElemTIParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
