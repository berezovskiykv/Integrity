#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class AnalogDrainPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.statePath = `${this.rootPath}.state`;
        //this.config.qualityTag = `${this.config.rootPath}.state`;
        this.config.Sensorname = accessData.stringValue(`${this.rootPath}.ID`);
        let descr = accessData.stringValue(`${this.rootPath}.mass.Description`).replace("Измерение"," ")
        descr = descr.replace("- Масса"," ")
        this.config.Title = descr
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.EUnit = accessData.stringValue(`${this.rootPath}.mass.EUnit`);
        this.config.Code = `codes.CK_cmd.cmd`;
        // this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.FracDigits = 2;
    }

    initialize() {
        // VALUE.eUnit.access.setStringValue(this.config.EUnit, "Text");
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
        this.cl1=0;
      
    }

    /**
    * Читает текущие значения уставок
    * @returns {Object} Значения уставок
    */
    readSetpoints() {
        return {
            MaxSpeed: accessData.doubleValue(`${this.valuePath}.MaxSpeed`),
            MinSpeed: accessData.doubleValue(`${this.valuePath}.MinSpeed`),
            DensNow: accessData.doubleValue(`${this.valuePath}.DensNow`),
            MaxDens: accessData.doubleValue(`${this.valuePath}.MaxDens`),
            MinDen: accessData.doubleValue(`${this.valuePath}.MinDen`),
            OverM: accessData.doubleValue(`${this.valuePath}.OverM`),
            OverV: accessData.doubleValue(`${this.valuePath}.OverV`),
            SumMassa: accessData.doubleValue(`${this.valuePath}.SumMassa`),
            SumVolu: accessData.doubleValue(`${this.valuePath}.SumVolu`),
            TempNow: accessData.doubleValue(`${this.valuePath}.TempNow`),
            manualDens: accessData.doubleValue(`${this.valuePath}.manualDens`),
            mask_dens: accessData.doubleValue(`${this.valuePath}.mask_dens`),
            mask_mass: accessData.doubleValue(`${this.valuePath}.mask_mass`),
            mask_temp: accessData.doubleValue(`${this.valuePath}.mask_temp`),
            mask_volume: accessData.doubleValue(`${this.valuePath}.mask_volume`),
        };
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        if ((state === null || state === undefined)) return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            noerr       :   (state == 0),
            break       :   (state == 1),
            kz          :   (state == 2),
            mask        :   (state == 3),
        }
    }

    // /** Устанавливает биты/цвета аварий*/
     processFaultBits() {
         let state = accessData.doubleValue(this.statePath);
        if ((state === null || state === undefined)) return;
       
        //Биты аварий
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            noerr  :             colors.EO.State.off_front,
            break  :             colors.AP.Flt.act,
            kz  :               colors.AP.Flt.act,
            all   :             (state>0) ? colors.AP.Flt.act : colors.AP.Flt.inact
        }
    }

    /**
     * Определяет цвет в зависимости от состояния
     * @returns {Object} Цвет в формате RGBA
     */
    determineColor(status) {
        return {
            value_text
            : status.imit ? colors.AP.TextPopup.imit
            : status.rep ? colors.AP.SimCol.yellCol
            : colors.AP.TextPopup.default,

            scale 
            : status.HH_Act || status.LL_Act ? colors.AP.ScalePopup.alarm
            : status.H_Act || status.L_Act ? colors.AP.ScalePopup.warn
            : colors.AP.ScalePopup.default
        }
    }

//#region PublishFunctions
    //#region object_timestamp
    publish_updateTimeStamp(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath], 
                (newValue) => {this.updateTimeStamp(newValue.value, newValue.tag, this, object)})
        }
        else {}
    }

    //#endregion
    publish_updateCustomTag(object, tagSuffix) {
    if (!object.observerAction) {
        object.observerAction = publisher.register([`${this.rootPath}${tagSuffix}`], 
            (newValue) => {this.updateCustomTag(newValue.value, newValue.tag, this, object)}
        );
    }
}

    //#region object_Value
    publish_updateValue(object, sensor) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.${sensor}`, 
                                                        this.statePath
                                                    ], 
                (newValue) => {this.updateValue(newValue.value, `${this.valuePath}.${sensor}`, this.statePath, this, object)})
        }
        else {}
    }
    //#endregion


    //#region object_mode
    publish_updateMode(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath],
                (newValue) => {this.updateMode(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }
    //#endregion

    publish_blockCmdBtn(object, blockCondition = []) {  
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            this.faultPath
                                                        ],
                    (newValue) => {this.blockCmdBtn(newValue.value, newValue.tag, blockCondition, this, object)})
            }
            else {}
        }

    //#region object_set
    publish_updateSetPoints(object, prefix, checkbox = false, bit) {
        
        let setTag = (checkbox) ? `${this.valuePath}.state` : `${this.valuePath}.${prefix}`;
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.${prefix}`,
                                                        `${this.statePath}`,
                                                        
                                                    ], 
                (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, checkbox, this, object)})
            }
        else {}
    }
    //#endregion

    //#region object_alarms
    publish_updateAlarms(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath
                                                    ],
                (newValue) => {this.updateAlarms(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }
    //#endregion

    //#region object_msgOffBox
    publish_updateMsgState(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath
                                                    ],
                (newValue) => {this.updateMsgState(newValue.value, newValue.tag, this, object)})
            }
        else {}
    }
    //#endregion

//#endregion





//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {
            // VALUE.eUnit.access.setStringValue('???????', "Text");
            title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            subtitle.access.setStringValue('????????????????????????????????????????????????????????', "Text");
        
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


  

    //вывод значения
    updateValue(value, path, state, context, object) {
            let color = context.determineColor(context.processStateBits());
            if (getSignalQuality(path)) {
                if (value == S(path)) {
                    object.value.setStringValue(accessData.doubleValue(`${path}`).toFixed(2) , "Text");
                }
                if (value == S(state)) {
                    RGBAColoring(object.value, color.value_text, "TextColor");
                    RGBAColoring(object, color.value_text, "eUnit.TextColor");
    
                }
            }
            else {
                object.value.setStringValue("???.???", "Text");
                RGBAColoring(object.value, colors.AP.Text.default, "TextColor");
                RGBAColoring(object, colors.AP.Text.default, "eUnit.TextColor");
            }
    }

    //Режимы
    updateMode(value, state, prefix, context, object) {
        if (getSignalQuality(state)) {
            object.select.point.setVisible(context.processStateBits()[prefix]);
            RGBAColoring(object.select.back, colors.SERVICE.Goodqual.field, "FillColor")
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
        }
        else {
            RGBAColoring(object.select.back, colors.SERVICE.Badqual.field, "FillColor")
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
            object.select.point.setVisible(false);
        }
    }

    //Изменение режима по клику
    ModeClick(object, objectName, prefix) {
        if (getSignalQuality(this.statePath) && !this.processStateBits()[prefix]) {
            runAccessBox(object.select, objectName + '.select.click', {postfix:``, codes: `${this.config.Code}.${this.config.cmd_on}`, inputTag: `KSPG.CK.asuComReqMode.wvalue`})
        }
        else {
            runAccessBox(object.select, objectName + '.select.click', {postfix:``, codes: `${this.config.Code}.${this.config.cmd_off}`, inputTag: `KSPG.CK.asuComReqMode.wvalue`})
        }
    }

    //состояния/значения уставок
    updateSetPoints(value, state, prefix, checkbox, context, object) {
        if(getSignalQuality(state)) {
            let SET = context.readSetpoints();
            let word = accessData.stringValue(`${this.valuePath}.${prefix}.Description`);
                if(word.includes("Измерение"))
                     word = accessData.stringValue(`${this.valuePath}.${prefix}.Description`).replace("СК Измерение","");
                else if(word.includes("Регулирование"))
                     word = accessData.stringValue(`${this.valuePath}.${prefix}.Description`).replace("СК Регулирование","");
                else
                    word = accessData.stringValue(`${this.valuePath}.${prefix}.Description`).replace("СК","");
                object.set.value.setStringValue(SET[prefix].toFixed(2), "Text");
                object.text.setStringValue(word, "Text")
                object.setStringValue(accessData.stringValue(`${this.valuePath}.${prefix}.EUnit`), "eUnit.Text")
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                // if ((typeof(object.select) !== 'undefined') && checkbox) {
                    // RGBAColoring(object.select.back, colors.SERVICE.Goodqual.field, "FillColor")
                    // if (context.processStateBits()[`${prefix}`]) {
                    if (getSignalQuality(`${this.valuePath}.${prefix}`) && context.processStateBits()["noerr"]) {
                        RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
                    }
                    else {
                        RGBAColoring(object.set.value, colors.SERVICE.Sets.inact, "FillColor")
                    }
                // }
                // else {
                //     RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
                // }
            }
            else {
                // if ((typeof(object.select) !== 'undefined') && checkbox) {
                //     RGBAColoring(object.select.back, colors.SERVICE.Badqual.field, "FillColor")
                    // object.select.point.setVisible(false);
                // }
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
            RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor")
            object.set.value.setStringValue("???.???", "Text");
        }
    }
    
    //Изменение уставок
    SetClick(object, objectName, prefix, checkbox = false, cm1, cm2) {
        if(getSignalQuality(`${this.valuePath}.${prefix}`)) { 
            
            if (checkbox && (this.processStateBits()[`setpoint`])) {       
                if (this.processStateBits()[`${prefix}`]) {
                    runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${this.config.cmd_off}`, inputTag: this.valuePath})
                    runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.${prefix}`, codes: this.config.Code})
                }
                else {
                    runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${this.config.cmd_on}`, inputTag: this.valuePath})
                    clickClear(object.set, objectName + '.set.click');
                }
            }
            else if (!checkbox) {
               runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.${prefix}`, codes: this.config.Code});
                
            }
        }
        else {
            if (checkbox) {
                clickClear(object.select, objectName + '.select.click');
            }
            clickClear(object.set, objectName + '.set.click');
        }
    }
        //Изменение уставок
    Setpoints(object, objectName, cm1, cm2, bit) {
        if(getSignalQuality(`${this.valuePath}`)) {
            // object.select.point.setVisible(this.processStateBits()[`setpoint`]);      
            if (this.processStateBits()[`setpoint`]) {
      
                runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${cm2}`, inputTag: this.valuePath})       
            }
            else {
                
                    runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${cm1}`, inputTag: this.valuePath})
                }
        }
        else {
     
        }
    }

    //аварии
    updateAlarms(value, flt, prefix, context, object) {
        if(getSignalQuality(flt)) {
           let color = context.processFaultBits()
           let st = context.processStateBits();
            if(st[prefix]){
                RGBAColoring(object.indicator, color[prefix], "FillColor")
                RGBAColoring(alarms.name, color.all, "FillColor")
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                // object.text.setStringValue(accessData.stringValue(`${this.statePath}.${prefix}.Description`), "Text");
            }
            else{
                RGBAColoring(object.indicator, colors.AP.Flt.inact, "FillColor")
                // RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
            }
                
        }
        else {
            RGBAColoring(alarms.name, colors.SERVICE.Popup.headDEF, "FillColor")
            RGBAColoring(object.indicator, colors.SERVICE.Badqual.field, "FillColor")
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")

        }
    }

   blockCmdBtn(value, state, blockCondition, context, object) {
            if (getSignalQuality(state)) {
                let status = context.processStateBits();
                let block = blockCondition.some(item => {
                                        const isNegated = item.startsWith('!');
                                        const key = isNegated ? item.slice(1) : item;
                                        const value = key in status ? status[key] : false;
                                        return isNegated ? !value : value;
                                        });
                if (!block) {
                    RGBAColoring(object.field, colors.SERVICE.buttons.act, "FillColor")
                }
                else {
                    RGBAColoring(object.field, colors.SERVICE.buttons.inact, "FillColor")
                }
            }
            else {
                RGBAColoring(object.field, colors.SERVICE.Badqual.field, "FillColor")
            }
        }

    SendTU(object, objectName, prefix){
            if (getSignalQuality(this.statePath)) {
                runAccessBox(object, objectName + '.click', {codes: `${this.config.Code}.cmd.${prefix}`, inputTag: this.rootPath})
            }
            else {
                clickClear(object, objectName + '.click')
            }
        }

    SendTU2(object, objectName, prefix, blockCondition = []){
            if (getSignalQuality(this.statePath)) {
                let status = this.processStateBits();
                let block = blockCondition.some(item => {
                                        const isNegated = item.startsWith('!');
                                        const key = isNegated ? item.slice(1) : item;
                                        const value = key in status ? status[key] : false;
                                        return isNegated ? !value : value;
                                        });
                if (!block) {
                    runAccessBox(object, objectName + '.click', {codes: `${this.config.code}.cmd.${prefix}`, inputTag: this.rootPath})
                }
                else {
                    clickClear(object, objectName + '.click')
                }
            }
            else {
                clickClear(object, objectName + '.click')
            }   
        }

    updateMsgState(value, state, context, object) {
        if (getSignalQuality(state)) {
            object.point.setVisible(!context.processStateBits().msgOff)
            RGBAColoring(object.back, colors.SERVICE.Goodqual.field, "FillColor")
        }
        else {
            object.point.setVisible(false);
            RGBAColoring(object.back, colors.SERVICE.Badqual.field, "FillColor")
        }
    }

updateCustomTag(value, path, context, object) {
    if (getSignalQuality(path)) {
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(value !== null ? value.toString() : "", "Text");
        } 
        else if (object.setStringValue) {
            object.setStringValue(value !== null ? value.toString() : "", "Text");
        }
    }
    else {
        }
}
//#endregion
}
    
    

