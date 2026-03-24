#INCLUDE "ObservableObject.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "Managers/colorSettings.js"

class BlockParameter extends ObservableObject {
    setupSignalPaths() {
        this.statePath = this.config.rootPath;
        this.config.qualityTag = this.config.rootPath;
        this.colorPath = `${this.config.rootPath}.Color`;
        this.stepPath = `${this.config.rootPath}.Step`;
    }

    readCurrentState() {
        return {
            state: accessData.doubleValue(this.statePath),
            priority: accessData.intValue(this.colorPath),
            timestamp: new Date().getTime()
        };
    }

    updateText() {
        // Реализация метода updateText
        const currentStep = accessData.intValue(this.statePath);
        const descriptionPath = `${this.statePath}.step${currentStep}.Description`;
        
        let descriptionText = "Нет состояния";
        
        try {
            // Проверяем сначала существование и качество основного состояния
            const stateValue = accessData.doubleValue(this.statePath);
            
            // Если состояние валидное, пытаемся получить описание
            if (stateValue !== null && stateValue !== undefined) {
                descriptionText = accessData.stringValue(descriptionPath);
                
                // Если описание пустое или undefined, оставляем "Нет состояния"
                if (!descriptionText || descriptionText === "") {
                    descriptionText = "Нет состояния";
                }
            }
        } catch (error) {
            // Если произошла ошибка при чтении данных, оставляем "Нет состояния"
            descriptionText = "Нет состояния";
        }
        
        if (this.object.stepdesc) {
            this.object.stepdesc.setStringValue(wrapText(descriptionText, 50), "Text");
        }
    }

    updateBadQuality() {
        // При плохом качестве выводим ??????
        if (this.object.stepdesc) {
            this.object.stepdesc.setStringValue("??????????????????", "Text");
        }
    }

    updateVisuals() {
        this.processStateBits();
        this.color = this.determineColor();
        this.updateText(); // Используем реализованный метод
        this.changeColor(this.object.state, this.color.value_state, "FillColor");
    }

    checkForFlashing() {
    }

    changeVisibility(child, condition) {
        if (child && child.access) {
            child.access.setVisible(condition);
        }
    }

    changeText(object, value) {
        // Реализация метода changeText
        if (object && object.access) {
            object.access.setStringValue(value, "Text");
        }
    }

    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }

    flashingColor(child, color1, color2, property) {
        if (child) {
            flashing(child, color1, color2, property);
        }
    }

    processStateBits() {
        const state = this.currentState.state;
        if (state == null) return;
        
        this.state = {};
        for (let i = 0; i <= 10; i++) {
            this.state[`step${i}`] = (state === i);
        }
    }

    determineColor() {
        const colorMap = {
            1: colors.Block.State.alm,
            2: colors.Block.State.wrn,
            9: colors.Block.State.inf,
            10: colors.Block.State.good
        };
        
        const currentStep = accessData.intValue(this.statePath);
        const colorPath = `${this.statePath}.step${currentStep}.Color`;
        
        // Проверяем существование свойства Color
        let stepColor;
        try {
            stepColor = accessData.intValue(colorPath);
        } catch (error) {
            // Если свойства нет, используем цвет по умолчанию
            stepColor = null;
        }
        
        return {
            value_state: stepColor && colorMap[stepColor] ? colorMap[stepColor] : colors.DP.Fillstate.default
        };
    }
}

function block(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BlockParameter(object, {});
    }
    object.parameter.checkForUpdates();
}


class STN3000_vlv extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.statePath = `${this.config.rootPath}.Open`;
        this.faultPath = `${this.config.rootPath}.Close`;
        this.config.qualityTag = `${this.config.rootPath}.Close`;
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            value: accessData.doubleValue(this.valuePath),
            fault:  accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
   
        return true;
    }

    updateBadQuality(){
    this.object.text.setStringValue(`${this.config.desc}`+" - Нет статуса", "Text");
    }

    updateVisuals() {
        if(accessData.boolValue(`${this.statePath}`)){
              this.object.text.setStringValue(`${this.config.desc}`+" - Открыт","Text");
              }
        else if(accessData.boolValue(`${this.faultPath}`)){
             this.object.text.setStringValue(`${this.config.desc}`+" - Закрыт","Text");
        }
        else{
            this.object.text.setStringValue(`${this.config.desc}`+" - Не определен","Text");
        }
    }
    
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (1) {
            if (getSignalQuality(this.config.qualityTag) || getSignalQuality(this.statePath)) {
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

function stn_vlv(object, desc) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new STN3000_vlv(object, {desc : desc});
    }
    object.parameter.checkForUpdates();
}

class BIRG_status extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            value: accessData.doubleValue(this.valuePath),
            fault:  accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
   
        return true;
    }

    updateBadQuality(){
    this.object.stepdesc.setStringValue("Нет статуса", "Text");
    RGBAColoring(this.object.state, colors.AP.Fillstate.field, "FillColor");
    }

    updateVisuals() {
        if(!accessData.boolValue(`${this.valuePath}`)){
              this.object.stepdesc.setStringValue("В работе","Text");
               RGBAColoring(this.object.state, colors.VLV.Fillstate.open, "FillColor");
              }
        else{
            this.object.stepdesc.setStringValue("Авария","Text");
             RGBAColoring(this.object.state, colors.VLVP.treanglestate1.err, "FillColor");
        }
    }
    
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (1) {
            if (getSignalQuality(this.config.qualityTag) || getSignalQuality(this.statePath)) {
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
function block_birg(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BIRG_status(object, {});
    }
    object.parameter.checkForUpdates();
}