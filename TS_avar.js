#INCLUDE "ObservableObject.js"

class Dp_avar extends ObservableObject {
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
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.Description`), "text.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
    //    this.object.setStringValue("????????", "ID.Text");
   this.object.setStringValue(accessData.stringValue(`${this.statePath}.Description`), "text.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "state.FillColor");
    }

    updateVisuals() {
        if(this.config.detcol==9) {
              if(accessData.boolValue(`${this.statePath}`))
            {
                RGBAColoring(this.object, colors.VLV.Fillstate.open, "state.FillColor");
            }
            else{
                RGBAColoring(this.object, colors.AP.Flt.act, "state.FillColor");
            }
        }
        else if(this.config.detcol==1) {
            if(accessData.boolValue(`${this.statePath}`))
            {
                RGBAColoring(this.object, colors.AP.Flt.act, "state.FillColor");
            }
            else{
                RGBAColoring(this.object, colors.AP.Fillvalue.norm, "state.FillColor");
            }
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
    button(object, objectName, cmd) {
        runAccessBox(object.mask, objectName + '.mask.click', {codes: cmd, inputTag: 'KSPG.ALG.ALGAO'})

    }
}
class Check_avar extends ObservableObject {
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
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.Description`), "text.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        
        return true;
    }

    updateBadQuality(){
    //    this.object.setStringValue("????????", "ID.Text");
   this.object.setStringValue(accessData.stringValue(`${this.statePath}.Description`), "text.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "state.FillColor");
    }

    updateVisuals() {
       this.object.select.point.setVisible(accessData.boolValue(`${this.statePath}`))
        // if(accessData.boolValue(`${this.statePath}`))
        // {
        //    object.select.point.setVisible(accessData.boolValue(`${this.statePath}`))
        // }
        // else{
        //     object.select.point.setVisible(false)
        //     } 
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
    button(object, objectName, cmd) {
        if(cmd.includes("ALGAO"))
            runAccessBox(object.select, objectName + '.select.click', {codes: cmd, inputTag: 'KSPG.ALG.ALGAO'})
        else
             runAccessBox(object.select, objectName + '.select.click', {codes: cmd, inputTag: 'KSPG.ALG.ALGBHO'})

    }
}

function dp_avar(object, detcol = '1', cmd) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new Dp_avar(object, {detcol : detcol});
    }
    object.parameter.checkForUpdates();
    object.parameter.button(object, objectName, cmd)
}
function ch_avar(object, detcol = '1', cmd) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new Check_avar(object, {detcol : detcol});
    }
    object.parameter.checkForUpdates();
    object.parameter.button(object, objectName, cmd);
}
