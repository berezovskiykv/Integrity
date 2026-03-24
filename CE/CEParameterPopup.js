#INCLUDE "ObservablePopup.js"

class CEParameterPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.rootPath = config.rootPath;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality, context.statePath)}, 'q')
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.tag = `${this.rootPath}`;
        this.cmdPath = `${this.rootPath}.cmd`;
        this.statePath = `${this.rootPath}.state`;
        this.offStatus = `${this.rootPath}.OffStatus`;
        this.modePath = `${this.rootPath}.mode`;
        this.setpointPath = `${this.rootPath}.xa`;
        this.mskPath = `${this.rootPath}.msk`;
        this.sourcePath = `${this.rootPath}.source`;
        this.FCPath = `${this.rootPath}.FirstCause`;
        this.stateFlgPath = `${this.config.rootPath}.state.flg0`;
        this.modeFlgPath = `${this.config.rootPath}.mode.flg0`;
        this.sourceFlgPath = `${this.config.rootPath}.source.flg0`;
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.Code = accessData.stringValue(`${this.rootPath}.Type`);
    }

    initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");

    }

    readSetpoints() {
    const readSET = (name) => ({
        value: accessData.doubleValue(`${this.setpointPath}.${name}`),
        description: accessData.stringValue(`${this.setpointPath}.${name}.Description`),
        fracdigits: accessData.intValue(`${this.setpointPath}.${name}.FracDigits`),
        eunit: accessData.stringValue(`${this.setpointPath}.${name}.EUnit`)
    });

    const result = {};
    for (let i = 0; i <= 15; i++) {
        const index = i < 10 ? `0${i}` : `${i}`;
        result[`t${index}`] = readSET(`t${index}`);
    }
    return result;
    }


    CE_desc(value, state, prefix, checkbox, context, object) {
    let tag = this.tag;
    let num = object.access.stringValue("NUM");
    let FC = object.access.stringValue("FC");
    let firstCauseValue = accessData.stringValue(`${tag}.FirstCause`);
    object.Text.setStringValue(accessData.stringValue(`${tag}.state.${num}.Description`), "Text");

     if (firstCauseValue && FC && firstCauseValue.toString() === FC.toString()) {
        object.firstcause.setVisible(true);
    } else {
        object.firstcause.setVisible(false);
    }

    
    let color = (!!(S(`${tag}.mode.flg0`) & (S(`codes.CE.Status3.${num}`)))) ? colors.CE.brownColor 
        : S(`${tag}.state.${num}`) & S(`${tag}.state.${num}.Color`) == 1 ? colors.CE.redColor
        : S(`${tag}.state.${num}`) & S(`${tag}.state.${num}.Color`) == 2 ? colors.CE.warn
        : colors.CE.invisible;

    let textColor = color == colors.CE.invisible ? colors.CE.darkBackgroundColor
        : color == colors.CE.warn ? colors.CE.darkBackgroundColor  
        : colors.CE.white;

   
    RGBAColoring(object.Background, color, "FillColor");
    RGBAColoring(object.Text, textColor, "TextColor");
    }


   SetClick(object, objectName, prefix, checkbox = false) {
        let postfixTag = (checkbox) ? `set_${prefix}_Lim` : prefix
        if(getSignalQuality(this.statePath) && getSignalQuality(`${this.setpointPath}.${postfixTag}`)) {
            if ((typeof(object.select) !== 'undefined') && checkbox) {
                runAccessBox(object.select, objectName + '.select.click', {codes: `${this.config.code}.cmd.${prefix}On`, statebit: this.processStateBits()[`${prefix}_On`], inputTag: this.valuePath})
                if (this.processStateBits()[`${prefix}_On`]) {
                    runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.xa.${postfixTag}`, codes: this.config.code})
                }
                else {
                    clickClear(object.set, objectName + '.set.click');
                }
            }
            else {
                runInputWindow(object.set, objectName + '.set.click', {inputTag: this.rootPath, postfix: `.xa.${postfixTag}`, codes: this.config.code})
            }
        }
        else {
            if ((typeof(object.select) !== 'undefined') && checkbox) {
                clickClear(object.select, objectName + '.select.click');
            }
            clickClear(object.set, objectName + '.set.click');
        }
    }

 
    ModeClick(object, objectName, prefix) {
        if (getSignalQuality(this.statePath)) {
            let mskComand = (!!(S(`${this.tag}.mode.flg0`) & (S(`codes.CE.Status3.${prefix}`)))) ? `codes.CE.cmd.${prefix}_msk_rst` 
                : `codes.CE.cmd.${prefix}_msk_set`;
            runAccessBox(object.mask, objectName + '.mask', {codes: mskComand, inputTag: this.tag})
        }
        else {
            clickClear(object.mask, objectName + '.mask')
        }
    }

    SendTU(object, objectName, prefix){
        if (getSignalQuality(this.statePath)) {
            runAccessBox(object, objectName + '.click', {codes: `${this.config.Code}.cmd.${prefix}`, inputTag: this.rootPath})
        }
        else {
            clickClear(object, objectName + '.click')
        }
    }

    publish_updateCustomTag(object, tagSuffix) {
    if (!object.observerAction) {
        object.observerAction = publisher.register([`${this.rootPath}${tagSuffix}`], 
            (newValue) => {this.updateCustomTag(newValue.value, newValue.tag, this, object)}
        );
    }
    }
    publish_updateSetPoints(object, prefix, blockCondition = []) {
            if (!object.observerAction) {
                object.observerAction = publisher.register([this.statePath,
                                                            `${this.setpointPath}.${prefix}`
                                                        ], 
                    (newValue) => {this.updateSetPoints(newValue.value, newValue.tag, prefix, blockCondition, this, object)})
                }
            else {}
        }

    publish_CE_desc(object, prefix, checkbox = false) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath,
                `${this.statePath}.${prefix}`,
                                                        this.modePath,
                                                        this.stateFlgPath,
                                                        this.modeFlgPath,
                                                        this.sourceFlgPath,
                                                        this.FCPath,
                                                        this.mskPath  
                                                    ], 
                (newValue) => {this.CE_desc(newValue.value, newValue.tag, prefix, checkbox, this, object)})
            }
        else {}
    }
    publish_CE_off(object, prefix) {
        if (!object.observerAction3) {
            object.observerAction3 = publisher.register([this.offStatus,
                                                    ], 
                (newValue) => {this.CE_off(newValue.value, newValue.tag, prefix, this, object)})
            }
        else {}
    }
    CE_off(value, state, prefix, context, object) {
        if(accessData.boolValue(`${this.offStatus}.${prefix}`)) {
             RGBAColoring(object.off, colors.CE.redColor, "FillColor");
        }
        else {
             RGBAColoring(object.off, colors.VLV.Fillstate.open, "FillColor");
        }
  
    }
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {

            title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            subtitle.access.setStringValue('????????????????????????????????????????????????????????', "Text");
        }
    }

    updateSetPoints(value, state, prefix, blockCondition, context, object) {
        if(getSignalQuality(state)) {
            let block = (blockCondition.length > 0) ? getBlockResult(blockCondition, context.processStateBits()) : false;
            let SET = context.readSetpoints();
            object.set.value.setStringValue(SET[prefix].value.toFixed(SET[prefix].fracdigits), "Text");
            object.eunit.setStringValue(SET[prefix].eunit, "Text")
            RGBAColoring(object.eunit, colors.SERVICE.Goodqual.text, "TextColor")
            !block ? RGBAColoring(object.set.value, colors.SERVICE.Sets.Good, "FillColor") : RGBAColoring(object.set.value, colors.SERVICE.Sets.inact, "FillColor");
        }
        else {
           RGBAColoring(object.eunit, colors.SERVICE.Badqual.text, "TextColor")
           RGBAColoring(object.set.value, colors.SERVICE.Sets.Bad, "FillColor")
            object.set.value.setStringValue("???.???", "Text");
        }
    }

    updateCustomTag(value, path, context, object) {
    if (getSignalQuality(path)) {
        if (object.value && object.value.setStringValue) {
            object.value.setStringValue(value !== null ? value.toString() : "", "Text");
        } 
        else if (object.setStringValue) {
            object.setStringValue(value !== null ? value.toString() : "", "Text");
        }
    }
    else {
        }
}
}


