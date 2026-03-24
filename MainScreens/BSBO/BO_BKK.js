#INCLUDE "Elem_AT.js"
#INCLUDE "Elem_TS.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "CheckLink.js"

#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "bo_bkk";
diagNameMouse = "bo_bkk";
active = true;
#ONCE_EXECUTION_END
// active = isEmbededDiagramActive('bsbo', diagName, 'bsboscr');



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
class DatePars extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.Day = `${this.config.rootPath}.Day`;
        this.Month = `${this.config.rootPath}.Month`;
        this.Year = `${this.config.rootPath}.Year`;
        this.Hour = `${this.config.rootPath}.Hour`;
        this.Min = `${this.config.rootPath}.Min`;
        this.Sec = `${this.config.rootPath}.Sec`;
        this.config.qualityTag = this.Day;   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            Day: accessData.doubleValue(this.Day),
            Month: accessData.doubleValue(this.Month),
            Year: accessData.doubleValue(this.Year),
            Hour: accessData.doubleValue(this.Hour),
            Min: accessData.doubleValue(this.Min),
            Sec: accessData.doubleValue(this.Sec),
            timestamp: new Date().getTime()
        };
        return newState;
    }
     hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.fault !== this.currentState.fault ||
            newState.Day !== this.currentState.Day ||
            newState.Month !== this.currentState.Month ||
            newState.Year !== this.currentState.Year ||
            newState.Hour !== this.currentState.Hour ||
            newState.Min !== this.currentState.Min ||
            newState.Sec !== this.currentState.Sec ||
            newState.priority !== this.currentState.priority ||
            newState.quality !== this.currentState.quality) {
            return true;
        }
    }

    updateText() {
        return true;
    }

    updateBadQuality(){
        this.object.VALUE.Value.setStringValue("","Text");
        RGBAColoring(this.object.VALUE.state, colors.ElemAT.Fillstate.default, "FillColor")
        
    }

    updateVisuals() {
        this.object.VALUE.Value.setStringValue(accessData.doubleValue(this.Day).toFixed(0)+'.'+accessData.doubleValue(this.Month).toFixed(0)+'.'+accessData.doubleValue(this.Year).toFixed(0)+' '+accessData.doubleValue(this.Hour).toFixed(0)+':'+accessData.doubleValue(this.Min).toFixed(0)+':'+accessData.doubleValue(this.Sec).toFixed(0),"Text")
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
function Dat(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DatePars(object, {});
    }
    object.parameter.checkForUpdates();
}