#INCLUDE "ObservableObjectLsu2.js"

class ElemPTParameter extends ObservableObject {
    constructor(object, config) {
        super(object, config);
        this.forceInitialUpdate = true;
    }
   
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;  // Только путь к Tfail
        this.config.qualityTag = `${this.config.rootPath}`;
        //environment.logInfo("ElemPT");
    }

    readCurrentState() {
        return {
            value: accessData.doubleValue(this.valuePath),  // Чтение только Tfail
            quality: accessData.stringValue(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
    }
    updateText() {
        // Пустая реализация, если не используется
    }
    checkForFlashing() {
        // Пустая реализация, если мигание не требуется
    }

    updateBadQuality() {
        if (this.object) {
            this.object.setStringValue("???", "time.Text.Text");
        }
    }
    
    updateVisuals() {
        this.changeValue(this.object.time.Text, this.currentState.value);
        this.forceInitialUpdate = false;
    }

    changeValue(child, value) {
        if (child && child.access && child.access.setStringValue) {
            child.access.setStringValue(value, "Text");
        }
    }
}

function elempt(object) {
    if (!object.parameter) {
        object.parameter = new ElemPTParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
