#INCLUDE "ObservableObject.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "Managers/colorSettings.js"


////////////////////////////////////////////////
function StartPAZAlg(object, objectName, postfix) {
    let tag = getAliasesPath(object);
    let code = accessData.stringValue(`${tag}.Type`);
    if (getSignalQuality(`${tag}.Status`)) {
        runAccessBox(object, objectName + ".click", {codes: `${code}.${postfix}`, inputTag: tag});
    }
    else {
        clickClear(object, objectName + '.click');
    }
}

//Аварийный останов
class PAZKspg extends ObservableObject {
    /** Инициализация параметра */
    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.popup = accessData.stringValue(`${this.config.rootPath}.Popup`);
        this.config.Code = accessData.stringValue(`${this.config.rootPath}.Type`);
        this.currentState = this.getInitialState();
        this.config.qualityTag = "";
        this.setupSignalPaths();
    }

    setupSignalPaths() {
        this.statusKSPGPath = 'KSPG.ALG.ALG_Status';
        this.stepPath = `${this.config.rootPath}.Step`;
        this.statusPath = `${this.config.rootPath}.Status`;
        this.setPointPath = `${this.config.rootPath}.xa`;
        this.timeleftPath = `${this.config.rootPath}.TimeLeft`
        this.popupPath = `${this.config.rootPath}.PopupNum`
        this.config.qualityTag = `${this.config.rootPath}.Status`;
    }

    /** Возвращает начальное состояние параметра
     * @returns {Object} Начальное состояние
     */
    getInitialState() {
        return {
            step: null,
            statusKSPG: null,
            needPopup: null,
            popupNum: null,
            timeleft: null,
            statusZRA: null,
            quality: null,
            timestamp: null
        };
    }
    
    readCurrentState() {
        var newState = {
            needPopup: accessData.boolValue(`${this.statusPath}.Popup`),
            popupNum: accessData.intValue(this.popupPath),
            statusKSPG: accessData.doubleValue(this.statusKSPGPath),
            statusZRA: accessData.boolValue(`${this.statusPath}.RUN_CheckZRA`),
            step: accessData.doubleValue(this.stepPath),
            timeleft: accessData.doubleValue(this.timeleftPath),
            quality: getSignalQuality(this.statusPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        let hasChanged_step = this.hasStateChanged(newState, ['step']);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                this.openPopup()
                if (hasChanged_step) {
                    this.updateStep();
                    this.currentState = newState;
                    //return true;
                }
                //return false;
            }
            else {
                this.updateBadQuality()
                this.currentState = this.getInitialState()
            }
        }
        else return;
    }

    updateBadQuality() {
        //this.object.setVisible(false)
    }


    /** Проверяет, изменилось ли состояние
     * @param {Object} newState - Новое состояние
     * @returns {Boolean} true, если состояние изменилось
     */
    hasStateChanged(newState, tags = []) {
        return tags.some(item => (newState[item] !== this.currentState[item]))
    }

    updateStep() {

        this.object.stepdesc.setStringValue(wrapText(accessData.stringValue(`${this.config.Code}.Step.step${accessData.intValue(this.stepPath)}.Description`), 50), "Text")
    }

}

class PAZState extends ObservableObject {
    /** Инициализация параметра */
    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.currentState = this.getInitialState();
        this.config.qualityTag = this.config.rootPath;
        this.setupSignalPaths();
    }

    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
    }

    /** Возвращает начальное состояние параметра
     * @returns {Object} Начальное состояние
     */
    getInitialState() {
        return {
            state: null,
            quality: null,
            timestamp: null
        };
    }

    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    /** Проверяет, изменилось ли состояние
     * @param {Object} newState - Новое состояние
     * @returns {Boolean} true, если состояние изменилось
     */
    hasStateChanged(newState, tags = []) {
        return tags.some(item => newState[item] !== this.currentState[item])
    }

    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        let hasChanged_state = this.hasStateChanged(newState, ['state']);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                if (hasChanged_state) {
                    this.updateState();
                    this.currentState = newState;
                    return true;
                }
                return false;
            }
            else {
                this.updateBadQuality()
                this.currentState = this.getInitialState()
            }
        }
        else return;
    }

    updateBadQuality() {
        this.object.text.setStringValue('???????????????', "Text")
        RGBAColoring(this.object.frame, colors.ALGKSPG.State.defaultfieldClr, "FillColor")
        RGBAColoring(this.object.text, colors.ALGKSPG.State.defaulttextClr, "TextColor")
        RGBAColoring(this.object.name, colors.ALGKSPG.State.defaulttextClr, "TextColor")
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        if (state === null || state === undefined)  return;

        const states = {
            M_AO: {
                descr: 'ПАЗ АО',
                fieldClr: colors.ALGKSPG.State.AOfield,
                textClr: colors.ALGKSPG.State.AOtext,
            },
            M_AOSS1: {
                descr: 'Загазованность\nвхода\nПАЗ АОСС-1',
                fieldClr: colors.ALGKSPG.State.AOfield, 
                textClr: colors.ALGKSPG.State.AOtext,
            },
            M_AOSS2: {
                descr: 'Загазованность\nвхода\nПАЗ АОСС-2',
                fieldClr: colors.ALGKSPG.State.AOfield,
                textClr: colors.ALGKSPG.State.AOtext,
            },
            M_PS: {
                descr: 'Предупреждающий\nсигнал',
                fieldClr: colors.ALGKSPG.State.NOfield,
                textClr: colors.ALGKSPG.State.NOtext,
            },
            M_Fire: {
                descr: 'Пожар',
                fieldClr: colors.ALGKSPG.State.AOfield,
                textClr: colors.ALGKSPG.State.AOtext,
            },
            M_AO_setMAN: {
                descr: 'ПАЗ АО\nустановлен по\nкоманде оператора',
                fieldClr: colors.ALGKSPG.State.RUNfield,
                textClr: colors.ALGKSPG.State.RUNtext,
            },
            M_AOSS1_setMAN: {
                descr: 'Загазованность\nвхода ПАЗ АОСС-1\nустановлен по\nкоманде оператора',
                fieldClr: colors.ALGKSPG.State.RUNfield,
                textClr: colors.ALGKSPG.State.RUNtext,
            },
            M_AOSS2_setMAN: {
                descr: 'Загазованность\nвхода ПАЗ АОСС-2\nустановлен по\nкоманде оператора',
                fieldClr: colors.ALGKSPG.State.RUNfield,
                textClr: colors.ALGKSPG.State.RUNtext,
            },
            NORM: {
                descr: 'ПАЗ в норме\nДеблокирован',
                fieldClr: colors.ALGKSPG.State.RUNfield,
                textClr: colors.ALGKSPG.State.RUNtext,
            }
        };
        const bits = Object.keys(states);

        const activeBit = bits.find(bit => accessData.boolValue(`${this.statePath}.${bit}`))
        const activeStatus = activeBit ? states[activeBit] : null;

        return activeStatus || {
            descr: 'Нет состояния',
            fieldClr: colors.ALGKSPG.State.defaultfieldClr,
            textClr: colors.ALGKSPG.State.defaulttextClr
        }
    }

    updateState() {
        this.object.text.setStringValue(this.processStateBits().descr, "Text")
        RGBAColoring(this.object.frame, this.processStateBits().fieldClr, "FillColor")
        RGBAColoring(this.object.text, this.processStateBits().textClr, "TextColor")
        RGBAColoring(this.object.name, this.processStateBits().textClr, "TextColor")
    }

}

function PAZ(object, objectName) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new PAZKspg(object, {});
    }
    object.parameter.checkForUpdates();
}

function PAZStatus(object) {
    if (!object.parameter) {
        object.parameter = new PAZState(object, {});
    }
    object.parameter.checkForUpdates();
}