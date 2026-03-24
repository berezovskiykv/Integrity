#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа задвижки
 * @class VlvParameterPopup
 * @extends ObservablePopup
 */
class VlvParameterPopup extends ObservablePopup {
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
        //this.config.Sensorname = accessData.stringValue(`${this.rootPath}.Sensor_Name`);
        this.config.Sensorname = accessData.stringValue(`${this.rootPath}.ID`);
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.code = accessData.stringValue(`${this.rootPath}.Type`);
    }

        initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
        sensorname.access.setStringValue(this.config.Sensorname, "Text");
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
                fracdigits  : accessData.intValue(`${this.setpointPath}.${name}.FracDigits`),
                eunit       : accessData.stringValue(`${this.setpointPath}.${name}.EUnit`)
            }
        }

        return {
            Tmove     : readSET('Tmove'),

        }
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        let fault = accessData.doubleValue(this.faultPath);
        if (state === null || state === undefined) return;
        if (fault === null || fault === undefined) return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            mask            :   !!(state & (S(`${this.config.code}.Status1.Disable`))),
            Imit            :   !!(state & (S(`${this.config.code}.Status1.Imit`))),
            msgoff          :   !!(state & (S(`${this.config.code}.Status1.MsgOff`))),
            local           :   !!(state & (S(`${this.config.code}.Status1.Local`))),
            man             :   !!(state & (S(`${this.config.code}.Status1.Man`))),
            auto            :   !!(state & (S(`${this.config.code}.Status1.Aut`))),
            perm            :   !!(state & (S(`${this.config.code}.Status1.Perm`))),
            intlk           :   !!(state & (S(`${this.config.code}.Status1.Intlk`))),
            protect         :   !!(state & (S(`${this.config.code}.Status1.Protect`))),
            kvit            :   !!(state & (S(`${this.config.code}.Status1.Kvit`))),
            bad             :   !!(state & (S(`${this.config.code}.Status1.Undef`))),
            opening         :   !!(state & (S(`${this.config.code}.Status1.Opening`))),
            opened          :   !!(state & (S(`${this.config.code}.Status1.Opened`))),
            closing         :   !!(state & (S(`${this.config.code}.Status1.Closing`))),
            closed          :   !!(state & (S(`${this.config.code}.Status1.Closed`))),
            middle          :   !!(state & (S(`${this.config.code}.Status1.Middle`))),
            mskperm         :   !!(state & (S(`${this.config.code}.Status1.MskPerm`))),
            mskintlk        :   !!(state & (S(`${this.config.code}.Status1.MskIntlk`))),
            mskprotect      :   !!(state & (S(`${this.config.code}.Status1.MskProtect`))),
            lock            :   !!(fault & (S(`${this.config.code}.Status2.Lock`))),
            flt             :   !!(S(`${this.config.rootPath}.status2`) > 0)
        }
    }

    /** Устанавливает биты/цвета аварий*/
    processFaultBits() {
        let fault = accessData.doubleValue(this.faultPath);
        let state = accessData.doubleValue(this.statePath);
        if (fault === null || fault === undefined) return;
        if (state === null || state === undefined) return; 
        
        let defineCLR = (name, actCLR, tag = fault) => {
            let sts = !!(tag & accessData.intValue(`${this.config.code}.${name}`))
            let descr = accessData.stringValue(`${this.config.code}.${name}.Description`)
            return { sts, descr, clr: sts ? actCLR : colors.SERVICE.Flt.inact }
        }

         return {
            aggregate   :   !!(fault > 0) ? colors.SERVICE.Flt.actAlm : colors.SERVICE.Popup.headDEF,
            ModDISt     :   defineCLR('Status2.ModDISt', colors.SERVICE.Flt.actAlm),    
            ModDOSt     :   defineCLR('Status2.ModDOSt', colors.SERVICE.Flt.actAlm),    
            Ext_Flt     :   defineCLR('Status2.Ext_Flt', colors.SERVICE.Flt.actAlm),    
            Nordy       :   defineCLR('Status2.Nordy', colors.SERVICE.Flt.actAlm),      
            CmdOpenFlt  :   defineCLR('Status2.CmdOpenFlt', colors.SERVICE.Flt.actAlm), 
            CmdCloseFlt :   defineCLR('Status2.CmdCloseFlt', colors.SERVICE.Flt.actAlm),
            CmdStopFlt  :   defineCLR('Status2.CmdStopFlt', colors.SERVICE.Flt.actAlm), 
            Unappmove   :   defineCLR('Status2.Unappmove', colors.SERVICE.Flt.actAlm),  
            NoMove      :   defineCLR('Status2.NoMove', colors.SERVICE.Flt.actAlm),     
            Fault       :   defineCLR('Status2.Fault', colors.SERVICE.Flt.actAlm),      
            Torque      :   defineCLR('Status2.Torque', colors.SERVICE.Flt.actAlm),     
            Lock        :   defineCLR('Status2.Lock', colors.SERVICE.Flt.actAlm),       
            ErrCmdAut   :   defineCLR('Status2.ErrCmdAut', colors.SERVICE.Flt.actAlm),  
            CmdFlt      :   defineCLR('Status2.CmdFlt', colors.SERVICE.Flt.actAlm),  
            flt         :   !!(S(`${this.config.rootPath}.status2`) > 0)

        }
    }


    determineColor(status) {
        return {
            text_state
            : status.bad ? colors.VLVP.SimCol.yellCol
            : status.flt ? colors.VLVP.SimCol.whiteCol
            : colors.VLVP.treanglestate1.field,

            AWstate
            : status.bad ? colors.VLVP.SimCol.blackCol
            : status.flt ? colors.VLVP.SimCol.redCol
            : colors.VLVP.treanglestate1.field,

            AWstate_back
            : status.bad ? colors.VLVP.SimCol_back.grayCol_back
            : status.flt ? colors.VLVP.SimCol_back.redCol_back
            : colors.VLVP.treanglestate1.field,

            value_state1
            : status.closed ? colors.VLVP.treanglestate1.close
            : status.middle ? colors.VLVP.treanglestate1.middle
            : status.opened ? colors.VLVP.treanglestate1.open
            : status.bad || status.flt ? colors.VLVP.treanglestate1.err
            : colors.VLVP.treanglestate1.field,

            value_state1_back
            : status.closed ? colors.VLVP.treanglestate1_back.close
            : status.middle ? colors.VLVP.treanglestate1_back.middle
            : status.opened ? colors.VLVP.treanglestate1_back.open
            : status.bad || status.flt ? colors.VLVP.treanglestate1_back.err
            : colors.VLVP.treanglestate1_back.field,

            value_state2
            : status.closed ? colors.VLVP.treanglestate2.close
            : status.middle ? colors.VLVP.treanglestate2.middle
            : status.opened ? colors.VLVP.treanglestate2.open
            : status.bad || status.flt ? colors.VLVP.treanglestate2.err
            : colors.VLVP.treanglestate2.field,

            value_state2_back
            : status.closed ? colors.VLVP.treanglestate2_back.close
            : status.middle ? colors.VLVP.treanglestate2_back.middle
            : status.opened ? colors.VLVP.treanglestate2_back.open
            : status.bad || status.flt ? colors.VLVP.treanglestate2_back.err
            : colors.VLVP.treanglestate2_back.field,
        }
    }



    //#region PublishFunctions
        //#region object_timestamp
        // publish_updateTimeStamp(object) {
        //     if (!object.observerAction) {
        //         object.observerAction = publisher.register([this.statePath
        //                                                 ], 
        //             (newValue) => {this.updateTimeStamp(newValue.value, newValue.tag, this, object)})
        //     }
        //     else {}
        // }
        //#endregion
            
        //#region object_Element
        // publish_updateElement(object) {
        //     if (!object.observerAction) {
        //         object.observerAction = publisher.register([this.statePath,
        //                                                     this.faultPath
        //                                                 ], 
        //             (newValue) => {this.updateElement(newValue.value, newValue.tag, this, object)})
        //     }
        //     else {}
        // }
        //#endregion

        //#region object_mode
        // publish_updateMode(object, prefix) {
        //     if (!object.observerAction) {
        //         object.observerAction = publisher.register([this.statePath
        //                                                 ],
        //             (newValue) => {this.updateMode(newValue.value, newValue.tag, prefix, this, object)})
        //         }
        //     else {}
        // }
        //#endregion
        
        //#region object_Btn
        // publish_blockCmdBtn(object, blockCondition = []) {  
        //     if (!object.observerAction) {
        //         object.observerAction = publisher.register([this.statePath,
        //                                                     this.faultPath
        //                                                 ],
        //             (newValue) => {this.blockCmdBtn(newValue.value, newValue.tag, blockCondition, this, object)})
        //         }
        //     else {}
        // }
        //#endregion

        //#region object_set
        // publish_updateSetPoints(object, prefix) {
        //     if (!object.observerAction) {
        //         object.observerAction = publisher.register([this.statePath,
        //                                                     `${this.setpointPath}.${prefix}`
        //                                                 ], 
        //             (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, this, object)})
        //         }
        //     else {}
        // }
        //#endregion
        // publish_updateTextMode(object) {
        //     if (!object.observerAction) {
        //         object.observerAction = publisher.register([this.statePath,
        //                                                     this.faultPath
                    
        //                                                 ], 
        //             (newValue) => {this.updateTextMode(newValue.value, newValue.tag, this, object)})
        //     }
        //     else {}
        // }
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

        //элемент задвижки в попапе (должна быть логика UpdateVisuals из VlvParameter.js)
        updateElement(value, state, context, object) {
            if (getSignalQuality(state)) {
                let status = context.processStateBits();
                let color = context.determineColor(status);
                object.off.setVisible(status.mask);
                object.imit.setVisible(status.Imit);
                object.man.setVisible(status.man);
                object.local.setVisible(status.local);
                object.auto.setVisible(status.auto);
                object.block.setVisible(status.lock);
                object.AW.setVisible(status.bad || status.flt);
                RGBAColoring(object.body.treangle1, color.value_state1, "FillColor");
                RGBAColoring(object.body.treangle1, color.value_state1_back, "BackgroundColor");
                RGBAColoring(object.body.treangle2, color.value_state2, "FillColor");
                RGBAColoring(object.body.treangle2, color.value_state2_back, "BackgroundColor");
                RGBAColoring(object.AW, color.AWstate, "FillColor");
                RGBAColoring(object.AW, color.AWstate_back, "BackgroundColor");
            }
            else {
                object.off.setVisible(false);
                object.imit.setVisible(false);
                object.man.setVisible(false);
                object.local.setVisible(false);
                object.auto.setVisible(false);
                object.block.setVisible(false);
                object.AW.setVisible(false);

            }
        }

        // //моргание
        elementFlashing(object) {
            if (getSignalQuality(this.statePath)) {
                let status = this.processStateBits();
                if (status.opening){
                    flashing(object.body.treangle1, this.determineColor(status).value_state1, colors.VLVP.treanglestate1.opening, "FillColor");
                    flashing(object.body.treangle1, this.determineColor(status).value_state1_back, colors.VLVP.treanglestate1_back.opening, "BacgroundColor");
                    flashing(object.body.treangle2, this.determineColor(status).value_state2, colors.VLVP.treanglestate2.opening, "FillColor");
                    flashing(object.body.treangle2, this.determineColor(status).value_state2_back, colors.VLVP.treanglestate2_back.opening, "BacgroundColor");
                }
                if (status.closing){
                    flashing(object.body.treangle1, this.determineColor(status).value_state1, colors.VLVP.treanglestate1.closing, "FillColor");
                    flashing(object.body.treangle1, this.determineColor(status).value_state1_back, colors.VLVP.treanglestate1_back.closing, "BacgroundColor");
                    flashing(object.body.treangle2, this.determineColor(status).value_state2, colors.VLVP.treanglestate2.closing, "FillColor");
                    flashing(object.body.treangle2, this.determineColor(status).value_state2_back, colors.VLVP.treanglestate2_back.closing, "BacgroundColor");
                }
                else return;
            }
        }

        updateTextMode(value, state, context, object) {
        let priority = accessData.intValue(this.config.priorityTag)
        if (getSignalQuality(state)) {
        let status = context.processStateBits();
        let color = context.determineColor(status);
        switch (true) {
            case status.flt:
                object.mode.setStringValue("А", "Text");
                object.mode.setVisible(true);
                RGBAColoring(object.mode, color.text_state, "TextColor");
                break;
            case status.bad:
                object.mode.setStringValue("S", "Text");
                object.mode.setVisible(true);
                RGBAColoring(object.mode, color.text_state, "TextColor");
                break;
            default:
                object.mode.setVisible(false);
                break; 
        }
    }
    else {
        object.mode.setVisible(false);
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
                    // let prefixTag = (this.processStateBits()[prefix]) ? `${prefix}_off` : `${prefix}_on`
                    let prefixTag = (this.processStateBits()[prefix]) ? `Dis${prefix}` : `En${prefix}`
                    runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.code}.cmd.${prefixTag}`, inputTag: this.rootPath})
                }
                else {
                    clickClear(object.select, objectName + '.select.click')
                }
            }
            else {
                clickClear(object.select, objectName + '.select.click')
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

        //состояния/значения уставок
        updateSetPoints(value, state, prefix, context, object) {
            if(getSignalQuality(state)) {
                let SET = context.readSetpoints();
                object.set.value.setStringValue(SET[prefix].value.toFixed(SET[prefix].fracdigits), "Text");
                object.text.setStringValue(SET[prefix].description, "Text")
                object.eunit.setStringValue(SET[prefix].eunit, "Text")
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
                RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor")
            }
            else {
                RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
                RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor")
                object.set.value.setStringValue("???.???", "Text");
            }
        }

        //Изменение уставок
        SetClick(object, objectName, prefix) {
            if(getSignalQuality(this.statePath) && getSignalQuality(`${this.setpointPath}.${prefix}`)) {
                runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.xa.${prefix}`, codes: this.config.code})
            }
            else {
                clickClear(object.set, objectName + '.set.click');
            }
        }

        //аварии
        updateAlarms(value, flt, prefix, context, object) {
            if(getSignalQuality(flt)) {
            let color = context.processFaultBits()
                RGBAColoring(object.indicator, color[prefix].clr, "FillColor")
                object.text.setStringValue(color[prefix].descr, "Text")
                RGBAColoring(alarms.name, color.aggregate, "FillColor")
                RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
            }
            else {
                RGBAColoring(alarms.name, colors.SERVICE.Popup.headDEF, "FillColor")
                RGBAColoring(object.indicator, colors.SERVICE.Badqual.field, "FillColor")
                RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")

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

//Обходим подписку.

direct_updateTimeStamp(object) {
    let currentQuality = getSignalQuality(this.statePath);
    if (currentQuality) {
        let sourceTime = accessData.sourceTime(this.statePath);
        let date = new Date(sourceTime);
        let dateString = getDate(date);
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(dateString, "Text");
        }
    } else {
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue('??.??.???? ??:??', "Text");
        }
    }
}

direct_updateElement(object) {
    let currentQuality = getSignalQuality(this.statePath);
    let status = this.processStateBits();
    let color = this.determineColor(status);
    
    if (currentQuality) {  // ✅ Good quality
        // ✅ Видимость индикаторов состояний
        if (object.off) object.off.setVisible(status.mask);
        if (object.imit) object.imit.setVisible(status.Imit);
        if (object.man) object.man.setVisible(status.man);
        if (object.local) object.local.setVisible(status.local);
        if (object.auto) object.auto.setVisible(status.auto);
        if (object.block) object.block.setVisible(status.lock);
        if (object.AW) object.AW.setVisible(status.bad || status.flt);
        
        // ✅ Цвета треугольников состояния
        if (object.body && object.body.treangle1) {
            RGBAColoring(object.body.treangle1, color.value_state1, "FillColor");
            RGBAColoring(object.body.treangle1, color.value_state1_back, "BackgroundColor");
        }
        if (object.body && object.body.treangle2) {
            RGBAColoring(object.body.treangle2, color.value_state2, "FillColor");
            RGBAColoring(object.body.treangle2, color.value_state2_back, "BackgroundColor");
        }
        
        // ✅ Авария/блокировка
        if (object.AW) {
            RGBAColoring(object.AW, color.AWstate, "FillColor");
            RGBAColoring(object.AW, color.AWstate_back, "BackgroundColor");
        }
        
    } else {  // Bad quality
        if (object.off) object.off.setVisible(false);
        if (object.imit) object.imit.setVisible(false);
        if (object.man) object.man.setVisible(false);
        if (object.local) object.local.setVisible(false);
        if (object.auto) object.auto.setVisible(false);
        if (object.block) object.block.setVisible(false);
        if (object.AW) object.AW.setVisible(false);
    }
}

direct_updateMode(object, prefix) {
    let currentQuality = getSignalQuality(this.statePath);
    let statusBits = this.processStateBits();
    
    if (currentQuality) {
        if (object.select && object.select.point) {
            object.select.point.setVisible(statusBits[prefix]);
        }
        if (object.select && object.select.back) {
            RGBAColoring(object.select.back, colors.SERVICE.Goodqual.field, "FillColor");
        }
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor");
        }
    } else {
        if (object.select && object.select.point) {
            object.select.point.setVisible(false);
        }
        if (object.select && object.select.back) {
            RGBAColoring(object.select.back, colors.SERVICE.Badqual.field, "FillColor");
        }
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor");
        }
    }
}

direct_blockCmdBtn(object, blockCondition) {
    let currentQuality = getSignalQuality(this.statePath);
    let status = this.processStateBits();
    
    if (currentQuality) {
        let block = false;
        for (let i = 0; i < blockCondition.length; i++) {
            let item = blockCondition[i];
            let isNegated = item.indexOf('!') === 0;
            let key = isNegated ? item.slice(1) : item;
            let bitValue = status[key] || false;
            if (isNegated ? !bitValue : bitValue) {
                block = true;
                break;
            }
        }
        if (object.field) {
            RGBAColoring(object.field, block ? colors.SERVICE.buttons.inact : colors.SERVICE.buttons.act, "FillColor");
        }
    } else {
        if (object.field) {
            RGBAColoring(object.field, colors.SERVICE.Badqual.field, "FillColor");
        }
    }
}

direct_updateSetPoints(object, prefix) {
    let currentQuality = getSignalQuality(this.statePath);
    let SET = this.readSetpoints();
    
    if (currentQuality) {
        if (object.set && object.set.value && object.set.value.setStringValue) {
            object.set.value.setStringValue(SET[prefix].value.toFixed(SET[prefix].fracdigits || 2), "Text");
        }
        if (object.text && object.text.setStringValue) {
            object.text.setStringValue(SET[prefix].description || "", "Text");
        }
        if (object.eunit && object.eunit.setStringValue) {
            object.eunit.setStringValue(SET[prefix].eunit || "", "Text");
        }
        if (object.text) RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor");
        if (object.set && object.set.value) RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor");
    } else {
        if (object.text) RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor");
        if (object.set && object.set.value) RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor");
        if (object.set && object.set.value && object.set.value.setStringValue) {
            object.set.value.setStringValue("???.???", "Text");
        }
    }
}

direct_updateTextMode(object) {
    let currentQuality = getSignalQuality(this.statePath);
    let status = this.processStateBits();
    let color = this.determineColor(status);
    
    if (currentQuality) {
        if (status.flt) {
            if (object.mode && object.mode.setStringValue) {
                object.mode.setStringValue("А", "Text");
                object.mode.setVisible(true);
            }
            if (object.mode) RGBAColoring(object.mode, color.text_state, "TextColor");
        } else if (status.bad) {
            if (object.mode && object.mode.setStringValue) {
                object.mode.setStringValue("S", "Text");
                object.mode.setVisible(true);
            }
            if (object.mode) RGBAColoring(object.mode, color.text_state, "TextColor");
        } else {
            if (object.mode) object.mode.setVisible(false);
        }
    } else {
        if (object.mode) object.mode.setVisible(false);
    }
}

direct_updateAlarms(object, prefix) {
    let currentQuality = getSignalQuality(this.faultPath);
    let faultBits = this.processFaultBits();
    
    if (currentQuality) {
        if (object.indicator) {
            RGBAColoring(object.indicator, faultBits[prefix].clr, "FillColor");
        }
        if (object.text && object.text.setStringValue) {
            object.text.setStringValue(faultBits[prefix].descr || "", "Text");
        }
        if (alarms && alarms.name) {
            RGBAColoring(alarms.name, faultBits.aggregate, "FillColor");
        }
        if (object.text) {
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor");
        }
    } else {
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
}

direct_updateMsgState(object) {
    let currentQuality = getSignalQuality(this.statePath);
    let stateBits = this.processStateBits();
    
    if (currentQuality) {
        if (object.point) {
            object.point.setVisible(!stateBits.msgoff);
        }
        if (object.back) {
            RGBAColoring(object.back, colors.SERVICE.Goodqual.field, "FillColor");
        }
    } else {
        if (object.point) object.point.setVisible(false);
        if (object.back) {
            RGBAColoring(object.back, colors.SERVICE.Badqual.field, "FillColor");
        }
    }
}


}
