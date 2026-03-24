#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/colorSettings.js"
#INCLUDE "Managers/hover.js"

/** Базовый класс для наблюдаемых объектов на мнемосхеме
 * @class ObservableObject
 * @abstract
 */
class ObservableObject {
    /** Создает экземпляр ObservableObject
     * @param {Object} object - Qt-объект на мнемосхеме
     * @param {Object} config - Конфигурация параметра
     */
    constructor(object, config) {
        this.object = object;
        this.config = config;
        this.currentState = {};
        this.previousState = {};
        
        this.initialize();

    }
    
    /** Инициализация параметра */
    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.rootPath2 = getAliasesPath2(this.object);
        this.config.ID = accessData.stringValue(`${this.config.rootPath}.ID`);
        this.config.nameobject = accessData.stringValue(`${this.config.rootPath}.Name_Object`);
        this.config.nameobject1 = accessData.stringValue(`${this.config.rootPath}.Name_Object1`);
        this.config.description = accessData.stringValue(`${this.config.rootPath}.Description`);
        this.config.popup = accessData.stringValue(`${this.config.rootPath}.Popup`);
        this.config.code = accessData.stringValue(`${this.config.rootPath}.Type`);
        this.config.name = this.object.name;
        this.currentState = this.getInitialState();
        this.config.qualityTag = "";
        this.setupSignalPaths();
        this.copyState(this.currentState, this.previousState);
    }

    /** Копирует состояние из одного объекта в другой
     * @param {Object} source - Исходный объект состояния
     * @param {Object} target - Целевой объект состояния
     */
    copyState(source, target) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    /** Настройка путей к сигналам (должен быть реализован в наследниках)
     * @abstract
     * @throws {Error} При вызове метода базового класса
     */
    setupSignalPaths() {
        throw new Error('setupSignalPaths must be implemented in derived class');
    }

    /** Возвращает начальное состояние параметра
     * @returns {Object} Начальное состояние
     */
    getInitialState() {
        return {
            quality: null,
            value: null,
            state: null,
            fault: null,
            timestamp: null
        };
    }

    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            this.object.start = this.updateText();
            if (getSignalQuality(this.config.qualityTag)) {
                /*this.object.start ? {} : this.object.start = this.updateText();*/
                this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.copyState(this.currentState, this.previousState);
                    return true;
                }
                this.checkForFlashing();
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

    /** Проверяет, изменилось ли состояние
     * @param {Object} newState - Новое состояние
     * @returns {Boolean} true, если состояние изменилось
     */
    hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.fault !== this.currentState.fault ||
            newState.priority !== this.currentState.priority ||
            newState.quality !== this.currentState.quality) {
            return true;
        }
        
        // if (newState.setpoints) {
        //     for (var key in newState.setpoints) {
        //         if (newState.setpoints[key] !== this.currentState.setpoints[key]) {
        //             return true;
        //         }
        //     }
        // }
        
        return false;
    }

    /** Читает текущее состояние (должен быть реализован в наследниках)
     * @abstract
     * @throws {Error} При вызове метода базового класса
     * @returns {Object} Текущее состояние
     */
    readCurrentState() {
        throw new Error('readCurrentState must be implemented in derived class');
    }

    /** Вызывается при изменении состояния */
    onStateChanged() {
            this.updateVisuals();
            this.updateLogic();
    }

    /** Обновляет визуальные элементы (должен быть реализован в наследниках)
     * @abstract
     * @throws {Error} При вызове метода базового класса
     */
    updateVisuals() {
        throw new Error('updateVisuals must be implemented in derived class');
    }

    checkForFlashing() {
        throw new Error('checkForFlashing must be implemented in derived class');
    }

    /** Выполняет дополнительную логику при изменении состояния */
    updateLogic() {
        // Базовая реализация пустая
    }
    updateText(){
        throw new Error('updateText must be implemented in derived class');
    }
    updateBadQuality() {
        throw new Error('updateBadQuality must be implemented in derived class');
    }

    openPopup() {
        let mouseEvent = clickRelease(this.object, this.object.name + '.click');  
        if(mouseEvent.action == 'click'){this.object.clickRespons = mouseEvent.respons;}
        else if(mouseEvent.action == 'release'){
            runPopup(
            {
                alias: this.config.rootPath,
                popupName: this.config.popup,
                posX: this.object.clickRespons['globalPosX'],
                posY: this.object.clickRespons['globalPosY']
            },
            {
                inputTag: this.config.rootPath,
                codes: this.config.code
            });
        }
    }

}
