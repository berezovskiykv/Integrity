#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "SIR/SirParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "Elem_AP.js"
#INCLUDE "Elem_AT.js"
#INCLUDE "MainScreens/BSBO/BO_objects.js"
#INCLUDE "ObservableObject.js"
#INCLUDE "CheckLink.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "drain_column";
active = true;
diagNameMouse = "drain_column"
#ONCE_EXECUTION_END
// active = isEmbededDiagramActive('bsbo', diagName, 'bsboscr');

class statusMass extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            open: accessData.boolValue(this.openPath),
            close: accessData.boolValue(this.closePath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
   
        return true;
    }

    updateBadQuality(){
         this.object.stage.setStringValue("Нет состояния","Text");
         RGBAColoring(this.object.field, colors.SERVICE.Badqual.field, "FillColor");
    }

    updateVisuals() {
     if(accessData.doubleValue(this.statePath)==0)
        {
            this.object.stage.setStringValue("Ожидание команды","Text");
            RGBAColoring(this.object.field, colors.AP.Fillstate.field, "FillColor");
        }
        else if(accessData.doubleValue(this.statePath)==1)
        {
            this.object.stage.setStringValue("Подготовка к отгрузке","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
            //RGBAColoring(this.object.stage, colors.AGT.Indicatorstate.RDYStop, "TextColor");
        }
        else if(accessData.doubleValue(this.statePath)==2)
        {
            this.object.stage.setStringValue("Захолаживание насоса","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
        }
        else if(accessData.doubleValue(this.statePath)==3)
        {
            this.object.stage.setStringValue("Захолаживание СК","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
        }
        else if(accessData.doubleValue(this.statePath)==4)
        {
            this.object.stage.setStringValue("Налив","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
        }
        else if(accessData.doubleValue(this.statePath)==5)
        {
            this.object.stage.setStringValue("Пауза","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.close, "FillColor");
            RGBAColoring(this.object.stage, colors.AGT.Indicatorstate.RDYStop, "TextColor");
        }
        else if(accessData.doubleValue(this.statePath)==6)
        {
            this.object.stage.setStringValue("Ручное захолаживание","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
        }
        else if(accessData.doubleValue(this.statePath)==7)
        {
            this.object.stage.setStringValue("Ручная отгрузка","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
        }
        else if(accessData.doubleValue(this.statePath)==8)
        {
            this.object.stage.setStringValue("Прерывание отгрузки","Text");
            RGBAColoring(this.object.field, colors.VLV.Fillstate.avar, "FillColor");
        }
        else {
               this.object.stage.setStringValue("Нет состояния","Text");
         RGBAColoring(this.object.field, colors.SERVICE.Badqual.field, "FillColor");
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
class param extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        if(this.config.type=='freeze'){
             this.config.popup = 'AP_CK';
             this.config.qualityTag = `${this.statePath}.Freezing_massRes`;
        }
        else {
            this.config.popup = 'AP_CK_2';
            this.config.qualityTag = `${this.statePath}.Naliv_massRes`;
        }
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
   
        return true;
    }

    updateBadQuality(){
       
    }

    updateVisuals() {
    
    }
    
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (accessData.doubleValue(this.config.qualityTag)>=0) {
                this.openPopup();
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
class CK_status extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            open: accessData.boolValue(this.openPath),
            close: accessData.boolValue(this.closePath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
   
        return true;
    }

    updateBadQuality(){
    RGBAColoring(this.object.field, colors.AP.Fillstate.field, "FillColor");
    this.object.stage.setStringValue("Нет статуса", "Text");
    }

    updateVisuals() {
        let text = accessData.stringValue(`${this.statePath}.Alarm.Description`);
        let wrap = wrapText(text, 37);
        if(accessData.stringValue(`${this.statePath}.Alarm.Description`) != undefined)
            this.object.stage.setStringValue(wrap, "Text");
        else
          //  this.object.stage.setStringValue("??????????", "Text");
            this.object.stage.setStringValue("Нет статуса", "Text");
        if (this.config.alm=='alm')
            RGBAColoring(this.object.field, colors.VLV.Fillstate.avar, "FillColor");
        else
         RGBAColoring(this.object.field, colors.VLV.Fillstate.open, "FillColor");
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
    wrapText(text, charsPerLine){
        let result='';
        for(let i=0;i<text.length;i+=charsPerLine){
            result +=text.substring(i,i+charsPerLine)+'\n';
        }
        return result;
    }
    
}

function status(object, alm, num) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new CK_status(object, {alm : alm, num : num});
    }
    object.parameter.checkForUpdates();
}
function statMass(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new statusMass(object, {});
    }
    object.parameter.checkForUpdates();
}

function parament(object, type) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new param(object, {type : type});
    }
    object.parameter.checkForUpdates();
}

function  button(object, objectName, tag, descr)
 {
   runAccessBox(object, objectName + '.click', {value: 2, postfix:`.wvalue`, inputTag: `KSPG.CK.${tag}`, desc: descr})
 }
 function  button2(object, objectName, tag, descr)
 {
   runAccessBox(object, objectName + '.click', {value: 1, postfix:``, inputTag: `KSPG.CK.${tag}`, desc: descr})
 }