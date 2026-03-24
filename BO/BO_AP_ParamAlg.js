#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class AnalogBOPopupAlg extends ObservablePopup {
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
         this.statusPath = `${this.rootPath}.status`;
        this.faultPath = `${this.rootPath}.flt`;
        this.setpointPath = `${this.rootPath}.xa`;
        this.mskPath = `${this.rootPath}.msk_set`;
        //this.config.qualityTag = `${this.config.rootPath}.state`;
         this.config.Sensorname = accessData.stringValue(`${this.rootPath}.Sensor_Name`);
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.EUnit = accessData.stringValue(`${this.rootPath}.EUnit`);
        this.config.Code = accessData.stringValue(`${this.rootPath}.Type`);
        this.config.FracDigits = 2;
         if(this.config.type=='CK' || this.config.type=='FT'){
            this.comTag = `KSPG.CK.asuComReqMode.wvalue`;
            this.lsuCode = `codes.CK_cmd.cmd`;
        }
        else {
             this.lsuCode = `codes.BO_cmd.cmd`;
            this.comTag = `KSPG.BO.State.s6`;
        }

    }

    initialize() {
        // VALUE.eUnit.access.setStringValue(this.config.EUnit, "Text");
        // title.access.setStringValue(this.config.Title, "Text");
        // subtitle.access.setStringValue(this.config.Subtitle, "Text");
        // this.cl1=0;
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
            imit: accessData.doubleValue(`${this.setpointPath}.imit`),
            HH: accessData.doubleValue(`${this.valuePath}.HH`),
            LL: accessData.doubleValue(`${this.valuePath}.LL`),
            I: accessData.doubleValue(`${this.valuePath}.I`),
            K: accessData.doubleValue(`${this.valuePath}.K`),
            C: accessData.doubleValue(`${this.valuePath}.C`),
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
        let msk = accessData.doubleValue(this.mskPath);
        let status = accessData.doubleValue(this.statusPath);
        if ((state === null || state === undefined)  || (msk === null || msk === undefined))  return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            field       :   !!(state & (accessData.intValue(`${this.config.Code}.Status1.Field`))),
            mask        :   (status == 5),
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
            AL_On       :   !!(msk & (accessData.intValue(`${this.config.Code}.msk_set.AL_LimEn`))),
            noerr       :   (status == 0),
            break       :   (status == 1),
            kz          :   (status == 2),
            adcerr      :   (status == 3),
            off         :   (status == 4)
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
         processFaultBitsLSU() {
         let status = accessData.doubleValue(this.statusPath);
        if ((status === null || status === undefined)) return;
       
        //Биты аварий
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            noerr  :             colors.EO.State.off_front,
            break  :             colors.AP.Flt.act,
            kz  :               colors.AP.Flt.act,
            adcerr  :            colors.AP.Fillvalue.warn,
            off  :              colors.AP.Fillvalue.warn,
            all   :             (status>0) ? colors.AP.Flt.act : colors.AP.Flt.inact
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
    publish_updateAlarmsLSU(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statusPath
                                                    ],
                (newValue) => {this.updateAlarmsLSU(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }
    //#region object_Value
    publish_updateValue(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.valuePath, 
                                                        this.statePath
                                                    ], 
                (newValue) => {this.updateValue(newValue.value, this.valuePath, this.statePath, this, object)})
        }
        else {}
    }
    //#endregion

    //#region object_Scale
        publish_updateScaleValue(object) {
            if (!object.observerAction1) {
                object.observerAction1 = publisher.register([this.valuePath, 
                                                            this.statePath,
                                                            `${this.setpointPath}.wHighEngin`, 
                                                            `${this.setpointPath}.wLowEngin`
                                                        ], 
                    (newValue) => {this.updateScaleValue(newValue.value, this.valuePath, this.statePath, this, object)})
            }
            else {}
        }

        publish_updateScaleColor(object) {
            if (!object.observerAction2) {
                object.observerAction2 = publisher.register([this.statePath  
                                                        ], 
                    (newValue) => {this.updateScaleColor(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }

        publish_updateScaleSetPoints(object) {
            if (!object.observerAction3) {
                object.observerAction3 = publisher.register([this.statePath,
                                                            this.mskPath,
                                                            `${this.setpointPath}.wHighEngin`, 
                                                            `${this.setpointPath}.set_AH_Lim`, 
                                                            `${this.setpointPath}.set_WH_Lim`, 
                                                            `${this.setpointPath}.set_WL_Lim`, 
                                                            `${this.setpointPath}.set_AL_Lim`,
                                                            `${this.setpointPath}.wLowEngin` 
                                                        ],
                    (newValue) => {this.updateScaleSetPoints(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }

        publish_updateEngineeringRanks(object) {
            if (!object.observerAction4) {
                object.observerAction4 = publisher.register([this.statePath,
                                                            this.mskPath,
                                                            `${this.setpointPath}.wHighEngin`, 
                                                            `${this.setpointPath}.wLowEngin` 
                                                            ],
                    (newValue) => {this.updateEngineeringRanks(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }
    //#endregion

    //#region object_mode
    publish_updateMode(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath,
                                                        this.statusPath
            ],
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
    publish_updateSetPoints(object, prefix, checkbox = false) {
        let setTag = (checkbox) ? `${this.setpointPath}.set_${prefix}_Lim` : `${this.setpointPath}.${prefix}`
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.mskPath,
                                                        setTag,
                                                        `${this.valuePath}.${prefix}`
                                                    ], 
                (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, checkbox, this, object)})
            }
        else {}
    }
    //#endregion

    //#region object_alarms
    publish_updateAlarms(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.faultPath
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
 //аварии
    updateAlarmsLSU(value, flt, prefix, context, object) {
        if(getSignalQuality(flt)) {
           let color = context.processFaultBitsLSU()
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
    ModeClickLSU(object, objectName, prefix) {
        if (getSignalQuality(this.statePath) && !this.processStateBits()[prefix]) {
            runAccessBox(object.select, objectName + '.select.click', {postfix:``, codes: `${this.lsuCode}.${this.config.cmd_on}`, inputTag: this.comTag})
        }
        else {
            runAccessBox(object.select, objectName + '.select.click', {postfix:``, codes: `${this.lsuCode}.${this.config.cmd_off}`, inputTag: this.comTag})
        }
    }
    //состояния/значения уставок
    updateSetPoints(value, state, prefix, checkbox, context, object) {
        if(getSignalQuality(this.statePath)) {
            let SET = context.readSetpoints();
            let descTag = (checkbox) ? `set_${prefix}_Lim` : `${prefix}`
            switch(value) {
                case SET[prefix]:
                    //let descTag = (checkbox) ? `set_${prefix}_Lim` : `${prefix}`
                    object.set.value.setStringValue(SET[prefix].toFixed(context.config.FracDigits), "Text");
                    if(prefix=='I' || prefix=='K' || prefix=='C'|| prefix=='HH'||prefix=='LL'||prefix=='DensNow'|| prefix=='MaxDens'|| prefix=='MinDen'|| prefix=='MaxSpeed'|| prefix=='MinSpeed' || prefix=='OverM'|| prefix=='OverV'|| prefix=='OverV'|| prefix=='SumMassa'|| prefix=='SumVolu'|| prefix=='TempNow'|| prefix=='manualDens'|| prefix=='mask_dens'|| prefix=='mask_mass'|| prefix=='mask_temp'|| prefix=='mask_volume')
                        object.text.setStringValue(accessData.stringValue(`${this.valuePath}.${prefix}.Description`), "Text")
                    else
                        object.text.setStringValue(accessData.stringValue(`${this.setpointPath}.${descTag}.Description`), "Text")
                    break;
                default:
                    if ((typeof(object.select) !== 'undefined') && checkbox) {
                        object.select.point.setVisible(context.processStateBits()[`${prefix}_On`])
                    }
                    //let descTag = (checkbox) ? `set_${prefix}_Lim` : `${prefix}`
                    if(prefix=='I' || prefix=='K' || prefix=='C'|| prefix=='HH'||prefix=='LL'||prefix=='DensNow'|| prefix=='MaxDens'|| prefix=='MinDen'|| prefix=='MaxSpeed'|| prefix=='MinSpeed' || prefix=='OverM'|| prefix=='OverV'|| prefix=='OverV'|| prefix=='SumMassa'|| prefix=='SumVolu'|| prefix=='TempNow'|| prefix=='manualDens'|| prefix=='mask_dens'|| prefix=='mask_mass'|| prefix=='mask_temp'|| prefix=='mask_volume')
                        object.text.setStringValue(accessData.stringValue(`${this.valuePath}.${prefix}.Description`), "Text")
                    else
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
 //Изменение уставок
    SetClickLSU(object, objectName, prefix, checkbox = false, cm1, cm2) {
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
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(value !== null ? value.toFixed(2) : "", "Text");
        } 
        else if (object.setStringValue) {
            object.setStringValue(value !== null ? value.toFixed(2) : "", "Text");
        }
    }
    else {
        }
}
//#endregion
}
    
    

