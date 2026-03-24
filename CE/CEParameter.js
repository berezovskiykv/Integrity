#INCLUDE "ObservableObject.js"

class CEParameter extends ObservableObject {
    setupSignalPaths() {
        this.rootPath = `${this.config.rootPath}`;
        this.cmdPath = `${this.config.rootPath}.cmd`;
        this.statePath = `${this.config.rootPath}.state`;
        this.stateFlgPath = `${this.config.rootPath}.state.flg0`;
        this.modePath = `${this.config.rootPath}.mode`;
        this.modeFlgPath = `${this.config.rootPath}.mode.flg0`;
        this.mskPath = `${this.config.rootPath}.msk`;
        this.sourcePath = `${this.config.rootPath}.source`;
        this.FCPath = `${this.config.rootPath}.FirstCause`;
        this.config.qualityTag = `${this.config.rootPath}.state`;
        if(this.config.mod == 'rsu')
            this.config.popup = 'CE16_RSU'
    }

    getInitialState() {
        var state = super.getInitialState();
        this.currentState = state;
        return state;
    }

    readCurrentState() {
        var newState = {
            state: accessData.boolValue(this.statePath),
            mode: accessData.boolValue(this.modePath),
            modeFlg: accessData.intValue(this.modeFlgPath), // читаем modeFlgPath как int
            stateFlg: accessData.intValue(this.stateFlgPath), 
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
        };

        return newState;

    }

    checkForUpdates() {
        const baseResult = super.checkForUpdates();

        const newState = this.readCurrentState();

        // Если состояние изменилось — обновляем визуал и текст
        if (
            !this.currentState ||
            (this.currentState.stateFlg !== newState.stateFlg) ||
            (this.currentState.modeFlg !== newState.modeFlg) ||    // Отслеживаем изменение modeFlg
            (this.currentState.state !== newState.state) ||
            (this.currentState.mode !== newState.mode) 
        ) {
            this.currentState = newState;
            this.updateVisuals();
            this.updateText();
        }

        return baseResult;
    }


    updateText() {
        let id = this.object.access.stringValue("NameId");
        this.object.setStringValue(id, "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("????????", "ID.Text");
        this.object.setStringValue("", "click.Tooltip");
        // this.changeColor(this.object.VALUE.state, colors.AP.Fillvalue.norm, "FillColor");
        // this.changeColor(this.object.STATE, colors.AP.Fillstate.field, "FillColor");

    }

    updateVisuals() {

        // environment.logInfo("accessData.doubleValue(this.statePath): " + accessData.boolValue(this.statePath));
        // environment.logInfo("accessData.doubleValue(this.modePath): " + accessData.boolValue(this.modePath));
        // environment.logInfo(accessData.boolValue(this.statePath) && accessData.boolValue(this.modePath));
        this.color = this.determineColor()
        this.changeColor(this.object.Rectangle,  this.color.fillColor, "FillColor");
        this.changeColor(this.object.ID,  this.color.textColor, "TextColor");
    }

    checkForFlashing() {
    //      if (this.state.kvit) {
    //         this.flashingColor(this.object.value_field, this.color.value_state, colors.AP.Fillvalue.kvit, "FillColor");
    // }
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

    determineColor() {
        return {
            fillColor
            : accessData.boolValue(this.statePath) && !!(S(`${this.statePath}.Color`) == 1) ? colors.CE.redColor
            : accessData.boolValue(this.statePath) && !!(S(`${this.statePath}.Color`) == 2) ? colors.CE.warn
            : accessData.boolValue(this.modePath) ? colors.CE.brownColor 
            : colors.Block.State.good,

            textColor
            : accessData.boolValue(this.statePath) && !!(S(`${this.statePath}.Color`) == 2) ? colors.SIR.Fillstate.bad
            : colors.CE.white
        }
    }


}

function CE(object, mod) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new CEParameter(object, {mod : mod});
        //object.parameter = new CEParameterExtraQuality(object, {});
    }
    object.parameter.checkForUpdates();
}

class CEPAZParameter extends ObservableObject {
    setupSignalPaths() {
        this.rootPath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}.state`;
    }

    getInitialState() {
        var state = super.getInitialState();
        this.currentState = state;
        return state;
    }

    readCurrentState() {
        var newState = {
            state: accessData.boolValue(this.statePath),
            mode: accessData.boolValue(this.modePath),
            modeFlg: accessData.intValue(this.modeFlgPath), 
            stateFlg: accessData.intValue(this.stateFlgPath), 
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
        };

        return newState;

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
        this.changeColor(this.object.INDICATOR,  this.color.fillColor, "FillColor");
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

    determineColor() {
        return {
            fillColor
            : accessData.boolValue(this.statePath) ? colors.CE.redColor
            : colors.CE.inact,
        }
    }
}
function CEPAZ(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new CEPAZParameter(object, {});
    }
    object.parameter.checkForUpdates();
}


