#INCLUDE "ObservableObjectLsu2.js"

class ElemDPParameter extends ObservableObject {
        constructor(object, config) {
        super(object, config);
        this.forceInitialUpdate = true; // Флаг для принудительного обновления при инициализации
    }
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}`;
        this.config.qualityTag = `${this.config.rootPath}`;
        //environment.logInfo("ElemDP");

    }

    readCurrentState() {
        return {
            state: accessData.doubleValue(this.statePath),
            state_quality: accessData.stringValue(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
    }

    updateText() {

    }

    updateBadQuality() {
        if (this.object) {
            this.changeVisibility(this.object.bit0, false);
            this.changeVisibility(this.object.bit1, false);
            this.changeVisibility(this.object.bit2, false);
            this.changeVisibility(this.object.bit3, false);
            this.changeVisibility(this.object.bit4, false);
            this.changeVisibility(this.object.bit5, false);
            this.changeVisibility(this.object.bit6, false);
            this.changeVisibility(this.object.bit7, false);
            this.changeVisibility(this.object.bit8, false);
            this.changeVisibility(this.object.bit9, false);
            this.changeVisibility(this.object.bit10, false);
            this.changeVisibility(this.object.bit11, false);
            this.changeVisibility(this.object.bit12, false);
            this.changeVisibility(this.object.bit13, false);
            this.changeVisibility(this.object.bit14, false);
            this.changeVisibility(this.object.bit15, false);
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
        this.changeVisibility(this.object.bit5, (this.state.bit5));
        this.changeVisibility(this.object.bit6, (this.state.bit6));
        this.changeVisibility(this.object.bit7, (this.state.bit7));
        this.changeVisibility(this.object.bit8, (this.state.bit8));
        this.changeVisibility(this.object.bit9, (this.state.bit9));
        this.changeVisibility(this.object.bit10, (this.state.bit10));
        this.changeVisibility(this.object.bit11, (this.state.bit11));
        this.changeVisibility(this.object.bit12, (this.state.bit12));
        this.changeVisibility(this.object.bit13, (this.state.bit13));
        this.changeVisibility(this.object.bit14, (this.state.bit14));
        this.changeVisibility(this.object.bit15, (this.state.bit15));
    
        

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
            bit5: !!(state & 32),   // Бит 0 (1)
            bit6: !!(state & 64),   // Бит 1 (2)
            bit7: !!(state & 128),   // Бит 2 (4)
            bit8: !!(state & 256),   // Бит 3 (8)
            bit9: !!(state & 512),  // Бит 4 (16)
            bit10: !!(state & 1024),   // Бит 0 (1)
            bit11: !!(state & 2048),   // Бит 1 (2)
            bit12: !!(state & 4096),   // Бит 2 (4)
            bit13: !!(state & 8192),   // Бит 3 (8)
            bit14: !!(state & 16384),  // Бит 4 (16)
            bit15: !!(state & 32768),  // Бит 4 (16)
            rawValue: state        // Сохраняем исходное значение
        };
    }
}

function elemdp(object) {
    if (!object.parameter) {
        object.parameter = new ElemDPParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
