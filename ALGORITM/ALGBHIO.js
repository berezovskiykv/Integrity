#INCLUDE "ObservableObject.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "Managers/colorSettings.js"
active = true;
function StartBHIOAlg(object, objectName, postfix) {
    let tag = getAliasesPath(object);
    let code = accessData.stringValue(`${tag}.Type`);
    if (getSignalQuality(`${tag}.Status`)) {
        runAccessBox(object, objectName + ".click", {codes: `${code}.${postfix}`, inputTag: tag});
    }
    else {
        clickClear(object, objectName + '.click');
    }
}

function openSetpointsPopup1(object, objectName){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: 'bho_setpoints', 
                popupName: 'bho_setpoints', 
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
            });
    }
}
function openSetpointsPopupCE(object, objectName){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: 'BHO_SETPOINTS_CE', 
                popupName: 'BHO_SETPOINTS_CE', 
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
            });
    }
}
function openStepPopup(object, objectName){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: 'BH_Step', 
                popupName: 'BH_Step', 
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
            });
    }
}

function finishBtn(object, objectName) {
        let tag = getAliasesPath(object);
        let status = accessData.intValue(`${tag}.Status`);
        let Code = accessData.stringValue(`${tag}.Type`);
        if (typeof(object.finish) !== 'undefined') {
            object.finish.setVisible(
                status === 
                    accessData.intValue(`${Code}.Status.BHO_WorkAndShip`) ||
                status === 
                    accessData.intValue(`${Code}.Status.BHO_Ship`)
            );
        }
        // environment.logInfo("1: " + (status === 
        //             accessData.intValue(`${Code}.Status.BHO_WorkAndShip`)));
        // environment.logInfo("2: " + (status === 
        //             accessData.intValue(`${Code}.Status.BHO_Ship`)));
        // environment.logInfo("3: " + (status === 
        //             accessData.intValue(`${Code}.Status.BHO_Ship`) ||
        //                     accessData.intValue(status) == 
        //             accessData.intValue(`${Code}.Status.BHO_Ship`)));
        // environment.logInfo("Status String: " + `${tag}.Status`);
        // environment.logInfo("Status Value: " + status);
        // environment.logInfo("BHO_Ship Value: " + accessData.intValue(`${Code}.Status.BHO_Ship`));
        // environment.logInfo("BHO_WorkAndShip Value: " + accessData.intValue(`${Code}.Status.BHO_WorkAndShip`));

        // environment.logInfo(tag);
        // environment.logInfo(Code);
        // environment.logInfo(accessData.intValue(`${Code}.cmd.ShipStop`));
        if (getSignalQuality(`${tag}.Status`)) {
            runAccessBox(object, objectName + '.finish.click', {codes: `${Code}.cmd.ShipStop`, inputTag: tag});
        }
        else {
            clickClear(object, objectName + '.finish.click');
        }
    }

//Аварийный останов
class AlgBHIO extends ObservableObject {
    /** Инициализация параметра */
    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.popup = accessData.stringValue(`${this.config.rootPath}.Popup`);
        this.config.Code = accessData.stringValue(`${this.config.rootPath}.Type`);
        this.config.qualityTag = "";
        this.setupSignalPaths();
        this.currentState = this.getInitialState();
    }

setupSignalPaths() {
    let code = this.object.access.stringValue("CONST");
    let time = this.object.access.stringValue("TIME");
    let visible = this.object.access.stringValue("VISIBLE");
    let visible2 = this.object.access.stringValue("VISIBLE2");
    
    this.statusKSPGPath = 'KSPG.ALG.ALG_Status';
    this.stepPath = `${this.config.rootPath}.${code}`;
    this.visiblePath = `${this.config.rootPath}.${visible}`;
    this.visible2Path = `${this.config.rootPath}.${visible2}`;
    

    try {
        let visible3 = this.object.access.stringValue("VISIBLE3");
        if (typeof visible3 !== 'undefined') {
            this.visible3Path = `${this.config.rootPath}.${visible3}`;
        }
    
    } catch (e) {

    }
    
    this.statusPath = `${this.config.rootPath}.Status`;
    this.setPointPath = `${this.config.rootPath}.xa`;
    this.timeleftPath = `${this.config.rootPath}.${time}`;
    this.popupPath = `${this.config.rootPath}.PopupNum`;
    this.config.qualityTag = `${this.config.rootPath}.Status`;
}


getInitialState() {
    let state = {
        step: null,
        statusKSPG: null,
        needPopup: null,
        popupNum: null,
        timeleft: null,
        statusZRA: null,
        quality: null,
        timestamp: null,
        visible: null,
        visible2: null
    };
    
    if (typeof this.visible3Path !== 'undefined') {
        state.visible3 = null;
    }
    
    return state;
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
        visible: accessData.boolValue(this.visiblePath),
        visible2: accessData.boolValue(this.visible2Path),
        timestamp: new Date().getTime()
    };
    
    if (typeof this.visible3Path !== 'undefined') {
        newState.visible3 = accessData.doubleValue(this.visible3Path);
    }
    
    return newState;
}

 
    checkForUpdates() {
        var newState = this.readCurrentState();
        let hasChanged_timeleft = this.hasStateChanged(newState, ['timeleft']);
        let hasChanged_step = this.hasStateChanged(newState, ['step']);
        let hasChanged_popup = this.hasStateChanged(newState, ['needPopup', 'popupNum']);
        let hasChanged_statusKSPG = this.hasStateChanged(newState, ['statusKSPG'])
        let hasChanged_statusZRA = this.hasStateChanged(newState, ['statusZRA'])
        let hasChanged_visible = this.hasStateChanged(newState, ['visible'])
        let hasChanged_visible2 = this.hasStateChanged(newState, ['visible2'])
        let hasChanged_visible3 = this.hasStateChanged(newState, ['visible3'])
        
        if (1) {
            if (getSignalQuality(this.config.qualityTag)) {
                if (typeof(this.object.deblock) !== 'undefined') {this.deblockBtn()}
                if (typeof(this.object.checkZRA) !== 'undefined') {this.checkZRAbtn()}
                this.openPopup()
           
                if (hasChanged_visible || hasChanged_visible2 || hasChanged_visible3) {
                this.updateObjVisible();
                }
                if (hasChanged_step) {
                    this.updateStep(this.config.prefix);
                }
                if (hasChanged_timeleft) {
                    this.updateTimeLeft();
                }
                if (hasChanged_popup) {
                    this.runConfirmPopup();
                }
                if (hasChanged_statusZRA) {
                    this.updateZRAState();
                }
                
                this.currentState = newState;
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

    hasStateChanged(newState, tags = []) {
        return tags.some(item => (newState[item] !== this.currentState[item]))
    }

    updateTimeLeft() {
        this.object.timer.setStringValue(timeConvertM(accessData.doubleValue(this.timeleftPath)), "Text")
    }

    updateStep(prefix) {
        if (typeof(this.object.checkZRA) !== 'undefined') {
            this.object.checkZRA.setVisible(accessData.intValue(this.stepPath) == 1);
        }

        if (typeof(this.object.deblock) !== 'undefined') {
            this.object.deblock.setVisible(accessData.intValue(this.stepPath) == 3);
        }

        this.object.stepdesc.setStringValue(wrapText(accessData.stringValue(`${this.config.Code}.${prefix}.step${accessData.intValue(this.stepPath)}.Description`), 44), "Text")
    }

    updateZRAState() {
        if (typeof(this.object.checkZRA) !== 'undefined') {
            this.object.checkZRA.select.point.setVisible(accessData.boolValue(`${this.statusPath}.RUN_CheckZRA`))
        }
    }

    updateObjVisible() {
    if (this.object.stringValue("VISIBLE3") !== '') {
        let isVisible3 = accessData.intValue(this.visible3Path) == 1;
        this.object.setVisible(isVisible3);
    } else {
        let isVisible1 = accessData.boolValue(this.visiblePath);
        let isVisible2 = accessData.boolValue(this.visible2Path);
        this.object.setVisible(isVisible1 || isVisible2);
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
                popup_num: accessData.intValue(this.popupPath)
            });
        }
        else {
        }
    }



    deblockBtn() {
        if (getSignalQuality(this.config.qualityTag)) {
            runAccessBox(this.object.deblock, this.object.name + '.deblock.click', {codes: `${this.config.Code}.cmd.Deblock`, inputTag: this.config.rootPath});
        }
        else {
            clickClear(this.object.deblock, this.object.name + '.deblock.click');
        }
    }

}
class BH_sets extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = this.statePath;   
    }
 
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.text.setStringValue(accessData.stringValue(`${this.statePath}.Description`),"Text")
        return true;
    }

    updateBadQuality(){
   
    }

    updateVisuals() {
       this.object.set.value.setStringValue(accessData.doubleValue(this.statePath),"Text");
       this.object.eUnit.setStringValue(accessData.stringValue(`${this.statePath}.EUnit`),"Text")
    }
    
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (1) {
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : */this.object.start = this.updateText();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
                return false;
            }
            else {
                clickClear(this.object, this.object.name + ".click")
                this.updateBadQuality()
                this.currentState = this.getInitialState()
            }
        }
        else return;
    }    
}
class BHIOState extends ObservableObject {
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
        if (1) {
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
            BHO_AO: {
                descr: 'Аварийный\nостанов',
                fieldClr: colors.ALGKSPG.State.AOfield,
                textClr: colors.ALGKSPG.State.AOtext,
            },
            BHO_NO: {
                descr: 'Нормальный\nостанов',
                fieldClr: colors.ALGKSPG.State.NOfield,
                textClr: colors.ALGKSPG.State.NOtext,
            },
            BHO_RdyReqCool: {
                descr: 'Готов к пуску\nТребуется\nзахолаживание',
                fieldClr: colors.ALGKSPG.State.RDYRUNfield,
                textClr: colors.ALGKSPG.State.RDYRUNtext,
            },
            BHO_Cooling: {
                descr: 'Захолаживание',
                fieldClr: colors.Block.State.good,
                textClr: colors.ALGKSPG.State.RUNtext,
            },
            BHO_RdyCooled: {
                descr: 'Готов к пуску\nЗахоложен',
                fieldClr: colors.ALGKSPG.State.RUNfield,
                textClr: colors.ALGKSPG.State.RUNtext,
            },
            BHO_Work: {
                descr: 'В работе',
                fieldClr: colors.Block.State.good,
                textClr: colors.ALGKSPG.State.RDYRUNtext,
            },
            BHO_Ship: {
                descr: 'Отгрузка',
                fieldClr: colors.Block.State.good,
                textClr: colors.ALGKSPG.State.RDYRUNtext,
            },
            BHO_WorkAndShip: {
                descr: 'В работе\nс отгрузкой',
                fieldClr: colors.Block.State.good,
                textClr: colors.ALGKSPG.State.RDYRUNtext,
            },
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

function BHIO(object, objectName, prefix) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AlgBHIO(object, {prefix : prefix});
    }
    object.parameter.checkForUpdates();
}

function BHIOStatus(object) {
    if (!object.parameter) {
        object.parameter = new BHIOState(object, {});
    }
    object.parameter.checkForUpdates();
}

class ModeRVSParameter extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
    }


    readCurrentState() {
        var newState = {
            state: accessData.boolValue(this.statePath),
            timestamp: new Date().getTime()
        };     
        return newState;
    }

    updateText() {
    }

    updateBadQuality(){
        this.object.setVisible(true);

    }

    updateVisuals() {
        this.processStateBits();
        this.object.setVisible(this.object.status);
 
    }
    checkForFlashing() {
     
    }
    

    processStateBits() {
        let state = this.currentState.state;

        this.state = {
            status        :   (state) == true,
         }
    }



}

function ModeRVS(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new ModeRVSParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
class AlgBhioPopup extends ObservableObject {
    /** Инициализация параметра */
    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.currentState = this.getInitialState();
        this.setupSignalPaths();
    }

    setupSignalPaths() {
        this.statusPath = `${this.config.rootPath}.Status`;
        this.popupPath = `${this.config.rootPath}.PopupNum`;
        this.popupPathState = `${this.config.rootPath}.Status.BHO_Popup`;
        this.ColPopup = `${this.statusPath}.BHO_ColPopup`;
        this.WrkPopup = `${this.statusPath}.BHO_WrkPopup`;
        this.WrkAutoChsPopup = `${this.statusPath}.BHO_WrkAutoChsPopup`;
        this.ShipPopup = `${this.statusPath}.BHO_ShipPopup`;
        this.ShipAutoPopup = `${this.statusPath}.BHO_ShipPopupAuto`;
        this.ShipMassPopup = `${this.statusPath}.BHO_ShipPopupMass`;
        this.ShipPumpPopup = `${this.statusPath}.BHO_ShipPopupPump`;
        this.config.qualityTag = `${this.config.rootPath}.Status`;
        this.StepPath = `${this.config.rootPath}.Ship.Step`;
   
    }

    /** Возвращает начальное состояние параметра
     * @returns {Object} Начальное состояние
     */
    getInitialState() {
        return {
            ColPopup: null,
            WrkPopup: null,
            WrkAutoChsPopup: null,
            popupNum: null,
            popupPathState: null,
            ShipPopup: null,
            ShipAutoPopup: null,
            quality: null,
            timestamp: null,
            ShipMassPopup: null,
            ShipPumpPopup: null,
            StepPath: null
        };
    }
    
    readCurrentState() {
        var newState = {
            ColPopup: accessData.boolValue(`${this.ColPopup}`),
            popupNum: accessData.intValue(this.popupPath),
            popupPathState: accessData.boolValue(`${this.popupPathState}`),
            status: accessData.doubleValue(this.statusPath),
            WrkPopup: accessData.boolValue(`${this.WrkPopup}`),
            WrkAutoChsPopup: accessData.boolValue(this.WrkAutoChsPopup),
             ShipAutoPopup: accessData.boolValue(this.ShipAutoPopup),
            ShipPopup: accessData.boolValue(this.ShipPopup),
            quality: getSignalQuality(this.statusPath),
            ShipMassPopup: accessData.boolValue(this.ShipMassPopup),
            ShipPumpPopup: accessData.boolValue(this.ShipPumpPopup),
            StepPath: accessData.intValue(this.StepPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }
    // hasStateChanged(newState) {
    //     if (newState.ColPopup !== this.currentState.ColPopup ||
    //         newState.status !== this.currentState.status ||
    //         newState.popupNum !== this.currentState.popupNum ||
    //          newState.popupPathState !== this.currentState.popupPathState ||
    //         newState.WrkPopup !== this.currentState.WrkPopup ||
    //         newState.WrkAutoChsPopup !== this.currentState.WrkAutoChsPopup ||
    //         newState.ShipPopup !== this.currentState.ShipPopup ||
    //         newState.ShipMassPopup !== this.currentState.ShipMassPopup ||
    //         newState.ShipPumpPopup !== this.currentState.ShipPumpPopup ||
    //         newState.quality !== this.currentState.quality) {
    //         return true;
    //     }
    //     return false;
    // }
    hasStateChanged(newState, tags = []) {
        return tags.some(item => (newState[item] !== this.currentState[item]))
    }
    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState(); 
        let hasChanged_ColPopup = this.hasStateChanged(newState, ['ColPopup']);
        let hasChanged_popup = this.hasStateChanged(newState, ['needPopup', 'popupNum']);
        let hasChanged_status = this.hasStateChanged(newState, ['status']);
        let hasChanged_popupPathState = this.hasStateChanged(newState, ['popupPathState']);
        let hasChanged_WrkPopup = this.hasStateChanged(newState, ['WrkPopup']);
         let hasChanged_ShipPopup = this.hasStateChanged(newState, ['ShipPopup']);
         let hasChanged_ShipMassPopup = this.hasStateChanged(newState, ['ShipMassPopup']);
         let hasChanged_ShipPumpPopup = this.hasStateChanged(newState, ['ShipPumpPopup']);
         let hasChanged_ShipAutoPopup = this.hasStateChanged(newState, ['ShipAutoPopup']);
        let hasChanged_StepPath = this.hasStateChanged(newState, ['StepPath']);
        if (1) {
            if (getSignalQuality(this.config.qualityTag)) {
                if(hasChanged_StepPath || hasChanged_ColPopup || hasChanged_status || hasChanged_popupPathState || hasChanged_WrkPopup|| hasChanged_ShipAutoPopup || hasChanged_ShipPopup || hasChanged_ShipMassPopup || hasChanged_ShipPumpPopup)
                    this.openPopup();
            //    if(hasChanged_popup)
                    this.confirm_pop_run();
                this.currentState = newState;
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
   
    openPopup() {
    let popupNames;
    let alname;
    let popupState;
    let confirm = false;
    let mes, cmd1, cmd2, st, conf;
    if(accessData.boolValue(this.ColPopup)){
        popupNames = 'BHOColChoicePopup';
        alname = 'c1';
        popupState = accessData.boolValue(this.ColPopup)
        this.config.code = this.ColPopup;
        this.popupStart(popupNames, alname)
    }
    else if(accessData.boolValue(this.WrkPopup)) {
        popupNames = 'BHOWrkChoicePopup';   
         alname = 'c2';
        popupState = accessData.boolValue(this.WrkPopup);
         this.config.code = this.WrkPopup;
         this.popupStart(popupNames, alname)
    }
    if(accessData.boolValue(this.ShipPopup)) {
        popupNames = 'BHOShipChoicePopup';  
         alname = 'c3'; 
        popupState = accessData.boolValue(this.ShipPopup);
         this.config.code = this.ShipPopup;
         this.popupStart(popupNames, alname)
    }
    if(accessData.boolValue(this.ShipMassPopup)) {
        popupNames ='BHOMassShipChoicePopup';
         alname = 'c4';
        this.config.code = this.ShipMassPopup;
        this.popupStart(popupNames, alname)
    }
    if(accessData.boolValue(this.ShipAutoPopup)) {
        confirm = true;
         alname = 'c5';
        popupState = false;
        popupNames = 'BHOAutoShipChoicePopup';
        mes = 'Автоматически для выдачи СПГ назначена Р-9.1';
        cmd1 = 'Yes';
        cmd2 = 'ShipManInput';
        st = this.ShipAutoPopup;
        conf = 1;
        this.confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname)  
    }
    // if(accessData.boolValue(this.ShipPumpPopup)) {
    //     confirm = true;
    //      alname = 'c6';
    //     popupState = false;
    //     popupNames = 'BHOAutoShipChoicePopup';
    //     mes = 'Выберите способ отгрузки';
    //     cmd1 = 'ShipWPump';
    //     cmd2 = 'ShipWOPump';
    //     st = this.ShipPumpPopup;
    //     conf = 1;
    //     this.confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname)  
    // }
    if(accessData.intValue(`${this.config.rootPath}.Ship.Step`)==10) {
        runPopup(
            {
                alias: 'PumpAlg',
                popupName: 'BHOSpeedShipChoicePopup',
                posX: 2360,
                posY: 400
            },
            {
                inputTag: 'KSPG.ALG.ALGBHO'
            });
        }
}
    confirm_pop_run() {
     let popupNames;
    let alname;
    let popupState;
    let confirm = false;
    let mes, cmd1, cmd2, st, conf;
        if(accessData.boolValue(this.popupPathState) && (accessData.intValue(this.popupPath) ==14 || accessData.intValue(this.popupPath) ==17)) {
        confirm = true;
         alname = 'c7';
        popupState = false;
        popupNames = 'BHOAutoShipChoicePopup';
        cmd2 = 'RetChsMode';
        st = this.popupPathState;
        conf = 4;
        this.confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname)  
    }
    else if(accessData.boolValue(this.popupPathState) && (accessData.intValue(this.popupPath) ==16 || accessData.intValue(this.popupPath) ==26 || accessData.intValue(this.popupPath) == 6)) {
        confirm = true;
         alname = 'c8';
        popupState = false;
        popupNames = 'BHOAutoShipChoicePopup';
        cmd2 = 'No';
        st = this.popupPathState;
        conf = 5;
        this.confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname)  
    }
    else if(accessData.boolValue(this.popupPathState) && (accessData.intValue(this.popupPath) ==18 || accessData.intValue(this.popupPath) ==19 || accessData.intValue(this.popupPath) ==20 || accessData.intValue(this.popupPath) ==21 || accessData.intValue(this.popupPath) ==22 || accessData.intValue(this.popupPath) ==24 || accessData.intValue(this.popupPath) ==25 || accessData.intValue(this.popupPath) ==27 || accessData.intValue(this.popupPath) == 28)) {
        confirm = true;
         alname = 'c9';
        popupState = false;
        popupNames = 'BHOAutoShipChoicePopup';
        st = this.popupPathState;
        conf = 6;
        this.confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname)  
    }
    else if(accessData.boolValue(this.popupPathState) && accessData.intValue(this.popupPath) == 5) {
        confirm = true;
         alname = 'c10';
        popupState = false;
        popupNames = 'BHOAutoShipChoicePopup_p5';
        st = this.popupPathState;
        conf = 7;
        this.confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname)  
    }
    else if (accessData.boolValue(this.popupPathState)) {
        confirm = true;
         alname = 'c10';
        popupState = false;
        popupNames = 'BHOAutoShipChoicePopup';
        st = this.popupPathState;
        conf = 2;
        this.confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname)  
    }
    }
    confirm_popup (popupNames, mes, cmd1, cmd2, st, conf, alname) {
        runPopup(
            {
                alias: this.config.rootPath,
                popupName: popupNames,
                posX: 2360,//2360
                posY: 400
            },
            {
                tag: this.config.rootPath,
                message: mes,
                alarm: `Команда оператора - ${accessData.stringValue(`${this.config.rootPath}.Description`)}`,
                code: `codes.ALGBHO.cmd`,
                popup_num: accessData.intValue(this.popupPath),
                cmd1: cmd1,
                cmd2: cmd2,
                state: st,
                conf: conf
            });
    }
    popupStart(popupNames, alname) {
        runPopup(
            {
                alias: this.config.rootPath+alname,
                popupName: popupNames,
                posX: 2360, //2360
                posY: 400
                
            },
            {
                inputTag: this.config.rootPath,
                codes: this.config.code
            });
    }
}
function algbhioPopup(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AlgBhioPopup(object, {});
    }
    object.parameter.checkForUpdates();
}
function algbhioSets(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new BH_sets(object, {});
    }
    object.parameter.checkForUpdates();
}

