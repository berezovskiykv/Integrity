#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"

/** Базовый класс для наблюдаемых объектов на мнемосхеме
 * @class ObservableObject
 * @abstract
 */
class ObservableObjectLsu {
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
        this.currentState = this.getInitialState();
        this.config.qualityTag1 = "";
        this.config.qualityTag2 = "";
        this.setupSignalPaths();
        this.copyState(this.currentState, this.previousState);
        //this.onStateChanged();
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
            value: null
        };
    }

    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
checkForUpdates() {
    var newState = this.readCurrentState();
    var hasChanged = this.hasStateChanged(newState);
    var isGoodQuality = getSignalQuality(this.config.qualityTag1) && getSignalQuality(this.config.qualityTag2);

    if (active) {
        if (isGoodQuality) {
            // Если качество улучшилось (было плохое → стало хорошее)
            if (!this.wasGoodQualityBefore) {
                this.updateText();  // Принудительно обновляем текст
                this.wasGoodQualityBefore = true;
            }
            
            if (hasChanged) {
                this.currentState = newState;
                this.onStateChanged();
                this.copyState(this.currentState, this.previousState);
                return true;
            }
        }
        else {
            this.updateBadQuality();
            this.wasGoodQualityBefore = false;
            this.currentState = newState;
            this.copyState(this.currentState, this.previousState);
        }
    }
    return false;
}
    /** Проверяет, изменилось ли состояние
     * @param {Object} newState - Новое состояние
     * @returns {Boolean} true, если состояние изменилось
     */
    hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state || 
            newState.state_quality !== this.currentState.state_quality ||
            newState.value_quality !== this.currentState.value_quality) {
            return true;
        }

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

}