#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа 
 * @class WordBRPopup
 * @extends ObservablePopup
 */
class WordBRPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.valuePath], (newValue) => {context.updatePopupText(newValue.quality, context.valuePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.config.Title = accessData.stringValue(`${this.rootPath}.Description`)
        this.config.FracDigits = 2;
    }

    initialize() {
        head.title.access.setStringValue(this.config.Title, "Text");
        diagram.setSize(750,30+20*this.config.codes);
        diagram.setDiagramSize(750,30+20*this.config.codes);
       
    }

 
//#region PublishFunctions
  
    //#region object_Value
    publish_updateValue(object, bit) {
        if (!object.observerAction1) {
            object.observerAction1 = publisher.register([`${this.valuePath}`
                                                    ], 
                (newValue) => {this.updateValue(newValue.value, this.valuePath, this, object, bit)})
        }
        else {}
    }
      //#region object_TextState
        publish_updateTextState(object, bit) {
            if (!object.observerAction2) {
                object.observerAction2 = publisher.register([this.valuePath
                                                        ], 
                    (newValue) => {this.updateTextState(newValue.value, newValue.tag, this, object, bit)})
            }
            else {}
        }
    //#endregion

//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {
            head.title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
           
        }
    }
    //вывод значения
    updateValue(value, path, context, object, bit) {
            if (getSignalQuality(path)) {
                //if(accessData.boolValue(`${this.valuePath}.${bit}`))
                RGBAColoring(object.state, this.DetColor(object,bit,context), "FillColor");
                // else
                // RGBAColoring(object.state, colors.SERVICE.Flt.inact, "FillColor");
            }
            else {
                RGBAColoring(object.state, colors.SERVICE.Badqual.field, "FillColor");
            }
    }
        //текстовое состояние параметра
        updateTextState(value, state, context, object, bit) {
           
            if (getSignalQuality(state)) {
               object.desc.setStringValue(" " + accessData.stringValue(`${this.valuePath}.${bit}.Description`), "Text");
            }
            else {
               object.desc.setStringValue("???????????????????", "Text");
            }
        }
    DetColor(object, bit, context) {
        let colorPath = accessData.doubleValue(`${context.valuePath}.${bit}.Color`)
        let color;
        if (colorPath == 1)
            color = colors.SERVICE.Flt.actAlm;
        else if (colorPath == 2)
            color = colors.SERVICE.Flt.actWrn;
         else if (colorPath == 9)
            color = colors.VLV.Fillstate.open;
        else 
            color = colors.SERVICE.Flt.inact;
       
            return color;
    } 
}
    
    

