#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class AnalogParameterPopup extends ObservablePopup {
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
        this.faultPath = `${this.rootPath}.flt`;
        this.setpointPath = `${this.rootPath}.xa`;
        this.mskPath = `${this.rootPath}.msk_set`;
        //this.config.qualityTag = `${this.config.rootPath}.state`;
        this.config.Sensorname = accessData.stringValue(`${this.rootPath}.Sensor_Name`);
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.EUnit = accessData.stringValue(`${this.rootPath}.EUnit`);
        this.config.Code = accessData.stringValue(`${this.rootPath}.Type`);
        this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
    }

    initialize() {
        VALUE.eUnit.access.setStringValue(this.config.EUnit, "Text");
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
        sensorname.access.setStringValue(this.config.Sensorname, "Text");
    }

    /**
    * Читает текущие значения уставок
    * @returns {Object} Значения уставок
    */
    readSetpoints() {
        return {
            HighEngin: accessData.doubleValue(`${this.setpointPath}.wHighEngin`),
            AH: accessData.doubleValue(`${this.setpointPath}.set_AH_Lim`),
            WH: accessData.doubleValue(`${this.setpointPath}.set_WH_Lim`),
            WL: accessData.doubleValue(`${this.setpointPath}.set_WL_Lim`),
            AL: accessData.doubleValue(`${this.setpointPath}.set_AL_Lim`),
            LowEngin: accessData.doubleValue(`${this.setpointPath}.wLowEngin`),
            hyst: accessData.doubleValue(`${this.setpointPath}.hyst`),
            imit: accessData.doubleValue(`${this.setpointPath}.imit`)
        };
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        let msk = accessData.doubleValue(this.mskPath);
        if ((state === null || state === undefined)  || (msk === null || msk === undefined))  return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            field       :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Field`))),
            mask        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Disable`))),
            imit        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Imit`))),
            msgOff      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.MsgOff`))),
            valueOff    :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.ValueOff`))),
            bad         :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Bad`))),
            test        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Test`))),
            kvit        :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Kvit`))),
            fltkvit     :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.FltKvit`))),
            AH_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.AH_Act`))),
            WH_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.WH_Act`))),
            WL_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.WL_Act`))),
            AL_Act      :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.AL_Act`))),
            AH_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.AH_LimEn`))),
            WH_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.WH_LimEn`))),
            WL_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.WL_LimEn`))),
            AL_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.AL_LimEn`)))
        }
    }

    /** Устанавливает биты/цвета аварий*/
    processFaultBits() {
        let fault = accessData.doubleValue(this.faultPath);
        if (fault === null || fault === undefined) return; 
        
        let defineCLR = (name, actCLR, inactCLR) => {
            let sts = !!(fault & accessData.intValue(`${this.config.Code}.Status2.${name}`))
            return { sts, clr: sts ? actCLR : inactCLR}
        }
        //Биты аварий
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            aggregate       :   !!(fault > 0) ? colors.AP.Flt.act : colors.SERVICE.Popup.headDEF,
            CH              :   defineCLR('ChFlt', colors.AP.Flt.act, colors.AP.Flt.inact),
            MOD             :   defineCLR('ModFlt', colors.AP.Flt.act, colors.AP.Flt.inact),
            SENS            :   defineCLR('SensFlt', colors.AP.Flt.act, colors.AP.Flt.inact),
            EXT             :   defineCLR('ExtFlt', colors.AP.Flt.act, colors.AP.Flt.inact),
            HighMeasureErr  :   defineCLR('HightMeasureErr', colors.AP.Flt.act, colors.AP.Flt.inact),
            LowMeasureErr   :   defineCLR('LowMeasureErr', colors.AP.Flt.act, colors.AP.Flt.inact)
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
            : status.test ? colors.AP.TextPopup.test
            : colors.AP.TextPopup.default,

            scale 
            : status.bad ? colors.AP.ScalePopup.invalid
            : status.AH_Act || status.AL_Act ? colors.AP.ScalePopup.alarm
            : status.WH_Act || status.WL_Act ? colors.AP.ScalePopup.warn
            : colors.AP.ScalePopup.default
        }
    }

//#region PublishFunctions
    //#region object_timestamp
    // publish_updateTimeStamp(object) {
    //     if (!object.observerAction) {
    //         object.observerAction = publisher.register([this.statePath], 
    //             (newValue) => {this.updateTimeStamp(newValue.value, newValue.tag, this, object)})
    //     }
    //     else {}
    // }

    //#endregion
//     publish_updateCustomTag(object, tagSuffix) {
//     if (!object.observerAction) {
//         object.observerAction = publisher.register([`${this.rootPath}${tagSuffix}`], 
//             (newValue) => {this.updateCustomTag(newValue.value, newValue.tag, this, object)}
//         );
//     }
// }

    //#region object_Value
    // publish_updateValue(object) {
    //     if (!object.observerAction) {
    //         object.observerAction = publisher.register([this.valuePath, 
    //                                                     this.statePath
    //                                                 ], 
    //             (newValue) => {this.updateValue(newValue.value, this.valuePath, this.statePath, this, object)})
    //     }
    //     else {}
    // }
    //#endregion

    //#region object_Scale
        // publish_updateScaleValue(object) {
        //     if (!object.observerAction1) {
        //         object.observerAction1 = publisher.register([this.valuePath, 
        //                                                     this.statePath,
        //                                                     `${this.setpointPath}.wHighEngin`, 
        //                                                     `${this.setpointPath}.wLowEngin`
        //                                                 ], 
        //             (newValue) => {this.updateScaleValue(newValue.value, this.valuePath, this.statePath, this, object)})
        //     }
        //     else {}
        // }

        // publish_updateScaleColor(object) {
        //     if (!object.observerAction2) {
        //         object.observerAction2 = publisher.register([this.statePath  
        //                                                 ], 
        //             (newValue) => {this.updateScaleColor(newValue.value, newValue.tag, this, object)})
        //     }
        //     else {}
        // }

        // publish_updateScaleSetPoints(object) {
        //     if (!object.observerAction3) {
        //         object.observerAction3 = publisher.register([this.statePath,
        //                                                     this.mskPath,
        //                                                     `${this.setpointPath}.wHighEngin`, 
        //                                                     `${this.setpointPath}.set_AH_Lim`, 
        //                                                     `${this.setpointPath}.set_WH_Lim`, 
        //                                                     `${this.setpointPath}.set_WL_Lim`, 
        //                                                     `${this.setpointPath}.set_AL_Lim`,
        //                                                     `${this.setpointPath}.wLowEngin` 
        //                                                 ],
        //             (newValue) => {this.updateScaleSetPoints(newValue.value, newValue.tag, this, object)})
        //     }
        //     else {}
        // }

        // publish_updateEngineeringRanks(object) {
        //     if (!object.observerAction4) {
        //         object.observerAction4 = publisher.register([this.statePath,
        //                                                     this.mskPath,
        //                                                     `${this.setpointPath}.wHighEngin`, 
        //                                                     `${this.setpointPath}.wLowEngin` 
        //                                                     ],
        //             (newValue) => {this.updateEngineeringRanks(newValue.value, newValue.tag, this, object)})
        //     }
        //     else {}
        // }
    //#endregion

    //#region object_mode
    // publish_updateMode(object, prefix) {
    //     if (!object.observerAction) {
    //         object.observerAction = publisher.register([this.statePath],
    //             (newValue) => {this.updateMode(newValue.value, newValue.tag, prefix, this, object)})
    //         }
    //     else {}
    // }
    //#endregion

    // publish_blockCmdBtn(object, blockCondition = []) {  
    //         if (!object.observerAction) {
    //             object.observerAction = publisher.register([this.statePath,
    //                                                         this.faultPath
    //                                                     ],
    //                 (newValue) => {this.blockCmdBtn(newValue.value, newValue.tag, blockCondition, this, object)})
    //         }
    //         else {}
    //     }

    //#region object_set
    // publish_updateSetPoints(object, prefix, checkbox = false) {
    //     let setTag = (checkbox) ? `${this.setpointPath}.set_${prefix}_Lim` : `${this.setpointPath}.${prefix}`
    //     if (!object.observerAction) {
    //         object.observerAction = publisher.register([this.mskPath,
    //                                                     setTag
    //                                                 ], 
    //             (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, checkbox, this, object)})
    //         }
    //     else {}
    // }
    //#endregion

    //#region object_alarms
    // publish_updateAlarms(object, prefix) {
    //     if (!object.observerAction) {
    //         object.observerAction = publisher.register([this.faultPath
    //                                                 ],
    //             (newValue) => {this.updateAlarms(newValue.value, newValue.tag, prefix, this, object)})
    //         }
    //     else {}
    // }
    //#endregion

    //#region object_msgOffBox
    // publish_updateMsgState(object) {
    //     if (!object.observerAction) {
    //         object.observerAction = publisher.register([this.statePath
    //                                                 ],
    //             (newValue) => {this.updateMsgState(newValue.value, newValue.tag, this, object)})
    //         }
    //     else {}
    // }
    //#endregion

//#endregion





//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {
            VALUE.eUnit.access.setStringValue('???????', "Text");
            title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            subtitle.access.setStringValue('????????????????????????????????????????????????????????', "Text");
            sensorname.access.setStringValue('???????????', "Text");
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

    //Изменение размера шкалы
    updateScaleValue(value, path, state, context, object) {
        let SET = context.readSetpoints();
        let x;
        var scaleX;
        var scaleY = 100;
        if (getSignalQuality(path) || getSignalQuality(state)) {            
            x = accessData.doubleValue(path);
            scaleX = utils.rangeTransform(x, SET.LowEngin, SET.HighEngin, 0, 100);
        }
        else {
            x = SET.HighEngin;
            scaleX = utils.rangeTransform(x, SET.LowEngin, SET.HighEngin, 0, 100);
        }
        object.scaleLine.setScaleXY(scaleX, scaleY, 0);
    }

    //Цвет шкалы
    updateScaleColor(value, state, context, object){
        let color = context.determineColor(context.processStateBits());
        if (getSignalQuality(state)) {
            RGBAColoring(object.scaleLine, color.scale, "FillColor");
        }
        else {
            RGBAColoring(object.scaleLine, colors.AP.ScalePopup.Badqual, "FillColor");
        }
    }

    //расположение уставок на шкале
    updateScaleSetPoints(value, state, context, object){
        var offsetX;
        var offsetY = 0;
        let statusbit;
        let SET;
        let setfunc = (item) => {
            statusbit = context.processStateBits();
            //LogData(statusbit.AH_On, 'updateScaleSetPoints')
                            offsetX = utils.rangeTransform(SET[item], SET.LowEngin, SET.HighEngin, 0, 360 )
                            object[item].move(offsetX, offsetY);
                            object[item].setVisible(statusbit[`${item}_On`]);            
        }

        if (getSignalQuality(state)) {
            SET = context.readSetpoints();
            switch (value) {
                case SET.AH:
                     setfunc("AH");
                     break;
                case SET.WH:
                    setfunc("WH");
                    break;
                case SET.WL:
                    setfunc("WL");
                    break;
                case SET.AL:
                    setfunc("AL");
                    break;
                default:
                    setfunc("AH");
                    setfunc("WH");
                    setfunc("WL");
                    setfunc("AL");
                    break; 
            }
        }
        else {
            object.AH.setVisible(false);
            object.WH.setVisible(false);
            object.WL.setVisible(false);
            object.AL.setVisible(false);
        }
    }       
    
    //Вывод предельных значений
    updateEngineeringRanks(value, state, context, object){
        if (getSignalQuality(state)) {
            let SET = context.readSetpoints();
            switch (value) {
                case SET.LowEngin:
                    object.lowEng.value.setStringValue(SET.LowEngin.toFixed(context.config.FracDigits), "Text");
                    break;
                case SET.HighEngin:
                    object.highEng.value.setStringValue(SET.HighEngin.toFixed(context.config.FracDigits), "Text");
                    break;
                default:
                    object.lowEng.value.setStringValue(SET.LowEngin.toFixed(context.config.FracDigits), "Text");
                    object.highEng.value.setStringValue(SET.HighEngin.toFixed(context.config.FracDigits), "Text");
                    break;
                }
            RGBAColoring(object.lowEng.value, colors.SERVICE.Sets.Good, "FillColor");
            RGBAColoring(object.highEng.value, colors.SERVICE.Sets.Good, "FillColor");
        }
        else {
            object.lowEng.value.setStringValue('??.??', "Text");
            object.highEng.value.setStringValue('??.??', "Text");
            RGBAColoring(object.lowEng.value, colors.SERVICE.Sets.Bad, "FillColor");
            RGBAColoring(object.highEng.value, colors.SERVICE.Sets.Bad, "FillColor");
        }
    }

    //Ввод предельных значений
    EngineeringRanksClick(object, objectName) {
        if (getSignalQuality(this.statePath)) {
            runInputWindow(object.lowEng, objectName + '.lowEng.click', {inputTag: this.rootPath, postfix: ".xa.wLowEngin", codes: this.config.Code});
            runInputWindow(object.highEng, objectName + '.highEng.click', {inputTag: this.rootPath, postfix: ".xa.wHighEngin", codes: this.config.Code});
        }
        else {
            clickClear(object.lowEng, objectName + '.lowEng.click')
            clickClear(object.highEng, objectName + '.highEng.click')
        }
    }

    //вывод значения
    updateValue(value, path, state, context, object) {
            let color = context.determineColor(context.processStateBits());
            if (getSignalQuality(path) || getSignalQuality(state)) {
                if (value == S(path)) {
                    object.value.setStringValue(accessData.stringValue(`${path}.Display`) , "Text");
                }
                if (value == S(state)) {
                    RGBAColoring(object.value, color.value_text, "TextColor");
                    RGBAColoring(object.eUnit, color.value_text, "TextColor");
    
                }
            }
            else {
                object.value.setStringValue("???.???", "Text");
                RGBAColoring(object.value, colors.AP.Text.default, "TextColor");
                RGBAColoring(object.eUnit, colors.AP.Text.default, "TextColor");
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
        ModeClick(object, objectName, prefix, checkbox = false) {
        if (getSignalQuality(this.statePath)) {
            if (!checkbox && !this.processStateBits()[prefix]) {
                runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.cmd.${prefix}`, inputTag: this.rootPath})
            }
            else if (checkbox) {
                let prefixTag = (this.processStateBits()[prefix]) ? `${prefix}_off` : `${prefix}_on`
                runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.cmd.${prefixTag}`, inputTag: this.rootPath})
            }
            else {
                clickClear(object.select, objectName + '.select.click')
            }
        }
        else {
            clickClear(object.select, objectName + '.select.click')
        }
    }

    //состояния/значения уставок
    updateSetPoints(value, state, prefix, checkbox, context, object) {
        if(getSignalQuality(state)) {
            let SET = context.readSetpoints();
            switch(value) {
                case SET[prefix]:
                    object.set.value.setStringValue(SET[prefix].toFixed(context.config.FracDigits), "Text");
                    break;
                default:
                    if ((typeof(object.select) !== 'undefined') && checkbox) {
                        object.select.point.setVisible(context.processStateBits()[`${prefix}_On`])
                    }
                    let descTag = (checkbox) ? `set_${prefix}_Lim` : `${prefix}`
                    object.text.setStringValue(accessData.stringValue(`${this.setpointPath}.${descTag}.Description`), "Text")
                    object.set.value.setStringValue(SET[prefix].toFixed(context.config.FracDigits), "Text");
                    break;
                }
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                if ((typeof(object.select) !== 'undefined') && checkbox) {
                    RGBAColoring(object.select.back, colors.SERVICE.Goodqual.field, "FillColor")
                    if (context.processStateBits()[`${prefix}_On`]) {
                        RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
                    }
                    else {
                        RGBAColoring(object.set.value, colors.SERVICE.Sets.inact, "FillColor")
                    }
                }
                else {
                    RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
                }
            }
            else {
                if ((typeof(object.select) !== 'undefined') && checkbox) {
                    RGBAColoring(object.select.back, colors.SERVICE.Badqual.field, "FillColor")
                    object.select.point.setVisible(false);
                }
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
            RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor")
            object.set.value.setStringValue("???.???", "Text");
        }
    }
    
    //Изменение уставок
    SetClick(object, objectName, prefix, checkbox = false) {
        let postfixTag = (checkbox) ? `set_${prefix}_Lim` : prefix
        if((getSignalQuality(this.statePath)) && getSignalQuality(`${this.setpointPath}.${postfixTag}`)) { 
            if ((typeof(object.select) !== 'undefined') && checkbox) {
                let msksetvalue = (accessData.intValue(this.mskPath) & accessData.intValue(`${this.config.Code}.msk_set.${prefix}_LimEn`)) ? 
                    accessData.intValue(this.mskPath) - accessData.intValue(`${this.config.Code}.msk_set.${prefix}_LimEn`) : 
                    accessData.intValue(this.mskPath) + accessData.intValue(`${this.config.Code}.msk_set.${prefix}_LimEn`);
                runAccessBox(object.select, objectName + '.select.click', {value: msksetvalue, postfix: '.wvalue', statebit: this.processStateBits()[`${prefix}_On`], inputTag: this.mskPath, desc: accessData.stringValue(`${this.mskPath}.Description`).replace("состояние обработки порогов","")+'\n'+accessData.stringValue(`${this.config.Code}.msk_set.${prefix}_LimEn.Description`)})
                if (this.processStateBits()[`${prefix}_On`]) {
                    runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.xa.${postfixTag}`, codes: this.config.Code})
                }
                else {
                    clickClear(object.set, objectName + '.set.click');
                }
            }
            else {
                runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.xa.${postfixTag}`, codes: this.config.Code})
            }
        }
        else {
            if ((typeof(object.select) !== 'undefined') && checkbox) {
                clickClear(object.select, objectName + '.select.click');
            }
            clickClear(object.set, objectName + '.set.click');
        }
    }

    //аварии
    updateAlarms(value, flt, prefix, context, object) {
        if(getSignalQuality(flt)) {
           let color = context.processFaultBits()
                RGBAColoring(object.indicator, color[prefix].clr, "FillColor")
                RGBAColoring(alarms.name, color.aggregate, "FillColor")
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
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
                    runAccessBox(object, objectName + '.click', {codes: `${this.config.Code}.cmd.${prefix}`, inputTag: this.rootPath})
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
        // environment.logInfo("value: " + value);
        // environment.logInfo("path: " + path);
        // environment.logInfo("FracDigits: " + accessData.intValue(`${path}.FracDigits`));
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(value !== null ? value.toFixed(accessData.intValue(`${path}.FracDigits`)) : "", "Text");
        } 
        else if (object.setStringValue) {
            object.setStringValue(value !== null ? value.toFixed(accessData.intValue(`${path}.FracDigits`)) : "", "Text");
        }
    }
    else {
        }
}
//#endregion
    
    //Обходим подписку
direct_updateSetPoints(object, prefix, checkbox = false) {
    let descTag = checkbox ? "set_" + prefix + "_Lim" : prefix;
    let setTag = this.setpointPath + "." + descTag;
    
    // Читаем ВСЕ свежие данные
    let currentValue = accessData.doubleValue(setTag);
    let currentQuality = getSignalQuality(setTag);
    let description = accessData.stringValue(setTag + ".Description");
    let SET = this.readSetpoints();
    let stateBits = this.processStateBits();
    
    if (currentQuality) {  // Good quality
        // Description Работает всегда
        if (object.text && object.text.setStringValue) {
            object.text.setStringValue(description || "N/A", "Text");
        }
        
        // Значение Работает всегда
        let valueText = "0.00";
        if (SET && SET[prefix] !== undefined && SET[prefix] !== null) {
            valueText = SET[prefix].toFixed(this.config.FracDigits || 2);
        }
        if (object.set && object.set.value && object.set.value.setStringValue) {
            object.set.value.setStringValue(valueText, "Text");
        }
        
        // ✅ Чекбокс ТОЛЬКО если есть (не ломает без него!)
        if (checkbox && object.select && object.select.point) {
            object.select.point.setVisible(!!stateBits[prefix + "_On"]);
        }
        if (checkbox && object.select && object.select.back) {
            RGBAColoring(object.select.back, colors.SERVICE.Goodqual.field, "FillColor");
        }
        
        // Цвета текста Работает всегда
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor");
        }
        
        // Цвет значения Работает всегда (с/без чекбокса)
        if (object.set && object.set.value) {
            let valueColor = colors.SERVICE.Sets.Good;
            // Цвет зависит от чекбокса только если он есть
            if (checkbox && stateBits && stateBits[prefix + "_On"] !== undefined) {
                valueColor = stateBits[prefix + "_On"] ? colors.SERVICE.Sets.Good : colors.SERVICE.Sets.inact;
            }
            RGBAColoring(object.set.value, valueColor, "FillColor");
        }
        
    } else {  // Bad quality
        // Всегда безопасно
        if (object.text && object.text.setStringValue) {
            object.text.setStringValue("???", "Text");
        }
        if (object.set && object.set.value && object.set.value.setStringValue) {
            object.set.value.setStringValue("???.???", "Text");
        }
        
        // Чекбокс только если есть
        if (checkbox && object.select && object.select.point) {
            object.select.point.setVisible(false);
        }
        if (checkbox && object.select && object.select.back) {
            RGBAColoring(object.select.back, colors.SERVICE.Badqual.field, "FillColor");
        }
        
        // Цвета bad quality
        if (object.text) RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor");
        if (object.set && object.set.value) RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor");
    }
    
//    environment.logInfo("✅ " + prefix + ": Description='" + (description || "NULL") + "', Value=" + (SET ? SET[prefix] : "NULL") + ", hasCheckbox=" + checkbox);
}

// Обход для значения и цвета
direct_updateValue(object) {
    // ✅ Читаем свежие данные
    let currentValue = accessData.doubleValue(this.valuePath);
    let currentPathQuality = getSignalQuality(this.valuePath);
    let currentStateQuality = getSignalQuality(this.statePath);
    let stateBits = this.processStateBits();
    let color = this.determineColor(stateBits);
    
    let displayQuality = currentPathQuality || currentStateQuality;
    
    if (displayQuality) {  // ✅ Good quality
        // ✅ Значение из .Display или числовое
        let displayText = accessData.stringValue(this.valuePath + ".Display");
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(displayText || currentValue.toFixed(this.config.FracDigits || 2), "Text");
        }
        
        // ✅ Цвета текста по состоянию (imit/test/default)
        if (object.value) {
            RGBAColoring(object.value, color.value_text, "TextColor");
        }
        if (object.eUnit) {
            RGBAColoring(object.eUnit, color.value_text, "TextColor");
        }
        
    } else {  // Bad quality
        // ✅ Bad quality значения и цвета
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue("???.???", "Text");
        }
        if (object.value) {
            RGBAColoring(object.value, colors.AP.Text.default, "TextColor");
        }
        if (object.eUnit) {
            RGBAColoring(object.eUnit, colors.AP.Text.default, "TextColor");
        }
    }
    
    // environment.logInfo("✅ Value: '" + (displayQuality ? "OK" : "BAD") + "', display='" + 
    //                    (displayQuality ? accessData.stringValue(this.valuePath + ".Display") : "???") + 
    //                    "', color=" + color.value_text);
}

// Обход для шкалы (значение)
direct_updateScaleValue(object) {
    // ✅ Читаем свежие данные
    let currentValue = accessData.doubleValue(this.valuePath);
    let pathQuality = getSignalQuality(this.valuePath);
    let stateQuality = getSignalQuality(this.statePath);
    let SET = this.readSetpoints();
    
    let scaleX, scaleY = 100;
    
    if (pathQuality || stateQuality) {  // ✅ Good quality
        // ✅ Нормальное положение ползунка
        scaleX = utils.rangeTransform(currentValue, SET.LowEngin, SET.HighEngin, 0, 100);
    } else {
        // ✅ Bad quality — на максимум
        scaleX = utils.rangeTransform(SET.HighEngin, SET.LowEngin, SET.HighEngin, 0, 100);
    }
    
    // ✅ Применяем масштаб
    if (object.scaleLine && object.scaleLine.setScaleXY) {
        object.scaleLine.setScaleXY(scaleX, scaleY, 0);
    }
    
    // environment.logInfo("ScaleValue: x=" + currentValue + 
    //                    ", scaleX=" + scaleX + 
    //                    ", quality=" + (pathQuality || stateQuality ? "GOOD" : "BAD"));
}

// Обход для цвета шкалы
direct_updateScaleColor(object) {
    // ✅ Читаем свежие данные
    let currentState = accessData.doubleValue(this.statePath);
    let currentQuality = getSignalQuality(this.statePath);
    let stateBits = this.processStateBits();
    let color = this.determineColor(stateBits);
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Цвет шкалы по состоянию (alarm/warn/default)
        if (object.scaleLine) {
            RGBAColoring(object.scaleLine, color.scale, "FillColor");
        }
    } else {  // Bad quality
        // ✅ Специальный цвет плохого качества
        if (object.scaleLine) {
            RGBAColoring(object.scaleLine, colors.AP.ScalePopup.Badqual, "FillColor");
        }
    }
    
    // environment.logInfo("ScaleColor: scale=" + (currentQuality ? "state-based" : "Badqual") + 
    //                    ", quality=" + currentQuality);
}

// Обход для уставок на шкале
direct_updateScaleSetPoints(object) {
    // ✅ Читаем свежие данные
    let currentState = accessData.doubleValue(this.statePath);
    let currentQuality = getSignalQuality(this.statePath);
    let SET = this.readSetpoints();
    let stateBits = this.processStateBits();
    
    let offsetY = 0;
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Обновляем ВСЕ метки уставок
        let positions = ["AH", "WH", "WL", "AL"];
        for (let i = 0; i < positions.length; i++) {
            let item = positions[i];
            if (object[item]) {
                let offsetX = utils.rangeTransform(SET[item], SET.LowEngin, SET.HighEngin, 0, 360);
                object[item].move(offsetX, offsetY);
                object[item].setVisible(!!stateBits[item + "_On"]);
            }
        }
    } else {  // Bad quality
        // ✅ Скрываем ВСЕ метки
        let positions = ["AH", "WH", "WL", "AL"];
        for (let i = 0; i < positions.length; i++) {
            let item = positions[i];
            if (object[item]) {
                object[item].setVisible(false);
            }
        }
    }
    
    // environment.logInfo("ScaleSetPoints: quality=" + currentQuality + 
    //                    ", AH_On=" + stateBits.AH_On + 
    //                    ", positions updated");
}

// Обход для инженерных пределов
direct_updateEngineeringRanks(object) {
    // ✅ Читаем свежие данные
    let currentQuality = getSignalQuality(this.statePath);
    let SET = this.readSetpoints();
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Оба предела всегда (упрощено)
        let fracDigits = this.config.FracDigits || 2;
        let lowText = SET.LowEngin !== undefined ? SET.LowEngin.toFixed(fracDigits) : "0.00";
        let highText = SET.HighEngin !== undefined ? SET.HighEngin.toFixed(fracDigits) : "100.00";
        
        // Нижний предел
        if (object.lowEng && object.lowEng.value && object.lowEng.value.setStringValue) {
            object.lowEng.value.setStringValue(lowText, "Text");
        }
        
        // Верхний предел
        if (object.highEng && object.highEng.value && object.highEng.value.setStringValue) {
            object.highEng.value.setStringValue(highText, "Text");
        }
        
        // ✅ Зеленые цвета
        if (object.lowEng && object.lowEng.value) {
            RGBAColoring(object.lowEng.value, colors.SERVICE.Sets.Good, "FillColor");
        }
        if (object.highEng && object.highEng.value) {
            RGBAColoring(object.highEng.value, colors.SERVICE.Sets.Good, "FillColor");
        }
        
    } else {  // Bad quality
        // ✅ Оба предела — ошибка
        if (object.lowEng && object.lowEng.value && object.lowEng.value.setStringValue) {
            object.lowEng.value.setStringValue('??.??', "Text");
        }
        if (object.highEng && object.highEng.value && object.highEng.value.setStringValue) {
            object.highEng.value.setStringValue('??.??', "Text");
        }
        
        // ✅ Красные цвета
        if (object.lowEng && object.lowEng.value) {
            RGBAColoring(object.lowEng.value, colors.SERVICE.Sets.Bad, "FillColor");
        }
        if (object.highEng && object.highEng.value) {
            RGBAColoring(object.highEng.value, colors.SERVICE.Sets.Bad, "FillColor");
        }
    }
    
    // environment.logInfo("EngineeringRanks: Low=" + (SET.LowEngin || "NULL") + 
    //                    ", High=" + (SET.HighEngin || "NULL") + 
    //                    ", quality=" + currentQuality);
}

// Обход для аварий
direct_updateAlarms(object, prefix) {
    // ✅ Читаем свежие данные
    let currentFault = accessData.doubleValue(this.faultPath);
    let currentQuality = getSignalQuality(this.faultPath);
    let faultBits = this.processFaultBits();
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Индикатор аварии (CH, MOD, SENS, etc)
        if (object.indicator) {
            RGBAColoring(object.indicator, faultBits[prefix].clr, "FillColor");
        }
        
        // ✅ Заголовок аварий (aggregate цвет)
        if (alarms && alarms.name) {
            RGBAColoring(alarms.name, faultBits.aggregate, "FillColor");
        }
        
        // ✅ Текст good quality
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor");
        }
    } else {  // Bad quality
        // ✅ Default цвета
        if (alarms && alarms.name) {
            RGBAColoring(alarms.name, colors.SERVICE.Popup.headDEF, "FillColor");
        }
        if (object.indicator) {
            RGBAColoring(object.indicator, colors.SERVICE.Badqual.field, "FillColor");
        }
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor");
        }
    }
    
    //environment.logInfo("✅ Alarm " + prefix + ": fault=" + currentFault + ", color=" + (faultBits[prefix] ? faultBits[prefix].sts : "N/A"));
}

// Обход для состояний кнопок/команд
direct_blockCmdBtn(object, blockCondition = []) {
    // ✅ Читаем свежие данные
    let currentQuality = getSignalQuality(this.statePath);
    let stateBits = this.processStateBits();
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Проверяем условия блокировки
        let block = false;
        for (let i = 0; i < blockCondition.length; i++) {
            let item = blockCondition[i];
            let isNegated = item.indexOf('!') === 0;
            let key = isNegated ? item.slice(1) : item;
            let bitValue = (key in stateBits) ? stateBits[key] : false;
            let conditionResult = isNegated ? !bitValue : bitValue;
            
            if (conditionResult) {
                block = true;
                break;
            }
        }
        
        // ✅ Активная/неактивная кнопка
        if (object.field) {
            if (!block) {
                RGBAColoring(object.field, colors.SERVICE.buttons.act, "FillColor");
            } else {
                RGBAColoring(object.field, colors.SERVICE.buttons.inact, "FillColor");
            }
        }
        
    } else {  // Bad quality
        // ✅ Плохое качество — серая кнопка
        if (object.field) {
            RGBAColoring(object.field, colors.SERVICE.Badqual.field, "FillColor");
        }
    }
    
    // environment.logInfo("blockCmdBtn: blocked=" + block + 
    //                    ", conditions=" + blockCondition.join(',') + 
    //                    ", quality=" + currentQuality);
}

// Универсальный обход для времени/режимов/кастомных тегов
direct_updateTimeStamp(object) {
    // ✅ Читаем свежие данные
    let currentState = accessData.doubleValue(this.statePath);
    let currentQuality = getSignalQuality(this.statePath);
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Метка времени из sourceTime
        let sourceTime = accessData.sourceTime(this.statePath);
        let date = new Date(sourceTime);
        let dateString = getDate(date);
        
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(dateString, "Text");
        }
        
        // environment.logInfo("✅ Timestamp: " + dateString);
    } else {  // Bad quality
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue('??.??.???? ??:??', "Text");
        }
        
        // environment.logInfo("✅ Timestamp: BAD QUALITY");
    }
}

direct_updateMode(object, prefix) {
    // ✅ Читаем свежие данные
    let currentState = accessData.doubleValue(this.statePath);
    let currentQuality = getSignalQuality(this.statePath);
    let stateBits = this.processStateBits();
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Видимость точки режима
        if (object.select && object.select.point) {
            object.select.point.setVisible(!!stateBits[prefix]);
        }
        
        // ✅ Цвета good quality
        if (object.select && object.select.back) {
            RGBAColoring(object.select.back, colors.SERVICE.Goodqual.field, "FillColor");
        }
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor");
        }
    } else {  // Bad quality
        // ✅ Скрываем точку
        if (object.select && object.select.point) {
            object.select.point.setVisible(false);
        }
        
        // ✅ Цвета bad quality
        if (object.select && object.select.back) {
            RGBAColoring(object.select.back, colors.SERVICE.Badqual.field, "FillColor");
        }
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor");
        }
    }
    
    // environment.logInfo("✅ Mode " + prefix + ": visible=" + stateBits[prefix] + ", quality=" + currentQuality);
}

direct_updateMsgState(object) {
    // ✅ Читаем свежие данные
    let currentQuality = getSignalQuality(this.statePath);
    let stateBits = this.processStateBits();
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Видимость точки: msgOff=0 → visible=true (инверсия!)
        let msgOff = stateBits.msgOff || false;
        if (object.point) {
            object.point.setVisible(!msgOff);
        }
        
        // ✅ Зеленый фон
        if (object.back) {
            RGBAColoring(object.back, colors.SERVICE.Goodqual.field, "FillColor");
        }
        
    } else {  // Bad quality
        // ✅ Скрываем точку + серый фон
        if (object.point) {
            object.point.setVisible(false);
        }
        if (object.back) {
            RGBAColoring(object.back, colors.SERVICE.Badqual.field, "FillColor");
        }
    }
    
    environment.logInfo("MsgState: msgOff=" + stateBits.msgOff + 
                       ", pointVisible=" + (!stateBits.msgOff) + 
                       ", quality=" + currentQuality);
}

direct_updateCustomTag(object, tagSuffix) {
    // ✅ Формируем путь к кастомному тегу
    let customPath = this.rootPath + tagSuffix;
    let currentValue = accessData.doubleValue(customPath);
    let currentQuality = getSignalQuality(customPath);
    let fracDigits = accessData.intValue(customPath + ".FracDigits") || 2;
    
    if (currentQuality) {  // ✅ Good quality
        let displayValue = "";
        if (currentValue !== null && currentValue !== undefined) {
            displayValue = currentValue.toFixed(fracDigits);
        }
        
        // ✅ Поддержка двух типов объектов (как в оригинале)
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(displayValue, "Text");
        } else if (object.setStringValue) {
            object.setStringValue(displayValue, "Text");
        }
        
        // environment.logInfo("CustomTag " + tagSuffix + ": value=" + currentValue + ", display='" + displayValue + "'");
    } else {
        // ✅ Bad quality — очищаем
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue("", "Text");
        } else if (object.setStringValue) {
            object.setStringValue("", "Text");
        }
        
        // environment.logInfo("CustomTag " + tagSuffix + ": BAD QUALITY");
    }
}


}