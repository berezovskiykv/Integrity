#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа уставок алгоритмов КСПГ
 * @class ALGSetpointsPopup
 * @extends ObservablePopup
 */
class ALGSetpointsPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        //let context = this;
        //publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    initialize() {
        title.access.setStringValue("Алгоритмы КСПГ", "Text");
        subtitle.access.setStringValue("Уставки", "Text");
    }


//#region PublishFunctions

    //#region object_set
    publish_updateSetPoints(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([getAliasesPath(object)
                                                    ], 
                (newValue) => {this.updateSetPoints(newValue.value, newValue.quality, newValue.tag, object)})
            }
        else {}
    }
    //#endregion

//#endregion





//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    // updatePopupText(value, state) {
    //     if (getSignalQuality(state)) {
    //         this.initialize();
    //     }
    //     else {
    //         title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
    //         subtitle.access.setStringValue('????????????????????????????????????????????????????????', "Text");
    //     }
    // }

    //состояния/значения уставок
    updateSetPoints(value, quality, tag, object) {
        if(quality) {
            object.set.value.setStringValue(value, "Text");
            object.text.setStringValue(accessData.stringValue(`${tag}.Description`), "Text")
            object.eunit.setStringValue(accessData.stringValue(`${tag}.EUnit`), "Text")
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
            RGBAColoring(object.eunit, colors.SERVICE.Goodqual.text, "TextColor")
            RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
        }
        else {
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
            RGBAColoring(object.eunit, colors.SERVICE.Badqual.text, "TextColor")
            RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor")
            object.set.value.setStringValue("???.???", "Text");
        }
    }
    
    //Изменение уставок
    SetClick(object, objectName) {
        let tag = getAliasesPath(object);
        let code = object.access.stringValue("CONST");
        if (getSignalQuality(tag)) { 
                runInputWindow(object.set, objectName + '.set.click', {inputTag: tag, codes: code})
        }
        else {
            clickClear(object.set, objectName + '.set.click');
        }
    }
//#endregion
}
    
    

