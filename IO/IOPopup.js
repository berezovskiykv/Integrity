#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа сигналов i/O
 * @class IOPopup
 * @extends ObservablePopup
 */
class IOPopup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.initialize();
       publisher.register([`${context.rootPath}.Name_Object`], (newValue) => {context.updatePopupText(newValue.quality)}, 'q');
        this.pars();
        diagram.setSize(1148,65+20*this.point.length);
        diagram.setDiagramSize(1148,65+20*this.point.length);
   
        
    }

    initialize() {
        Title.title.access.setStringValue(accessData.stringValue(`${this.rootPath}.Name_Object`), "Text");
       // Title.title.access.setStringValue(`${this.rootPath}`, "Text");
        Title.subtitle.access.setStringValue(accessData.stringValue(`${this.rootPath}.Name_Object1`), "Text");
        this.map_pars = new Map();
        
    }

    pars(){
        let j=0;
        this.point = accessData.stringValue(`${this.rootPath}.Point_Module`);
        this.point = this.point.split(", ");
       
        for(let i=0;i<this.point.length;i++)
        {
            this.map_pars.set(`ch${i+1}`, {
            root: '',
            tag: '',
            id: '',
            descr: '',
            nobj: '',
            nobj1: '',
            modtype: ''
            });
        }
        for(const[key,value] of this.map_pars.entries()) {
            value.id = this.point[j];
            this.channel = value.id.split(":");
            this.mod = this.channel[0].split("_")
            this.word = this.channel[0].replace("ASUTP","RSU.AC1");
            this.word = this.word.replace("PAZ","PAZ.AC1")
            this.channel[0] = this.word;
            value.root = 'KSPG.Diag.' + this.channel[0];
            if(this.channel[1].includes("AnalogIn")) {
                value.modtype = 'a';
                this.channel[1] = this.channel[1].replace("AnalogIn","Out_");
                for(let i=1; i<9;i++){
                    this.channelTag = 'KSPG.Diag.' + this.channel[0] + '.channel' + i + '.ID';
                    if(this.channel[1] == accessData.stringValue(this.channelTag)){
                        value.id =  i;
                        value.tag=value.root+'.channel' + i;
                      
                    value.descr = accessData.stringValue(`${value.tag}.Description`);
                    value.nobj = accessData.stringValue(`${value.tag}.Name_Object`);
                    value.nobj1 = accessData.stringValue(`${value.tag}.Name_Object1`);
                    }
                }
            }
            else {
                if(this.channel[1].includes("DigOut")) 
                    this.channel[1] = this.channel[1].replace("DigOut","DigOutState");
                value.modtype = 'd';
                for(let i=1; i<64;i++){
                    this.channelTag = 'KSPG.Diag.' + this.channel[0] + '.channel' + i + '.ID';
                    if(this.channel[1] == accessData.stringValue(this.channelTag)){
                        value.id =  i;
                        value.tag=value.root+'.channel' + i;
                    value.descr = accessData.stringValue(`${value.tag}.Description`);
                    value.nobj = accessData.stringValue(`${value.tag}.Name_Object`);
                    value.nobj1 = accessData.stringValue(`${value.tag}.Name_Object1`);
                    }
                }
            
            }
        j++;
            }
           
    }

    publish_updateText(object) {

        if (!object.observerAction1) {
              for(const[key,value] of this.map_pars.entries()){
                let chTag = this.map_pars.get(key);
                let n=key.replace("ch", "");
                object.observerAction1 = publisher.register([chTag.tag],
                (newValue) => {this.updateChannelText(newValue.quality, value.tag, this, chTag, object, key,n)}, 'q')  

            }
                
        }
        else {}
    }

    publish_updateChannelValue(object) {
        if (!object.observerAction2) {
             for(const[key,value] of this.map_pars.entries()){
                let chTagVal = this.map_pars.get(key);
                let n=key.replace("ch", "");
                object.observerAction2 = publisher.register([chTagVal.tag,],
                (newValue) => {this.updateChannelValue(newValue.value, newValue.quality, newValue.tag, this, object, key, chTagVal,n)})
             }
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
            Title.title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            //Title.title.access.setStringValue(`${this.rootPath}`, "Text");
            Title.subtitle.access.setStringValue('?????????????????????????????????????????????????????????', "Text");

        }
    }
    updateChannelText(quality, path, context, chVal, object,key,n) {
        
        if (quality) {
            object[key].ValueAP.setVisible(false)
            object[key].ValueDP.setVisible(false)
            object[key].Desc.setStringValue(chVal.descr, "Text");
            object[key].Clem.setStringValue(chVal.nobj1, "Text");
            object[key].Field.setStringValue(chVal.nobj, "Text");
            object[key].PLC.setStringValue((accessData.stringValue(`${chVal.root}.Description`)).replace('Диагностика. ', '').replace('Шкаф ', ''), "Text");
           object[key].Chan.setStringValue(chVal.id, "Text");
           
           (((Number(n)) % 2) > 0 ) ? RGBAColoring(object[key].Background, colors.DIAG.lines.line1, "FillColor") : RGBAColoring(object[key].Background, colors.DIAG.lines.line2, "FillColor");
            if(chVal.modtype=='a')
                object[key].ValueAP.setVisible(true)
            else {
                object[key].ValueDP.setVisible(true)
            }
        }
        else {
            object[key].Desc.setStringValue('?????????????????????????????????????????????????????????', "Text");
            object[key].Clem.setStringValue('?????????????????????', "Text");
            object[key].Field.setStringValue('????????????????????', "Text");
            object[key].PLC.setStringValue('???????????????????????', "Text");
            object[key].Chan.setStringValue('???????????????????????', "Text");
            RGBAColoring(object[key].Background, colors.SERVICE.Badqual.field, "FillColor")
        }
    }


    updateChannelValue(value, quality, path, context, object, key, chTagVal, n){
        if (quality) {
            if(chTagVal.modtype=='a') {
                (((Number(n)+1) % 2) > 0 ) ? RGBAColoring(object[key].ValueDP, colors.DIAG.lines.line1, "FillColor") : RGBAColoring(object[key].ValueDP, colors.DIAG.lines.line2, "FillColor");
                object[key].ValueAP.Value.setStringValue(accessData.doubleValue(chTagVal.tag).toFixed(3), "Text"); 
            }   
            else {
                if(accessData.doubleValue(chTagVal.tag)) {
                    RGBAColoring(object[key].ValueDP, colors.DIAG.state.dp, "FillColor");
                }
                else {
                    (((Number(n)+1) % 2) > 0 ) ? RGBAColoring(object[key].ValueDP, colors.DIAG.lines.line1, "FillColor") : RGBAColoring(object[key].ValueDP, colors.DIAG.lines.line2, "FillColor");
                    //object.ValueAP.Value.setStringValue("", "Text"); 
                }
            }
        }
        else {
            object[key].ValueAP.Value.setStringValue('???.???', "Text");
            (((Number(n)+1) % 2) > 0 ) ? RGBAColoring(object[key].ValueDP, colors.DIAG.lines.line1, "FillColor") : RGBAColoring(object[key].ValueDP, colors.DIAG.lines.line2, "FillColor");
        }
    }
}