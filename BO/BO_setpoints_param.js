#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class SetpointsBOPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.config.Title = 'БО'
        this.config.Subtitle = 'Уставки'
        this.config.FracDigits = 2;
    }

    initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");      
    }

    publish_updateTimeStamp(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath], 
                (newValue) => {this.updateTimeStamp(newValue.value, newValue.tag, this, object)})
        }
        else {}
    }
    //#region object_set
    publish_updateSetPoints(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.${prefix}`   
                                                    ], 
                (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }
    //#endregion
//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
     //   if (getSignalQuality(state)) {
            this.initialize();
//        }
        // else {
        //     title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
        //     subtitle.access.setStringValue('????????????????????????????????????????????????????????', "Text");
        
        // }
    }

    //метка времени
    updateTimeStamp(value, state, context, object) {
        if (getSignalQuality(state)) {
                let date = new Date(accessData.sourceTime(state));
                object.value.setStringValue(getDate(date), "Text");
            }
            else {
                object.value.setStringValue('??.??.???? ??:??', "Text");
        }
    }
    //состояния/значения уставок
    updateSetPoints(value, state, prefix, context, object) {
        object.text.setStringValue(accessData.stringValue(`${this.valuePath}.${prefix}.Description`), "Text")
        object.setStringValue(accessData.stringValue(`${this.valuePath}.${prefix}.EUnit`), "eunit.Text")
        if(getSignalQuality(state)) {
                object.set.value.setStringValue(value.toFixed(2), "Text");
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
            }
            else {
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
            RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor")
            object.set.value.setStringValue("???.???", "Text");
        }
    }
    
    //Изменение уставок
    SetClick(object, objectName, prefix) {
        if(getSignalQuality(`${this.valuePath}.${prefix}`)) { 
            runInputWindow(object.set, objectName + '.set.click', {inputTag: `${this.rootPath}.${prefix}`, codes: this.config.Code})
        }
        else {
            clickClear(object.set, objectName + '.set.click');
        }
    }

}
    
    

