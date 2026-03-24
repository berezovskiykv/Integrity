#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа задвижки
 * @class VLV_BR_popup
 * @extends ObservablePopup
 */
class VLV_BR_popup extends ObservablePopup {
    constructor (publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

        setupSignalsPath() {
        this.statePath = `${this.rootPath}.State`;
        this.Pos = `${this.rootPath}.SetPosKL`;
        //this.config.Sensorname = accessData.stringValue(`${this.rootPath}.Sensor_Name`);
        this.config.Sensorname = accessData.stringValue(`${this.rootPath}.State.ID`);
        this.config.Title = accessData.stringValue(`${this.rootPath}.State.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.State.ID`)
        this.config.code = 'codes.BR_VLV';
    }

        initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
        sensorname.access.setStringValue(this.config.Sensorname, "Text");
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        if (state === null || state === undefined) return;
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            reset     :   !!(state & 1),
            open      :   !!(state & 2),
            close     :   !!(state & 4),
            stop      :   !!(state & 8),
            imit_on   :   !!(state & 16),
            imit_off  :   !!(state & 32),
            flt       :   !!(state & 64),
            auto      :   !!(state & 128),
            local     :   !!(state & 256),
            rep       :   !!(state & 512),
            allow_set :   !!(state & 1024),
            apply_set :   !!(state & 2048),
            off_set   :   !!(state & 4096),
        }
    }

    determineColor(status) {
        return {
            value_state1
            : status.close ? colors.VLVP.treanglestate1.close
            : (!status.close && !status.open) ? colors.VLVP.treanglestate1.middle
            : status.open ? colors.VLVP.treanglestate1.open
            : status.flt ? colors.VLVP.treanglestate1.err
            : colors.VLVP.treanglestate1.field,

            value_state1_back
            : status.close ? colors.VLVP.treanglestate1_back.close
            : (!status.close && !status.open) ? colors.VLVP.treanglestate1_back.middle
            : status.open ? colors.VLVP.treanglestate1_back.open
            : status.flt ? colors.VLVP.treanglestate1_back.err
            : colors.VLVP.treanglestate1_back.field,

            value_state2
            : status.close ? colors.VLVP.treanglestate2.close
            : (!status.close && !status.open) ? colors.VLVP.treanglestate2.middle
            : status.open ? colors.VLVP.treanglestate2.open
            : status.flt ? colors.VLVP.treanglestate2.err
            : colors.VLVP.treanglestate2.field,

            value_state2_back
            : status.close ? colors.VLVP.treanglestate2_back.close
            : (!status.close && !status.open) ? colors.VLVP.treanglestate2_back.middle
            : status.open ? colors.VLVP.treanglestate2_back.open
            : status.flt ? colors.VLVP.treanglestate2_back.err
            : colors.VLVP.treanglestate2_back.field,
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
                                                            this.faultPath
                                                        ], 
                    (newValue) => {this.updateElement(newValue.value, newValue.tag, this, object)})
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

        //#region object_set
        publish_updateSetPoints(object, prefix) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            `${this.Pos}`
                                                        ], 
                    (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, this, object)})
                }
            else {}
        }
        //#endregion
        publish_updateTextMode(object) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            this.faultPath
                    
                                                        ], 
                    (newValue) => {this.updateTextMode(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }
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

        //элемент задвижки в попапе (должна быть логика UpdateVisuals из VlvParameter.js)
        updateElement(value, state, context, object) {
            if (getSignalQuality(state)) {
                let status = context.processStateBits();
                let color = context.determineColor(status);
                object.off.setVisible(status.rep);
                object.imit.setVisible(status.imit_on);
                object.local.setVisible(status.local);
                object.auto.setVisible(status.auto);
                object.block.setVisible(status.stop);
                object.alm.setVisible(status.flt);
                RGBAColoring(object.body.treangle1, color.value_state1, "FillColor");
                RGBAColoring(object.body.treangle1, color.value_state1_back, "BackgroundColor");
                RGBAColoring(object.body.treangle2, color.value_state2, "FillColor");
                RGBAColoring(object.body.treangle2, color.value_state2_back, "BackgroundColor");
            }
            else {
                // object.off.setVisible(false);
                // object.imit.setVisible(false);
                // object.local.setVisible(false);
                // object.auto.setVisible(false);
                // object.block.setVisible(false);
                // object.alm.setVisible(false);
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
        ModeClick(object, objectName, prefix, code,checkbox = false) {
            if (getSignalQuality(this.statePath)) {
                if (!checkbox && !this.processStateBits()[prefix]) {
                    runAccessBox(object.select, objectName + '.select.click', {postfix: ``, codes: `${this.config.code}.cmd.${code}`, inputTag: `${this.rootPath}.cmd`})
                }
                else if (checkbox) {
                    let prefixTag = (this.processStateBits()[prefix]) ? 'Cmd5' : 'Cmd4'
                    
                    // let prefixTag = (this.processStateBits()[prefix]) ? `Dis${prefix}` : `En${prefix}`
                    runAccessBox(object.select, objectName + '.select.click', {postfix: ``, codes: `${this.config.code}.cmd.${prefixTag}`, inputTag: `${this.rootPath}.cmd`})
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
                object.set.value.setStringValue(accessData.doubleValue(`${this.Pos}`).toFixed(2), "Text");
                object.text.setStringValue(accessData.stringValue(`${this.Pos}.Description`), "Text")
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
            if(getSignalQuality(this.statePath)) {
                runInputWindow(object.set, objectName + '.set.click', {prefix:`.wvalue`, inputTag: this.Pos, codes: this.config.code})
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

        SendTU(object, objectName, prefix, code,blockCondition = []){
            if (getSignalQuality(this.statePath)) {
                let status = this.processStateBits();
                let block = blockCondition.some(item => {
                                        const isNegated = item.startsWith('!');
                                        const key = isNegated ? item.slice(1) : item;
                                        const value = key in status ? status[key] : false;
                                        return isNegated ? !value : value;
                                        });
                if (!block) {
                    runAccessBox(object, objectName + '.click', {postfix: '',codes: `${this.config.code}.cmd.${code}`, inputTag: `${this.rootPath}.cmd`})
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
