#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "MainScreens/BR/BR+BPT.js"
#INCLUDE "Elem_AP.js"
#INCLUDE "Elem_AT.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/ALGBHIO.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"

#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "overview";
[position, diagNameMouse] = currentPositionPRJ();
//active = true;
#ONCE_EXECUTION_END
active = isDiagramActive(diagName, position);

class LSPG_state extends ObservableObject {
   
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}`;
        this.config.qualityTag1= `${this.config.rootPath}`;
     
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            state_quality: accessData.stringValue(this.config.qualityTag1),
            value_quality: accessData.stringValue(this.config.qualityTag2),
            timestamp: new Date().getTime(),
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.Description, "id.Text");
        this.object.setStringValue(this.config.EUnit, "unit.Text");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("Нет статуса", "Decs.Text");
        RGBAColoring(this.object, colors.SERVICE.Badqual.field, "st.FillColor");

    }
    
    updateGoodQuality() {
    this.updateText();
    this.updateVisuals();
}

hasStateChanged(newState) {
    const qualityChanged = 
        (getSignalQuality(this.config.qualityTag1) !== getSignalQuality(newState.state_quality)) ||
        (getSignalQuality(this.config.qualityTag2) !== getSignalQuality(newState.value_quality));
    
    return qualityChanged || 
           newState.value !== this.currentState.value ||
           newState.state !== this.currentState.state;
}

   
    updateVisuals() {
        if(accessData.doubleValue(`${this.config.rootPath}`)==32)
            {
                this.object.Decs.setStringValue("Аварийный останов от системы ПАЗ КСПГ", "Text");
                 RGBAColoring(this.object.st, colors.AP.Flt.act, "FillColor")
            }  
           else if(accessData.doubleValue(`${this.config.rootPath}`)==64){
                this.object.Decs.setStringValue("Аварийный останов ЛСПГ", "Text");
               RGBAColoring(this.object.st, colors.AP.Flt.act, "FillColor")
            }
           else if(accessData.doubleValue(`${this.config.rootPath}`)==128){
                this.object.Decs.setStringValue("Готовность к пуску ЛСПГ", "Text");
                   RGBAColoring(this.object.st, colors.VLV.Fillstate.open, "FillColor");
            }
            else if(accessData.doubleValue(`${this.config.rootPath}`)==256){
                 this.object.Decs.setStringValue("Выдача СПГ остановлена", "Text");
                  RGBAColoring(this.object.st, colors.AGT.Indicatorstate.RDYStop, "TextColor");
            }
            else if(accessData.doubleValue(`${this.config.rootPath}`)==512){
                this.object.Decs.setStringValue("Требуется перекрытие пассивного потока", "Text");
               RGBAColoring(this.object.st, colors.AGT.Indicatorstate.RDYStop, "TextColor");
            }
            else if(accessData.doubleValue(`${this.config.rootPath}`)==1024){
                this.object.Decs.setStringValue("Аварийный останов ПАЗ", "Text");
                RGBAColoring(this.object.st, colors.AP.Flt.act, "FillColor")
            }   
            else if(accessData.doubleValue(`${this.config.rootPath}`)==2048) {
                this.object.Decs.setStringValue("Нормальный останов", "Text");
                RGBAColoring(this.object.st, colors.VLV.Fillstate.open, "FillColor");
            }
            else if(accessData.doubleValue(`${this.config.rootPath}`)==4096) {
                 this.object.Decs.setStringValue("Пуск и работа", "Text");
                RGBAColoring(this.object.st, colors.VLV.Fillstate.open, "FillColor");
            }
            else {
                  this.object.Decs.setStringValue("Нет статуса", "Text");
                   RGBAColoring(this.object, colors.SERVICE.Badqual.field, "st.FillColor");
            }
    }
checkForUpdates() {
    var newState = this.readCurrentState();
    var hasChanged = this.hasStateChanged(newState);
    var isGoodQuality = getSignalQuality(this.config.qualityTag1);

    if (active) {
        if (isGoodQuality) {
            // Если качество улучшилось (было плохое → стало хорошее)
            if (!this.wasGoodQualityBefore) {
                this.updateText();  // Принудительно обновляем текст
                this.wasGoodQualityBefore = true;
            }
            
            if (hasChanged) {
                this.currentState = newState;
                this.onStateChanged();
                this.copyState(this.currentState, this.previousState);
                return true;
            }
        }
        else {
            this.updateBadQuality();
            this.wasGoodQualityBefore = false;
            this.currentState = newState;
            this.copyState(this.currentState, this.previousState);
        }
    }
    return false;
}
    changeValue(child, parameter) {
        if (child) {
            child.access.setStringValue(parameter.toFixed(2), "Text");
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

function lspg_st(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new LSPG_state(object, {});
    }
    object.parameter.checkForUpdates();
}

