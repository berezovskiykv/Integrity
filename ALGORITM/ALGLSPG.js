#INCLUDE "ObservableObject.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/colorSettings.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "Managers/hoverManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/aliasManager.js"

class ModeLspg extends ObservableObject {
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
    }


    readCurrentState() {
        var newState = {
            state: accessData.boolValue(this.statePath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.description, "ID.Text");
        return true;
    }

    updateBadQuality(){
        this.changeVisibility(this.object.state);
    }

    updateVisuals() {
        this.object.setStringValue(this.config.description, "ID.Text");
        this.processStateBits();
        this.changeVisibility(this.object.state, this.state.act);

    }
    
    checkForFlashing() {
 
    }

 
    changeText(object, value) {
        if (object) {
            object.access.setStringValue(value, "Text");
        }
    }

    /** Изменяет видимость указанного свойства */
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
        checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            this.object.start = this.updateText();
            //if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : this.object.start = this.updateText();*/
                runAccessBox(this.object, this.object.name + '.click', {codes: `codes.ALGRUN.cmd.${this.config.cm}`, inputTag: `KSPG.ALG.ALGRUN`})
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
            }
            // else {
            //     clickClear(this.object, this.object.name + ".click")
            //     this.updateBadQuality()
            //     this.currentState = this.getInitialState()
            // }
        // }
        // else return;
    }

     processStateBits() {
        let state = this.currentState.state;
        if (state === null || state === undefined) return;

        this.state = {
            act         :  (accessData.boolValue(`${this.config.rootPath}`) == true)

        }
    }
}

function LspgMode(object,objectName,cm) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new ModeLspg(object, {cm:cm});
    }
    object.parameter.checkForUpdates();
}
