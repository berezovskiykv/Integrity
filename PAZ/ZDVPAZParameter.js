#INCLUDE "ObservableObject.js"

function openVLVPopup(object, objectName){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: 'vlv_state', 
                popupName: 'vlv_state', 
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
            });
    }
}
class ZDVFLTParameter extends ObservableObject {
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        const prefix = this.config.prefix
        const postfix = this.config.postfix
        this.statePath = `${this.config.rootPath}.${prefix}`;
        this.faultPath = `${this.config.rootPath}.${postfix}`;
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
            act         :   !!((state>0) || (fault>0))
        }
    }
    determineColor() {
        return {
            value_state
            : this.state.act ? colors.DP.Fillstate.act1
            : colors.DP.Fillstate.act3
        }
    }

    openPopup() {
        let code = accessData.stringValue("CONST");
        let mouseEvent = clickRelease(this.object, this.object.name + '.click');  
        if(mouseEvent.action == 'click'){this.object.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: "zdv_position_1",
                posX: this.object.clickRespons['globalPosX'],
                posY: this.object.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
            });
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

function zdvflt(object,prefix,postfix) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new ZDVFLTParameter(object, {prefix:prefix,postfix:postfix});
    }
    object.parameter.checkForUpdates();
}

class ZDVFLTParameter2 extends ObservableObject {
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        const prefix = this.config.prefix
        const postfix = this.config.postfix
        this.statePath = `${this.config.rootPath}.${prefix}`;
        this.faultPath = `${this.config.rootPath}.${postfix}`;
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
            act         :   !!((state>0) || (fault>0))
        }
    }
    determineColor() {
        return {
            value_state
            : this.state.act ? colors.DP.Fillstate.act2
            : colors.DP.Fillstate.act3
        }
    }

    openPopup() {
        let code = accessData.stringValue("CONST");
        let mouseEvent = clickRelease(this.object, this.object.name + '.click');  
        if(mouseEvent.action == 'click'){this.object.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: "zdv_position_2",
                posX: this.object.clickRespons['globalPosX'],
                posY: this.object.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
            });
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

function zdvflt2(object,prefix,postfix) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new ZDVFLTParameter2(object, {prefix:prefix,postfix:postfix});
    }
    object.parameter.checkForUpdates();
}

