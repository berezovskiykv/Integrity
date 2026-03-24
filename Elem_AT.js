#INCLUDE "ObservableObjectLsu2.js"
class SimpleValueParameter extends ObservableObject {
   
    setupSignalPaths() {
        this.valuePath = this.config.rootPath;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.Description = accessData.stringValue(`${this.config.rootPath}.ID`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        //this.config.FracDigits = 2;
        this.config.qualityTag = this.config.rootPath;
        this.updateText();
    }

    readCurrentState() {
        return {
            value: accessData.doubleValue(this.valuePath),
            quality: accessData.stringValue(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
    }

    updateText() {
        if (this.object) {
            this.object.setStringValue(this.config.Description, "ID.Text");
            this.object.setStringValue(this.config.EUnit, "VALUE.eUnit.Text");
        }
        return true;
    }

    updateBadQuality() {
        if (this.object) {
            //this.object.setStringValue("????????", "ID.Text");
            this.object.setStringValue("", "VALUE.eUnit.Text");
            this.object.setStringValue("", "VALUE.Value.Text");
            // Установка стандартного цвета при плохом качестве
            this.changeColor(this.object.VALUE.state, colors.ElemAT.Fillstate.default, "FillColor");
        }
    }

    updateVisuals() {
        if (getSignalQuality(this.config.qualityTag)) {
            this.changeValue(this.object.VALUE.Value, this.currentState.value);
            // Установка нормального цвета при хорошем качестве
            this.changeColor(this.object.VALUE.state, colors.ElemAT.Fillstate.normal, "FillColor");
        }
    }

    changeValue(child, parameter) {
        if (child && parameter !== null && parameter !== undefined) {
            child.access.setStringValue(parameter.toFixed(this.config.FracDigits), "Text");
        }
    }

    changeColor(child, color, property) {
        if (child && color) {
            RGBAColoring(child, color, property);
        }
    }

    hasStateChanged(newState) {
        return (getSignalQuality(this.config.qualityTag) !== this.lastQualityState) ||
               (newState.value !== this.currentState.value);
    }
}

class DateValueParameter extends ObservableObject {
   
    setupSignalPaths() {
        this.valuePath = this.config.rootPath;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.EUnit`);
        this.config.Description = accessData.stringValue(`${this.config.rootPath}.ID`);
        // this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.FracDigits = 2;
        this.config.qualityTag = this.config.rootPath;
        this.updateText();
    }

    readCurrentState() {
        return {
            value: accessData.doubleValue(this.valuePath),
            quality: accessData.stringValue(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
    }

    updateText() {
        if (this.object) {
            this.object.setStringValue(this.config.Description, "ID.Text");
            this.object.setStringValue(this.config.EUnit, "VALUE.eUnit.Text");
        }
        return true;
    }

    updateBadQuality() {
        if (this.object) {
            //this.object.setStringValue("????????", "ID.Text");
            this.object.setStringValue("", "VALUE.eUnit.Text");
            this.object.setStringValue("", "VALUE.Value.Text");
            // Установка стандартного цвета при плохом качестве
            this.changeColor(this.object.VALUE.state, colors.ElemAT.Fillstate.default, "FillColor");
        }
    }

    updateVisuals() {
        if (getSignalQuality(this.config.qualityTag)) {
            this.changeValue(this.object.VALUE.Value, this.uintToDate(this.currentState.value));
            // Установка нормального цвета при хорошем качестве
            this.changeColor(this.object.VALUE.state, colors.ElemAT.Fillstate.normal, "FillColor");
        }
    }

    changeValue(child, parameter) {
        if (child && parameter !== null && parameter !== undefined) {
            child.access.setStringValue(parameter, "Text");
        }
    }

    changeColor(child, color, property) {
        if (child && color) {
            RGBAColoring(child, color, property);
        }
    }

    hasStateChanged(newState) {
        return (getSignalQuality(this.config.qualityTag) !== this.lastQualityState) ||
               (newState.value !== this.currentState.value);
    }

    uintToDate(value) {
        let date = new Date(value * 1000);
        let formattedTime = 
        date.getDay().toString().padStart(2, '0') + '.' + 
        date.getMonth().toString().padStart(2, '0') + '.' + 
        date.getFullYear().toString().slice(-2) + ' ' + 
        date.getHours().toString().padStart(2, '0') + ':' +
        date.getMinutes().toString().padStart(2, '0'); /*+ ':' +
        date.getSeconds().toString().padStart(2, '0'); */
        //let formattedTime = date.toLocaleTimeString(undefined, { hour12: false }); //по идее должен учитовать локальный часовой пояс
        return formattedTime;
    }
}

function simpleValue(object) {
    if (!object.parameter) {
        object.parameter = new SimpleValueParameter(object, {});
    }
    object.parameter.checkForUpdates();
}

function dateValue(object) {
    if (!object.parameter) {
        object.parameter = new DateValueParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
