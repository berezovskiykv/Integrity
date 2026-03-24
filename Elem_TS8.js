#INCLUDE "ObservableObject.js"

class TS8Parameter extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        //environment.logInfo("Path TS8 Error: " + this.statePath);
        //environment.logInfo("ElemTS");
        this.kvitPath = `${this.config.rootPath}.Kvit`;
        this.severityPath = `${this.config.rootPath}.AE_BitOnSeverity`;
        this.modFltPath = this.statePath.slice(0, this.statePath.indexOf('.Out')) + ".ModFlt";
        this.config.qualityTag = `${this.config.rootPath}`;
        this.config.Description = accessData.stringValue(`${this.config.rootPath}.Description`);
    }

    readCurrentState() {
        return {
            state: accessData.doubleValue(this.statePath),
            kvit: accessData.doubleValue(this.kvitPath),
            severity: accessData.doubleValue(this.severityPath),
            modFlt: accessData.doubleValue(this.modFltPath),
            quality: accessData.stringValue(this.qualityTag),
            timestamp: new Date().getTime()
        };
    }

     checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (getSignalQuality(this.config.qualityTag)) {
            this.updateText();
            if (hasChanged) {
                this.currentState = newState;
                this.onStateChanged();
                this.copyState(this.currentState, this.previousState);
                return true;
            }
            this.checkForFlashing();
        }
        else {
            clickClear(this.object, this.object.name + ".click");
            this.updateBadQuality();
        }
        return false;
    }

    hasStateChanged(newState) {
        return newState.state !== this.currentState.state ||
               newState.severity !== this.currentState.severity ||
               newState.quality !== this.currentState.quality ||
               newState.kvit !== this.currentState.kvit ||
               newState.modFlt !== this.currentState.modFlt;
    }

    updateText() {
        this.object.setStringValue(this.config.Description, "id.Text");
    }

    updateBadQuality() {
        //this.object.id.access.setStringValue("?????????", "Text");
        this.changeColor(this.object.status, colors.ElemTS.Fillstate.bad, "FillColor");
        this.changeVisibility(this.object.status, true);
    }

    updateVisuals() {
        this.processStateBits();
        let colors = this.determineColor();
        this.changeColor(this.object.status, colors.value_state, "FillColor");
        this.changeColor(this.object.status, colors.back_state, "BackgroundColor");
    }

    processStateBits() {
        let state = this.currentState.state;
        let severity = this.currentState.severity;
        let kvit = this.currentState.kvit;
        if (((state === null || state === undefined) || (severity === null || severity === undefined) || (kvit === null || kvit === undefined))) return;
        
        this.state = state;
        this.rawSeverity = severity;
        
        this.severityFlags = {
            avar: (severity == 1),
            pred: (severity == 2),
            inf: (severity == 9),
            kvit: (kvit == true)  
        };
    }


    determineColor() {
        return {
            value_state: 
                this.severityFlags.avar && this.state ? colors.ElemTS.Fillstate.main1 :
                this.severityFlags.pred && this.state ? colors.ElemTS.Fillstate.main2 :
                this.severityFlags.inf  && this.state ? colors.ElemTS.Fillstate.main3 :
                colors.ElemTS.Fillstate.bad,
            
            back_state: 
                this.severityFlags.avar && this.state ? colors.ElemTS.Fillstate.back1 :
                this.severityFlags.pred && this.state ? colors.ElemTS.Fillstate.back2 :
                this.severityFlags.inf  && this.state ? colors.ElemTS.Fillstate.back3 :
                colors.ElemTS.Fillstate.bad
        };
    }

    checkForFlashing() {
        if (this.severityFlags.kvit) {
            const currentColors = this.determineColor();
            this.flashingColor(this.object.status, currentColors.value_state, colors.ElemTS.Fillstate.kvit, "FillColor");
            this.flashingColor(this.object.status, currentColors.back_state, colors.ElemTS.Fillstate.kvit_back, "BackgroundColor");
        }
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

function ts8_elem(object) {
    if (!object.parameter) {
        object.parameter = new TS8Parameter(object, {
            rootPath: getAliasesPath(object)
        });
    }
    object.parameter.checkForUpdates();
}
