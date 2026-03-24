#INCLUDE "ObservablePopup.js"

/**
 * Класс для попапа аналоговых параметров
 * @class DiagModulePopup
 * @extends ObservablePopup
 */
class PC_Popup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        //this.setupSignalsPath();
        this.initialize();
        publisher.register([`${context.rootPath}.Link`], (newValue) => {context.updatePopupText(newValue.quality)}, 'q');

    }

    initialize() {
        outputtitle.title.access.setStringValue("АРМ", "Text");
        outputtitle.subtitle.access.setStringValue(accessData.stringValue(`${this.rootPath}.Name_Object1`), "Text");
   
    }
//#region PublishFunctions
    //#region object_channel
    publish_updateSystemText(object) {
        if (!object.observerAction) {
                object.observerAction = publisher.register([`${this.rootPath}.Link`], 
                (newValue) => {this.updateSystemText(newValue.quality, this, object)}, 'q')
            }
        
        else {}
    }
    publish_updateSystemValue(object) {
        if (!object.observerAction) {
                object.observerAction = publisher.register([`${this.rootPath}.system.sysServices`,
                                                            `${this.rootPath}.hrSystem.hrSystemDate.Display`,
                                                            `${this.rootPath}.hrSystem.hrSystemProcesses`,
                                                            `${this.rootPath}.hrSystem.hrSystemUptime`], 
                (newValue) => {this.updateSystemValue(newValue.value, newValue.quality, newValue.tag, this, object, objectName)})
            }
        
        else {}
    }
    publish_updateCPUdynamicValue(object) {
        if (!object.observerAction) {
                object.observerAction = publisher.register([`${this.rootPath}.systemStats.cpu_user`,
                                                            `${this.rootPath}.systemStats.cpu_total`,
                                                            `${this.rootPath}.systemStats.cpu_system`,
                                                            `${this.rootPath}.systemStats.cpu_idle`], 
                (newValue) => {this.updateCPUdynamicValue(newValue.value, newValue.quality, newValue.tag, this, object, objectName)})
            }
        
        else {}
    }
    publish_updateMemdynamicValue(object) {
        if (!object.observerAction1) {
                object.observerAction1 = publisher.register([`${this.rootPath}.memory.memAvail`,
                                                            `${this.rootPath}.memory.memAvailReal`,
                                                            `${this.rootPath}.memory.memAvailSwap`,
                                                            `${this.rootPath}.memory.memBuffer`,
                                                            `${this.rootPath}.memory.memCached`,
                                                            `${this.rootPath}.memory.memShared`,
                                                            `${this.rootPath}.memory.memTotalFree`,
                                                            `${this.rootPath}.memory.memTotalReal`,
                                                            `${this.rootPath}.memory.memTotalSwap`,
                                                            `${this.rootPath}.memory.memUsedReal`,
                                                            `${this.rootPath}.memory.memUsedSwap`], 
                (newValue) => {this.updateMemdynamicValue(newValue.value, newValue.quality, newValue.tag, this, object, objectName)})
            }
        
        else {}
    }
    publish_updateState(object) {
        if (!object.observerAction2) {
                object.observerAction2 = publisher.register([`${this.rootPath}.systemStats.cpu_user.alm`,
                                                            `${this.rootPath}.memory.memAvail.alm`,
                                                            `${this.rootPath}.systemStats.cpu_total.alm`,
                                                            `${this.rootPath}.systemStats.cpu_system.alm`], 
                (newValue) => {this.updateState(newValue.value, newValue.quality, newValue.tag, this, object)})
            }
        
        else {}
    }
    publish_updateDSKdynamicValue(object,dsk) {
        if (!object.observerAction) {
                object.observerAction = publisher.register([`${this.rootPath}.dskTable.dskDevice.dsk${dsk}`,
                                                            `${this.rootPath}.dskTable.dskAvail.dsk${dsk}`,
                                                            `${this.rootPath}.dskTable.dskPath.dsk${dsk}`,
                                                            `${this.rootPath}.dskTable.dskPercent.dsk${dsk}`,
                                                            `${this.rootPath}.dskTable.dskTotal.dsk${dsk}`,
                                                            `${this.rootPath}.dskTable.dskUsed.dsk${dsk}`    ], 
                (newValue) => {this.updateDSKdynamicValue(newValue.value, newValue.quality, newValue.tag, this, object, dsk)})
            }
        
        else {}
    }
    //#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(quality) {
        if (quality) {
            this.initialize();
        }
        else {
            outputtitle.title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            outputtitle.subtitle.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
        }
    }

    updateSystemText(quality, context, object) {
       if (quality) {
            object.sysName.setStringValue(accessData.stringValue(`${context.rootPath}.system.sysName`), "Text")
            object.sysDescr.setStringValue(accessData.stringValue(`${context.rootPath}.system.sysDescr`), "Text")
       }
       else {
            object.sysName.setStringValue("?????????????????", "Text");
            object.sysDescr.setStringValue("?????????????????", "Text");
        }
    }
     updateSystemValue(value, quality, path, context, object, objectName) {
        if (quality) {
            if(path==`${context.rootPath}.system.sysServices`)
                object.systemServices.setStringValue(accessData.stringValue(`${this.rootPath}.system.sysServices`), "Text");
            else if (path==`${context.rootPath}.hrSystem.hrSystemDate.Display`)
                object.sysDate.setStringValue(accessData.stringValue(path), "Text");
            else if (path==`${context.rootPath}.hrSystem.hrSystemProcesses`)
                object.systemProcesses.setStringValue(accessData.stringValue(`${this.rootPath}.hrSystem.hrSystemProcesses`), "Text");
            else if (path==`${context.rootPath}.hrSystem.hrSystemUptime`)
                object.sysUpTime.setStringValue(accessData.stringValue(`${this.rootPath}.hrSystem.hrSystemUptime.Display`), "Text");
        }
        else {
            object.systemServices.setStringValue("?????????????????", "Text");
            object.sysDate.setStringValue("?????????????????", "Text");
            object.systemProcesses.setStringValue("?????????????????", "Text");
            object.sysUpTime.setStringValue("?????????????????", "Text");
        }
     }

    updateCPUdynamicValue(value, quality, path, context, object, objectName) {
         if (quality) {
            if(path==`${context.rootPath}.systemStats.cpu_user`)
                object.cpu_us.setStringValue(accessData.stringValue(`${this.rootPath}.systemStats.cpu_user`), "Text");
            else if (path==`${context.rootPath}.systemStats.cpu_total`)
                object.cpu_total.setStringValue(accessData.stringValue(`${this.rootPath}.systemStats.cpu_total`), "Text"); 
            else if (path==`${context.rootPath}.systemStats.cpu_system`)
                object.cpu_sy.setStringValue(accessData.stringValue(`${this.rootPath}.systemStats.cpu_system`), "Text");
            else if (path==`${context.rootPath}.systemStats.cpu_idle`)
                object.cpu_id.setStringValue(accessData.stringValue(`${this.rootPath}.systemStats.cpu_idle`), "Text");
            
                
        }
        else {
            object.cpu_us.setStringValue("?????????????????", "Text");
            object.cpu_total.setStringValue("?????????????????", "Text");
            object.cpu_sy.setStringValue("?????????????????", "Text");
            object.cpu_id.setStringValue("?????????????????", "Text");
            
        }
    }

    updateMemdynamicValue(value, quality, path, context, object, objectName){
            if (quality) {
            if(path==`${context.rootPath}.memory.memAvail`)
            {
                object.memAvail.setStringValue(accessData.doubleValue(`${context.rootPath}.memory.memAvail.Display`).toFixed(2), "Text");
            }
              
            else if (path==`${context.rootPath}.memory.memTotalReal`)
                object.memTotalReal.setStringValue(accessData.doubleValue(`${this.rootPath}.memory.memTotalReal.Display`).toFixed(2), "Text");
            else if (path==`${context.rootPath}.memory.memTotalSwap`)
                object.memTotalSwap.setStringValue(accessData.doubleValue(`${this.rootPath}.memory.memTotalSwap.Display`).toFixed(2), "Text");
            else if (path==`${context.rootPath}.memory.memAvailReal`)
                object.memAvailReal.setStringValue(accessData.doubleValue(`${this.rootPath}.memory.memAvailReal.Display`).toFixed(2), "Text");
            else if (path==`${context.rootPath}.memory.memAvailSwap`)
                object.memAvailSwap.setStringValue(accessData.doubleValue(`${this.rootPath}.memory.memAvailSwap.Display`).toFixed(2), "Text");
            else if (path==`${context.rootPath}.memory.memUsedReal`)
                object.memUsedReal.setStringValue(accessData.doubleValue(`${this.rootPath}.memory.memUsedReal.Display`).toFixed(2), "Text");
            else if (path==`${context.rootPath}.memory.memUsedSwap`)
                object.memUsedSwap.setStringValue(accessData.doubleValue(`${this.rootPath}.memory.memUsedSwap.Display`).toFixed(2), "Text");
            else if (path==`${context.rootPath}.memory.memBuffer`)
                object.memBufCache.setStringValue((accessData.doubleValue(`${this.rootPath}.memory.memBuffer.Display`) + accessData.doubleValue(`${this.rootPath}.memory.memCached.Display`)).toFixed(2), "Text");
        }
    }

    updateState(value, quality, path, context, object){
            if (quality) {
            if(path==`${context.rootPath}.systemStats.cpu_user.alm`)
                context.SetParamColor('systemStats.cpu_user', object,'cpu_us');
            else if (path==`${context.rootPath}.systemStats.cpu_total.alm`)
                context.SetParamColor('systemStats.cpu_total', object, 'cpu_total');
            else if (path==`${context.rootPath}.systemStats.cpu_system.alm`)
                context.SetParamColor('systemStats.cpu_system', object, 'cpu_sy'); 
            else if (path==`${context.rootPath}.memory.memAvail.alm`)
                 context.SetParamColor('memory.memAvail', object,'memAvail');      
        }
        else {
            RGBAColoring(object, colors.SERVICE.Badqual.field, "cpu_us.FillColor");
            RGBAColoring(object, colors.SERVICE.Badqual.field, "cpu_total.FillColor");
            RGBAColoring(object, colors.SERVICE.Badqual.field, "cpu_sy.FillColor");
            RGBAColoring(object, colors.SERVICE.Badqual.field, "memAvail.FillColor");
        }
    }

    updateDSKdynamicValue(value, quality, path, context, object, dsk){
            if (quality) {
            if(path==`${this.rootPath}.dskTable.dskDevice.dsk${dsk}`)
                object.device.setStringValue(accessData.stringValue(`${this.rootPath}.dskTable.dskDevice.dsk${dsk}`), "Text");
             else if (path==`${context.rootPath}.dskTable.dskUsed.dsk${dsk}`)
                object.used.setStringValue((accessData.doubleValue(`${this.rootPath}.dskTable.dskUsed.dsk${dsk}`)/1048576).toFixed(2), "Text");
            else if (path==`${context.rootPath}.dskTable.dskAvail.dsk${dsk}`)
                object.avail.setStringValue(accessData.doubleValue(`${this.rootPath}.dskTable.dskAvail.dsk${dsk}.Display`).toFixed(2), "Text");
            else if (path==`${context.rootPath}.dskTable.dskPercent.dsk${dsk}`)
                object.percent.setStringValue(accessData.doubleValue(`${this.rootPath}.dskTable.dskPercent.dsk${dsk}`), "Text");
            else if (path==`${context.rootPath}.dskTable.dskPath.dsk${dsk}`)
                object.path.setStringValue(accessData.stringValue(`${this.rootPath}.dskTable.dskPath.dsk${dsk}`), "Text");
            else if (path==`${context.rootPath}.dskTable.dskTotal.dsk${dsk}`)
                object.total.setStringValue((accessData.doubleValue(`${this.rootPath}.dskTable.dskTotal.dsk${dsk}`)/1048576).toFixed(3), "Text");
        }
        else {
           
        }
    }



     SetParamColor(tag, object, obj){
        let severity = accessData.stringValue(`${this.rootPath}.${tag}.alm.AE_BitOnSeverity`);
        let almSignal = accessData.boolValue(`${this.rootPath}.${tag}.alm`);
        let color;
        (severity == 1) ? color = colors.DIAG.state.alm : color = colors.DIAG.state.wrn;
        (almSignal) ? RGBAColoring(object, color, `${obj}.FillColor`) : RGBAColoring(object, colors.DIAG.lines.buttonLine, `${obj}.FillColor`)
     }
}