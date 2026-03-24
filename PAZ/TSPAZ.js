#INCLUDE "ObservableObject.js"
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
            state: accessData.boolValue(this.statePath),
            fault: accessData.boolValue(this.faultPath),
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
        this.color = this.determineColor()
        this.changeColor(this.object.field, this.color.value_state, "FillColor");
  
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
        let fault = this.currentState.fault;
        if (fault === null || fault === undefined) return;

        this.state = {
            act         :   !!(state == true)
        }
    }
    determineColor() {
        return {
            value_state
            : this.state.act ? colors.DP.Fillstate.act1
            : colors.DP.Fillstate.act3
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