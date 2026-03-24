#INCLUDE "ObservableObject.js"
#INCLUDE "Managers/colorSettings.js"

class ElemTSParameter extends ObservableObject {
    constructor(object, config) {
        super(object, config);
        this.forceInitialUpdate = true; // Флаг для принудительного обновления при инициализации
    }

    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.severityPath = `${this.config.rootPath}.AE_BitOnSeverity`;
        this.config.qualityTag = `${this.config.rootPath}`;
        this.config.description = accessData.stringValue(`${this.config.rootPath}.Description`);
        //environment.logInfo(this.config.qualityTag);
    }

    readCurrentState() {
        return {
            state: S(this.statePath),
            quality: accessData.stringValue(this.qualityTag),
            timestamp: new Date().getTime()
        };
    }

     checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        //if (getSignalQuality(this.config.qualityTag)) {
            this.updateText();
            if (hasChanged) {
                this.currentState = newState;
                this.onStateChanged();
                this.copyState(this.currentState, this.previousState);
                return true;
            }
            this.checkForFlashing();
        }

    hasStateChanged(newState) {
        return newState.state !== this.currentState.state
    }

    updateText() {
        //this.object.setStringValue(this.config.description, "Description.Text");
        /*  При именовании графического элемента типа "текст", 
            настройки этого элемента сбрасываються по умолчанию,
            кроме настроек размера элемента. 
        this.object.setStringValue(this.config.description, "Description.Text");
        this.object.setStringValue("false", "Description.Fill");
        this.object.setStringValue("left", "Description.Alignment");
        */

        this.object.setStringValue(this.config.description, "ID.Text");
        this.object.setStringValue("false", "Descr.Fill");
        this.object.setStringValue("left", "Descr.Alignment");
    }

    updateBadQuality() {
        //this.object.access.setStringValue("?????????", "Descr.Text");
        this.object.setStringValue(this.config.description, "ID.Text");
        this.changeColor(this.object.indicator, colors.ElemTS.Fillstate.bad, "FillColor");
        //this.changeVisibility(this.object.indicator, true);
    }

    updateVisuals() {
        this.object.setStringValue(this.config.description, "ID.Text");
        this.processStateBits();
        let colors = this.determineColor();
        this.changeColor(this.object.indicator, colors.value_state, "FillColor");
        this.changeColor(this.object.indicator, colors.back_state, "BackgroundColor");
    }

    processStateBits() {
        let state = this.currentState.state;
        let severity = S(this.severityPath);
        //let kvit = this.currentState.kvit;
        if (((state === null || state === undefined) || (severity === null || severity === undefined))) return;
        
        this.state = state;
        this.rawSeverity = severity;
        
        this.severityFlags = {
            alm: (severity == 1),
            wrn: (severity == 2),
            inf: (severity > 9),
            //kvit: (kvit == true)  
        };
    }


    determineColor() {
        return {
            value_state: 
                this.severityFlags.alm && this.state ? colors.ElemTS.Fillstate.main1 :
                this.severityFlags.wrn && this.state ? colors.ElemTS.Fillstate.main2 :
                this.severityFlags.inf  && this.state ? colors.ElemTS.Fillstate.main3 :
                colors.ElemTS.Fillstate.bad,
            
            back_state: 
                this.severityFlags.alm && this.state ? colors.ElemTS.Fillstate.back1 :
                this.severityFlags.wrn && this.state ? colors.ElemTS.Fillstate.back2 :
                this.severityFlags.inf  && this.state ? colors.ElemTS.Fillstate.back3 :
                colors.ElemTS.Fillstate.bad
        };
    }

    checkForFlashing() {
        // if (this.severityFlags.kvit) {
        //     const currentColors = this.determineColor();
        //     this.flashingColor(this.object.status, currentColors.value_state, colors.ElemTS.Fillstate.kvit, "FillColor");
        //     this.flashingColor(this.object.status, currentColors.back_state, colors.ElemTS.Fillstate.kvit_back, "BackgroundColor");
        // }
    }

    flashingColor (child, color1, color2, property) {
        if (child) {
            flashing(child, color1, color2, property)
        }
    }

    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }
       
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
}

function tselem(object) {
    if (!object.parameter) {
        object.parameter = new ElemTSParameter(object, {
            //rootPath: getAliasesPath(object)
        });
    }
    object.parameter.checkForUpdates();
}
