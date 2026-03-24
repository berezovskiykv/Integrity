#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/colorSettings.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/hover.js"
/**
 * Базовый класс для наблюдаемых объектов на мнемосхеме
 * @class ObservablePopup
 * @abstract
 */
class ObservablePopup {
    /**
     * Создает экземпляр ObservablePopup
     * @param {Object} config - Конфигурация параметра
     */
    constructor(config) {
        if (new.target === ObservablePopup) {
            throw new Error("ObservablePopup is an abstract class and cannot be instantiated directly");
        }
        
        this.rootPath = config.rootPath;
        this.config = config;
        this.subscriptions = [];
        
        this.initialize();
    }

    /** Инициализация параметра */
    initialize() {
        // Базовый метод, может быть переопределен потомками
    }

    /**
     * Обновление состояния
     * @abstract
     */
    update() {
        throw new Error("Method 'update()' must be implemented");
    }
}

/**
 * Оптимизированный Publisher для частых обновлений
 * @class Publisher
 */
class Publisher {
    constructor() {
        this.observers = new Map();     // { tag: Set(callbacks) }
        this.lastValues = new Map();    // { tag: lastValue }
        
        //пропуск первой иттерации checkforupdates для корректной работы регистра через конструктор класса попапа
        this.checkUpdates = () => {
            this.checkUpdates = () => this.checkForUpdates()
        }
    }
    /**
     * Регистрация callback на изменения тега
     * @param {string} tag - Путь к данным
     * @param {Function} callback - Уже привязанная функция
     * @param {Array} args - массив аргументов для передачи в callback
     */
    register(tags, callback, condition = '') {
        let hasChanged = (currentValue, currentQuality, lastValue) => false;

        switch (condition)
        {
            case 'q':
                hasChanged = (currentValue, currentQuality, lastValue) => currentQuality !== lastValue.quality
                break;
            case 'v':
                hasChanged = (currentValue, currentQuality, lastValue) => currentValue !== lastValue.value
                break;

            default:
                hasChanged = (currentValue, currentQuality, lastValue) => currentQuality !== lastValue.quality || currentValue !== lastValue.value
                break;

        }

        for (const tag of tags) {
            this.registerTag(tag, callback, hasChanged, condition)
        }
        return true;
    }

    registerTag(tag, callback, hasChanged, condition) {
        if (!publisher.observers.has(tag)) {
                publisher.observers.set(tag, {
                    callbacks: []
                });


                // var currentValue = this.readData(tag);
                // var currentQuality = getSignalQuality(tag);

                publisher.lastValues.set(tag, {
                    value : null,
                    quality : null
                });
            }
            // Добавляем callback в Set
            publisher.observers.get(tag).callbacks.push([callback, hasChanged, condition]);
    }

    readData(tag) {
        // Пробуем прочитать как число
        const numVal = accessData.doubleValue(tag);
        if (!isNaN(numVal)) {
            return numVal;
        }

        // Пробуем как boolean
        const boolVal = accessData.booleanValue(tag);
        if (boolVal === true || boolVal === false) {
            return boolVal;
        }

        // По умолчанию — строка
        return accessData.stringValue(tag);
    }

    /**   
    * Проверка обновлений (вызывается 10 раз/сек)
    */
    checkForUpdates() {
        var context = this;
        let cond;
        this.observers.forEach((observer, tag) => {

            var currentValue = context.readData(tag);
            var currentQuality = getSignalQuality(tag);
            let lastValue = context.lastValues.get(tag);
            
            let anyChanged = false;

            observer.callbacks.forEach((cb) => {
                    if(!cb[1](currentValue, currentQuality, lastValue)) {
                        return;
                    }

                    anyChanged = true;

                    cb[0]({value: currentValue, quality: currentQuality, tag: tag});
                });
                
            if (anyChanged)
                context.lastValues.set(tag, {
                    value : currentValue, 
                    quality : currentQuality
                    });
        });
    }
}

