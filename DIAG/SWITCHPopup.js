#INCLUDE "ObservablePopup.js"

/**
 * Класс для попапа коммутатора
 * @class SWITCHPopup
 * @extends ObservablePopup
 */
class SWITCHPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        //this.setupSignalsPath();
        this.initialize();
        publisher.register([`${context.rootPath}.Link`], (newValue) => {context.updatePopupText(newValue.quality)}, 'q');

    }
initialize() {
    output_Title.title.access.setStringValue("Коммутатор", "Text");
    output_Title.subtitle.access.setStringValue(accessData.stringValue(`${this.rootPath}.Name_Object1`), "Text");
  
    this.config.code = 'codes.RACKF';
     
    }
//#region PublishFunctions
    //#region object_channel
    publish_updateSystemText(object) {
        if (!object.observerAction) {
                object.observerAction = publisher.register([`${this.rootPath}.system.sysDescr`,],
                (newValue) => {this.updateSystemText(newValue.quality, newValue.tag, this, object)}, 'q')
            
        }
        else {}
    }
    publish_updateTimeValue(object) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([`${this.rootPath}.system.sysUpTime`], 
                (newValue) => {this.updateTimeValue(newValue.value, newValue.quality, newValue.tag, this, object, objectName)})
            }
        else {}
    }

    publish_updatePortText(object,port) {
        if (!object.observerAction1) {
                object.observerAction1 = publisher.register([`${this.rootPath}.Link`,],
                (newValue) => {this.updatePortText(newValue.quality, `${this.rootPath}.interfaces.ifDescr.port${port}`, this, object, port)}, 'q')
            
        }
        else {}
    }
    publish_updatePortValue(object,port) {
        if (!object.observerAction2) {
                object.observerAction2 = publisher.register([`${this.rootPath}.interfaces.ifAdminStatus.port${port}`,
                                                            `${this.rootPath}.interfaces.ifSpeed.port${port}`,
                                                            `${this.rootPath}.interfaces.ifLastChange.port${port}`,
                                                            `${this.rootPath}.interfaces.ifInDiscards.port${port}`,
                                                            `${this.rootPath}.interfaces.ifOutDiscards.port${port}`,
                                                            `${this.rootPath}.interfaces.ifInOctets.port${port}`,
                                                            `${this.rootPath}.interfaces.ifOutOctets.port${port}`,
                                                            `${this.rootPath}.interfaces.ifOperStatus.port${port}`],
                (newValue) => {this.updatePortValue(newValue.value, newValue.quality, newValue.tag, this, object, port)})
            
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
            output_Title.title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            output_Title.subtitle.access.setStringValue('?????????????????????????????????????????????????????????', "Text");

        }
    }

    updateSystemText(quality, path, context, object) {
        if (quality) {
             object.sysDescr.setStringValue(accessData.stringValue(`${context.rootPath}.system.sysDescr`), "Text");
        }
        else {
            object.sysDescr.setStringValue('?????????????????????????????????????????????????????????', "Text");
        }
    }
    updateTimeValue(value, quality, path, context, object, objectName) {
        if (quality) 
          object.setStringValue(accessData.stringValue(`${context.rootPath}.system.sysUpTime.Display`), "Text");  
        else
            object.setStringValue("?????????????????", "Text");        
    }

    updatePortText(quality, path, context, object, port) {
        if (quality) {
            object.ifName.setStringValue(accessData.stringValue(`${context.rootPath}.interfaces.ifDescr.port${port}.Name_Object1`), "Text");
            object.ifDescr.setStringValue(accessData.stringValue(`${context.rootPath}.interfaces.ifDescr.port${port}.Name_Object`), "Text");
        }
        else {
            object.ifName.setStringValue('?????????????????????????????????????????????????????????', "Text");
        }
    }
    updatePortValue(value, quality, path, context, object, port) {
        if (quality) {
            if(path==`${this.rootPath}.interfaces.ifAdminStatus.port${port}`) {
                switch(accessData.doubleValue(`${context.rootPath}.interfaces.ifAdminStatus.port${port}`)) {
                        case(1):
                            object.ifAdminStatus.setStringValue("up", "Text")
                            RGBAColoring(object.ifAdminStatus, colors.DIAG.state.inf, "TextColor");
                            break;
                        case(2):
                            object.ifAdminStatus.setStringValue("down", "Text")
                            RGBAColoring(object.ifAdminStatus, colors.DIAG.state.alm, "TextColor");
                            break;
                        case(3):
                            object.ifAdminStatus.setStringValue("testing", "Text")
                            RGBAColoring(object.ifAdminStatus, colors.DIAG.state.testing, "TextColor");
                            break;
                        default:
                            object.ifAdminStatus.setStringValue("Н/Д", "Text")
                            RGBAColoring(object.ifAdminStatus, colors.DIAG.state.text, "TextColor");
                            break;
                }
            }
            else if (path==`${this.rootPath}.interfaces.ifSpeed.port${port}`)
                object.ifSpeed.setStringValue(accessData.doubleValue(`${context.rootPath}.interfaces.ifSpeed.port${port}`)/1000000, "Text");
            else if (path==`${this.rootPath}.interfaces.ifLastChange.port${port}`)
                object.ifLastChanges.setStringValue(accessData.doubleValue(`${context.rootPath}.interfaces.ifLastChange.port${port}.Display`), "Text");  
            else if (path==`${this.rootPath}.interfaces.ifInDiscards.port${port}`)
                object.ifInDiscards.setStringValue(accessData.doubleValue(`${context.rootPath}.interfaces.ifInDiscards.port${port}`), "Text"); 
            else if (path==`${this.rootPath}.interfaces.ifOutDiscards.port${port}`)
                object.ifOutDiscards.setStringValue(accessData.doubleValue(`${context.rootPath}.interfaces.ifOutDiscards.port${port}`), "Text"); 
            else if (path==`${this.rootPath}.interfaces.ifInOctets.port${port}`){
                object.ifInOctets.setStringValue((accessData.doubleValue(`${context.rootPath}.interfaces.ifInOctets.port${port}`)/1000000).toFixed(2), "Text"); 
            }
            else if (path==`${this.rootPath}.interfaces.ifOutOctets.port${port}`){
                object.ifOutOctets.setStringValue((accessData.doubleValue(`${context.rootPath}.interfaces.ifOutOctets.port${port}`)/1000000).toFixed(2), "Text"); 
            }
            else if (path==`${this.rootPath}.interfaces.ifOperStatus.port${port}`){
       
             switch(accessData.doubleValue(`${context.rootPath}.interfaces.ifOperStatus.port${port}`))
            {
                case(1):
                object.ifOperStatus.setStringValue("up", "Text")
                RGBAColoring(object.ifOperStatus, colors.DIAG.state.inf, "TextColor");
                break;
                case(2):
                object.ifOperStatus.setStringValue("down", "Text")
                RGBAColoring(object.ifOperStatus, colors.DIAG.state.alm, "TextColor");
                break;
                case(3):
                object.ifOperStatus.setStringValue("testing", "Text")
                RGBAColoring(object.ifOperStatus, colors.DIAG.state.testing, "TextColor");
                break;
                default:
                object.ifOperStatus.setStringValue("Н/Д", "Text")
                RGBAColoring(object.ifOperStatus, colors.DIAG.state.text, "TextColor");
                break;
            }
        }
        object.Num.setStringValue(port, "Text"); 
    } 
        
        else
            {
            object.ifAdminStatus.setStringValue("?????????????????", "Text");        
            object.ifSpeed.setStringValue("?????????????????", "Text");  
            object.ifLastChanges.setStringValue('?????????????????????????????????????????????????????????', "Text");
            object.ifInDiscards.setStringValue('?????????????????????????????????????????????????????????', "Text");
            }
      
}
    // status(object, context, port, name){
    //          switch(accessData.doubleValue(`${context.rootPath}.interfaces.${name}.port${port}`))
    //         {
    //             case(1):
    //             `object.${name}`.setStringValue("up", "Text")
    //             RGBAColoring(`object.${name}`, colors.DIAG.state.inf, "TextColor");
    //             break;
    //             case(2):
    //             `object.${name}`.setStringValue("down", "Text")
    //             RGBAColoring(`object.${name}`, colors.DIAG.state.alm, "TextColor");
    //             break;
    //             case(3):
    //             `object.${name}`.setStringValue("testing", "Text")
    //             RGBAColoring(`object.${name}`, colors.DIAG.state.testing, "TextColor");
    //             break;
    //             default:
    //             `object.${name}`.setStringValue("Н/Д", "Text")
    //             RGBAColoring(`object.${name}`, colors.DIAG.state.text, "TextColor");
    //             break;
    //         }
    // }

}