#INCLUDE "ObservableObject.js"
#INCLUDE "ObservableObjectLsu.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "CheckLink.js"
class dp_EO extends ObservableObject {
    setupSignalPaths() {
        this.bit_on = this.config.bit_on;
        this.bit_off = this.config.bit_off;
        this.bit_ready = this.config.bit_ready;
        this.valuePath = `${this.config.rootPath}`;
        this.config.ID = accessData.stringValue(`${this.config.rootPath}.${this.bit_on}.ID`, "Text");
        this.config.qualityTag = `${this.config.rootPath}`;
    }

    getInitialState() {
        var state = super.getInitialState();
        return state;
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }


    updateText() {
        this.object.setStringValue(this.config.ID, "name.Text");
         this.object.setStringValue(this.config.ID, "consumer.topText.Text");
        //this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
       this.object.setStringValue("??????", "name.Text");
        RGBAColoring(this.object.indicator.front, colors.SERVICE.Badqual.field, "FillColor");
        RGBAColoring(this.object.indicator.front, colors.SERVICE.Goodqual.field_act, "BackgroundColor");
        this.changeVisibility(this.object.stick_off, false);
        this.changeVisibility(this.object.stick_on, false);
    }

    updateVisuals() {

        if(accessData.boolValue(`${this.valuePath}.${this.bit_on}`))
        {
        this.changeVisibility(this.object.stick_off, false);
        this.changeVisibility(this.object.stick_on, false);
            if(accessData.boolValue(`${this.valuePath}.${this.bit_off}`))
            {
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_back, "BackgroundColor");
        
            }
            else{
                RGBAColoring(this.object.indicator.front, colors.EO.State.on_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.on_back, "BackgroundColor");
               this.changeVisibility(this.object.stick_off, true);
            }
        }
        else if(accessData.boolValue(`${this.valuePath}.${this.bit_off}`))  {
        this.changeVisibility(this.object.stick_off, false);
        this.changeVisibility(this.object.stick_on, false);
            if(accessData.boolValue(`${this.valuePath}.${this.bit_on}`))
            {
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_back, "BackgroundColor");
      
            } 
            else{
                RGBAColoring(this.object.indicator.front, colors.EO.State.off_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.off_back, "BackgroundColor");
                this.changeVisibility(this.object.stick_on, true);
            }
        }
        else if(accessData.boolValue(`${this.valuePath}.${this.bit_ready}`))  {
            RGBAColoring(this.object.indicator.front, colors.EO.State.ready_front, "FillColor");
            RGBAColoring(this.object.indicator.front, colors.EO.State.ready_back, "BackgroundColor");
            this.changeVisibility(this.object.stick_off, false);
            this.changeVisibility(this.object.stick_on, false);
        }
        else {
            RGBAColoring(this.object.indicator.front, colors.EO.State.inact_front, "FillColor");
            RGBAColoring(this.object.indicator.front, colors.EO.State.inact_back, "BackgroundColor");
            this.changeVisibility(this.object.stick_off, false);
            this.changeVisibility(this.object.stick_on, false);
         
        }          
    }
  /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.valuePath)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                //this.openPopup();
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
 /** Изменяет видимость указанного свойства */
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
}
class dp_EO2 extends ObservableObject {
    setupSignalPaths() {
        this.bit_on = this.config.bit_on;
        this.bit_off = this.config.bit_off;
        this.bit_ready = this.config.bit_ready;
        this.word1 = this.config.word1;
        this.word2 = this.config.word2;
        this.valuePath = `${this.config.rootPath}.${this.word1}`;
        this.config.ID = accessData.stringValue(`${this.valuePath}.${this.bit_on}.ID`, "Text");
        this.config.qualityTag = `${this.config.rootPath}`;
        this.faultPath= `${this.config.rootPath}.${this.word2}`;
        

    }

    getInitialState() {
        var state = super.getInitialState();
        return state;
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            quality: accessData.stringValue(this.qualityPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }


    updateText() {
        this.object.setStringValue(this.config.ID, "name.Text");
        //this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
       this.object.setStringValue("??????", "name.Text");
        RGBAColoring(this.object.indicator.front, colors.SERVICE.Badqual.field, "FillColor");
        RGBAColoring(this.object.indicator.front, colors.SERVICE.Goodqual.field_act, "BackgroundColor");
        this.changeVisibility(this.object.stick_off, false);
        this.changeVisibility(this.object.stick_on, false);
    }

    updateVisuals() {
      
        if(accessData.boolValue(`${this.valuePath}.${this.bit_on}`))
        {
        this.changeVisibility(this.object.stick_off, false);
        this.changeVisibility(this.object.stick_on, false);
            if(accessData.boolValue(`${this.faultPath}.${this.bit_off}`))
            {
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_back, "BackgroundColor");
        
            }
            else{
                RGBAColoring(this.object.indicator.front, colors.EO.State.on_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.on_back, "BackgroundColor");
               this.changeVisibility(this.object.stick_off, true);
            }
        }
        else if(accessData.boolValue(`${this.faultPath}.${this.bit_off}`))  {
        this.changeVisibility(this.object.stick_off, false);
        this.changeVisibility(this.object.stick_on, false);
            if(accessData.boolValue(`${this.valuePath}.${this.bit_on}`))
            {
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.no_back, "BackgroundColor");
      
            } 
            else{
                RGBAColoring(this.object.indicator.front, colors.EO.State.off_front, "FillColor");
                RGBAColoring(this.object.indicator.front, colors.EO.State.off_back, "BackgroundColor");
                this.changeVisibility(this.object.stick_on, true);
            }
        }
        else if(accessData.boolValue(`${this.faultPath}.${this.bit_ready}`))  {
            RGBAColoring(this.object.indicator.front, colors.EO.State.ready_front, "FillColor");
            RGBAColoring(this.object.indicator.front, colors.EO.State.ready_back, "BackgroundColor");
            this.changeVisibility(this.object.stick_off, false);
            this.changeVisibility(this.object.stick_on, false);
        }
        else {
            RGBAColoring(this.object.indicator.front, colors.EO.State.inact_front, "FillColor");
            RGBAColoring(this.object.indicator.front, colors.EO.State.inact_back, "BackgroundColor");
            this.changeVisibility(this.object.stick_off, false);
            this.changeVisibility(this.object.stick_on, false);
         
        }          
    }
  /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.valuePath)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                //this.openPopup();
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
 /** Изменяет видимость указанного свойства */
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
}
class status_EO extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.faultPath = `${this.config.word2}`;
        this.config.qualityTag = this.statePath;
        this.num = this.config.num;
        this.config.popup = "EO_popup";
       
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        // const wordWrap = (str, max, br = "\n") =>
        //     str.replace(
        //         new RegExp(`(?![^\\n]{1,${max}}$)([^\\n]{1,${max}})\\s`,"g"),
        //         "$1" + br
        //     );
        // this.w1 = accessData.stringValue(`${this.statePath}.${this.bit}.Description`);
        // this.w2 = wordWrap(this.w1, 15);
        // this.object.setStringValue(this.w2, "desc.Text");
        return true;
    }

    updateBadQuality(){
        // this.object.setStringValue("????????", "desc.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "left.FillColor");
    }

    updateVisuals() {
        let j = Number(this.config.num)+2;
        if(j<10){
            if(accessData.boolValue(`${this.statePath}.b0${j}`) || accessData.boolValue(`${this.statePath}.b0${j+1}`) || accessData.boolValue(`${this.statePath}.b0${j+2}`)){
                RGBAColoring(this.object.left, colors.SERVICE.Flt.actAlm, "FillColor");  
            }
            else 
                RGBAColoring(this.object.left, colors.EO.State.inact_front, "FillColor"); 
        }
        else{
            if(accessData.boolValue(`${this.statePath}.b${j}`) || accessData.boolValue(`${this.statePath}.b${j+1}`) || accessData.boolValue(`${this.statePath}.b${j+2}`) || accessData.boolValue(`${this.faultPath}.b${this.config.bit1}`) || accessData.boolValue(`${this.faultPath}.b${this.config.bit2}`) || accessData.boolValue(`${this.faultPath}.b${this.config.bit3}`)){
                RGBAColoring(this.object.left, colors.SERVICE.Flt.actAlm, "FillColor");  
            }
            else 
                RGBAColoring(this.object.left, colors.EO.State.inact_front, "FillColor"); 
        }

    }
 checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                this.openPopup();
                /*this.object.start ? {} : */this.object.start = this.updateText();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
                // this.checkForFlashing();
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
    openPopup() {
        let mouseEvent = clickRelease(this.object, this.object.name + '.click');  
        if(mouseEvent.action == 'click'){this.object.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: this.config.popup,
                posX: this.object.clickRespons['globalPosX'],
                posY: this.object.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
                num: this.config.num,
                word2 : this.config.word2
            });
        }
    }

    
}
class EO_bit extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;
        this.bit = this.config.bit;
   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        // this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
        this.object.setStringValue(accessData.stringValue(`${this.statePath}.${this.bit}.Description`), "desc.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("????????", "ID.Text");
        RGBAColoring(this.object, colors.AP.Fillstate.field, "left.FillColor");
    }

    updateVisuals() {
        if(accessData.boolValue(`${this.statePath}.${this.bit}`))
        {
             if(accessData.boolValue(`${this.statePath}.${this.bit}.Color`)==1)
                RGBAColoring(this.object, colors.VLV.Fillstate.avar, "left.FillColor");
            else if(accessData.boolValue(`${this.statePath}.${this.bit}.Color`)==9)
                RGBAColoring(this.object, colors.VLV.Fillstate.open, "left.FillColor");
            else
                 RGBAColoring(this.object, colors.SERVICE.Flt.inact, "left.FillColor");
        }
        else{
             RGBAColoring(this.object, colors.SERVICE.Flt.inact, "left.FillColor");
         
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
                // this.checkForFlashing();
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
class system extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;
   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        // this.object.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "ID.Text");
       
      
        return true;
    }

    updateBadQuality(){
        this.object.setStringValue("????????", "ID.Text");
        
    }

    updateVisuals() {
 this.object.setStringValue(accessData.stringValue(`${this.statePath}.Alarm.AE_BitOnText`), "desc.Text");
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
                // this.checkForFlashing();
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
        else if (this.config.type=='ap') {
            this.changeValue(this.object.value, this.currentState.value);
             this.changeColor(this.object.value_field, colors.AP.SimCol.whiteCol, "FillColor");
            this.changeColor(this.object.field, colors.AP.SimCol.whiteCol, "FillColor");
            this.changeColor(this.object.value_field, colors.AP.SimCol.whiteCol, "LineColor");
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

    function dp_eo(object, bit_on, bit_off, bit_ready) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new dp_EO(object, {bit_on : bit_on, bit_off : bit_off, bit_ready : bit_ready});
    }
    object.parameter.checkForUpdates();
}
    function dp_eo2(object, word1, word2, st, bit_on, bit_off, bit_ready) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new dp_EO2(object, {word1 : word1, word2 : word2, st : st, bit_on : bit_on, bit_off : bit_off, bit_ready : bit_ready});
    }
    object.parameter.checkForUpdates();
}
    function status(object, num, word2, bit1, bit2, bit3) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new status_EO(object, {num : num, word2 : word2, bit1 : bit1, bit2 : bit2, bit3 : bit3});
    }
    object.parameter.checkForUpdates();
}
    function bit_eo(object, bit) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new EO_bit(object, {bit : bit});
    }
    object.parameter.checkForUpdates();
}
    function sys(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new system(object, {});
    }
    object.parameter.checkForUpdates();
}