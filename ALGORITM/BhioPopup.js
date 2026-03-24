#INCLUDE "ObservablePopup.js"
#INCLUDE "AP/AnalogParameter.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
active = true;
class BHIOPopup extends ObservablePopup {
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
        this.Col0 = `${this.rootPath}.Col.Col_ChoiceR_0`;
        this.Col1 = `${this.rootPath}.Col.Col_ChoiceR_1`;
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object1`)
    }

    initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        error91.setVisible(false);
        this.colNum = 2;
        select.point.setVisible(false)
    }

   
    //#region object_Value
    publish_updateQueue(object, tag) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.rootPath}.${tag}ChoiceR_0`,
                                                        `${this.rootPath}.${tag}ChoiceR_1`,
                                                        `${this.valuePath}.xa.Col_LvlCooled`,
                                                        `${this.valuePath}.xa.Wrk_MaxLvl`,
                                                        `${this.valuePath}.xa.Ship_LvlShip`,
                                                        this.config.LT91,
                                                        this.config.LT92
                                                    ], 
                (newValue) => {this.updateQueue(newValue.value, this.valuePath, this.statePath, this, object, tag)})
        }
        else {}
    }
    publish_updateQueueShip(object, tag) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.rootPath}.${tag}ChoiceR_0`
                                                    ], 
                (newValue) => {this.updateQueueShip(newValue.value, this.valuePath, this.statePath, this, object, tag)})
        }
        else {}
    }
    publish_updateState(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.R_Status.${prefix}`
                                                    ], 
                (newValue) => {this.updateState(newValue.value, this.valuePath, this.statePath, this, prefix, object)})
        }
        else {}
    }
    publish_updateMode(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.Status.BHO_${prefix}AutoChs`
                                                    ], 
                (newValue) => {this.updateMode(newValue.value, this.valuePath, this.statePath, this, prefix, object)})
        }
        else {}
    }
    //#endregion
    publish_updateModeShip(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.Status.BHO_${prefix}`
                                                    ], 
                (newValue) => {this.updateModeShip(newValue.value, this.valuePath, this.statePath, this, prefix, object)})
        }
        else {}
    }

//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {  
            title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
        }
    }
    updateQueue(value, path, state, context, object, tag) {
    
        if (getSignalQuality(this.statePath)) {  
            if(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==1)          
               object.ChTxt1.setStringValue("P-9.1","Text")
            else if (accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==2)
               object.ChTxt1.setStringValue("P-9.2","Text")
            else 
               object.ChTxt1.setStringValue("Нет","Text")
            if(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_1`)==1)          
               object.ChTxt2.setStringValue("P-9.1","Text")
            else if (accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_1`)==2)
               object.ChTxt2.setStringValue("P-9.2","Text")
            else 
               object.ChTxt2.setStringValue("Нет","Text")
        }
        else {
            object.ChTxt1.setStringValue("?????","Text")
            object.ChTxt2.setStringValue("?????","Text")
        }
   
    }
    updateQueueShip(value, path, state, context, object, tag) {
        if (getSignalQuality(this.statePath)) {  
            if(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==1){
                 object.ChTxt1.setStringValue("P-9.1","Text")

            }          
            else if (accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==2) {
                object.ChTxt1.setStringValue("P-9.2","Text");

            }
            else {
                object.ChTxt1.setStringValue("Нет","Text");

            }           
        }
        else {
            object.ChTxt1.setStringValue("?????","Text")

        }
   
    }

        QueueClick(object, objectName, prefix, tag) {
        if (getSignalQuality(this.statePath)) {
            let state;
           let path;
           // if(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)!=0 && accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_1`)) {
           //      error91.setVisible(true);
           //      error92.setVisible(true);
           // }
           // else if (!this.condithion(tag, "P1") && !this.condithion(tag, "P2")) {
           //      error91.setVisible(true);
           //      error92.setVisible(true);
           //  }
           // else if(!this.condithion(tag, "P1"))
           //      error91.setVisible(true);
           // else if(!this.condithion(tag, "P2"))
           //      error92.setVisible(true);
           // else {
           //      error91.setVisible(false);
           //      error92.setVisible(false);
           // }

           if(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==0 && !(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)!=0 && accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_1`))) {
                if(prefix == "P1") {
                    if(this.condithion(tag, prefix)){
                        error91.setVisible(false);
                        runAccessBox(object, objectName + '.click', {value: 1, postfix: '.wvalue', inputTag: `${this.rootPath}.${tag}ChoiceR_0`, desc: `Выбор первой очередености - P-9.1`});
                    }
                   else
                       error91.setVisible(true);
                }
                else if (prefix == "P2") {
                    if(this.condithion(tag, prefix)) {
                        error92.setVisible(false);
                        runAccessBox(object, objectName + '.click', {value: 2, postfix: '.wvalue', inputTag: `${this.rootPath}.${tag}ChoiceR_0`, desc: `Выбор первой очередености - P-9.2`})
                    }

                   else
                       error92.setVisible(true);
                }
            }
            else if(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_1`)==0 && this.colNum == 2 && !(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)!=0 && accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_1`))) {
                if(prefix == "P1") {
                    if(this.condithion(tag, prefix)){
                       error91.setVisible(false);
                        runAccessBox(object, objectName + '.click', {value: 1, postfix: '.wvalue', inputTag: `${this.rootPath}.${tag}ChoiceR_1`, desc: `Выбор второй очередености - P-9.1`})
                    }
                   else
                       error91.setVisible(true);

                }
                else if (prefix == "P2") {
                     if(this.condithion(tag, prefix)) {
                      error92.setVisible(false);
                        runAccessBox(object, objectName + '.click', {value: 2, postfix: '.wvalue', inputTag: `${this.rootPath}.${tag}ChoiceR_1`, desc: `Выбор второй очередености - P-9.2`})
                    }
                   else
                       error92.setVisible(true);
                }
            }
            else if(accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)!=0 && accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_0`)==accessData.doubleValue(`${this.rootPath}.${tag}ChoiceR_1`)){
                  error91.setVisible(true);
                  error92.setVisible(true);
            }
            else {
                 error91.setVisible(false);
                  error92.setVisible(false);
            }
        }
        else {
            clickClear(object, objectName + '.click')
        }
    }
    condithion(tag, prefix) {
        let cond;
        if(tag=='Col.Col_')
            if(prefix=="P1") {
                (accessData.doubleValue(this.config.LT91)<accessData.doubleValue(`${this.valuePath}.xa.Col_LvlCooled`) && !accessData.boolValue(`${this.valuePath}.R_Status.R1.Oos`)) ? cond=true : cond=false
            }
            if(prefix=="P2") {
                (accessData.doubleValue(this.config.LT92)<accessData.doubleValue(`${this.valuePath}.xa.Col_LvlCooled`) && !accessData.boolValue(`${this.valuePath}.R_Status.R2.Oos`)) ? cond=true : cond=false
            }
        if(tag.includes('Wrk')) {
            if(prefix=="P1") {
                (accessData.doubleValue(this.config.LT91)>accessData.doubleValue(`${this.valuePath}.xa.Col_LvlCooled`) && !accessData.boolValue(`${this.valuePath}.R_Status.R1.Oos`) && !accessData.boolValue(`${this.valuePath}.R_Status.R1.Ship`) && accessData.doubleValue(this.config.LT91)<accessData.doubleValue(`${this.valuePath}.xa.Wrk_MaxLvl`)) ? cond=true : cond=false
            }
            if(prefix=="P2") {
                (accessData.doubleValue(this.config.LT92)>accessData.doubleValue(`${this.valuePath}.xa.Col_LvlCooled`) && !accessData.boolValue(`${this.valuePath}.R_Status.R2.Oos`) && !accessData.boolValue(`${this.valuePath}.R_Status.R2.Ship`) && accessData.doubleValue(this.config.LT92)<accessData.doubleValue(`${this.valuePath}.xa.Wrk_MaxLvl`)) ? cond=true : cond=false
            }
        }
        if(tag.includes('Ship')) {
            if(prefix=="P1") {
                (accessData.doubleValue(this.config.LT91)>accessData.doubleValue(`${this.valuePath}.xa.Ship_LvlShip`) && !accessData.boolValue(`${this.valuePath}.R_Status.R1.Oos`) && !accessData.boolValue(`${this.valuePath}.R_Status.R1.Filling`)) ? cond=true : cond=false
            }
            if(prefix=="P2") {
                (accessData.doubleValue(this.config.LT92)>accessData.doubleValue(`${this.valuePath}.xa.Ship_LvlShip`) && !accessData.boolValue(`${this.valuePath}.R_Status.R2.Oos`) && !accessData.boolValue(`${this.valuePath}.R_Status.R2.Filling`)) ? cond=true : cond=false
            }
        }
        return cond;
        
    }
    updateNum(object, objectName) {
        let mouseEvent = clickRelease(object, objectName);
         if(mouseEvent.action == 'release') {
            if(this.colNum == 2){
                this.colNum = 1;
                object.point.setVisible(true);
            }
            else {
                this.colNum = 2;
                object.point.setVisible(false);
            }
         }
    }
    updateState(value, path, state, context, prefix, object) {
        if (getSignalQuality(this.statePath)) {
            if(accessData.boolValue(`${this.valuePath}.R_Status.${prefix}`)){
              object.text.setStringValue(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`),"Text");
              if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Норма"))
                RGBAColoring(object.field, colors.Block.State.inf, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Ремонт"))
                RGBAColoring(object.field, colors.CE.brownColor, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Захоложен"))
                RGBAColoring(object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Заполнение"))
                RGBAColoring(object.field, colors.Block.State.inf, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Заполнен"))
                RGBAColoring(object.field, colors.Block.State.inf, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Пустой"))
                RGBAColoring(object.field, colors.Block.State.wrn, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("В промежутке"))
                RGBAColoring(object.field, colors.Block.State.wrn, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Отгрузка"))
                RGBAColoring(object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("В работе"))
                RGBAColoring(object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Захолаживание"))
                RGBAColoring(object.field, colors.Block.State.good, "FillColor");
                else if(accessData.stringValue(`${this.valuePath}.R_Status.${prefix}.Description`).includes("Остановлен"))
                RGBAColoring(object.field, colors.Block.State.wrn, "FillColor");
                object.setVisible(true);
        }
            else 
            {
               object.setVisible(false);
            }
        }
        else {
             object.R_Status.setStringValue("Нет статуса", "Text")
        }
    }
    updateMode(value, path, state, context, prefix, object) {
        if (getSignalQuality(this.statePath)) {
           if(accessData.boolValue(`${this.valuePath}.Status.BHO_${prefix}AutoChs`)) {
               object.select.point.setVisible(true)
           }
           else {
                object.select.point.setVisible(false)
           }
        }
        else {
            object.select.point.setVisible(false)
        }
    }
    updateModeShip(value, path, state, context, prefix, object) {
        if (getSignalQuality(this.statePath)) {
           if(accessData.boolValue(`${this.valuePath}.Status.BHO_${prefix}`)) {
               object.with.select.point.setVisible(true);
                object.without.select.point.setVisible(false);
           }
           else {
                object.with.select.point.setVisible(false);
                object.without.select.point.setVisible(true);
           }
        }
        else {
            object.with.select.point.setVisible(false);
            object.without.select.point.setVisible(false)
        }
    }
        //Изменение режима по клику
    StateClick(object, objectName, prefix) {
        if (getSignalQuality(this.statePath)) {
            if(accessData.doubleValue(`${this.valuePath}.R_Status.${prefix}`) == 1) 
                runAccessBox(object, objectName + '.click', {codes: `codes.ALGBHO.cmd.${prefix}_Oos`, inputTag: this.valuePath});  
            else if (accessData.doubleValue(`${this.valuePath}.R_Status.${prefix}`) == 2)
                runAccessBox(object, objectName + '.click', {codes: `codes.ALGBHO.cmd.${prefix}_Norm`, inputTag: this.valuePath});  
        }
        else {
            clickClear(object, objectName + '.click')
        }
    }
    //Изменение режима по клику
    CmdClick(object, objectName, prefix) {
        if (getSignalQuality(this.statePath)) {
            runAccessBox(object, objectName + '.click', {codes: `codes.ALGBHO.cmd.${prefix}`, inputTag: this.valuePath});  
        }
        else {
            clickClear(object, objectName + '.click')
        }
    }
        //Изменение режима по клику
    ModeClick(object, objectName, prefix, checkbox = false) {
        if (getSignalQuality(this.statePath)) {
            if (checkbox) {
                runAccessBox(object.select, objectName + '.select.click', {codes: `codes.ALGBHO.cmd.${prefix}AutoChs`, inputTag: this.valuePath})
            }
            else if(!checkbox && accessData.boolValue(`${this.valuePath}.Status.BHO_${prefix}`)) {
                runAccessBox(object.without.select, objectName + '.without.select.click', {codes: `codes.ALGBHO.cmd.${prefix}`, inputTag: this.valuePath})
            }
            else if(!checkbox && !accessData.boolValue(`${this.valuePath}.Status.BHO_${prefix}`)) {
                runAccessBox(object.with.select, objectName + '.with.select.click', {codes: `codes.ALGBHO.cmd.${prefix}`, inputTag: this.valuePath})
            }
            else {
                clickClear(object.select, objectName + '.select.click')
            }
        }
        else {
            clickClear(object.select, objectName + '.select.click')
        }
    }

    QueueClickShip(object, objectName, prefix, tag) {
        if (getSignalQuality(this.statePath)) {
            if(prefix == "P1") {
                if(this.condithion(tag, prefix)){
                    error91.setVisible(false);  
                    runAccessBox(object, objectName + '.click', {value: 1, postfix: '.wvalue', inputTag: `${this.rootPath}.${tag}ChoiceR_0`, desc: `Выбор первой очередености - P-9.1`});
                }    
                else
                    error91.setVisible(true);  
            }   
            else if (prefix == "P2") {
                if(this.condithion(tag, prefix)) {
                    error92.setVisible(false);
                    runAccessBox(object, objectName + '.click', {value: 2, postfix: '.wvalue', inputTag: `${this.rootPath}.${tag}ChoiceR_0`, desc: `Выбор первой очередености - P-9.2`})
                }    
                else
                    error92.setVisible(true);
            }   
        }
        else {
            clickClear(object, objectName + '.click')
        }
    }
//#endregion

}
    
    

