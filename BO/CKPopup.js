#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class CKPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.config.Title = "Параметры";
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.EUnit = accessData.stringValue(`${this.rootPath}.EUnit`);
        this.config.FracDigits = 2;
    }

    initialize() {
        title.access.setStringValue("Параметры", "Text");
        // subtitle.access.setStringValue("", "Text");
        
        
    }

    //#region object_Value
    publish_updateValue(object, tagT) {
       let tag = `${this.valuePath}.${tagT}`
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.${tagT}`], 
                (newValue) => {this.updateValue(newValue.value, tag, this, object)})
        }
        else {}
    }
    //#endregion



    //вывод значения
    updateValue(value, path, context, object) {
        let qwe = accessData.stringValue(`${path}.Description`).replace("СК Измерение ","");
        qwe = qwe.replace("Данные замораживания ","");
        qwe = qwe.replace("Данные отгрузки ","");
        qwe = qwe.replace("СК ","");
        qwe = qwe.replace("замораживания","захолаживания");
        object.text.setStringValue(qwe, "Text")
        if (getSignalQuality(path)) {
                    object.set.value.setStringValue(accessData.doubleValue(path).toFixed(2), "Text");
                    object.eUnit.setStringValue(accessData.stringValue(`${path}.EUnit`), "Text");
                    RGBAColoring(object.set.value, colors.AP.SimCol.whiteCol, "FillColor");
            }
            else {
                object.set.value.setStringValue("???.???", "Text");
                object.eUnit.setStringValue("??????", "Text");
                RGBAColoring(object.set.value, colors.SERVICE.Badqual.field, "FillColor");
            }
    }
}
    
    

