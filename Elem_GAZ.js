#INCLUDE "ObservableObjectLsu2.js"

class ElemGAZParameter extends ObservableObject {
    constructor(object, config) {
        super(object, config);
        this.forceInitialUpdate = true; // Флаг для принудительного обновления при инициализации
    }
   
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}.state`;
        this.valuePath = `${this.config.rootPath}.Tfail`;
        this.config.qualityTag = `${this.config.rootPath}.state`;
        //environment.logInfo("ElemGAZ");
        
        // Принудительное обновление текста при инициализации
        this.updateText();
    }

    readCurrentState() {
        return {
            value: accessData.doubleValue(this.valuePath),
            state: accessData.doubleValue(this.statePath),
            state_quality: accessData.stringValue(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
    }

    updateText() {

    }

    updateBadQuality() {
        if (this.object) {
            this.object.setStringValue("???", "time.Text.Text");
            this.changeVisibility(this.object.bit0, false);
            this.changeVisibility(this.object.bit1, false);
            this.changeVisibility(this.object.bit2, false);
            this.changeVisibility(this.object.bit3, false);
            this.changeVisibility(this.object.bit4, false);
            this.changeVisibility(this.object.norm, false);
        }
    }
    
    updateGoodQuality() {
        this.updateText();
        this.updateVisuals();
    }

    hasStateChanged(newState) {
        const qualityChanged = 
            (getSignalQuality(this.config.qualityTag) !== getSignalQuality(newState.state_quality));
        
        return this.forceInitialUpdate || qualityChanged || 
               newState.state !== this.currentState.state;
    }

    updateVisuals() {
        this.processStateBits();
        this.changeVisibility(this.object.bit0, (this.state.bit0));
        this.changeVisibility(this.object.bit1, (this.state.bit1));
        this.changeVisibility(this.object.bit2, (this.state.bit2));
        this.changeVisibility(this.object.bit3, (this.state.bit3));
        this.changeVisibility(this.object.bit4, (this.state.bit4));
        this.changeValue(this.object.time.Text, accessData.doubleValue(this.valuePath));
        // Управление видимостью norm (видим, если ни один бит не установлен)
        const anyBitActive = this.state.bit0 || this.state.bit1 || this.state.bit2 || 
                           this.state.bit3 || this.state.bit4;
        this.changeVisibility(this.object.norm, !anyBitActive);
        
        this.forceInitialUpdate = false; // Сбрасываем флаг после первого обновления
    }

    changeValue(child, parameter) {
        if (child) {
            child.access.setStringValue(parameter, "Text");
        }
    }

    changeColor(child, color, property) {
        if (child && color) {
            RGBAColoring(child, color, property);
        }
    }
       
    changeVisibility(child, condition) {
        if (child && child.access && child.access.setVisible) {
            try {
                child.access.setVisible(condition);
            } catch(e) {
                console.error("Error changing visibility:", e);
                try { child.visible = condition; } catch(e) {}
            }
        }
    }

    processStateBits() {
        let state = this.currentState.state;
        if (state === null || state === undefined) return;

        // Преобразуем числовое состояние в битовые флаги
        this.state = {
            bit0: !!(state & 1),   // Бит 0 (1)
            bit1: !!(state & 2),   // Бит 1 (2)
            bit2: !!(state & 4),   // Бит 2 (4)
            bit3: !!(state & 8),   // Бит 3 (8)
            bit4: !!(state & 16),  // Бит 4 (16)
            rawValue: state        // Сохраняем исходное значение
        };
    }
}

function elemgaz(object) {
    if (!object.parameter) {
        object.parameter = new ElemGAZParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
