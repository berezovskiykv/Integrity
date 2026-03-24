#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа сирены
 * @class SirParameterPopup
 * @extends ObservablePopup
 */
class SirParameterPopup extends ObservablePopup {
    constructor (publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.statePath = `${this.rootPath}.status1`;
        this.faultPath = `${this.rootPath}.status2`;
        this.setpointPath = `${this.rootPath}.xa`;
        //this.colorPath = `${this.config.rootPath}.Color`;
        this.colorPath = `${this.rootPath}.Color`;
        this.config.Sensorname = accessData.stringValue(`${this.rootPath}.Sensor_Name`);
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.code = accessData.stringValue(`${this.rootPath}.Type`);
    }

    initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
        Sensor_Name.access.setStringValue(this.config.Sensorname, "Text");
    }

    /**
    * Читает текущие значения уставок
    * @returns {Object} Значения уставок
    */
    readSetpoints() {
        let readSET = (name) => {
            return {
                value       : accessData.doubleValue(`${this.setpointPath}.${name}`),
                description : accessData.stringValue(`${this.setpointPath}.${name}.Description`),
                //fracdigits  : accessData.intValue(`${this.setpointPath}.${name}.FracDigits`),
                //eunit       : accessData.stringValue(`${this.setpointPath}.${name}.EUnit`),
            }
        }

        return {
            time: readSET('time')
        }
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        let fault = accessData.doubleValue(this.faultPath);
        if ((state === null || state === undefined) || (fault === null || fault === undefined)) return;

        return {
            mask        :   !!(state & (S(`${this.config.code}.Status1.Disable`))),
            imit        :   !!(state & (S(`${this.config.code}.Status1.Imit`))),
            msgOff      :   !!(state & (S(`${this.config.code}.Status1.MsgOff`))),
            man         :   !!(state & (S(`${this.config.code}.Status1.Man`))),
            aut         :   !!(state & (S(`${this.config.code}.Status1.Aut`))),
            bad         :   !!(state & (S(`${this.config.code}.Status1.Bad`))),
            act         :   !!(state & (S(`${this.config.code}.Status1.Act`))),
            Fltkvit     :   !!(state & (S(`${this.config.code}.Status1.FltKvit`))),
            kvit        :   !!(state & (S(`${this.config.code}.Status1.Kvit`))),
            ModDist     :   !!(fault & (S(`${this.config.code}.Status2.ModDISt`))),
            ModDost     :   !!(fault & (S(`${this.config.code}.Status2.ModDOSt`))),
            ErrFbk      :   !!(fault & (S(`${this.config.code}.Status2.ErrFbk`))),
            CCEnable    :   !!(fault & (S(`${this.config.code}.Status2.CCEnable`))),
            Fault       :   !!(fault & (S(`${this.config.code}.Status2.Fault`))),
            CmdFlt      :   !!(fault & (S(`${this.config.code}.Status2.CmdFlt`))),
            MskEnable   :   !!(fault & (S(`${this.config.code}.Status2.MskEnable`))),
            MskDisable  :   !!(fault & (S(`${this.config.code}.Status2.MskDisable`))),
            AutEnable   :   !!(fault & (S(`${this.config.code}.Status2.AutEnable`))),
            AutDisable  :   !!(fault & (S(`${this.config.code}.Status2.AutDisable`))),
            flt         :   !!(accessData.doubleValue(this.faultPath) > 0)
        }
    }

    /** Устанавливает биты/цвета аварий*/
    processFaultBits() {
        let fault = accessData.doubleValue(this.faultPath);
        if (fault === null || fault === undefined) return; 
        
        let defineCLR = (name, actCLR, inactCLR) => {
            let sts = !!(fault & accessData.intValue(`${this.config.code}.Status2.${name}`))
            return { sts, clr: sts ? actCLR : colors.SERVICE.Flt.inact}
        }

        return {
            aggregate       :   !!(fault > 0) ? colors.SERVICE.Flt.actAlm : colors.SERVICE.Popup.headDEF,
            ModDist         :   defineCLR('ModDISt', colors.SERVICE.Flt.actAlm),
            ModDost         :   defineCLR('ModDOSt', colors.SERVICE.Flt.actAlm),
            ErrFbk          :   defineCLR('ErrFbk', colors.SERVICE.Flt.actAlm),
            CCEnable        :   defineCLR('CCEnable', colors.SERVICE.Flt.actAlm),
            Fault           :   defineCLR('Fault', colors.SERVICE.Flt.actAlm),
            CmdFlt          :   defineCLR('CmdFlt', colors.SERVICE.Flt.actAlm),
            MskEnable       :   defineCLR('MskEnable', colors.SERVICE.Flt.actAlm),
            MskDisable      :   defineCLR('MskDisable', colors.SERVICE.Flt.actAlm),
            AutEnable       :   defineCLR('AutEnable', colors.SERVICE.Flt.actAlm),
            AutDisable      :   defineCLR('AutDisable', colors.SERVICE.Flt.actAlm)
        }
    }

    /**
     * Определяет цвет в зависимости от состояния
     * @returns {Object} Цвет в формате RGBA
     */

    determineColor(status) {
        let priority = accessData.intValue(this.colorPath)
        return {
                value_state
                : status.bad      ? colors.SIR.Fillstate.bad
                : status.ModDist  ? colors.SIR.Fillstate.flt
                : status.ModDost  ? colors.SIR.Fillstate.flt
                : status.ErrFbk   ? colors.SIR.Fillstate.flt
                : status.CCEnable ? colors.SIR.Fillstate.flt
                : status.Fault    ? colors.SIR.Fillstate.flt
                : status.CmdFlt   ? colors.SIR.Fillstate.flt
                : status.act && (priority == 1)  ? colors.SIR.Fillstate.act1
                : status.act && (priority == 2)  ? colors.SIR.Fillstate.act2 
                : status.act && (priority == 9)  ? colors.SIR.Fillstate.act3
                : status.act && (priority == 10) ? colors.SIR.Fillstate.act4
                : colors.SIR.Fillstate.field,

                back_state
                : status.bad      ? colors.SIR.Backstate.bad_back
                : status.ModDist  ? colors.SIR.Backstate.flt_back
                : status.ModDost  ? colors.SIR.Backstate.flt_back
                : status.ErrFbk   ? colors.SIR.Backstate.flt_back
                : status.CCEnable ? colors.SIR.Backstate.flt_back
                : status.Fault    ? colors.SIR.Backstate.flt_back
                : status.CmdFlt   ? colors.SIR.Backstate.flt_back
                : status.act && (priority == 1)  ? colors.SIR.Backstate.act1_back
                : status.act && (priority == 2)  ? colors.SIR.Backstate.act2_back 
                : status.act && (priority == 9)  ? colors.SIR.Backstate.act3_back
                : status.act && (priority == 10) ? colors.SIR.Backstate.act4_back
                : colors.SIR.Backstate.field,
                }
    }

    //#region PublishFunctions
        //#region object_timestamp
        publish_updateTimeStamp(object) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath
                                                        ], 
                    (newValue) => {this.updateTimeStamp(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }
        //#endregion
            
        //#region object_Element
        publish_updateElement(object) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            this.faultPath,
                                                            this.colorPath
                                                        ], 
                    (newValue) => {this.updateElement(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }
        //#endregion

        //#region object_TextState
        publish_updateTextState(object) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath
                                                        ], 
                    (newValue) => {this.updateTextState(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }
        //#endregion

        //#region object_Btn
        publish_blockCmdBtn(object, blockCondition = []) {  
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            this.faultPath
                                                        ],
                    (newValue) => {this.blockCmdBtn(newValue.value, newValue.tag, blockCondition, this, object)})
                }
            else {}
        }
        //#endregion

        //#region object_mode
        publish_updateMode(object, prefix) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath
                                                        ],
                    (newValue) => {this.updateMode(newValue.value, newValue.tag, prefix, this, object)})
                }
            else {}
        }
        //#endregion
        
        //#region object_set
        publish_updateSetPoints(object, prefix) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            `${this.setpointPath}.${prefix}`
                                                        ], 
                    (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, this, object)})
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

        //элемент дискрета в попапе (должна быть логика UpdateVisuals из SirParameter.js)
        updateElement(value, state, context, object) {
            let status = context.processStateBits();
            let color = context.determineColor(status);
            object.MASK.setVisible(status.mask);
            object.imit.setVisible(status.imit);
            object.auto.setVisible(status.aut);
            object.man.setVisible(status.man);
            object.sens.setVisible(status.ModDist || status.ModDost || status.ErrFbk || status.CCEnable );
            object.ext.setVisible(status.Fault || status.CmdFlt);
            RGBAColoring(object.INDICATOR, color.value_state, "FillColor");
            RGBAColoring(object.INDICATOR, color.back_state, "BackgroundColor");      
        }

        //моргание при необходимости квитирования
        elementFlashing(object) {
            if (getSignalQuality(this.statePath)) {
                if (this.processStateBits().kvit) {
                    flashing(object.INDICATOR, this.determineColor(this.processStateBits()).value_state, colors.SIR.Fillstate.kvit, "FillColor")
                    flashing(object.INDICATOR, this.determineColor(this.processStateBits()).back_state, colors.SIR.Backstate.kvit_back, "BackgroundColor")
                
                }
                else return;
            }
        }

        //текстовое состояние параметра
        updateTextState(value, state, context, object) {
            let priority = accessData.intValue(this.colorPath)
            if (getSignalQuality(state)) {
                let status = context.processStateBits();
                let color = context.determineColor(status);
             switch (true) {
                case status.act && (priority == 1 || priority == 2 || priority == 9):
                object.value.setStringValue("АКТИВНЫЙ", "Text");
                RGBAColoring(object.value, color.value_state, "TextColor");
                break;
                case status.act && (priority == 10):
                object.value.setStringValue("НЕАКТИВНЫЙ", "Text");
                RGBAColoring(object.value, color.value_state, "TextColor");
                break;
                default:
                object.value.setStringValue("НЕ ОПРЕДЕЛЕНО", "Text");
                RGBAColoring(object.value, colors.SERVICE.Goodqual.text, "TextColor");
                break; 
                }
            }
            else {
                object.value.setStringValue("?????????????????", "Text");
                RGBAColoring(object.value, colors.SERVICE.Badqual.text, "TextColor");
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
                    runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.code}.cmd.${prefix}`, inputTag: this.rootPath})
                }
                else if (checkbox) {
                    if (this.processStateBits()[prefix] && prefix == "imit") {
                        runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.code}.cmd.DisImit`, inputTag: this.rootPath})
                    }
                    else if (!this.processStateBits()[prefix] && prefix == "imit") {
                        runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.code}.cmd.EnImit`, inputTag: this.rootPath})
                    } else {
                        runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.code}.cmd.${prefix}`, inputTag: this.rootPath})
                    }
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
        updateSetPoints(value, state, prefix, context, object) {
             if(getSignalQuality(state)) {
                let SET = context.readSetpoints();
                object.time.set.value.setStringValue(SET[prefix].value, "Text");
                RGBAColoring(object.time.set.value, colors.SERVICE.Sets.Good, "FillColor")
            }
            else {
                RGBAColoring(object.time.set.value, colors.SERVICE.Sets.Bad, "FillColor")
                object.time.set.value.setStringValue("???.???", "Text");
             }
        }

        //Изменение уставок
        SetClick(object, objectName, prefix) {
            if(getSignalQuality(this.statePath) && getSignalQuality(`${this.setpointPath}.${prefix}`)) {
                runInputWindow(object.time.set, objectName + `.${prefix}.set.click`, {inputTag: this.rootPath, postfix: `.xa.${prefix}`, codes: this.config.code})
            }
            else {
                clickClear(object.time.set, objectName + `.${prefix}.set.click`);
            }
        }

        //аварии
        updateAlarms(value, flt, prefix, context, object) {
            if(getSignalQuality(flt)) {
                let color = context.processFaultBits()
                    RGBAColoring(object.Indicator, color[prefix].clr, "FillColor")
            //         //RGBAColoring(alarms.name, color.aggregate, "FillColor")
                    RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
            }
            else {
            //     //RGBAColoring(alarms.name, colors.SERVICE.Popup.headDEF, "FillColor")
                RGBAColoring(object.Indicator, colors.SERVICE.Badqual.field, "FillColor")
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

        SendTU(object, objectName, prefix, blockCondition = []){
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

    //#endregion

}