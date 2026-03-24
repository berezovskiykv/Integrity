#INCLUDE "ObservablePopup.js"

/**
 * Класс окна ввода уставок
 * @class InputParameterPopup
 * @extends ObservablePopup
 */
class InputWindowPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        //this.config = config;
        this.setupSignalsPath();
        this.initialize();
    }

    setupSignalsPath() {
        this.value = "";
        this.tag = this.rootPath;
        this.config.writeTag = `${this.tag}.wvalue`
        this.config.FracDigits = accessData.intValue(`${this.tag}.FracDigits`)
        this.config.eUnit = accessData.stringValue(`${this.tag}.EUnit`)
        this.needCheckValid = (this.tag.includes(".xa.set_") || this.tag.includes(".xa.wHighEngin") || this.tag.includes(".xa.wLowEngin")) ? true : false
        this.CompName = environment.readFile("/proc/sys/kernel/hostname", "").replace("\n", "");
    }
    
    initialize() {
        this.keys = {
            0x00000031: "1",
            0x00000032: "2",
            0x00000033: "3",
            0x00000034: "4",
            0x00000035: "5",
            0x00000036: "6",
            0x00000037: "7",
            0x00000038: "8",
            0x00000039: "9",
            0x00000030: "0",
            0x0000002d: "-",

            0x0000002e: ",", //точка
            0x0000002c: ",", //запятая
            0x01000003: "<<", //backspace
            0x01000004: "Ввод", //return
            0x01000005: "Ввод", //enter
            // 0x01000000: "Очистить" //esc
        }
        this.inputKey = 0;
    }
        
    valueButton_Click(object, objectName) {
        let mouseEvent;
        let key = this.keys[this.inputKey];

        if(key == object.value.stringValue("Text")){
            mouseEvent = clickRelease(object, objectName, true);
        }
        else{
            mouseEvent = clickRelease(object, objectName);
        }

        if(mouseEvent.action == 'release') {
            this.value += object.value.stringValue("Text");
        }
    }

    minusButton_Click(object, objectName) {
        let mouseEvent;
        let key = this.keys[this.inputKey];

        if(key == object.value.stringValue("Text")){
            mouseEvent = clickRelease(object, objectName, true);
        }
        else{
            mouseEvent = clickRelease(object, objectName);
        }

        if(mouseEvent.action == 'release') {
            if (!this.value.includes('-')) {
                this.value = object.value.stringValue("Text") + this.value;
            }
            else return;
        }
    }

    clearButton_Click(object, objectName) {
        let mouseEvent;
        let key = this.keys[this.inputKey];

        if(key == object.value.stringValue("Text")){
            mouseEvent = clickRelease(object, objectName, true);
        }
        else{
            mouseEvent = clickRelease(object, objectName);
        }

        if (mouseEvent.action == 'release' || mouseEvent.action == 'hold') {
            this.value = this.value.slice(0, -1);
        }
    }

    allClearButton_Click(object, objectName) {
        let mouseEvent;
        let key = this.keys[this.inputKey];

        if(key == object.value.stringValue("Text")){
            mouseEvent = clickRelease(object, objectName, true);
        }
        else{
            mouseEvent = clickRelease(object, objectName);
        }
        
        if (mouseEvent.action == 'release') {
            this.value = "";
        }
    }
    sendButton_Click(object, objectName) {
        let mouseEvent;
        let key = this.keys[this.inputKey];
        if(key == object.value.stringValue("Text")){
            mouseEvent = clickRelease(object, objectName, true);
        }
        else{
            mouseEvent = clickRelease(object, objectName);
        }
        
        let isValidateValue = (num) => {
            return num > -10000000 && num < 10000000 && num !== "" ? true : false;
        }
        
        //if (mouseEvent.action == 'click') {object.clickRespons = mouseEvent.respons;}
        if (mouseEvent.action == 'release') {
            //object.clickRespons = mouseEvent.respons;
            let result = isValidateValue(this.value);
            if (result == true) {
                this.commandExecute(object /*objectName, 273*/);
            }
            result = undefined;
        }
    }

    cancelButton_Click(object, objectName) {
        let mouseEvent = clickRelease(object, objectName);
        if (mouseEvent.action == 'release') {
            diagram.close();
        }
    }

    dotButton_Click(object, objectName) {
        let mouseEvent;
        let key = this.keys[this.inputKey];

        let dotVisible = () => {
            if (this.config.FracDigits == 0) {
                RGBAColoring(object.value, colors.SERVICE.inputWindow.noDot, "FillColor")
                return false;
            }
            return true;
        }
        if (dotVisible(object)) {
             if(key == object.value.stringValue("Text")){
                mouseEvent = clickRelease(object, objectName, true);
            }
            else{
                mouseEvent = clickRelease(object, objectName);
            }
            if (mouseEvent.action == 'release') {
                if (this.value.includes('.') === false && this.value.length != "") {
                    this.value += ".";
                }
            }
        }
        else {
            mouseEvent = clickRelease(object, objectName, false, true);
        }
    }

    //Показ значения
    displayValue(object) {
        let value = this.value.substr(0, 15);
        if (value.length > 1 && value[0] == "0" && value[1] != ".") {
            value = value.slice(1);
        }
        if (value.length > 2 && value[1] == "0" && value[2] != "." && value[0] == "-") {
            value = value.slice(0, -1);
        }
        if (value.indexOf('-', 1) > 0) {
            let tValue = value.split('-');
            let minus = value[0] == '-' ? '-' : "";
            value = "";
            for (i in tValue) {
                value += tValue[i];
            }
            value = minus + value;
        }
        object.setStringValue(value, "Text");
    }

    //Проверка уставок
    isValidSetpoint() {
        if (this.needCheckValid) {
            /* Название уставки, сформированное из тега передаваемого параметра */
            let setpoint = this.tag.split('.').pop()
            let mainTag = this.tag.replace(`.xa.${setpoint}`, '');
            /** Проверка, активна ли уставка 
            * @param {String} _code Путь типа объекта в кодовом дереве
            * @param {String} _tag Полный путь сигнала
            * @param {String} _name Имя уставки
            * @returns {Boolean} true - если уставка активна, false - если уставка неактивна
            */
            let isAct = (_code, _tag, _name) => {
                _name = _name.replace("set_", "");
                _name = _name.replace("_Lim", "On");
                return (((accessData.doubleValue(`${_tag}.state`) & accessData.doubleValue(`${_code}.state.${_name}`))) ? true : false);
            }

            /** Получение значения сигнала
            * @param {String} _tag Полный путь сигнала
            * @param {String} _name Имя уставки
            * @returns {Number} Значение уставки на момент вызова функции
            */
            let setVal = (_tag, _name) => {
                //accessData.setStringValue(_tag + ".xa." + _name, "test");
                return (accessData.doubleValue(`${_tag}.xa.${_name}`)).toFixed(this.config.FracDigits);
            }

            //let code = accessData.stringValue(spTag + ".Type")"";
            let code = "codes.AP";

            /** Объект, содержащий уставки, каждый литерал которого является объектом, обладающим свойствами: 
            * @param {Number} order - Порядковый номер уставки, использующийся в алгоритме для определения порядка уставок
            * @param {Function} mask Функция, возвращающая состояние уставки (включена - true/ отключена - false)
            * @param {Function} setpointValue Функция, возвращающая значение уставки
            */
            let psetpoints = {
                wHighEngin: { order: 0, mask: () => true, setpointValue: () => Number(setVal(mainTag, Object.keys(psetpoints)[0])) },
                set_AH_Lim: { order: 1, mask: () => isAct(code, mainTag, Object.keys(psetpoints)[1]), setpointValue: () => Number(setVal(mainTag, Object.keys(psetpoints)[1])) },
                set_WH_Lim: { order: 2, mask: () => isAct(code, mainTag, Object.keys(psetpoints)[2]), setpointValue: () => Number(setVal(mainTag, Object.keys(psetpoints)[2])) },
                set_WL_Lim: { order: 3, mask: () => isAct(code, mainTag, Object.keys(psetpoints)[3]), setpointValue: () => Number(setVal(mainTag, Object.keys(psetpoints)[3])) },
                set_AL_Lim: { order: 4, mask: () => isAct(code, mainTag, Object.keys(psetpoints)[4]), setpointValue: () => Number(setVal(mainTag, Object.keys(psetpoints)[4])) },
                wLowEngin: { order: 5, mask: () => true, setpointValue: () => Number(setVal(mainTag, Object.keys(psetpoints)[5])) }
            }
            /** Получение значения ближайшей активной верхней уставки 
            * @param {String} obj Объект, содержащий в себе уставки @see psetpoints
            * @param {String} num Номер текущей уставки
            * @returns {Number} Значение ближайшей активной верхней уставки
            */
            let getPrevElem = (obj, num) => {
                let curr = Object.entries(obj)[num][1];
                if (curr.mask() == true) {
                    return curr.setpointValue();
                }
                else return getPrevElem(obj, num + 1);
            }

            /** Получение значения ближайшей активной нижней уставки 
            * @param {String} obj Объект, содержащий в себе уставки
            * @param {String} num Номер текущей уставки
            * @returns {Number} Значение ближайшей активной нижней уставки
            */
            let getNextElem = (obj, num) => {
                let curr = Object.entries(obj)[num][1];
                if (curr.mask() == true || curr.order == 0) {
                    return curr.setpointValue();
                }
                else return getNextElem(obj, num - 1);
            }

            /** Вызов модульного окна с ошибкой с выводом сообщение, изменяющимся в соответствии с типом уставки
            * @param {Object} element Литерал объекта setpoints, являющийся объектом, содержащий поля order, mask, setpointValue
            */
            let throwError = (element) => {
                let lowVal = () => getPrevElem(psetpoints, element.order + 1);
                let highVal = () => getNextElem(psetpoints, element.order - 1);

                let errMessage;
                if (element.order == 0) {
                    errMessage = `Введено недостоверное значение! Введите число выше ${psetpoints.set_AH_Lim.setpointValue()}!`;
                }
                else if (element.order == 5) {
                    errMessage = `Введено недостоверное значение! Введите число ниже ${psetpoints.set_AL_Lim.setpointValue()}!`;
                }
                else {
                    errMessage = `Введено недостоверное значение! Введите число между ${lowVal()} и ${highVal()}!`;
                }
                runPopup(
                {
                    alias: 'eb',
                    popupName: 'errorBox',
                    posX: diagram.x,
                    posY: diagram.y
                },
                {
                    message: errMessage,
                });
                //diagram.close();
                return;
            }

            // Проверка на достоверность введённого значения
            for (const [key, element] of Object.entries(psetpoints)) {
                if ((key != setpoint) && (element.mask() == true)) {
                    if ((element.order < psetpoints[setpoint].order) && (Number(element.setpointValue()) < Number(this.value))) {
                        throwError(psetpoints[setpoint]);
                        return false;
                    }
                    else if ((element.order > psetpoints[setpoint].order) && (Number(element.setpointValue()) > Number(this.value))) {
                        throwError(psetpoints[setpoint]);
                        return false;
                    }
                }
            };
            return true;
        }
        else return true;
    }

    commandExecute(object) {
        if (isNaN(this.value)) {
            accessDiagram.loadAndRunDiagram("errorBox", "error");
            let diagramObject1 = accessDiagram.getWindow("error");
            diagramObject1.setStringPropValue("Некорректное значение!", "message");
        }
        else {
            if (!this.isValidSetpoint()) return;
            let newVal = `${parseFloat(Number(this.value).toFixed(this.config.FracDigits))} ${this.config.eUnit}`
            let alarm = `${this.config.alarm} - установить ${newVal} [${securityAgent.currentUserLogin()}/${this.CompName}]`;
            runPopup(
            {
                alias: 'accessBox',
                popupName: 'accessBox',
                posX: diagram.x,
                posY: diagram.y
            },
            {
                message: `${this.config.message} ${newVal}?`,
                alarm: alarm,
                tag: this.config.writeTag,
                value: this.value
            });
            
            diagram.close();
        }
    }
}