#INCLUDE "ObservableObjectLsu2.js"

class ElemVLVParameter extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}.state`;
        this.config.Description = accessData.stringValue(`${this.config.rootPath}.state.ID`) || "Нет данных";
        this.config.qualityTag = `${this.config.rootPath}.state`;
        //environment.logInfo("ElemVLV");
        // Сразу скрываем BLOCK при инициализации
        this.changeVisibility(this.object.BLOCK, false);
        this.changeVisibility(this.object.Link, false);
        this.changeVisibility(this.object.CRASH, false);
    }

    readCurrentState() {
        return {
            state: accessData.doubleValue(this.statePath),
            quality: accessData.stringValue(this.config.qualityTag),
            timestamp: new Date().getTime()
        };
    }

    checkForUpdates() {
        const newState = this.readCurrentState();
        const isGoodQuality = getSignalQuality(this.config.qualityTag);
        
        if (!active) return false;

        const qualityChanged = (isGoodQuality !== this.lastQualityState);
        const stateChanged = (newState.state !== this.currentState.state);
        this.lastQualityState = isGoodQuality;
        
        if (isGoodQuality) {
            if (qualityChanged || stateChanged || this.forceUpdate) {
                this.currentState = newState;

                this.updateVisuals();
                this.updateText();
                this.forceUpdate = false;
                return true;
            }
            this.checkForFlashing();
        } 
        else  {
             this.updateBadQuality();
             return false;
        }
    }

    updateText() {
        if (this.object && this.config.Description) {
            this.object.setStringValue(this.config.Description, "ID.Text");
        }
    }

    updateBadQuality() {
        if (this.object) {
            //this.object.setStringValue("????????", "ID.Text");
            this.changeColor(this.object.body.treangle1, colors.ElemVLV.Fillstate_treangle1.field, "FillColor");
            this.changeColor(this.object.body.treangle2, colors.ElemVLV.Fillstate_treangle2.field, "FillColor");
            this.changeColor(this.object.body.treangle1, colors.ElemVLV.Fillback_treangle1.field_back, "BackgroundColor");
            this.changeColor(this.object.body.treangle2, colors.ElemVLV.Fillback_treangle2.field_back, "BackgroundColor");
            // Скрываем BLOCK при плохом качестве
            this.changeVisibility(this.object.BLOCK, false);
            this.changeVisibility(this.object.Link, false);
            this.changeVisibility(this.object.CRASH, false);

        }
    }

    updateVisuals() {
        this.processStateBits();
        this.changeVisibility(this.object.CRASH, (this.state == 5));
        this.changeVisibility(this.object.Link,  (this.state == 6));
        this.changeVisibility(this.object.BLOCK, (this.state == 7));
        this.color = this.determineColor();
        this.changeColor(this.object.body.treangle1, this.color.state_treangle1, "FillColor");
        this.changeColor(this.object.body.treangle1, this.color.back_treangle1, "BackgroundColor");
        this.changeColor(this.object.body.treangle2, this.color.state_treangle2, "FillColor");
        this.changeColor(this.object.body.treangle2, this.color.back_treangle2, "BackgroundColor");
    }

    changeColor(child, color, property) {
        if (child && color && property) {
            RGBAColoring(child, color, property);
        }
    }
    
    changeVisibility(child, visible) {
        if (child && child.access && child.access.setVisible) {
            try {
                child.access.setVisible(visible);
            } catch(e) {
                console.error("Error changing visibility:", e);
                // Альтернативные методы, если основной не сработал
                try { child.visible = visible; } catch(e) {}
                try { child.opacity = visible ? 1 : 0; } catch(e) {}
            }
        } else if (child) {
            // Резервные методы для объектов без .access.setVisible
            try { child.visible = visible; } catch(e) {}
            try { child.opacity = visible ? 1 : 0; } catch(e) {}
        }
    }

    checkForFlashing() {
        if (this.state == 2 || this.state == 3) {
            //Моргание фона значения
            //Text_1.setStringValue(color, "Text")
            this.flashingColor(this.object.body.treangle1, this.color.state_treangle1, colors.ElemVLV.Fillstate_treangle1.middle, "FillColor");
            this.flashingColor(this.object.body.treangle1, this.color.back_treangle1,  colors.ElemVLV.Fillback_treangle1.middle_back, "BackgroundColor");
            this.flashingColor(this.object.body.treangle2, this.color.state_treangle2, colors.ElemVLV.Fillstate_treangle2.middle, "FillColor");
            this.flashingColor(this.object.body.treangle2, this.color.back_treangle2,  colors.ElemVLV.Fillback_treangle2.middle_back, "BackgroundColor");
        }
        else return;
    }

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

    processStateBits() {
        let state = this.currentState.state;
        if (state === null || state === undefined) return;
        this.state = state;
    }

    determineColor() {
        return {
            state_treangle1: this.state == 0 ? colors.ElemVLV.Fillstate_treangle1.err
                : this.state == 1 ? colors.ElemVLV.Fillstate_treangle1.stop
                : this.state == 2 ? colors.ElemVLV.Fillstate_treangle1.stop
                : this.state == 3 ? colors.ElemVLV.Fillstate_treangle1.open
                : this.state == 4 ? colors.ElemVLV.Fillstate_treangle1.open
                : this.state == 5 ? colors.ElemVLV.Fillstate_treangle1.field
                : this.state == 6 ? colors.ElemVLV.Fillstate_treangle1.field
                : this.state == 7 ? colors.ElemVLV.Fillstate_treangle1.field
                : colors.ElemVLV.Fillstate_treangle1.field,

            state_treangle2: this.state == 0 ? colors.ElemVLV.Fillstate_treangle2.err
                : this.state == 1 ? colors.ElemVLV.Fillstate_treangle2.stop
                : this.state == 2 ? colors.ElemVLV.Fillstate_treangle2.stop
                : this.state == 3 ? colors.ElemVLV.Fillstate_treangle2.open
                : this.state == 4 ? colors.ElemVLV.Fillstate_treangle2.open
                : this.state == 5 ? colors.ElemVLV.Fillstate_treangle2.field
                : this.state == 6 ? colors.ElemVLV.Fillstate_treangle2.field
                : this.state == 7 ? colors.ElemVLV.Fillstate_treangle2.field
                : colors.ElemVLV.Fillstate_treangle2.field,

            back_treangle1: this.state == 0 ? colors.ElemVLV.Fillback_treangle1.err_back
                : this.state == 1 ? colors.ElemVLV.Fillback_treangle2.stop_back
                : this.state == 2 ? colors.ElemVLV.Fillback_treangle2.stop_back
                : this.state == 3 ? colors.ElemVLV.Fillback_treangle2.open_back
                : this.state == 4 ? colors.ElemVLV.Fillback_treangle2.open_back
                : this.state == 5 ? colors.ElemVLV.Fillback_treangle1.field_back
                : this.state == 6 ? colors.ElemVLV.Fillback_treangle1.field_back
                : this.state == 7 ? colors.ElemVLV.Fillback_treangle1.field_back
                : colors.ElemVLV.Fillback_treangle1.field_back,
            
            back_treangle2: this.state == 0 ? colors.ElemVLV.Fillback_treangle2.err_back
                : this.state == 1 ? colors.ElemVLV.Fillback_treangle2.stop_back
                : this.state == 2 ? colors.ElemVLV.Fillback_treangle2.stop_back
                : this.state == 3 ? colors.ElemVLV.Fillback_treangle2.open_back
                : this.state == 4 ? colors.ElemVLV.Fillback_treangle2.open_back
                : this.state == 5 ? colors.ElemVLV.Fillback_treangle2.field_back
                : this.state == 6 ? colors.ElemVLV.Fillback_treangle2.field_back
                : this.state == 7 ? colors.ElemVLV.Fillback_treangle2.field_back
                : colors.ElemVLV.Fillback_treangle2.field_back
        };
    }
}

function elemvlv(object) {
    if (!object.parameter) {
        object.parameter = new ElemVLVParameter(object, {});
        // Дополнительная инициализация при создании
        object.parameter.changeVisibility(object.BLOCK, false);
    }
    object.parameter.checkForUpdates();
}
