#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class BHIOMassPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.statePath = `${this.rootPath}.Status`;
      
    }

    initialize() {

    }
    publish_updateSetPoints(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.xa.${prefix}`
                                                    ], 
                (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }
   
   updateSetPoints(value, state, prefix, context, object) {
        if(getSignalQuality(this.statePath)) {
            object.set.value.setStringValue(accessData.doubleValue(`${this.valuePath}.xa.${prefix}`).toFixed(2), "Text");
            RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
            }
        else {
            RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor")
            object.set.value.setStringValue("???.???", "Text");
        }
    }
     //Изменение уставок
    SetClick(object, objectName, prefix) {
        if(getSignalQuality(this.statePath))
            runInputWindow(object.set, objectName + '.set.click', {inputTag: this.valuePath, postfix: `.xa.${prefix}`, codes: this.config.Code})
         else
            clickClear(object.set, objectName + '.set.click');
    }
    buttonClick(object, objectName, prefix) {
        if(getSignalQuality(this.statePath))
           runAccessBox(object, objectName + '.click', {codes: `codes.ALGBHO.cmd.${prefix}`, inputTag: this.valuePath});  
         else
            clickClear(object, objectName + '.click');
    }
    buttonClickSet(object, objectName, prefix, val) {
        if(getSignalQuality(this.statePath))
          runAccessBox(object, objectName + '.click', {value: val, postfix: '.wvalue', inputTag: `${this.valuePath}.xa.${prefix}`, desc: `Установить скорость насосов Н-12.1, Н-12.2 - ${val} %`});
         else
            clickClear(object, objectName + '.click');
    }
//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {  
        }
    }
    
//#endregion

}
    
    

