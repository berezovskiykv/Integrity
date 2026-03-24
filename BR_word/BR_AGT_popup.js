#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа 
 * @class PG_popup
 * @extends ObservablePopup
 */
class AGT_popup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`.replace("N_State","");
        this.statePath = `${this.rootPath}`;
        this.config.FracDigits = 2;
    }

    initialize() {
       title.access.setStringValue(accessData.stringValue(`${this.statePath}.Name_Object1`).replace("Ведущий с","C"), "Text"); 
      //  subtitle.access.setStringValue(accessData.stringValue(`${this.statePath}.ID`), "Text"); 
       
    }

 
//#region PublishFunctions
  
  
      //#region object_TextState
        publish_updateTextState(object, bit) {
            if (!object.observerAction2) {
                object.observerAction2 = publisher.register([`${this.valuePath}.${bit}`
                                                        ], 
                    (newValue) => {this.updateTextState(newValue.value, newValue.tag, this, object, bit)})
            }
            else {}
        }
       
      
    //#region object_timestamp
    publish_updateTimeStamp(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath], 
                (newValue) => {this.updateTimeStamp(newValue.value, newValue.tag, this, object)})
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
           title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            subtitle.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
           
        }
    }
  
        //текстовое состояние параметра
        updateTextState(value, state, context, object, bit) {
           
            if (getSignalQuality(this.statePath)) {
               object.set.value.setStringValue(accessData.doubleValue(`${state}`), "Text");
                object.text.setStringValue(accessData.stringValue(`${state}.Description`), "Text");
            }
            else {
               object.text.setStringValue("???????????????", "Text");
                object.set.value.setStringValue("????", "Text");
            }
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

    DetColor(object, bit, context) {
        let colorPath = accessData.doubleValue(`${bit}.Color`)
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
    
    

