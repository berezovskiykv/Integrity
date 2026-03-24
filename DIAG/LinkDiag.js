#INCLUDE "ObservableObject.js"

#ONCE_EXECUTION_BEGIN
//let counter = 0;
//let color;
#ONCE_EXECUTION_END

class LinkCountParameter extends ObservableObject {
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
    }

    /**
     * Читает текущее состояние из OPC сервера
     * @returns {Object} Текущее состояние
     */
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            quality: getSignalQuality(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        //this.object.setStringValue(this.config.description, "ID.Text");
        return true;
    }

    updateBadQuality(){
        //this.object.setStringValue("????????", "ID.Text");
        // Цвет общего фона
        this.updateLinkColors(colors.Link.state.bad);
    }

    /** Обновляет цвета всех доступных Link'ов */
    updateLinkColors(color) {
        // Проверяем существование каждого Link перед изменением цвета
        const availableLinks = [
            this.object.Link1,
            this.object.Link2, 
            this.object.Link3,
            this.object.Link4
        ].filter(link => link !== undefined && link !== null);

        availableLinks.forEach(link => {
            this.changeColor(link, color, "LineColor");
        });
    }

    /** Обновляет визуальные элементы */
    updateVisuals() {
        this.processStateBits();
        this.color = this.determineColor();
        this.updateLinkColors(this.color.value_state);
    }
    
    checkForFlashing() {
    }

    /** Изменяет видимость указанного свойства */
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }

    /** Изменяет цвет указанного свойства
     * @param {String} child имя дочернего элемента ГО 
     * @param {String} property имя свойства
     */
    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }

    /** Моргание цвета у указанного свойства
     * @param {String} child имя дочернего элемента ГО
     * @param {String} color1 первый цвет
     * @param {String} color2 второй цвет
     * @param {String} property имя свойства
     */
    flashingColor (child, color1, color2, property) {
        if (child) {
            flashing(child, color1, color2, property)
        }
    }

     /** Устанавливает биты состояния*/
     processStateBits() {
        let state = this.currentState.state;
        if (state === null || state === undefined) return;

        // Биты состояния
        // p.s. двойное отрицание используется для явного приведения к булевому типу
        this.state = {
            act         :   !!(S(`${this.config.rootPath}`) == true),
            inact       :   !!(S(`${this.config.rootPath}`) == false)
        }
    }

    /**
     * Определяет цвет в зависимости от состояния
     * @returns {Object} Цвет в формате RGBA
     */
    determineColor() {
        return {
            value_state
            : this.state.act   ? colors.Link.state.act
            : this.state.inact ? colors.Link.state.inact
            : colors.Link.state.bad
        }
    }
}

/** Обрабатывает дискретный параметр на мнемосхеме
 * @param {Object} object - Qt-объект на мнемосхеме
 */
function link(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new LinkCountParameter(object, {});
    }
    object.parameter.checkForUpdates();
}

class statusPLC extends ObservableObject {
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
    }

    /** Устанавливает биты состояния*/
    processStateBits() {
        let state = accessData.doubleValue(this.statePath);
        if (state === null || state === undefined)  return;

        const states = {
            Unknown: {
                descr: 'Статус резервирования: Неопределен',
                fieldClr: colors.ALGKSPG.State.defaultfieldClr,
                textClr: colors.ALGKSPG.State.defaulttextClr
            },
            Active: {
                descr: 'Статус резервирования: Активный ',
                fieldClr: colors.ALGKSPG.State.RDYRUNfield,
                textClr: colors.ALGKSPG.State.RDYRUNtext,
            },
            Standby: {
                descr: 'Статус резервирования: Резервный',
                fieldClr: colors.Block.State.good,
                textClr: colors.ALGKSPG.State.RDYRUNtext,
            },
            StandAlone: {
                descr: 'Статус резервирования: Один на линии',
                fieldClr: colors.ALGKSPG.State.NOfield,
                textClr: colors.ALGKSPG.State.NOtext,
            },
            ReservLock: {
                descr: 'Статус резервирования: В резерве и заблокирован',
                fieldClr: colors.ALGKSPG.State.NOfield,
                textClr: colors.ALGKSPG.State.NOtext,
            },
            ReservLockOff: {
                descr: 'Статус резервирования: В резерве, не активен',
                fieldClr: colors.ALGKSPG.State.NOfield,
                textClr: colors.ALGKSPG.State.NOtext,
            },
            NoConnect: {
                descr: 'Статус резервирования: Нет связи с оппонентом',
                fieldClr: colors.ALGKSPG.State.NOfield,
                textClr: colors.ALGKSPG.State.NOtext,
            },
            Error: {
                descr: 'Статус резервирования: Ошибка модуля резервирования',
                fieldClr: colors.ALGKSPG.State.AOfield,
                textClr: colors.ALGKSPG.State.AOtext,
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
    }

}

function statePLC(object) {
    if (!object.parameter) {
        object.parameter = new statusPLC(object, {});
    }
    object.parameter.checkForUpdates();
}