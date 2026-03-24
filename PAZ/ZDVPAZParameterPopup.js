#INCLUDE "ObservablePopup.js"

class ZDVPAZParameterPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        //this.setupSignalsPath();
        this.initialize();
        //let context = this;
        //publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    initialize() {
        title.access.setStringValue("Несоответствие состояния задвижек целевому положению", "Text");
        //this.rootPath = getAliasesPath(this.object);
        //subtitle.access.setStringValue("Уставки", "Text");
    }

    setupSignalsPath() {
   
        //let inputTag = accessData.stringValue("inputTag");
        //this.statePath = `${this.config.rootPath}`;
        //this.config.Code = `${this.config.rootPath}.${code}`;
    }
    determineColor(state, object) {
        let code = object.stringValue("CONST");
        if ((state === null || state === undefined))  return;

    
        return (!!(state & (accessData.intValue(code)))) ? colors.DP.Fillstate.act1 : colors.DP.Fillstate.act3
    }


    publish_updateState(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([getAliasesPath(object)
                                                    ], 
                (newValue) => {this.updateState(newValue.value, newValue.tag, this, object)})
            }
        else {}
    }

    updateState(state, quality, context, object) {
            //if (quality) {
                let color = context.determineColor(state, object);
                RGBAColoring(object.INDICATOR, color, "FillColor");
            //}
            //else {
            //}
    }
}
    


    

