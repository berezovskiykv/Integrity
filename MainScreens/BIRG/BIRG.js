#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "SIR/SirParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "Elem_AP.js"
#INCLUDE "Elem_AT.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"
#INCLUDE "MainScreens/BPAIV.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "birg";
//active = true;
diagNameMouse = "birg"
#ONCE_EXECUTION_END
active = isEmbededDiagramActive('birg', diagName, 'birgscr');
class DpBIRG extends ObservableObject {
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
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.Description`), "id.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
    //    this.object.setStringValue("????????", "ID.Text");
   this.object.setStringValue(accessData.stringValue(`${this.statePath}.Description`), "id.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "state.FillColor");
    }

    updateVisuals() {

        if(accessData.boolValue(`${this.statePath}`))
        {
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "state.FillColor");
        }
        else{
             RGBAColoring(this.object, colors.AP.Flt.act, "state.FillColor");
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
function dp_BIRG(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DpBIRG(object, {});
    }
    object.parameter.checkForUpdates();
}
