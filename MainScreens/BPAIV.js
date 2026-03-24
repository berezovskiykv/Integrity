#INCLUDE "ObservableObjectLsu.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"



class BPAiV_AP extends ObservableObjectLsu {
   
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}.val`;
        this.statePath = `${this.config.rootPath}`;
        this.config.EUnit = accessData.stringValue(`${this.config.rootPath}.val.EUnit`);
        this.config.qualityTag1= `${this.config.rootPath}`;
        if(this.config.type=='dp')
            this.config.Description = accessData.stringValue(`${this.config.rootPath}.Description`);
        else if (this.config.type=='ap')
        {
            this.config.Description = accessData.stringValue(`${this.config.rootPath}.val.ID`);
            this.config.qualityTag1 = `${this.config.rootPath}.val`;
        }
     
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
        this.object.setStringValue(this.config.Description, "id.Text");
        this.object.setStringValue("", "unit.Text");
        this.object.setStringValue("", "value.Text")
        this.object.setStringValue("Нет статуса", "Decs.Text");
        RGBAColoring(this.object, colors.SERVICE.Badqual.field, "st.FillColor");
        this.changeColor(this.object.value_field, colors.ElemAT.Fillstate.default, "FillColor");
         this.changeColor(this.object.field, colors.ElemAT.Fillstate.default, "FillColor");
          this.changeColor(this.object.value_field, colors.ElemAT.Fillstate.default, "LineColor");

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
        if(this.config.type == 'dp')
        {
            if(accessData.boolValue(`${this.config.rootPath}`))
                RGBAColoring(this.object.state, colors.AP.Flt.act, "FillColor")
            else
                RGBAColoring(this.object.state, colors.AP.Flt.inact, "FillColor")
        }
        else if (this.config.type=='ap'){
            this.changeValue(this.object.value, this.currentState.value);
            this.changeColor(this.object.value_field, colors.AP.SimCol.whiteCol, "FillColor");
            this.changeColor(this.object.field, colors.AP.SimCol.whiteCol, "FillColor");
            this.changeColor(this.object.value_field, colors.AP.SimCol.whiteCol, "LineColor");
        }
      
        else
        {
            RGBAColoring(this.object.st, colors.AP.Flt.inact, "FillColor")
            if(accessData.doubleValue(`${this.config.rootPath}`)==1)
            {
                this.object.Decs.setStringValue("Стоп", "Text");
                RGBAColoring(this.object.st, colors.AGT.Indicatorstate.RDYStop, "TextColor");
            }  
            if(accessData.doubleValue(`${this.config.rootPath}`)==2){
                this.object.Decs.setStringValue("Ожидание входных параматров", "Text");
                RGBAColoring(this.object.st, colors.AP.Fillstate.field, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==3){
                this.object.Decs.setStringValue("Ожидание выходных параметров", "Text");
                RGBAColoring(this.object.st, colors.AP.Fillstate.field, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==4){
                 this.object.Decs.setStringValue("Работа", "Text");
                 RGBAColoring(this.object.st, colors.VLV.Fillstate.open, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==5){
                this.object.Decs.setStringValue("Ручной режим", "Text");
                RGBAColoring(this.object.st, colors.EO.State.no_front, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==6){
                this.object.Decs.setStringValue("Запуск в автоматическом режиме", "Text");
                RGBAColoring(this.object.st, colors.VLV.Fillstate.open, "FillColor");
            }   
            if(accessData.doubleValue(`${this.config.rootPath}`)==7) {
                this.object.Decs.setStringValue("Запуск в ручном режиме", "Text");
                RGBAColoring(this.object.st, colors.EO.State.no_front, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==8) {
                 this.object.Decs.setStringValue("Останов", "Text");
                 RGBAColoring(this.object.st, colors.AGT.Indicatorstate.RDYStop, "TextColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==9)
            {
                this.object.Decs.setStringValue("Авария", "Text");
                RGBAColoring(this.object.st, colors.AP.Flt.act, "FillColor")
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==10) {
                this.object.Decs.setStringValue("Сброс давлений", "Text");
                 RGBAColoring(this.object.st, colors.AP.Fillstate.field, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==11) {
                this.object.Decs.setStringValue("Переход в сброс давлений", "Text");
                RGBAColoring(this.object.st, colors.AP.Fillstate.field, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==12) {
                this.object.Decs.setStringValue("Переход в ожид. выходных парам.", "Text");
                 RGBAColoring(this.object.st, colors.AP.Fillstate.field, "FillColor");
            } 
            if(accessData.doubleValue(`${this.config.rootPath}`)==13) {
                this.object.Decs.setStringValue("Переход в ожид. входных парам.", "Text");
                RGBAColoring(this.object.st, colors.AP.Fillstate.field, "FillColor");
            }
            if(accessData.doubleValue(`${this.config.rootPath}`)==14) {
                this.object.Decs.setStringValue("Мгновенный останов", "Text");
                 RGBAColoring(this.object.st, colors.AGT.Indicatorstate.RDYStop, "TextColor");
            }
               
              
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

 button1(object, objectName, cm)
 {
   runAccessBox(object, objectName + '.click', {codes: `codes.BPAiV.cmd.${cm}`, inputTag: `KSPG.BPAiV.Azot`})
 }
 button2(object, objectName, cm)
 {
   runAccessBox(object, objectName + '.click', {codes: `codes.BPAiV.cmd.${cm}`, inputTag: `KSPG.BPAiV.air`})
 }

}
function ap_bpaiv(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BPAiV_AP(object, {type : 'ap'});
    }
    object.parameter.checkForUpdates();
}
function dp_bpaiv(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BPAiV_AP(object, {type : 'dp'});
    }
    object.parameter.checkForUpdates();
}
function dp_st(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BPAiV_AP(object, {type : 'status'});
    }
    object.parameter.checkForUpdates();
}
function button(object, objectName, cm) {
        if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BPAiV_AP(object, {cm : cm});
    }
   // object.parameter.checkForUpdates();
     object.parameter.button1(object, objectName, cm);
}
function button2(object, objectName, cm) {
        if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BPAiV_AP(object, {cm : cm});
    }
   // object.parameter.checkForUpdates();
     object.parameter.button2(object, objectName, cm);
}
