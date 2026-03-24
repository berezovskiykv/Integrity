#INCLUDE "ObservableObject.js"

class VlvParameter extends ObservableObject {
    setupSignalPaths() {
        this.statePath = `${this.config.rootPath}.status1`;
        this.faultPath = `${this.config.rootPath}.status2`;
        this.config.qualityTag = `${this.config.rootPath}.status1`;
    }


   
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
        this.changeVisibility(this.object.off);
        this.changeVisibility(this.object.imit);
        this.changeVisibility(this.object.block);
        this.changeVisibility(this.object.man);
        this.changeVisibility(this.object.auto);
        this.changeVisibility(this.object.local);
        this.changeVisibility(this.object.AW);
        this.changeVisibility(this.object.AW_text);
        this.changeColor(this.object.body.treangle1, colors.VLV.Fillstate.field, "FillColor");
        this.changeColor(this.object.body.treangle2, colors.VLV.Fillstate.field, "FillColor");

    }

    updateVisuals() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.processStateBits();
        this.color = this.determineColor()
        this.mode = this.determineMode();
        this.changeText(this.object.AW_text, this.mode);
        this.changeVisibility(this.object.off, this.state.mask);
        this.changeVisibility(this.object.imit, this.state.imit);
        this.changeVisibility(this.object.block, this.state.lock);
        this.changeVisibility(this.object.man, this.state.man);
        this.changeVisibility(this.object.local, this.state.local);
        this.changeVisibility(this.object.auto, this.state.auto); 
        this.changeVisibility(this.object.AW, this.state.bad || this.state.flt);  
        this.changeVisibility(this.object.AW_text, this.state.bad || this.state.flt);
        this.changeColor(this.object.AW_text, this.color.text_state, "TextColor");
        this.changeColor(this.object.body.treangle1, this.color.value_state1, "FillColor");
        this.changeColor(this.object.body.treangle1, this.color.value_state1_back, "BackgroundColor");
        this.changeColor(this.object.body.treangle2, this.color.value_state2, "FillColor");
        this.changeColor(this.object.body.treangle2, this.color.value_state2_back, "BackgroundColor");
        this.changeColor(this.object.AW, this.color.AWstate, "FillColor");
        this.changeColor(this.object.AW, this.color.AWstate_back, "BackgroundColor");  
    }
    
    checkForFlashing() {
                if (this.state.opening){
                    this.flashingColor(this.object.body.treangle1, this.color.value_state1, colors.VLVP.treanglestate1.opening, "FillColor");
                    this.flashingColor(this.object.body.treangle1, this.color.value_state1_back, colors.VLVP.treanglestate1_back.opening, "BacgroundColor");
                    this.flashingColor(this.object.body.treangle2, this.color.value_state2, colors.VLVP.treanglestate2.opening, "FillColor");
                    this.flashingColor(this.object.body.treangle2, this.color.value_state2_back, colors.VLVP.treanglestate2_back.opening, "BacgroundColor");
                }                                          
                if (this.state.closing){                     
                    this.flashingColor(this.object.body.treangle1, this.color.value_state1, colors.VLVP.treanglestate1.closing, "FillColor");
                    this.flashingColor(this.object.body.treangle1, this.color.value_state1_back, colors.VLVP.treanglestate1_back.closing, "BacgroundColor");
                    this.flashingColor(this.object.body.treangle2, this.color.value_state2, colors.VLVP.treanglestate2.closing, "FillColor");
                    this.flashingColor(this.object.body.treangle2, this.color.value_state2_back, colors.VLVP.treanglestate2_back.closing, "BacgroundColor");

    }
}

    changeText(object, value) {
        if (object) {
            object.access.setStringValue(value, "Text");
        }
    }

    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }

    changeColor(child, color, property) {
        if (child) {
            RGBAColoring(child, color, property);
        }
    }

    flashingColor (child, color1, color2, property) {
        if (child) {
            flashing(child, color1, color2, property)
        }
    }

     processStateBits() {
        let state = this.currentState.state;
        let fault = this.currentState.fault;
        if ((state === null || state === undefined) || (fault === null || fault === undefined)) return;


        this.state = {
            mask            :   !!(state & (S(`${this.config.code}.Status1.Disable`))),
            imit            :   !!(state & (S(`${this.config.code}.Status1.Imit`))),
            msgoff          :   !!(state & (S(`${this.config.code}.Status1.MsgOff`))),
            local           :   !!(state & (S(`${this.config.code}.Status1.Local`))),
            man             :   !!(state & (S(`${this.config.code}.Status1.Man`))),
            auto            :   !!(state & (S(`${this.config.code}.Status1.Aut`))),
            perm            :   !!(state & (S(`${this.config.code}.Status1.Perm`))),
            intlk           :   !!(state & (S(`${this.config.code}.Status1.Intlk`))),
            protect         :   !!(state & (S(`${this.config.code}.Status1.Protect`))),
            kvit            :   !!(state & (S(`${this.config.code}.Status1.Kvit`))),
            bad             :   !!(state & (S(`${this.config.code}.Status1.Undef`))),
            opening         :   !!(state & (S(`${this.config.code}.Status1.Opening`))),
            opened          :   !!(state & (S(`${this.config.code}.Status1.Opened`))),
            closing         :   !!(state & (S(`${this.config.code}.Status1.Closing`))),
            closed          :   !!(state & (S(`${this.config.code}.Status1.Closed`))),
            middle          :   !!(state & (S(`${this.config.code}.Status1.Middle`))),
            mskperm         :   !!(state & (S(`${this.config.code}.Status1.MskPerm`))),
            mskintlk        :   !!(state & (S(`${this.config.code}.Status1.MskIntlk`))),
            mskprotect      :   !!(state & (S(`${this.config.code}.Status1.MskProtect`))),
            lock            :   !!(fault & (S(`${this.config.code}.Status2.Lock`))),
            flt             :   !!(S(`${this.config.rootPath}.status2`) > 0)
    }
}


    determineColor() {
        return {
            text_state
            : this.state.bad ? colors.VLVP.SimCol.yellCol
            : this.state.flt ? colors.VLVP.SimCol.whiteCol
            : colors.VLVP.treanglestate1.field,

            AWstate
            : this.state.bad ? colors.VLVP.SimCol.blackCol
            : this.state.flt ? colors.VLVP.SimCol.redCol
            : colors.VLVP.treanglestate1.field,

            AWstate_back
            : this.state.bad ? colors.VLVP.SimCol_back.grayCol_back
            : this.state.flt ? colors.VLVP.SimCol_back.redCol_back
            : colors.VLVP.treanglestate1.field,

            value_state1
            : this.state.closed ? colors.VLVP.treanglestate1.close
            : this.state.middle ? colors.VLVP.treanglestate1.middle
            : this.state.opened ? colors.VLVP.treanglestate1.open
            : this.state.bad || this.state.flt ? colors.VLVP.treanglestate1.err
            : colors.VLVP.treanglestate1.field,

            value_state1_back
            : this.state.closed ? colors.VLVP.treanglestate1_back.close
            : this.state.middle ? colors.VLVP.treanglestate1_back.middle
            : this.state.opened ? colors.VLVP.treanglestate1_back.open
            : this.state.bad || this.state.flt ? colors.VLVP.treanglestate1_back.err
            : colors.VLVP.treanglestate1_back.field,

            value_state2
            : this.state.closed ? colors.VLVP.treanglestate2.close
            : this.state.middle ? colors.VLVP.treanglestate2.middle
            : this.state.opened ? colors.VLVP.treanglestate2.open
            : this.state.bad || this.state.flt ? colors.VLVP.treanglestate2.err
            : colors.VLVP.treanglestate2.field,

            value_state2_back
            : this.state.closed ? colors.VLVP.treanglestate2_back.close
            : this.state.middle ? colors.VLVP.treanglestate2_back.middle
            : this.state.opened ? colors.VLVP.treanglestate2_back.open
            : this.state.bad || this.state.flt ? colors.VLVP.treanglestate2_back.err
            : colors.VLVP.treanglestate2_back.field,

        }
    }

    determineMode() {
        return S(`${this.config.rootPath}.status2`) > 0 ? "A"
            : this.state.bad ? "S"
            : "";
    }
}

function vlv(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new VlvParameter(object, {});
    }
    object.parameter.checkForUpdates();
}
