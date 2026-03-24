#INCLUDE "ObservableObject.js"
class checkLink extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}.${this.config.out2}`;
        this.statePath = `${this.config.rootPath}.${this.config.out}`;
        this.Link_PLK = `KSPG.AreaEvent.${this.config.PLK}.FLT`;
        this.config.qualityTag = this.Link_PLK;
        this.faultPath = `${this.config.rootPath}`;
    }

    getInitialState() {
        
        return {
            quality: null,
            value: null,
            state: null,
            fault: null,
            TF1: null,
            TF2: null,
            TF3: null,
            TF4: null,
            GS: null,
            MAG: null,
            timestamp: null,
        };
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            TF1: accessData.boolValue(`${this.faultPath}.TF1`),
            TF2: accessData.boolValue(`${this.faultPath}.TF2`),
            TF3: accessData.boolValue(`${this.faultPath}.TF3`),
            TF4: accessData.boolValue(`${this.faultPath}.TF4`),
            GS: accessData.boolValue(`${this.faultPath}.GS`),
            MAG: accessData.boolValue(`${this.faultPath}.MAG`),
            Link_PLK: accessData.doubleValue(this.Link_PLK),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime(),
         
        };
        return newState;
    }
    hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.fault !== this.currentState.fault ||
            newState.TF1 !== this.currentState.TF1 ||
            newState.TF2 !== this.currentState.TF2 ||
            newState.TF3 !== this.currentState.TF3 ||
            newState.TF4 !== this.currentState.TF4 ||
            newState.GS !== this.currentState.GS ||
            newState.MAG !== this.currentState.MAG ||
            newState.Link_PLK !== this.currentState.Link_PLK ||
            newState.priority !== this.currentState.priority ||
            newState.quality !== this.currentState.quality) {
            return true;
        }    
    }

    updateText() {
    
    }

    updateBadQuality(){
        layer.setVisible("link",false)
    }

    updateVisuals() {
        if(this.config.out == 'qwe'){
            if (accessData.boolValue(this.Link_PLK)) {
            layer.setVisible("link",true)
        }
            else 
            layer.setVisible("link",false)
        }
        else if(accessData.stringValue(`${this.statePath}.Description`).includes("БКК")){
            if(accessData.boolValue(this.statePath) || accessData.boolValue(this.valuePath))
                layer.setVisible("link",true)
            else 
                layer.setVisible("link",false)
        }
        else if(this.config.out == 'AreaSysFlt' || this.config.out == 'AreaWrn'){
             if (accessData.doubleValue(this.statePath)==1) {
            layer.setVisible("link",true)
        }
            else 
            layer.setVisible("link",false)
        }
        else if(accessData.stringValue(`${this.statePath}.Description`).includes("БПАиВ")){
             if(accessData.boolValue(this.statePath) || accessData.boolValue(this.valuePath))
              layer.setVisible("link",true)
            else
              layer.setVisible("link",false)
        }
        else if(accessData.stringValue(`${this.statePath}.Description`).includes("TurboFlow")){
             if(!accessData.boolValue(this.statePath))
              layer.setVisible("link",true)
            else
              layer.setVisible("link",false)
        }
        else if(this.config.out == 'bkk2') {
            if (!accessData.boolValue(`${this.faultPath}.TF1`) && !accessData.boolValue(`${this.faultPath}.TF2`) && !accessData.boolValue(`${this.faultPath}.TF3`) && !accessData.boolValue(`${this.faultPath}.TF4`) && !accessData.boolValue(`${this.faultPath}.MAG`) && !accessData.boolValue(`${this.faultPath}.GS`)) 
                layer.setVisible("link",true)
            else 
                layer.setVisible("link",false)
        }
        else{
            if(accessData.boolValue(this.statePath))
              layer.setVisible("link",true)
            else
              layer.setVisible("link",false)
        }
    }
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
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
function checkLin(object, out, PLK, out2) {
    //какая то реализация динамики квадратиков A W S на кнопках навигации через экземпляр ObsetvableObject
  if (!object.parameter) {
        object.name = objectName;
        object.parameter = new checkLink(object, {out : out, PLK : PLK, out2 : out2});
    }
    object.parameter.checkForUpdates();
    
}
