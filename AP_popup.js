#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
    code = diagram.stringPropValue("CONST");
    diagram.setDiagramSize(500, 547);
    diagram.setSize(500, 547);
#ONCE_EXECUTION_END

//Считывание режимов.
function modeView(object){
    if((S(path + ".state")&S(code + ".state.Imit")) > 0){
        object.imit.select.point.access.setVisible(true);
        buttonClick(object.imit, "mode.imit", code + ".cmd.imit_off");
    }
    else{
        object.imit.select.point.access.setVisible(false);
        buttonClick(object.imit, "mode.imit", code + ".cmd.imit_on");
    }
     if((S(path + ".state")&S(code + ".state.Test")) > 0){
         object.test.select.point.access.setVisible(true);
         buttonClick(object.test, "mode.test", code + ".cmd.test_off");
     }
     else{
         object.test.select.point.access.setVisible(false);
         buttonClick(object.test, "mode.test", code + ".cmd.test_on");
     }
     if((S(path + ".state")&S(code + ".state.Disable")) > 0){
         object.mask.select.point.access.setVisible(true);
         object.field.select.point.access.setVisible(false);
         buttonClick(object.field, "mode.field", code + ".cmd.field");
         clickClear(object.mask, "mode.mask");
     }
     else{
         object.mask.select.point.access.setVisible(false);
         object.field.select.point.access.setVisible(true);
         buttonClick(object.mask, "mode.mask", code + ".cmd.mask");
         clickClear(object.field, "mode.field");
     }

}

//Вывод предельных значений
function setPointsView(object){
    let arr = [
        [object.AH, "AH"],
        [object.WH, "WH"],
        [object.WL, "WL"],
        [object.AL, "AL"],  
    ]
    let arr1 = [
        [object.hyst, "hyst"],
        [object.imit, "imit"]
    ]
    
    for (let i = 0; i < arr.length; i++) {
        arr[i][0].label.access.setStringValue(accessData.stringValue(path + ".xa.set_" + arr[i][1] + "_Lim.Name_Object"), "Text");
        arr[i][0].value.access.setStringValue(S(path + ".xa.set_" + arr[i][1] + "_Lim").toFixed(S(path + ".xa.set_" + arr[i][1] + "_Lim.FracDigits")), "Text");
        setpointsClick(arr[i][0].value, "setpoints." + arr[i][1] + ".value", code + ".xa.set_" + arr[i][1] + "_Lim", path + ".xa.set_" + arr[i][1] + "_Lim");

        arr[i][0].select.point.access.setVisible((S(path + ".msk_set")&S("codes.AP.msk_set." + arr[i][1] + "_LimEn")) > 0);
        setpointsEnable(arr[i][0].select, "setpoints." + arr[i][1] + ".select", code + ".msk_set." + arr[i][1] + "_LimEn", path + ".msk_set.wvalue");
        }
      
    for (let i = 0; i < arr1.length; i++) {
        arr1[i][0].label.access.setStringValue(accessData.stringValue(path + ".xa." + arr1[i][1] + ".Name_Object"), "Text");
        arr1[i][0].value.access.setStringValue(S(path + ".xa." + arr1[i][1]).toFixed(S(path + ".xa." + arr1[i][1] + ".FracDigits")), "Text");
        setpointsClick(arr1[i][0].value, "setpoints." + arr1[i][1] + ".value", code + ".xa." + arr1[i][1], path + ".xa." + arr1[i][1]);
    }
}

//Отображение аварий
function alarmView(){
    let alarmColor = {
        "0": (S(path + ".flt")&S(code + ".flt.CH")) > 0 ? colors.redColor : colors.grayBackColor,
        "1": (S(path + ".flt")&S(code + ".flt.MOD")) > 0 ? colors.redColor : colors.grayBackColor,
        "2": (S(path + ".flt")&S(code + ".flt.SENS")) > 0 ? colors.redColor : colors.grayBackColor,
        "3": (S(path + ".flt")&S(code + ".flt.EXT")) > 0 ? colors.redColor : colors.grayBackColor,
        "4": (S(path + ".flt")&S(code + ".flt.LowMeasureErr")) > 0 ? colors.redColor : colors.grayBackColor,
        "5": (S(path + ".flt")&S(code + ".flt.HightMeasureErr")) > 0 ? colors.redColor : colors.grayBackColor
    };
    let arr = [
        alarmsView.alarm1.AlarmRectangle,
        alarmsView.alarm2.AlarmRectangle,
        alarmsView.alarm3.AlarmRectangle,
        alarmsView.alarm4.AlarmRectangle,
        alarmsView.alarm5.AlarmRectangle,
        alarmsView.alarm6.AlarmRectangle
    ]
    for (let i = 0; i < arr.length; i++)
    {
        let color = alarmColor[i];
        if (S(path + ".flt.Quality") < 192){
            color = colors.grayBackColor;
            setRGBAColor(arr[i], colors.grayTextColor);
        }
        else{
            setRGBAColor(arr[i], colors.blackColor);
        }
        setRGBAColor(arr[i], color);
    }
}

//Вывод значения
function value(object){
    object.value.access.setStringValue(S(path + ".Display").toFixed(S(path + ".FracDigits")),"Text");
    object.eUnit.access.setStringValue(accessData.stringValue(path + ".EUnit"), "Text");
    if((S(path + ".state")&S("codes.AP.state.Test")) > 0){
        setTextRGBAColor(object.value, colors.yellowAPColor);
        setTextRGBAColor(object.eUnit, colors.yellowAPColor);
    }
    else if((S(path + ".state")&S("codes.AP.state.Imit")) > 0){
        setTextRGBAColor(object.value, colors.pinkColor);
        setTextRGBAColor(object.eUnit, colors.pinkColor);
    }
    else{
        setTextRGBAColor(object.value, colors.defaultTextColor);
        setTextRGBAColor(object.eUnit, colors.defaultTextColor);
    }
}

//Вывод предельных значений
function engineeringRank(object){
    object.high.access.setStringValue(S(path + ".xa.wHighEngin").toFixed(S(path + ".xa.wHighEngin.FracDigits")),"Text");
    object.low.access.setStringValue(S(path + ".xa.wLowEngin").toFixed(S(path + ".xa.wLowEngin.FracDigits")),"Text");
    setpointsClick(object.high, "scaleBar.high", code + ".xa.wHighEngin", path + ".xa.wHighEngin");
    setpointsClick(object.low, "scaleBar.low", code + ".xa.wLowEngin", path + ".xa.wLowEngin");
}

//Пределы
function scale(object, signal){
    var offsetX = utils.rangeTransform(S(path + ".xa.set_" + signal + "_Lim"), S(path + ".xa.wLowEngin"),
                                       S(path + ".xa.wHighEngin"), 0, 360);
    var offsetY = 0
    object.access.move(offsetX, offsetY);
    visible = (S(path + ".msk_set")&S(code + ".msk_set." + signal + "_LimEn")) > 0;
    //if(S(path + ".state.Quality") < 192){
    //    object.access.setVisible(false);
    //}
    //else{
        object.access.setVisible(visible);
    //}
}       

//Изменение размера шкалы
function scaleValue(object){
    let x = Number(accessData.stringValue(path + ".Display"));
    if((S(path + ".state")&S(code + ".state.Bad")) > 0 || S(path + ".state.Quality") < 192){
          x = S(path + ".xa.wHighEngin");
    }
    var scaleX = utils.rangeTransform(x, S(path + ".xa.wLowEngin"),
                                      S(path + ".xa.wHighEngin"), 0, 100);
    var scaleY = 100;
    object.scaleLine.access.setScaleXY(scaleX, scaleY, 0);
}

//Цвет рамки
function scaleColor(object){
    if(S(path + ".state.Quality") < 192){
        setRGBAColor(object.scaleLine, colors.greyInvalidColor);
    }
    else if((S(path + ".state")&S(code + ".state.Bad")) > 0){
        setRGBAColor(object.scaleLine, colors.blueInvalidColor);
    }
    else{
        if((S(path + ".state")&S(code + ".state.AH_Act")) > 0 ||
                (S(path + ".state")&S(code + ".state.AL_Act")) > 0){
            setRGBAColor(object.scaleLine, colors.redColor);
        }
        else if((S(path + ".state")&S(code + ".state.WH_Act")) > 0 ||
                (S(path + ".state")&S(code + ".state.WL_Act")) > 0){
            setRGBAColor(object.scaleLine, colors.yellowColor);
        }
        else if((Number(accessData.stringValue(path + ".Display")) > S(path + ".xa.wHighEngin") || 
                (Number(accessData.stringValue(path + ".Display")) < S(path + ".xa.wLowEngin")))){
            setRGBAColor(object.scaleLine, colors.blueInvalidColor);
        }
        else{
            setRGBAColor(object.scaleLine, colors.greenColor);
        }
    }
}

function Resize(object, alias){
    let w_min=500;
    let w_max=996;
    let h=547;

    sizePar = diagram.width;
    if (sizePar == w_min) {
        object.hide.access.setVisible(false);
        object.unhide.access.setVisible(true);
    }
    else {
        object.unhide.access.setVisible(false);
        object.hide.access.setVisible(true);
    }

    if (events.hasMouseClick(alias)) {

        //let sizePar = diagram.stringPropValue("WindowHeight");
         //let sizePar=headBackground.access.getSize().width;

        if (sizePar == w_min) {
            diagram.setDiagramSize(w_max,h);
            diagram.setSize(w_max,h);
            //headBackground.access.setSize(w_max,33);
        }
        else {
            diagram.setDiagramSize(w_min,h);
            diagram.setSize(w_min,h);
            //headBackground.access.setSize(w_min,33);
        }
    }
}



