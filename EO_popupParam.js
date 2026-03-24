#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа 
 * @class WordBRPopup
 * @extends ObservablePopup
 */
class EO_popup extends ObservablePopup {
    constructor(publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        publisher.register([context.valuePath], (newValue) => {context.updatePopupText(newValue.quality, context.valuePath)}, 'q')
      
        diagram.setSize(500,30+20*5);
        diagram.setDiagramSize(500,30+20*5);
    }

    setupSignalsPath() {
        this.valuePath = `${this.rootPath}`;
        this.valuePath2 = this.config.word2;
        this.config.Title = accessData.stringValue(`${this.rootPath}.Description`)
        this.config.FracDigits = 2;
        this.cout = 1;
        this.cout2 = 1;
        
    }

    initialize() {
        head.title.access.setStringValue(this.config.Title, "Text");
    }
 /** Устанавливает биты состояния*/
    processStateBits() {
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            b0       :   !!((accessData.boolValue(`${this.rootPath}.b00`))),
            b1        :   !!((accessData.boolValue(`${this.rootPath}.b01`))),
            b2        :   !!((accessData.boolValue(`${this.rootPath}.b02`))),
            b3      :   !!((accessData.boolValue(`${this.rootPath}.b03`))),
            b4    :   !!((accessData.boolValue(`${this.rootPath}.b04`))),
            b5         :  !!((accessData.boolValue(`${this.rootPath}.b05`))),
            b6        :   !!((accessData.boolValue(`${this.rootPath}.b06`))),
            b7        :  !!((accessData.boolValue(`${this.rootPath}.b07`))),
            b8     :   !!((accessData.boolValue(`${this.rootPath}.b08`))),
            b9      :   !!((accessData.boolValue(`${this.rootPath}.b09`))),
            b10      :   !!((accessData.boolValue(`${this.rootPath}.b10`))),
            b11      :   !!((accessData.boolValue(`${this.rootPath}.b11`))),
            b12      :   !!((accessData.boolValue(`${this.rootPath}.b12`))),
            b13       :   !!((accessData.boolValue(`${this.rootPath}.b13`))),
            b14       :   !!((accessData.boolValue(`${this.rootPath}.b14`))),
            b15       :  !!((accessData.boolValue(`${this.rootPath}.b15`))),
            bp0       :   !!((accessData.boolValue(`${this.config.word2}.b00`))),
            bp1        :   !!((accessData.boolValue(`${this.config.word2}.b01`))),
            bp2        :   !!((accessData.boolValue(`${this.config.word2}.b02`))),
            bp3      :   !!((accessData.boolValue(`${this.config.word2}.b03`))),
            bp4    :   !!((accessData.boolValue(`${this.config.word2}.b04`))),
        }
    }
        DetColor() {
        //Биты состояния
        //p.s. двойное отрицание используется для явного приведения к булевому типу
        return {
            b0       :   ((accessData.doubleValue(`${this.rootPath}.b00.Color`))),
            b1        :  ((accessData.doubleValue(`${this.rootPath}.b01.Color`))),
            b2        :  ((accessData.doubleValue(`${this.rootPath}.b02.Color`))),
            b3      :   ((accessData.doubleValue(`${this.rootPath}.b03.Color`))),
            b4    :   ((accessData.doubleValue(`${this.rootPath}.b04.Color`))),
            b5         :  ((accessData.doubleValue(`${this.rootPath}.b05.Color`))),
            b6        :   ((accessData.doubleValue(`${this.rootPath}.b06.Color`))),
            b7        :  ((accessData.doubleValue(`${this.rootPath}.b07.Color`))),
            b8     :   ((accessData.doubleValue(`${this.rootPath}.b08.Color`))),
            b9      :   ((accessData.doubleValue(`${this.rootPath}.b09.Color`))),
            b10      :   ((accessData.doubleValue(`${this.rootPath}.b10.Color`))),
            b11      :   ((accessData.doubleValue(`${this.rootPath}.b11.Color`))),
            b12      :   ((accessData.doubleValue(`${this.rootPath}.b12.Color`))),
            b13       :   ((accessData.doubleValue(`${this.rootPath}.b13.Color`))),
            b14       :   ((accessData.doubleValue(`${this.rootPath}.b14.Color`))),
            b15       :  ((accessData.doubleValue(`${this.rootPath}.b15.Color`))),
            bp0       :   ((accessData.doubleValue(`${this.config.word2}.b00.Color`))),
            bp1        :   ((accessData.doubleValue(`${this.config.word2}.b01.Color`))),
            bp2        :   ((accessData.doubleValue(`${this.config.word2}.b02.Color`))),
            bp3      :   ((accessData.doubleValue(`${this.config.word2}.b03.Color`))),
            bp4    :   ((accessData.doubleValue(`${this.config.word2}.b04.Color`))),
        }
    }

//#region PublishFunctions
  
    //#region object_Value
    publish_updateValue(object) {
        if (!object.observerAction1) {
            object.observerAction1 = publisher.register([this.valuePath, 
                                                            this.valuePath2
                                                    ], 
                (newValue) => {this.updateValue(newValue.value, this.valuePath, this, object)})
        }
        else {}
    }
      //#region object_TextState
        publish_updateTextState(object) {
            if (!object.observerAction2) {
                object.observerAction2 = publisher.register([this.valuePath
                                                        ], 
                    (newValue) => {this.updateTextState(newValue.value, newValue.tag, this, object)})
            }
            else {}
        }
    //#endregion

//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(value, state) {
        if (getSignalQuality(state)) {
            this.initialize();
        }
        else {
            head.title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
           
        }
    }

    

    //вывод значения
    updateValue(value, path, context, object) {
            if (getSignalQuality(path)) {
              this.col = this.processStateBits();
              this.col2=this.DetColor(); 
              for(let i=Number(this.config.num);i<Number(this.config.num)+5;i++){
                if (i<=15){
                    if(this.col[`b${i}`])
                    {
                        if(this.col2[`b${i}`]==1)
                          RGBAColoring(object, colors.SERVICE.Flt.actAlm, `N01_${this.cout}.state.FillColor`);
                        else if(this.col2[`b${i}`]==9)
                            RGBAColoring(object, colors.VLV.Fillstate.open, `N01_${this.cout}.state.FillColor`);
                    }
                      
                    else
                        RGBAColoring(object, colors.SERVICE.Flt.inact, `N01_${this.cout}.state.FillColor`);
                    
                }
                else {
                    let q = i-16;
                    if(this.col[`bp${q}`])
                    {
                        if(this.col2[`bp${q}`]==1)
                            RGBAColoring(object, colors.SERVICE.Flt.actAlm, `N01_${this.cout}.state.FillColor`);
                        else
                            RGBAColoring(object, colors.VLV.Fillstate.open, `N01_${this.cout}.state.FillColor`);
                    }
                        
                    else
                        RGBAColoring(object, colors.SERVICE.Flt.inact, `N01_${this.cout}.state.FillColor`);
                }
                this.cout++;
              }
              this.cout=1;
                // if(accessData.boolValue(`${this.valuePath}.${bit}`))
                // RGBAColoring(object.state, this.DetColor(object,bit,context), "FillColor");
                // else
                // RGBAColoring(object.state, colors.SERVICE.Flt.inact, "FillColor");
            }
            else {
                // RGBAColoring(object.state, colors.SERVICE.Badqual.field, "FillColor");
            }
    }
        //текстовое состояние параметра
        updateTextState(value, state, context, object) {
           
            if (getSignalQuality(state)) {
                // this.dec=this.processStateBits2();
                for(let i=Number(this.config.num);i<Number(this.config.num)+5;i++){
                    if(i<=15){
                        if(i<10) 
                        // object[`N01_${this.cout2}`].desc.setStringValue(" "+ this.dec[`b${i}`], "Text");accessData.stringValue(`${this.rootPath}.b13.Description`)
                            object[`N01_${this.cout2}`].desc.setStringValue(" "+ accessData.stringValue(`${this.rootPath}.b0${i}.Description`), "Text");
                        else 
                            object[`N01_${this.cout2}`].desc.setStringValue(" "+ accessData.stringValue(`${this.rootPath}.b${i}.Description`), "Text");
                    }
                    else {
                         let q = i-16;
                         object[`N01_${this.cout2}`].desc.setStringValue(" "+ accessData.stringValue(`${this.valuePath2}.b0${q}.Description`), "Text");
                        //  object[`N01_${this.cout2}`].desc.setStringValue(" "+ this.dec[`bp${q}`], "Text");
                    }
                   
                    this.cout2++;
                }
                 this.cout2=1;
                //    object.desc.setStringValue(" " + accessData.stringValue(`${this.valuePath}.${bit}.Description`), "Text");
            }
            else {
            //    object.desc.setStringValue("???????????????????", "Text");
            }
        }

}
    
    

