#INCLUDE "Elem_TS.js"
#INCLUDE "Elem/VLVboolParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "Elem_AP.js"
#INCLUDE "Elem_AT.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"

#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "bkk";
diagNameMouse = "bkk";
// active = true;
#ONCE_EXECUTION_END

active = isEmbededDiagramActive('birg', diagName, 'birgscr');

class DpBS extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
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
        RGBAColoring(this.object, colors.AP.Fillstate.field, "indicator.FillColor");

    }

    updateVisuals() {
        if(accessData.doubleValue(this.statePath)==1)
        {
            RGBAColoring(this.object, colors.ElemTS.Fillstate.main1, "indicator.FillColor");
            RGBAColoring(this.object, colors.ElemTS.Fillstate.back1, "indicator.BackgroundColor");
        }
        else {
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "indicator.FillColor");
            RGBAColoring(this.object, colors.AP.Fillvalue.norm, "indicator.BackgroundColor");
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

function dp_BS(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DpBS(object, {});
    }
    object.parameter.checkForUpdates();
}

 function  buttonTest(object, objectName, cm, descr)
 {
   runAccessBox(object, objectName + '.click', {value: cm, postfix:`` , inputTag: `KSPG.STN3000.StartTest`, desc: descr})
 }