#INCLUDE "ObservableObject.js"
#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "Elem/TS8.js"
#INCLUDE "DIAG/LinkDiag.js"

#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "diag";
[position, diagNameMouse] = currentPositionPRJ();
active = true;
#ONCE_EXECUTION_END
// active = isDiagramActive(diagName, position);

/** Класс состояния ПЛК
 * @class StatePLC
 * @extends ObservableObject
 */
class StatePLCClass extends ObservableObject {

    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.statePath = `${this.config.rootPath}.Status1`
        this.config.code = accessData.stringValue(`${this.config.rootPath}.Type`);
        this.config.popup = accessData.stringValue(`${this.config.rootPath}.Popup`);
        this.currentState = this.getInitialState();
        this.config.qualityTag = `${this.config.rootPath}.Status1`;
    }

    readCurrentState() {
        var newState = {
            state: accessData.doubleValue(this.statePath),
            timestamp: new Date().getTime()
        }
        return newState;
    }

    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    return true;
                }
                return false;
            }
            else {
                clickClear(this.object, this.object.name + ".click")
                //this.updateBadQuality()
                this.currentState = this.getInitialState()
            }    
        }
        else return;
    }


    // determineState() {
    //     let state = accessData.intValue(this.statePath)
    //     if (state=== null || state === undefined) return;
    //     let defineState = (index, fieldCLR, textCLR) => {
    //         return {
    //             sts     : accessData.boolValue(`${this.statePath}.${index}`),
    //             descr   : accessData.stringValue(`${this.statePath}.${index}.Description`),
    //             fieldCLR, textCLR
    //         }
    //     }
    //     return {
    //         0 : defineState('None', colors.DIAG.PLCState.almField, colors.DIAG.PLCState.almText),
    //         1 : defineState('Active', colors.DIAG.PLCState.actField, colors.DIAG.PLCState.actText),
    //         2 : defineState('Standby', colors.DIAG.PLCState.resField, colors.DIAG.PLCState.resText),
    //         3 : defineState('StanAlone', colors.DIAG.PLCState.almField, colors.DIAG.PLCState.almText),
    //         4 : defineState('StandbyBlock', colors.DIAG.PLCState.almField, colors.DIAG.PLCState.almText),
    //         5 : defineState('StandbyBlockNoActive', colors.DIAG.PLCState.almField, colors.DIAG.PLCState.almText)
    //     }
    // }

    updateVisuals() {
        // let PLCStatus = this.determineState();
        // environment.logInfo(S(`${this.config.rootPath}.Status1`));
        this.object.Err.setVisible(((S(`${this.config.rootPath}.Status1`) > 32) && 
                                !(S(`${this.config.rootPath}.Status1`) & 256) && 
                                !(S(`${this.config.rootPath}.Status1`) & 8388608)) || 
                                (accessData.signalQuality(`${this.config.rootPath}.Status1`).indexOf('Good') != 0));
        // for (let i = 0; i < 6; i++) {
        //     if (PLCStatus[i].sts) {
        //         this.object.setStringValue(wrapTextCustom(PLCStatus[i].descr), "Text");
        //         RGBAColoring(this.object, PLCStatus[i].fieldCLR, "FillColor")
        //         RGBAColoring(this.object, PLCStatus[i].textCLR, "TextColor")
            // }
        // }
    }

    // updateBadQuality() {
    //     this.object.setStringValue("????????????????", "Text");
    //     RGBAColoring(this.object, colors.DIAG.PLCState.defField, "FillColor")
    //     RGBAColoring(this.object, colors.DIAG.PLCState.defText, "TextColor")
    // }


}

/** Класс диаагностики модуля 
 * @class Module
 * @extends ObservableObject
 */
class DiagModuleClass extends ObservableObject {

    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.ID = accessData.stringValue(`${this.config.rootPath}.Name_Object1`).replace("AC1","");
        this.config.description = accessData.stringValue(`${this.config.rootPath}.Description`);
        this.config.popup = accessData.stringValue(`${this.config.rootPath}.Popup`);
        //this.config.code = 'codes.RACKF'
        // this.config.name = this.object.name;
        this.currentState = this.getInitialState();
        this.config.qualityTag = `${this.config.rootPath}.MStatus`;
        this.setupSignalPaths();
        //this.copyState(this.currentState, this.previousState);
        this.MapCurrentState = new Map();
        this.MapNewState = new Map();
        this.channelKeys = [];
        this.channelScanIntervalMs = 200;
        this.lastChannelScanTs = 0;
        this.forceChannelScan = true;
        this.sw=0;
        // this.chState = {
        //      value: null,
        //     hasChanged: false
        // }
        if(this.config.moduleType=='d'){
            for(let i=0;i<64;i++)
            {
                const channelKey = `channel${i+1}`;
                this.channelKeys.push(channelKey);
                this.MapCurrentState.set(`channel${i+1}`, {
                // value: accessData.IntValue(`${this.config.rootPath}.channel${i+1}`),
                    value: null,
                    hasChanged: false
                });
                this.MapNewState.set(`channel${i+1}`, {
                // value: accessData.IntValue(`${this.config.rootPath}.channel${i+1}`),
                value: null, 
                hasChanged: false
                });
            }
        }

    }
   
    /** Настраивает пути к сигналам */
    setupSignalPaths() {
        this.statePath = this.config.rootPath;
        this.faultPath = `${this.config.rootPath}.MStatus`;
        this.config.qualityTag = `${this.config.rootPath}.MStatus`;
    }

    readCurrentState() {
        const nowTs = Date.now();
        var newState = {
            state: accessData.doubleValue(this.statePath),
            fault: accessData.doubleValue(this.faultPath),
            
            timestamp: nowTs,
            channelChanged: false
        };

        if (this.config.moduleType == 'd') {
            const shouldScanChannels =
                this.forceChannelScan ||
                (newState.state !== this.currentState.state) ||
                (newState.fault !== this.currentState.fault) ||
                (nowTs - this.lastChannelScanTs >= this.channelScanIntervalMs);

            if (shouldScanChannels) {
                for (const key of this.channelKeys) {
                    const nextValue = accessData.doubleValue(`${this.config.rootPath}.${key}`);
                    const currentChannelState = this.MapCurrentState.get(key);
                    const channelChanged = currentChannelState.value !== nextValue;

                    this.MapNewState.get(key).value = nextValue;
                    currentChannelState.value = nextValue;
                    currentChannelState.hasChanged = channelChanged || this.forceChannelScan;
                    if (channelChanged) {
                        newState.channelChanged = true;
                    }
                }
                this.lastChannelScanTs = nowTs;
            }
        }

        return newState;

    }
    hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.fault !== this.currentState.fault ||
            newState.quality !== this.currentState.quality) {
            return true;
        }

        if (this.config.moduleType == 'd' && newState.channelChanged) {
            return true;
        }

        return false;
    }
    updateText() {
        // this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

   updateBadQuality(){
        // this.object.setStringValue("???????", "ID.Text");
        this.object.setStringValue("", "click.Tooltip");
        // Цвет общего фона
        this.changeColor(this.object.body, colors.SERVICE.Badqual.field, "FillColor");
        if(this.config.moduleType=='d'){
            for(const[key,value] of this.MapCurrentState.entries())
            {
              this.changeColor(this.object[key], colors.SERVICE.Badqual.field, "FillColor");
            }
        }
        
    }

/** Обновляет визуальные элементы */
    updateVisuals() {
        // Обновление битов состояния
        //Изменение видимости
        this.changeVisibility(this.object.Err, S(`${this.config.rootPath}.MStatus`));
        if(this.config.moduleType=='d')
            this.DiscretMod(object);
        // if (S(`${this.config.rootPath}.Link`))
        // this.changeVisibility(this.object.Link, false);
        // else 
        // this.changeVisibility(this.object.Link, true);


    }
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
        if(this.config.moduleType=='SW'){
            if (newState.fault==0){
                this.lin=0;
            }
            else 
                this.lin=1;
        }

        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                // this.object.start = this.updateText();
                this.updateText();
                this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    this.forceChannelScan = false;
                    return true;
                }   

                return false;
            }
            else {
                clickClear(this.object, this.object.name + ".click")
                this.updateBadQuality()
                this.currentState = this.getInitialState()
                this.forceChannelScan = true;
            }
        }
        else return;


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
 /** Изменяет видимость указанного свойства */
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
    DiscretMod(object){
            for(const[key,value] of this.MapCurrentState.entries())
        {
              if (!value.hasChanged) {
                  continue;
              }
              if(value.value)
              this.changeColor(this.object[key], colors.DIAG.state.dp, "FillColor");
            else {
                 this.changeColor(this.object[key], colors.DIAG.lines.line1, "FillColor");
            }
            value.hasChanged=false;
            
        }
    }



}

/** Класс диагностики линков
 * @class Link
 * @extends ObservableObject
 */
class LinkClass extends ObservableObject {

    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.port = this.config.port;
        this.end_port=this.config.end_port;
        this.start_port=this.config.start_port;
        this.sw = this.config.sw;
        this.adminstatus = `${this.config.rootPath}.${this.start_port}.interfaces.ifAdminStatus.port${this.port}`;
        this.operstatus = `${this.config.rootPath}.${this.start_port}.interfaces.ifOperStatus.port${this.port}`;
        this.ARM = `${this.config.rootPath}.${this.end_port}`;
        this.adminstatus2 = `${this.config.rootPath}.${this.end_port}.interfaces.ifAdminStatus.port${this.sw}`;
        this.operstatus2 = `${this.config.rootPath}.${this.end_port}.interfaces.ifOperStatus.port${this.sw}`;
        this.currentState = this.getInitialState();
    }

    getInitialState() {
        
        return {
            adminstatus: null,
            operstatus: null,
            adminstatus2: null,
            operstatus2: null,
            ARM: null,
            timestamp: null
        };
    }
    readCurrentState() {
        var newState = {
            adminstatus: accessData.doubleValue(this.adminstatus),
            operstatus: accessData.doubleValue(this.operstatus),
            adminstatus2: accessData.doubleValue(this.adminstatus2),
            operstatus2: accessData.doubleValue(this.operstatus2),
            ARM: accessData.boolValue(this.ARM),
            timestamp: new Date().getTime()
        };
         
        return newState;

    }
    hasStateChanged(newState) {
        if (newState.adminstatus !== this.currentState.adminstatus ||
            newState.DA !== this.currentState.DA ||
            newState.adminstatus2 !== this.currentState.adminstatus2 ||
            newState.operstatus2 !== this.currentState.operstatus2 ||
            newState.ARM !== this.currentState.ARM ||
            newState.operstatus !== this.currentState.operstatus) {
            return true;
        }
        
        return false;
    }
    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
            if (active) {
            if (getSignalQuality(this.adminstatus) || getSignalQuality(this.operstatus)) {
              
               // this.object.start = this.updateText();
               // this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    return true;
                }
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

    updateText() {
        //this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

   updateBadQuality(){
        this.object.setStringValue("", "click.Tooltip");
        RGBAColoring(this.object, colors.Link.state.bad, "LineColor");
    }

/** Обновляет визуальные элементы */
    updateVisuals() {
   
        if(this.sw=='sw2')
       {
            if((accessData.stringValue(this.adminstatus)==1) && (accessData.stringValue(this.operstatus)==1) && accessData.boolValue(this.ARM))
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "LineColor");
            else
            RGBAColoring(this.object, colors.AP.Flt.act, "LineColor");
       }
       else if(this.sw=='sw1'){
          if((accessData.stringValue(this.adminstatus)==1) && (accessData.stringValue(this.operstatus)==1))
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "LineColor");
            else
            RGBAColoring(this.object, colors.AP.Flt.act, "LineColor");
       }
       else
       {
            if((accessData.stringValue(this.adminstatus)==1) && (accessData.stringValue(this.operstatus)==1) && accessData.stringValue(this.adminstatus2)==1 && accessData.stringValue(this.operstatus2)==1)
            RGBAColoring(this.object, colors.VLV.Fillstate.open, "LineColor");
            else
            RGBAColoring(this.object, colors.AP.Flt.act, "LineColor");
       }

       
    }
}
class LinkLsuClass extends ObservableObject {

    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.port = this.config.port;
        this.end_port=this.config.end_port;
        this.start_port=this.config.start_port;
        this.sw = this.config.sw;
        this.adminstatus = `${this.config.rootPath}.${this.start_port}.interfaces.ifAdminStatus.port${this.port}`;
        this.operstatus = `${this.config.rootPath}.${this.start_port}.interfaces.ifOperStatus.port${this.port}`;
        this.LSU = `KSPG.${this.end_port}`;
        this.currentState = this.getInitialState();
        this.config.code = 'codes.TS8'
    
    }

    getInitialState() {
        
        return {
            adminstatus: null,
            operstatus: null,
            LSU: null,
            timestamp: null
        };
    }
    readCurrentState() {
        var newState = {
            adminstatus: accessData.doubleValue(this.adminstatus),
            operstatus: accessData.doubleValue(this.operstatus),
            LSU: accessData.doubleValue(this.LSU),
            timestamp: new Date().getTime()
        };
         
        return newState;

    }
    hasStateChanged(newState) {
        if (newState.adminstatus !== this.currentState.adminstatus ||
            newState.LSU !== this.currentState.LSU ||
            newState.operstatus !== this.currentState.operstatus) {
            return true;
        }
        
        return false;
    }
    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
            if (active) {
            if (getSignalQuality(this.adminstatus) || getSignalQuality(this.operstatus) || getSignalQuality(this.LSU)) {
              
               // this.object.start = this.updateText();
               // this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    return true;
                }
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

    updateText() {
        //this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

   updateBadQuality(){
        this.object.setStringValue("", "click.Tooltip");
        RGBAColoring(this.object, colors.Link.state.bad, "LineColor");
    }

/** Обновляет визуальные элементы */
    updateVisuals() {
    if((accessData.stringValue(this.adminstatus)==1) && (accessData.stringValue(this.operstatus)==1) && (this.processStateLSU()[this.config.prefix]  || this.processStateLSU()[this.config.prefix2]))
        RGBAColoring(this.object, colors.VLV.Fillstate.open, "LineColor");
    else
        RGBAColoring(this.object, colors.AP.Flt.act, "LineColor");
    if(this.processStateLSU()[this.config.prefix]  || this.processStateLSU()[this.config.prefix2])
        RGBAColoring(this.object, colors.VLV.Fillstate.open, "body.FillColor");
    else
        RGBAColoring(this.object, colors.Link.state.bad, "body.FillColor");
    }

    processStateLSU() {
        let lsu = accessData.doubleValue(this.LSU);
        if (lsu === null || lsu === undefined) return; 
        return {
            lspg              :   !!(lsu & (S(`${this.config.code}.Status1.Out01`))),
            bpaiv_azot        :   !!(lsu & (S(`${this.config.code}.Status1.Out02`))),
            bpaiv_air         :   !!(lsu & (S(`${this.config.code}.Status1.Out03`))),
            birgeo            :   !!(lsu & (S(`${this.config.code}.Status1.Out04`))),
            eo                :   !!(lsu & (S(`${this.config.code}.Status1.Out06`))),
            bo                :   !!(lsu & (S(`${this.config.code}.Status1.Out07`))),
            sk                :   !!(lsu & (S(`${this.config.code}.Status1.Out08`))),
            owen              :   !!(lsu & (S(`${this.config.code}.Status1.Out01`))),
            bkk_a1            :   !!(lsu & (S(`${this.config.code}.Status1.Out02`))),
            bkk_a2            :   !!(lsu & (S(`${this.config.code}.Status1.Out03`))),
            stn3000           :   !!(lsu & (S(`${this.config.code}.Status1.Out04`))),
            knspt             :   !!(lsu & (S(`${this.config.code}.Status1.Out05`))),
            apk               :   !!(lsu & (S(`${this.config.code}.Status1.Out06`)))
        }
    }
}
class SwitchClass extends ObservableObject {

    initialize() {
        this.config.rootPath = getAliasesPath(this.object);
        this.config.ID = accessData.stringValue(`${this.config.rootPath}.ID`);
        this.statePath = `${this.config.rootPath}.Link`;
        this.valuePath = `${this.config.rootPath}.Link`;
        this.config.description = accessData.stringValue(`${this.config.rootPath}.Description`);
        this.config.popup = accessData.stringValue(`${this.config.rootPath}.Popup`);
// this.config.popup = 'SWITCH14';
        
        this.currentState = this.getInitialState();
        this.config.qualityTag = this.statePath;
        this.date = `${this.config.rootPath}.hrSystem.hrSystemDate.Display`;
        

    }
       getInitialState() {
        return {
            quality: null,
            value: null,
            state: null,
            fault: null,
            date: null,
            timestamp: null
        };
    }
    readCurrentState() {
        var newState = {
            state: accessData.boolValue(this.statePath),
            quality: getSignalQuality(this.config.qualityTag),
            date: accessData.stringValue(this.date),
            timestamp: new Date().getTime()
        };
        return newState;

    }
    hasStateChanged(newState) {
        if (newState.value !== this.currentState.value ||
            newState.state !== this.currentState.state ||
            newState.date !== this.currentState.date ||
            newState.quality !== this.currentState.quality) {
            return true;
        }
        
        return false;
    }

    /** Проверяет обновления параметра
     * @returns {Boolean} true, если состояние изменилось
     */
    checkForUpdates() {
        var newState = this.readCurrentState();
        var hasChanged = this.hasStateChanged(newState);
     //   object.ID.setStringValue(this.statePath, "Text");
        if (active) {
            if (getSignalQuality(this.config.qualityTag)) {
                this.object.start = this.updateText();
                this.openPopup();
                if (hasChanged) {
                    this.currentState = newState;
                    this.onStateChanged();
                    return true;
                }
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

    updateText() {
        this.object.setStringValue(this.config.ID, "ID.Text");
        this.object.setStringValue(this.config.description, "click.Tooltip");
        return true;
    }

   updateBadQuality(){
        this.object.setStringValue("", "click.Tooltip");
    }

/** Обновляет визуальные элементы */
    updateVisuals() {
        if(accessData.boolValue(this.valuePath))
        this.object.Link.setVisible(false)
        else
        this.object.Link.setVisible(true)
        //    this.changeVisibility(this.object.Link, !accessData.boolValue(`${this.config.rootPath}.Link`));
        if(this.config.moduleType=='ARM'){
            this.object.setStringValue(accessData.stringValue(this.date), "date.Text");
            this.object.setStringValue(accessData.stringValue(`${this.config.rootPath}.systemStats.cpu_total`)+' %', "cp.Text");
        }
    }    
    //}
 /** Изменяет видимость указанного свойства */
    changeVisibility(child, condition) {
        if (child) {
            child.access.setVisible(condition);
        }
    }
}
function PLCState(object) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new StatePLCClass(object, {});
    }
    object.parameter.checkForUpdates();
}

function MODULE (object, module) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new DiagModuleClass(object, {'moduleType': module});
    }

    object.parameter.checkForUpdates();
}
function SWITCH(object, module) {
    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new SwitchClass(object, {'moduleType': module});
    }
    object.parameter.checkForUpdates();
}

function SWITCH_Link(object, port, start_port, end_port, sw) {

    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new LinkClass(object, {port : port, 
                                                    'start_port': start_port, 
                                                    'end_port':end_port, 
                                                    'sw': sw});
        
    }
    object.parameter.checkForUpdates();
}
function LinkLsu(object, port, start_port, end_port, prefix, prefix2) {

    if (!object.parameter) {
        object.name = objectName;
        object.parameter = new LinkLsuClass(object, {port : port, 
                                                    'start_port': start_port, 
                                                    'end_port':end_port, 
                                                    'prefix': prefix,
                                                    'prefix2': prefix2});
        
    }
    object.parameter.checkForUpdates();
}
function layers(object, objectName, name_layer) {
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'release') {
        if(name_layer == 'VU'){
            layer.setVisible("VU",true);
            layer.setVisible("main",false);
            // VU.Rectangle_6.setDoubleValue(3,"LineWidth")
            // SU.Rectangle_6.setDoubleValue(1,"LineWidth")
        }
        else if(name_layer == 'main') {
            layer.setVisible("VU",false);
            layer.setVisible("main",true);
        }
    }
    if(layer.isVisible("VU")){
        VU.Rectangle_6.setDoubleValue(3,"LineWidth")
        SU.Rectangle_6.setDoubleValue(1,"LineWidth")
    }
    else if (layer.isVisible("main")){
        VU.Rectangle_6.setDoubleValue(1,"LineWidth")
        SU.Rectangle_6.setDoubleValue(3,"LineWidth")
    }

}