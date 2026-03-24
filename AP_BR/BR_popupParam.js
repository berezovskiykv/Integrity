#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа аналоговых параметров
 * @class AnalogParameterPopup
 * @extends ObservablePopup
 */
class AnalogBRPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.statePath = `${this.rootPath}.State`;
        this.faultPath = `${this.rootPath}.flt`;
        this.mskPath = `${this.rootPath}.msk_set`;
        //this.config.qualityTag = `${this.config.rootPath}.state`;
        this.config.Sensorname = accessData.stringValue(`${this.rootPath}.ID`);
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.EUnit = accessData.stringValue(`${this.rootPath}.EUnit`);
        this.config.Code = `codes.BR_AI.cmd`;
        // this.config.FracDigits = accessData.intValue(`${this.config.rootPath}.FracDigits`)
        this.config.FracDigits = 2;
    }

    initialize() {
        VALUE.eUnit.access.setStringValue(this.config.EUnit, "Text");
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
        sensorname.access.setStringValue(this.config.Sensorname, "Text");
        this.cl1=0;
    }

    /**
    * Читает текущие значения уставок
    * @returns {Object} Значения уставок
    */
    readSetpoints() {
        return {
            HighEngin: accessData.doubleValue(`${this.valuePath}.HighEngin`),
            HighDev: accessData.doubleValue(`${this.valuePath}.HighDev`),
            HH: accessData.doubleValue(`${this.valuePath}.HH`),
            H: accessData.doubleValue(`${this.valuePath}.H`),
            LL: accessData.doubleValue(`${this.valuePath}.LL`),
            L: accessData.doubleValue(`${this.valuePath}.L`),
            LowEngin: accessData.doubleValue(`${this.valuePath}.LowEnging`),
            LowDev: accessData.doubleValue(`${this.valuePath}.LowDev`),
            Hist: accessData.doubleValue(`${this.valuePath}.Hist`),
            Imit: accessData.doubleValue(`${this.valuePath}.Imit`),
            I: accessData.doubleValue(`${this.valuePath}.I`),
            Filt: accessData.doubleValue(`${this.valuePath}.Filt`),
        };
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        if ((state === null || state === undefined)) return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            flt_val     :   !!(state & 1),
            flt_ch      :   !!(state & 2),
            flt_ho      :   !!(state & 4),
            flt_lo      :   !!(state & 8),
            flt_calc    :   !!(state & 16),
            Imit        :   !!(state & 32),
            LL      :   !!(state & 64),
            L       :   !!(state & 128),
            HH      :   !!(state & 256),
            H       :   !!(state & 512),
            Filt        :   !!(state & 1024),
            setpoint    :   !!(state & 2048),
            rep         :   !!(state & 4096),
            HH_Act      :   !!((accessData.doubleValue(`${this.valuePath}.HH`)) <= (accessData.doubleValue(this.valuePath))), 
            H_Act      :   !!((accessData.doubleValue(`${this.valuePath}.H`)) <= (accessData.doubleValue(this.valuePath))),
            L_Act      :   !!((accessData.doubleValue(`${this.valuePath}.L`)) >= (accessData.doubleValue(this.valuePath))),
            LL_Act      :   !!((accessData.doubleValue(`${this.valuePath}.LL`)) >= (accessData.doubleValue(this.valuePath)))
        }
    }

    /** Устанавливает биты/цвета аварий*/
     processFaultBits() {
         let state = accessData.doubleValue(this.statePath);
         let bb = accessData.boolValue(`${this.statePath}.b00`) || accessData.boolValue(`${this.statePath}.b01`) || accessData.boolValue(`${this.statePath}.b02`) || accessData.boolValue(`${this.statePath}.b03`) || accessData.boolValue(`${this.statePath}.b04`);
        if ((state === null || state === undefined)) return;
        let defineCLR = (name, actCLR, inactCLR) => {
            let sts = accessData.doubleValue(`${this.statePath}.b${name}.Color`);
            return { sts, clr: (sts==1) ? actCLR : inactCLR}
        }
        //Биты аварий
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            b00  :             defineCLR('00', colors.AP.Flt.act, colors.AP.Flt.inact),
            b01  :             defineCLR('01', colors.AP.Flt.act, colors.AP.Flt.inact),
            b02  :             defineCLR('02', colors.AP.Flt.act, colors.AP.Flt.inact),
            b03  :             defineCLR('03', colors.AP.Flt.act, colors.AP.Flt.inact),
            b04  :             defineCLR('04', colors.AP.Flt.act, colors.AP.Flt.inact),
            all   :             bb ? colors.AP.Flt.act : colors.AP.Flt.inact
        }
    }

    /**
     * Определяет цвет в зависимости от состояния
     * @returns {Object} Цвет в формате RGBA
     */
    determineColor(status) {
        return {
            value_text
            : status.Imit ? colors.AP.TextPopup.imit
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
                                                            `${this.valuePath}.HighEngin`, 
                                                            `${this.valuePath}.LowEnging`,
                                                        ], 
                    (newValue) => {this.updateScaleValue(newValue.value, this.valuePath, this.statePath, this, object)})
            }
            else {}
        }

        publish_updateScaleColor(object) {
            if (!object.observerAction2) {
                object.observerAction2 = publisher.register([this.valuePath,
                                                            // (accessData.boolValue(`${this.valuePath}.HiHi_Alm_AE`)), 
                                                            // (accessData.boolValue(`${this.valuePath}.Hi_Alm_AE`)), 
                                                            // (accessData.boolValue(`${this.valuePath}.LoLo_Alm_AE`)),
                                                            // (accessData.boolValue(`${this.valuePath}.Lo_Alm_AE`)),
                                                        ], 
                    (newValue) => {this.updateScaleColor(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }

        publish_updateScaleSetPoints(object) {
            if (!object.observerAction3) {
                object.observerAction3 = publisher.register([this.statePath,
                                                            `${this.valuePath}.HighEngin`, 
                                                            `${this.valuePath}.HH`, 
                                                            `${this.valuePath}.H`, 
                                                            `${this.valuePath}.LL`, 
                                                            `${this.valuePath}.L`,
                                                            `${this.valuePath}.LowEnging` 
                                                        ],
                    (newValue) => {this.updateScaleSetPoints(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }

        publish_updateEngineeringRanks(object) {
            if (!object.observerAction4) {
                object.observerAction4 = publisher.register([this.statePath,
                                                            `${this.valuePath}.HighEngin`, 
                                                            `${this.valuePath}.LowEnging`,
                                                            `${this.valuePath}.LowDev`,  
                                                            `${this.valuePath}.HighDev`,
                                                            `${this.valuePath}.I`
                                                            ],
                    (newValue) => {this.updateEngineeringRanks(newValue.value, newValue.tag, this, object)})
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
        
        let setTag = (checkbox) ? `${this.valuePath}.State.${bit}` : `${this.valuePath}.${prefix}`;
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.valuePath}.${prefix}`,
                                                        `${this.valuePath}`,
                                                        `${this.statePath}`,
                                                        setTag
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
        let SET = context.readSetpoints();
        let setfunc = (item) => {
            statusbit = context.processStateBits();
            //LogData(statusbit.AH_On, 'updateScaleSetPoints')
                            offsetX = utils.rangeTransform(SET[item], SET.LowEngin, SET.HighEngin, 0, 360 )
                           object[item].move(offsetX, offsetY);
                           object[item].setVisible(statusbit[`${item}`]);  
                               
        }

        if (getSignalQuality(state)) {
            SET = context.readSetpoints();
            switch (value) {
                case SET.HH:
                     setfunc('HH');
                     break;
                case SET.H:
                    setfunc("H");
                    break;
                case SET.LL:
                    setfunc("LL");
                    break;
                case SET.L:
                    setfunc("L");
                    break;
                default:
                    setfunc('HH');
                    setfunc("H");
                    setfunc("LL");
                    setfunc("L");
                    break; 
            }
        }
        else {
            object.HH.setVisible(false);
            object.H.setVisible(false);
            object.LL.setVisible(false);
            object.L.setVisible(false);
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
                case SET.HighDev:
                    object.highDev.value.setStringValue(SET.HighDev.toFixed(context.config.FracDigits), "Text");
                    break;
                case SET.LowDev:
                    object.lowDev.value.setStringValue(SET.LowDev.toFixed(context.config.FracDigits), "Text");
                break;
                case SET.I:
                    object.I.value.setStringValue(SET.I.toFixed(context.config.FracDigits), "Text");
                break;
                default:
                    object.lowEng.value.setStringValue(SET.LowEngin.toFixed(context.config.FracDigits), "Text");
                    object.highEng.value.setStringValue(SET.HighEngin.toFixed(context.config.FracDigits), "Text");
                    object.highDev.value.setStringValue(SET.HighDev.toFixed(context.config.FracDigits), "Text");
                    object.lowDev.value.setStringValue(SET.LowDev.toFixed(context.config.FracDigits), "Text");
                    object.I.value.setStringValue(SET.I.toFixed(context.config.FracDigits), "Text");
                    break;
                } 
            RGBAColoring(object.lowEng.value, colors.SERVICE.Sets.Good, "FillColor");
            RGBAColoring(object.highEng.value, colors.SERVICE.Sets.Good, "FillColor");
            RGBAColoring(object.highDev.value, colors.SERVICE.Sets.Good, "FillColor");
            RGBAColoring(object.lowDev.value, colors.SERVICE.Sets.Good, "FillColor");
            RGBAColoring(object.I.value, colors.SERVICE.Sets.Good, "FillColor");
        }
        else {
            object.lowEng.value.setStringValue('??.??', "Text");
            object.highEng.value.setStringValue('??.??', "Text");
            object.highDev.value.setStringValue('??.??', "Text");
            object.lowDev.value.setStringValue('??.??', "Text");
            object.I.value.setStringValue('??.??', "Text");
            RGBAColoring(object.lowEng.value, colors.SERVICE.Sets.Bad, "FillColor");
            RGBAColoring(object.highEng.value, colors.SERVICE.Sets.Bad, "FillColor");
            RGBAColoring(object.highDev.value, colors.SERVICE.Sets.Bad, "FillColor");
            RGBAColoring(object.lowDev.value, colors.SERVICE.Sets.Bad, "FillColor");
            RGBAColoring(object.I.value, colors.SERVICE.Sets.Bad, "FillColor");
        }
    }

    //Ввод предельных значений
    EngineeringRanksClick(object, objectName) {
        if (getSignalQuality(this.valuePath)) {
            runInputWindow(object.lowEng, objectName + '.lowEng.click', {inputTag: this.valuePath, postfix: ".LowEnging", codes: this.config.Code});
            runInputWindow(object.highEng, objectName + '.highEng.click', {inputTag: this.valuePath, postfix: ".HighEngin", codes: this.config.Code});
            runInputWindow(object.highDev, objectName + '.highDev.click', {inputTag: this.valuePath, postfix: ".HighDev", codes: this.config.Code});
            runInputWindow(object.lowDev, objectName + '.lowDev.click', {inputTag: this.valuePath, postfix: ".LowDev", codes: this.config.Code});
          
        }
        else {
            clickClear(object.lowEng, objectName + '.lowEng.click')
            clickClear(object.highEng, objectName + '.highEng.click')
            clickClear(object.highDev, objectName + '.highDev.click')
            clickClear(object.lowDev, objectName + '.lowDev.click')
      
        }
    }

    //вывод значения
    updateValue(value, path, state, context, object) {
            let color = context.determineColor(context.processStateBits());
            if (getSignalQuality(path) || getSignalQuality(state)) {
                if (value == S(path)) {
                    object.value.setStringValue(accessData.doubleValue(`${path}`).toFixed(context.config.FracDigits), "Text");
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
    ModeClick(object, objectName, prefix, cm1,cm2) {
        if (getSignalQuality(this.statePath) && !this.processStateBits()[prefix]) {
            runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${cm1}`, inputTag: this.valuePath})
        }
        else {
            runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${cm2}`, inputTag: this.valuePath})
        }
    }

    //состояния/значения уставок
    updateSetPoints(value, state, prefix, checkbox, context, object) {
          object.text.setStringValue(accessData.stringValue(`${this.valuePath}.${prefix}.Description`), "Text")
        if(getSignalQuality(this.statePath)) {
            let SET = context.readSetpoints();
            if(checkbox==false)
            {
                object.set.value.setStringValue(SET[prefix].toFixed(context.config.FracDigits), "Text");
                object.text.setStringValue(accessData.stringValue(`${this.valuePath}.${prefix}.Description`), "Text")
            }
                   
            else
                {
                    object.select.point.setVisible(context.processStateBits()[`${prefix}`]);
                    let descTag = (checkbox) ? `${prefix}` : `${prefix}`
                    object.text.setStringValue(accessData.stringValue(`${this.valuePath}.${descTag}.Description`), "Text")
                    object.set.value.setStringValue(SET[prefix].toFixed(context.config.FracDigits), "Text");
                }
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                if ((typeof(object.select) !== 'undefined') && checkbox) {
                    RGBAColoring(object.select.back, colors.SERVICE.Goodqual.field, "FillColor")
                    if (context.processStateBits()[`${prefix}`]) {
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
    SetClick(object, objectName, prefix, checkbox, cm1, cm2) {
        if(getSignalQuality(`${this.statePath}`)) { 
            if ((typeof(object.select) !== 'undefined') && checkbox && (this.processStateBits()[`setpoint`])) {       
                if (this.processStateBits()[`${prefix}`]) {
                    runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${cm2}`, inputTag: this.valuePath})
                    runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.${prefix}`, codes: this.config.Code})
                    //environment.logInfo("CODE BR 1: " + `${this.config.Code}.${cm2}`);
                }
                else {
                    runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.Code}.${cm1}`, inputTag: this.valuePath})
                    clickClear(object.set, objectName + '.set.click');
                    //environment.logInfo("CODE BR 2: " + `${this.config.Code}.${cm1}`);
                }
            }
            else if (!checkbox) {
               runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.${prefix}`, codes: this.config.Code});
               //environment.logInfo("CODE BR 3: " + this.config.Code); 
               //environment.logInfo("InputTag BR 3: " + this.rootPath); 
               //environment.logInfo("Postfix BR 3: " + `.${prefix}`); 
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
    Setpoints(object, objectName, cm1, cm2, bit) {
        if(getSignalQuality(`${this.statePath}`)) {
            object.select.point.setVisible(this.processStateBits()[`setpoint`]);      
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
      
                RGBAColoring(object.indicator, color[prefix].clr, "FillColor")
                RGBAColoring(alarms.name, color.all, "FillColor")
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                object.text.setStringValue(accessData.stringValue(`${this.statePath}.${prefix}.Description`), "Text");
      
                
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
    
    

