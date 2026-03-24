#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "SIR/SirParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "MainScreens/Histogram.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/ALGBHIO.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"
#INCLUDE "CE/CEParameter.js"
#INCLUDE "TS_avar.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "bs";
active = true;
diagNameMouse = "bs"
#ONCE_EXECUTION_END
// active = isEmbededDiagramActive('bsbo', diagName, 'bsboscr');

class BS_status extends ObservableObject {
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
   
        return true;
    }

    updateBadQuality(){
    RGBAColoring(this.object.field, colors.AP.Fillstate.field, "FillColor");
    this.object.field.setStringValue("Нет статуса", "Text");
    }

    updateVisuals() {
        if(accessData.boolValue(`${this.statePath}.${this.config.bit}`)){
              this.object.text.setStringValue(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`),"Text");
              if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Норма"))
                RGBAColoring(this.object.field, colors.Block.State.inf, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Ремонт"))
                RGBAColoring(this.object.field, colors.CE.brownColor, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Захоложен"))
                RGBAColoring(this.object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Заполнение"))
                RGBAColoring(this.object.field, colors.Block.State.inf, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Заполнен"))
                RGBAColoring(this.object.field, colors.Block.State.inf, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Пустой"))
                RGBAColoring(this.object.field, colors.Block.State.wrn, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("В промежутке"))
                RGBAColoring(this.object.field, colors.Block.State.wrn, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Отгрузка"))
                RGBAColoring(this.object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("В работе"))
                RGBAColoring(this.object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Захолаживание"))
                RGBAColoring(this.object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.statePath}.${this.config.bit}.Description`).includes("Остановлен"))
                RGBAColoring(this.object.field, colors.Block.State.wrn, "FillColor");
                this.object.setVisible(true);
        }
        else 
            {
               this.object.setVisible(false);
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
class BS_mode extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}.${this.config.bit}`;
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
   
        return true;
    }

    updateBadQuality(){
   
    }

    updateVisuals() {
       this.object.select.point.setVisible(accessData.boolValue(`${this.statePath}`))
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
    button(object, objectName, cmd) {
        runAccessBox(object.select, objectName + '.select.click', {codes: `codes.ALGBHO.cmd.${cmd}`, inputTag: 'KSPG.ALG.ALGBHO'})

    }
}
function status_BS(object, bit) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BS_status(object, {bit : bit});
    }
    object.parameter.checkForUpdates();
}
function Mode_BS(object, objectName, bit, cmd) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BS_mode(object, {bit : bit});
    }
    object.parameter.checkForUpdates();
    object.parameter.button(object, objectName, cmd);
}
function BHIO_ShipPump(object, objectName, prefix) {
    let cond = accessData.boolValue('KSPG.ALG.ALGBHO.Status.BHO_ShipPopupPump');
    bhio_pump.setVisible(cond);
    if(prefix=='ShipWPump') {
        if(accessData.boolValue('KSPG.ALG.ALGBHO.Status.BHO_PermPumpBO') && accessData.boolValue('KSPG.ALG.ALGBHO.Status.BHO_PermPumpEO')) {
             runAccessBox(object, objectName + '.click', {codes: `codes.ALGBHO.cmd.${prefix}`, inputTag: 'KSPG.ALG.ALGBHO'});  
             RGBAColoring(object.button, colors.SERVICE.buttons.act, "FillColor")
        }
        else {
            RGBAColoring(object.button, colors.SERVICE.buttons.inact, "FillColor")
        }
    }
    else {
        runAccessBox(object, objectName + '.click', {codes: `codes.ALGBHO.cmd.${prefix}`, inputTag: 'KSPG.ALG.ALGBHO'});  
    }
    
}