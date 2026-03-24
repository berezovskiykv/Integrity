#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"

class ObservableObject {
    constructor(object, config) {
        this.object = object;
        this.config = config;
        this.currentState = {};
        this.previousState = {};
        this.wasGoodQualityBefore = true; // Добавляем флаг для отслеживания качества
        
        this.initialize();
    }
    
    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.currentState = this.getInitialState();
        this.config.qualityTag = ""; // Теперь используем единый тег качества
        this.setupSignalPaths();
        this.copyState(this.currentState, this.previousState);
    }

    copyState(source, target) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    setupSignalPaths() {
        throw new Error('setupSignalPaths must be implemented in derived class');
    }

    getInitialState() {
        return {
            value: null,
            quality: null // Добавляем качество в состояние
        };
    }

    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        var isGoodQuality = getSignalQuality(this.config.qualityTag); // Проверяем только один тег

        if (active) {
            if (isGoodQuality) {
                if (!this.wasGoodQualityBefore) {
                    this.updateText(); // Восстанавливаем текст при возврате хорошего качества
                    this.wasGoodQualityBefore = true;
                }
                
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
                this.updateBadQuality();
                this.wasGoodQualityBefore = false;
                this.currentState = newState;
                this.copyState(this.currentState, this.previousState);
            }
        }
        return false;
    }

    hasStateChanged(newState) {
        return newState.value !== this.currentState.value ||
               newState.state !== this.currentState.state || 
               newState.quality !== this.currentState.quality;
    }

    readCurrentState() {
        throw new Error('readCurrentState must be implemented in derived class');
    }

    onStateChanged() {
        this.updateVisuals();
        this.updateLogic();
    }

    updateVisuals() {
        throw new Error('updateVisuals must be implemented in derived class');
    }

    checkForFlashing() {
        throw new Error('checkForFlashing must be implemented in derived class');
    }

    updateLogic() {
        // Базовая реализация пустая
    }
    
    updateText() {
        throw new Error('updateText must be implemented in derived class');
    }
    
    updateBadQuality() {
        throw new Error('updateBadQuality must be implemented in derived class');
    }
}