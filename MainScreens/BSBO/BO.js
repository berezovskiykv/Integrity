#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "SIR/SirParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "Elem_AT.js"
#INCLUDE "MainScreens/BSBO/BO_objects.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"

#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "bo";
active = true;
diagNameMouse = "bo"
#ONCE_EXECUTION_END
// active = isEmbededDiagramActive('bsbo', diagName, 'bsboscr');


class BO_status extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;   
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
   
        return true;
    }

    updateBadQuality(){
    RGBAColoring(this.object.field, colors.AP.Fillstate.field, "FillColor");
    this.object.stage.setStringValue("Нет статуса", "Text");
    }

    updateVisuals() {
        let text = accessData.stringValue(`${this.statePath}.Alarm.Description`);
        let wrap = wrapText(text, 42);
        if(accessData.stringValue(`${this.statePath}.Alarm.Description`)!=undefined)
            this.object.stage.setStringValue(wrap, "Text");
        else
          //  this.object.stage.setStringValue("??????????", "Text");
            this.object.stage.setStringValue("Нет статуса", "Text");
        if (this.config.alm=='alm')
            RGBAColoring(this.object.field, colors.VLV.Fillstate.avar, "FillColor");
        else
         RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
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

function status(object, alm, num) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BO_status(object, {alm : alm, num : num});
    }
    object.parameter.checkForUpdates();
}
function  button(object, objectName, tag)
 {
   runAccessBox(object, objectName + '.click', {postfix:``, codes: `codes.BO.cmd.Cmd1`, inputTag: `KSPG.BO.State.${tag}`})
 }

  function  BO_sets(object, objectName)
 {
    rootPath = getAliasesPath(object);
   let mouseEvent = clickRelease(object, objectName + '.click');  
   if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup(
        {
            alias: rootPath,
            popupName: 'BO_setpoints',
        },
        {
            inputTag: rootPath
        });
    }
 }
