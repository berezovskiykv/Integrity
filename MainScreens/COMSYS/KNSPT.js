#INCLUDE "ObservableObjectLsu.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "knspt";
//active = true;
diagNameMouse = "knspt";
#ONCE_EXECUTION_END

active = isEmbededDiagramActive('comsys', diagName, 'comsysscr');

class KNSPT_dp extends ObservableObjectLsu {
   
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.${this.config.bit}`;
        this.config.qualityTag1= `${this.config.rootPath}`;
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
        this.object.setStringValue(this.config.Description, "id.Text");
        this.object.setStringValue(this.config.EUnit, "unit.Text");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("????????", "id.Text");
        RGBAColoring(this.object, colors.SERVICE.Badqual.field, "st.FillColor");
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
        RGBAColoring(this.object.body, this.DetColor(object,this.statePath), "FillColor")
    }

checkForUpdates() {
    var newState = this.readCurrentState();
    var hasChanged = this.hasStateChanged(newState);
    var isGoodQuality = getSignalQuality(this.config.qualityTag1);

    if (active) {
        if (isGoodQuality) {
            // Если качество улучшилось (было плохое → стало хорошее)
            if (!this.wasGoodQualityBefore) {
                this.updateText();  // Принудительно обновляем текст
                this.wasGoodQualityBefore = true;
            }
            
            if (hasChanged) {
                this.currentState = newState;
                this.onStateChanged();
                this.copyState(this.currentState, this.previousState);
                return true;
            }
        }
        else {
            this.updateBadQuality();
            this.wasGoodQualityBefore = false;
            this.currentState = newState;
            this.copyState(this.currentState, this.previousState);
        }
    }
    return false;
}
    changeValue(child, parameter) {
        if (child) {
            child.access.setStringValue(parameter.toFixed(2), "Text");
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

    button(object, objectName, cm)
 {
    if(accessData.boolValue(this.statePath))
        runAccessBox(object, objectName + '.click', {postfix : '.wvalue', codes: `codes.KNSPT.cmd.Cmd0`, inputTag: `KSPG.KNSPT.comReg`})
    else
        runAccessBox(object, objectName + '.click', {postfix : '.wvalue', codes: `codes.KNSPT.cmd.${cm}`, inputTag: `KSPG.KNSPT.comReg`})
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
            color =  colors.AP.Flt.inact;
            return color;
    }

}
function knspt_dp(object, bit, cm, objectName) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new KNSPT_dp(object, {bit : bit});
    }
    object.parameter.checkForUpdates();
    object.parameter.button(object, objectName, cm);
}

