#INCLUDE "BaseClass.js"

#ONCE_EXECUTION_BEGIN
//let counter = 0;
//let color;
#ONCE_EXECUTION_END

/** Класс дискртеного параметра
 * @class agtParameter
 * @extends ObservableObject
 */
class AgtParameter extends ObservableObject {
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}.state`;
        this.faultPath = `${this.config.rootPath}.flt`;
        this.config.qualityTag = `${this.config.rootPath}.state`;
    }

    /**
     * Возвращает начальное состояние аналогового параметра
     * @returns {Object} Начальное состояние
    getInitialState() {
        var state = super.getInitialState();
        state.setlet counpoints = {
            AH: null, WH: null, TH: null,
            TL: null, WL: null, AL: null
        };
        return state;
    }
*/

    /**
     * Читает текущее состояние из OPC сервера
     * @returns {Object} Текущее состояние
     */
    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            timestamp: new Date().getTime()
        };
        return newState;
    }

    updateText() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

    updateBadQuality(){
        //this.object.setStringValue("????????", "ID.Text");
        this.object.setStringValue("", "click.Tooltip");
        // Цвет общего фона
        this.changeColor(this.object.STATE, colors.AGT.Fillstate.field, "FillColor");
        this.changeColor(this.object.INDICATOR, colors.AGT.Fillstate.field, "FillColor");

    }

    /** Обновляет визуальные элементы */
    updateVisuals() {
        // Для диагностики
        //counter++;
        //accessData.setStringValue(counter, "counter");

        // Обновление битов состояния
        this.processStateBits();
        //Изменение видимости
        this.changeVisibility(this.object.MASK, this.state.mask);
        this.changeVisibility(this.object.Frame, this.state.imit);
        this.changeVisibility(this.object.Mode.text, this.state.local || this.state.man || this.state.auto || this.state.mask);
        this.changeVisibility(this.object.Mode.Rectangle, this.state.local || this.state.man || this.state.auto || this.state.mask);

        // Изменение цвета
        this.color = this.determineColor()
        // Цвет фона значения
        this.changeColor(this.object.STATE, this.color.value_state, "FillColor");
        this.changeColor(this.object.INDICATOR, this.color.indicator_state, "FillColor");
        this.mode = this.determineMode();
        this.changeText(this.object.Mode.text, this.mode);
        this.changeColor(this.object.Mode.Rectangle, this.color.mode_state, "FillColor");
    }
    
    checkForFlashing() {
        if (this.state.kvit) {
            //Моргание фона значения
            this.flashingColor(this.object.STATE, this.color.value_state, colors.AGT.Fillstate.kvit, "FillColor");
            this.flashingColor(this.object.INDICATOR, this.color.indicator_state, colors.AGT.Fillstate.kvit, "FillColor");
        }
        else return;
    }

    /** Изменяет текстовое значение указанного свойства
     * @param {String} child имя дочернего элемента ГО 
     * @param {String} parameter имя свойства
     */
    changeText(object, value) {
        if (object) {
            object.access.setStringValue(value, "Text");
        }
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
            mask        :   !!(state & (S(`${this.config.code}.state.Mask`))),
            imit        :   !!(state & (S(`${this.config.code}.state.Imit`))),
            local       :   !!(state & (S(`${this.config.code}.state.Local`))),
            auto        :   !!(state & (S(`${this.config.code}.state.Auto`))),
            redun       :   !!(state & (S(`${this.config.code}.state.Redun`))),
            man         :   !!(state & (S(`${this.config.code}.state.Man`))),
            oos         :   !!(state & (S(`${this.config.code}.state.Oos`))),
            bad         :   !!(state & (S(`${this.config.code}.state.Bad`))),
            start       :   !!(state & (S(`${this.config.code}.state.Start`))),
            reverse     :   !!(state & (S(`${this.config.code}.state.Reverse`))),
            stop        :   !!(state & (S(`${this.config.code}.state.Stop`))),
            starting    :   !!(state & (S(`${this.config.code}.state.Starting`))),
            stoping     :   !!(state & (S(`${this.config.code}.state.Stoping`))),
            speed       :   !!(state & (S(`${this.config.code}.state.Speed`))),
            RDYStart    :   !!(state & (S(`${this.config.code}.state.RDYStart`))),
            RDYStop     :   !!(state & (S(`${this.config.code}.state.RDYStop`))),
            msgoff      :   !!(state & (S(`${this.config.code}.state.MsgOff`))),
            mskperm     :   !!(state & (S(`${this.config.code}.state.MskPerm`))),
            mskinter    :   !!(state & (S(`${this.config.code}.state.MskInter`))),
            mskprotect  :   !!(state & (S(`${this.config.code}.state.MskProtect`))),
            kvit        :   !!(state & (S(`${this.config.code}.state.Kvit`))),
            moto        :   !!(state & (S(`${this.config.code}.state.Moto`))),
            flt         :   !!(S(`${this.config.rootPath}.flt`) > 0)
        }
    }

    /**
     * Определяет цвет в зависимости от состояния
     * @returns {Object} Цвет в формате RGBA
     */

    determineColor() {
        return {
            value_state
            : this.state.bad || this.state.flt ? colors.AGT.Fillstate.avar
            : this.state.start ? colors.AGT.Fillstate.start
            : this.state.stop ? colors.AGT.Fillstate.stop
            : this.state.mask ? colors.AGT.Fillstate.mask
            : colors.AGT.Fillstate.field,

            indicator_state
            : this.state.bad || this.state.flt ? colors.AGT.Indicatorstate.avar
            : this.state.RDYStart ? colors.AGT.Indicatorstate.RDYStart
            : this.state.RDYStop ? colors.AGT.Indicatorstate.RDYStop
            : colors.AGT.Fillstate.field,

            field_state
            :this.state.imit ? colors.AGT.Fillstate.imit
            :colors.AGT.Fillstate.field,

            mode_state
            : this.state.bad || this.state.flt ? colors.AGT.Fillstate.avar
            : this.state.local ? colors.AGT.Modestate.local
            : this.state.auto ? colors.AGT.Modestate.auto
            : this.state.man ? colors.AGT.Modestate.man
            : colors.AGT.Fillstate.field 

        }
    }

    determineMode() {
        return this.state.local ? "МЕСТ."
            : this.state.auto ? "АВТ."
            : this.state.man ? "РУЧ."
            : this.state.mask ? "РЕМ."
            : "?????";
    }
}

/** Обрабатывает аналоговый параметр на мнемосхеме
 * @param {Object} object - Qt-объект на мнемосхеме
 */
function agt(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new AgtParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
