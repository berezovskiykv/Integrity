#INCLUDE "ObservableObject.js"

class APPAZParameter extends ObservableObject {
    setupSignalPaths() {
        const prefix = this.config.prefix
        this.rootPath = `${this.config.rootPath2}`;
        this.statePath = `${this.config.rootPath2}.state${prefix}`;
        this.modePath = `${this.config.rootPath2}.mode${prefix}`;
        this.config.qualityTag = `${this.config.rootPath2}.state`;
    }



    readCurrentState() {
        var newState = {
            state: accessData.boolValue(this.statePath),
            mode: accessData.boolValue(this.modePath),
            modeFlg: accessData.boolValue(this.modeFlgPath), 
            stateFlg: accessData.intValue(this.stateFlgPath), 
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
        };

        return newState;

    }
        getInitialState() {
        return {
            quality: null,
            value: null,
            state: null,
            fault: null,
            mode:  null,
            timestamp: null
        };
    }

        hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.fault !== this.currentState.fault ||
            newState.mode !== this.currentState.mode ||
            newState.priority !== this.currentState.priority ||
            newState.quality !== this.currentState.quality) {
            return true;
        }

        return false;
    }

    checkForUpdates() {
        const baseResult = super.checkForUpdates();
        const newState = this.readCurrentState();

        if (
            !this.currentState ||
            (this.currentState.stateFlg !== newState.stateFlg) ||
            (this.currentState.modeFlg !== newState.modeFlg) ||    
            (this.currentState.state !== newState.state) ||
            (this.currentState.mode !== newState.mode) 
        ) {
            this.currentState = newState;
            this.updateVisuals();
            //this.updateText();
        }

        return baseResult;
    }


    updateText() {
    }

    updateBadQuality(){

    }

    updateVisuals() {
        this.color = this.determineColor()
        this.changeColor(this.object.field,  this.color.fillColor, "FillColor");
    }

    checkForFlashing() {
 
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
    checkForUpdates() {
    var newState = this.readCurrentState();
    var hasChanged = this.hasStateChanged(newState);
    if (active) {
        this.object.start = this.updateText();
        this.openPopup();
        
        /* Убрана проверка качества сигнала */
        if (hasChanged) {
            this.currentState = newState;
            this.onStateChanged();
            this.copyState(this.currentState, this.previousState);
            return true;
        }
        this.checkForFlashing();
        return false;
    }
    else return;
}

    determineColor() {
        return {
            fillColor
            : accessData.boolValue(this.modePath) ? colors.CE.brownColor 
            : accessData.boolValue(this.statePath)&& !!(S(`${this.statePath}.Color`) == 2) ? colors.CE.warn
            : accessData.boolValue(this.statePath)&& !!(S(`${this.statePath}.Color`) == 1) ? colors.CE.redColor
            : colors.CE.inact,
        }
    }
}
function APPAZ(object,objectName,prefix) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new APPAZParameter(object, {prefix:prefix});
    }
    object.parameter.checkForUpdates();
}



class PAZVALParameter extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.state`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        //this.config.qualityTag = `${this.config.rootPath}.state`;
 
    }

 

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
        };
        return newState;
    }


    updateText() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.EUnit, "Eunit.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("???", "Eunit.Text");
        this.object.setStringValue("???", "value.Text");
        this.object.setStringValue("", "click.Tooltip");

    }

    updateVisuals() {

  
        this.changeValue(this.object.value, this.currentState.value);

    }
    
    checkForFlashing() {
 
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



    checkForUpdates() {
    var newState = this.readCurrentState();
    var hasChanged = this.hasStateChanged(newState);
    if (active) {
        this.object.start = this.updateText();
        this.openPopup();
        
        /* Убрана проверка качества сигнала */
        if (hasChanged) {
            this.currentState = newState;
            this.onStateChanged();
            this.copyState(this.currentState, this.previousState);
            return true;
        }
        this.checkForFlashing();
        return false;
    }
    else return;
}
}

function PAZVAL(object) {
    if (!object.parameter1) {
        object.name = objectName;
        object.parameter1 = new PAZVALParameter(object, {});
    }
    object.parameter1.checkForUpdates();
}
class TSPAZParameter extends ObservableObject {
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.faultPath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
        this.config.priorityTag = `${this.config.rootPath}.Color`;
    }

    /**
     * Читает текущее состояние из OPC сервера
     * @returns {Object} Текущее состояние
     */
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            quality: getSignalQuality(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        //this.object.setStringValue(this.config.description, "ID.Text");
        return true;
    }

    updateBadQuality(){
        //this.changeColor(this.object.indicator, colors.DP.Fillstate.default, "FillColor");
    }

    updateVisuals() {
        this.processStateBits();
        this.color = this.determineColor()
        this.changeColor(this.object.INDICATOR, this.color.value_state, "FillColor");
  
    }
    
    checkForFlashing() {
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
        if (state === null || state === undefined) return;
 

        this.state = {
            act        :   !!(accessData.boolValue(`${this.statePath}`) == true),
        }
    }
    determineColor() {
        return {
            value_state
            : this.state.act ? colors.DP.Fillstate.act1
            : colors.CE.inact
        }
    }
}

function tspaz(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new TSPAZParameter(object, {});
    }
    object.parameter.checkForUpdates();
}

class AVTZDVParameter extends ObservableObject {
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.faultPath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
        this.config.priorityTag = `${this.config.rootPath}.Color`;
    }

    /**
     * Читает текущее состояние из OPC сервера
     * @returns {Object} Текущее состояние
     */
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            quality: getSignalQuality(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.description, "ID.Text");
        return true;
    }

    updateBadQuality(){
        //this.changeColor(this.object.indicator, colors.DP.Fillstate.default, "FillColor");
    }

    updateVisuals() {
        this.processStateBits();
        this.changeVisibility(this.object.vlvCheck, this.state.act);
  
    }
    
    checkForFlashing() {
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
        if (state === null || state === undefined) return;
 

        this.state = {
            act        :   !!(accessData.boolValue(`${this.statePath}`) == false),
        }
    }
}

function avtZDV(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AVTZDVParameter(object, {});
    }
    object.parameter.checkForUpdates();
}

class ZDVVALParameter extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.status1`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.qualityTag = `${this.config.rootPath}.status1`;
 
    }

 

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
        };
        return newState;
    }


    updateText() {
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue("", "click.Tooltip");

    }

    updateVisuals() {
    this.object.setStringValue(this.config.ID, "ID.Text");

    }
    
    checkForFlashing() {
 
}

    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
 
    changeValue(child, zdvparam) {
        if (child) {
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

    
        }
checkForUpdates() {
    var newState = this.readCurrentState();
    var hasChanged = this.hasStateChanged(newState);
    if (active) {
        this.object.start = this.updateText();
        this.openPopup();
        
        /* Убрана проверка качества сигнала */
        if (hasChanged) {
            this.currentState = newState;
            this.onStateChanged();
            this.copyState(this.currentState, this.previousState);
            return true;
        }
        this.checkForFlashing();
        return false;
    }
    else return;
}
}

function ZDVPAZ(object) {
    if (!object.zdvparam) {
        object.name = objectName;
        object.zdvparam = new ZDVVALParameter(object, {});
    }
    object.zdvparam.checkForUpdates();
}
