#INCLUDE "ObservableObject.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "Managers/colorSettings.js"


////////////////////////////////////////////////
function StartKSPGAlg(object, objectName, postfix) {
    let tag = getAliasesPath(object);
    let code = accessData.stringValue(`${tag}.Type`);
    if (getSignalQuality(`${tag}.Status`)) {
        runAccessBox(object, objectName + ".click", {codes: `${code}.${postfix}`, inputTag: tag});
    }
    else {
        clickClear(object, objectName + '.click');
    }
}

function openSetpointsPopup(object, objectName){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: 'alg_setpoints', 
                popupName: 'alg_setpoints', 
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
            });
    }
}

//Аварийный останов
class AlgKspg extends ObservableObject {
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
        //let code = this.object.access.stringValue("CONST");
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
        let hasChanged_timeleft = this.hasStateChanged(newState, ['timeleft']);
        let hasChanged_step = this.hasStateChanged(newState, ['step']);
        let hasChanged_popup = this.hasStateChanged(newState, ['needPopup', 'popupNum']);
        let hasChanged_statusKSPG = this.hasStateChanged(newState, ['statusKSPG'])
        let hasChanged_statusZRA = this.hasStateChanged(newState, ['statusZRA'])
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                if (typeof(this.object.deblock) !== 'undefined') {this.deblockBtn()}
                if (typeof(this.object.checkZRA) !== 'undefined') {this.checkZRAbtn()}
                this.openPopup()
                if (hasChanged_statusKSPG) {
                    this.updateObjVisible();
                    this.currentState = newState;
                    //return true;
                }
                if (hasChanged_step) {
                    this.updateStep();
                    this.currentState = newState;
                    //return true;
                }
                if (hasChanged_timeleft) {
                    this.updateTimeLeft();
                    this.currentState = newState;
                    //return true;
                }
                //if (hasChanged_popup) {
                    this.runConfirmPopup();
                    
                    //return true;
               // }
                if (hasChanged_statusZRA) {
                    this.updateZRAState();
                    this.currentState = newState;
                    //return true;
                }
                this.currentState = newState;
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
        this.object.setVisible(false)
    }


    /** Проверяет, изменилось ли состояние
     * @param {Object} newState - Новое состояние
     * @returns {Boolean} true, если состояние изменилось
     */
    hasStateChanged(newState, tags = []) {
        return tags.some(item => (newState[item] !== this.currentState[item]))
    }

    updateTimeLeft() {
        this.object.timer.setStringValue(timeConvertM(accessData.doubleValue(this.timeleftPath)), "Text")
    }

    updateStep() {
        // if (this.config.rootPath.includes('.ALGRDYRUN')) {
        //     //this.object.timer.setVisible(accessData.intValue(this.stepPath) == 5) 
        // }
        // else if (this.config.rootPath.includes('.ALGRUN')) {
            //this.object.timer.setVisible(accessData.intValue(this.stepPath) == 2 || accessData.intValue(this.stepPath) == 3)
            if (typeof(this.object.checkZRA) !== 'undefined') {
                this.object.checkZRA.setVisible(accessData.intValue(this.stepPath) == 1);
            }
        // }
        // else {
            //this.object.timer.setVisible(accessData.intValue(this.stepPath) == 2 || accessData.intValue(this.stepPath) == 4);
            //this.object.timer.setVisible(true);
        //}

        if (typeof(this.object.deblock) !== 'undefined') {
            this.object.deblock.setVisible(accessData.intValue(this.stepPath) == 7);
        }

        this.object.stepdesc.setStringValue(wrapText(accessData.stringValue(`${this.config.Code}.Step.step${accessData.intValue(this.stepPath)}.Description`), 50), "Text")
    }

    updateZRAState() {
        if (typeof(this.object.checkZRA) !== 'undefined') {
            this.object.checkZRA.select.point.setVisible(accessData.boolValue(`${this.statusPath}.RUN_CheckZRA`))
        }
    }

    updateObjVisible() {
        const suffixMap = {
            '.ALGAO': 'b00',
            '.ALGNO': 'b01',
            '.ALGRDYRUN': 'b02',
            '.ALGRUN': 'b03',
            };

        for (const [key, value] of Object.entries(suffixMap)) {
            if (this.config.rootPath.includes(key)) {
                this.object.setVisible(accessData.boolValue(`${this.statusKSPGPath}.${value}`));
                break;
            }
        }
    }


    runConfirmPopup() {
        if(getSignalQuality(this.config.qualityTag) && accessData.boolValue(`${this.statusPath}.Popup`)) {
            runPopup(
            {
                alias: 'ALGConfirmPopup',
                popupName: 'ALGConfirmPopup',
                //screenPos: position
            },
            {
                tag: this.config.rootPath,
                message: accessData.stringValue(`${this.config.Code}.PopupNum.p${accessData.intValue(this.popupPath)}.Description`),
                alarm: `Команда оператора - ${accessData.stringValue(`${this.config.rootPath}.Description`)}`,
                code: `${this.config.Code}.cmd`,
                popup_num: accessData.intValue(this.popupPath),
                state: `${this.statusPath}.Popup`
            });
        }
        else {
        }
    }

    deblockBtn() {
        let code = this.object.access.stringValue("CONST");
        if (getSignalQuality(this.config.qualityTag)) {
            runAccessBox(this.object.deblock, this.object.name + '.deblock.click', {codes: `${this.config.Code}.${code}`, inputTag: this.config.rootPath});
        }
        else {
            clickClear(this.object.deblock, this.object.name + '.deblock.click');
        }
    }

    

    checkZRAbtn() {
        if (getSignalQuality(this.config.qualityTag)) {
            runAccessBox(this.object.checkZRA.select, this.object.name + '.checkZRA.select.click', {codes: `${this.config.Code}.cmd.RUN_CheckZRA`, inputTag: this.config.rootPath})
        }
        else {
            clickClear(this.object.checkZRA.select, this.object.name + '.checkZRA.select.click')
        }
    }
}

class KspgState extends ObservableObject {
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
            b00: {
                descr: 'Аварийный\nостанов',
                fieldClr: colors.ALGKSPG.State.AOfield,
                textClr: colors.ALGKSPG.State.AOtext,
            },
            b01: {
                descr: 'Нормальный\nостанов',
                fieldClr: colors.ALGKSPG.State.NOfield,
                textClr: colors.ALGKSPG.State.NOtext,
            },
            b02: {
                descr: 'Готовность\nк пуску',
                fieldClr: colors.ALGKSPG.State.RDYRUNfield,
                textClr: colors.ALGKSPG.State.RDYRUNtext,
            },
            b15: {
                descr: 'КСПГ в работе',
                fieldClr: colors.Block.State.good,
                textClr: colors.ALGKSPG.State.RUNtext,
            },
            b03: {
                descr: 'Пуск и работа',
                fieldClr: colors.Block.State.good,
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

function alg(object, objectName) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AlgKspg(object, {});
    }
    object.parameter.checkForUpdates();
}

function KspgStatus(object) {
    if (!object.parameter) {
        object.parameter = new KspgState(object, {});
    }
    object.parameter.checkForUpdates();
}
