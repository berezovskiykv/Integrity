#INCLUDE "ObservableObject.js"
class checkEv extends ObservableObject {
    setupSignalPaths() {
        this.valuePath = `${this.config.rootPath}.${this.config.ALM}`;
        this.statePath = `${this.config.rootPath}.${this.config.WRN}`;
        this.faultPath = `${this.config.rootPath}.${this.config.FLT}`;
        this.kvitAlmPath = `${this.config.rootPath}.${this.config.ALM}.kvit`;
        this.kvitWrnPath = `${this.config.rootPath}.${this.config.WRN}.kvit`;
        this.kvitFltPath = `${this.config.rootPath}.${this.config.FLT}.kvit`;
        this.config.qualityTag = `${this.config.rootPath}`;
        this.Link_PLK = `KSPG.AreaEvent.${this.config.PLK}.FLT`;
       
    }

    getInitialState() {
        
        return {
            quality: null,
            value: null,
            state: null,
            fault: null,
            kvitAlm: null,
            kvitWrn: null,
            kvitFlt: null,
            Link_PLK: null,
            timestamp: null,
        };
    }

    readCurrentState() {
        var newState = {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            kvitAlm: accessData.doubleValue(this.kvitAlmPath),
            kvitWrn: accessData.doubleValue(this.kvitWrnPath),
            kvitFlt: accessData.doubleValue(this.kvitFltPath),
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
            newState.kvitAlm !== this.currentState.kvitAlm ||
            newState.kvitWrn !== this.currentState.kvitWrn ||
            newState.kvitFlt !== this.currentState.kvitFlt ||
            newState.Link_PLK !== this.currentState.Link_PLK ||
            newState.priority !== this.currentState.priority ||
            newState.quality !== this.currentState.quality) {
            return true;
        }    
    }

    updateText() {
    
    }

    updateBadQuality(){
        this.object.ALM.setVisible(false);
        this.object.WRN.setVisible(false);
        this.object.FLT.setVisible(false);
    }

    updateVisuals() {
        if (accessData.boolValue(this.valuePath)) {
            this.object.ALM.setVisible(true);
            this.changeColor(this.object.ALM.Rectangle,  colors.SERVICE.Flt.actAlm, "FillColor");
        }
        else 
            this.object.ALM.setVisible(false);
        if (accessData.boolValue(this.statePath)) {
            this.object.WRN.setVisible(true);
            this.changeColor(this.object.WRN.Rectangle,  colors.SERVICE.Flt.actWrn, "FillColor");
        }
        else 
            this.object.WRN.setVisible(false);
    
        if (accessData.boolValue(this.faultPath) || accessData.boolValue(this.Link_PLK)) {
            this.object.FLT.setVisible(true);
            this.changeColor(this.object.FLT.Rectangle,  colors.SERVICE.Goodqual.text, "FillColor");
        }
        else 
            this.object.FLT.setVisible(false);

    }
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (1) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
                this.checkForFlashing();
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


    checkForKvit() {

    }

    checkForFlashing() {
        if (accessData.boolValue(this.kvitAlmPath)) {
            // let currentTextColor = this.object.ALM.Text.getColorValue("FillColor");
            let currentFillColor = this.object.ALM.Rectangle.getRGBAColorValue("FillColor");
            // this.flashingColor(this.object.ALM.Text, currentTextColor, colors.SERVICE.Goodqual.text, "FillColor");
            this.flashingColor(this.object.ALM.Rectangle, colors.SERVICE.Flt.actAlm, colors.SERVICE.NavBtn.inact, "FillColor");
        }

        if (accessData.boolValue(this.kvitWrnPath)) {
            // let currentTextColor = this.object.WRN.Text.getColorValue("FillColor");
            let currentFillColor = this.object.WRN.Rectangle.getRGBAColorValue("FillColor");
            // this.flashingColor(this.object.WRN.Text, currentTextColor, colors.SERVICE.Goodqual.text, "FillColor");
            this.flashingColor(this.object.WRN.Rectangle, colors.SERVICE.Flt.actWrn, colors.SERVICE.NavBtn.inact, "FillColor");
        }

        if (accessData.boolValue(this.kvitFltPath)){
            // let currentTextColor = this.object.FLT.Text.getColorValue("FillColor");
            let currentFillColor = this.object.FLT.Rectangle.getRGBAColorValue("FillColor");
            // this.flashingColor(this.object.FLT.Text, currentTextColor, colors.SERVICE.Goodqual.text, "FillColor");
            this.flashingColor(this.object.FLT.Rectangle, colors.SERVICE.Goodqual.text, colors.SERVICE.NavBtn.inact, "FillColor"); 
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

}
