#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
    code = diagram.stringPropValue("CONST");
    pop_symbol.access.setStringValue(path,"Tag");
#ONCE_EXECUTION_END



function Symbol_pop(object){
    lsMode(object, path);
    lsColor(object, path);

}


//Вывод временных уставок
function setPointsView(object) {
    let arr = [
        [object.time, "time"]
    ]

    for (let i = 0; i < arr.length; i++) {
        arr[i][0].value.access.setStringValue(S(path + ".xa." + arr[i][1]).toFixed(S(path + ".xa." + arr[i][1] + ".FracDigits")), "Text");
        setpointsClick(arr[i][0].value, "setPoints." + arr[i][1] + ".value", code + ".xa." + arr[i][1], path + ".xa." + arr[i][1]);
    }
}

//   setpointsClick(arr[i][0].value, "timesets." + arr[i][1] + ".value", code + ".xa." + arr[i][1], path + ".xa." + arr[i][1]);

//Отображение аварий
function alarmsView(object) {
   let alarmColor = {
        "0": (S(path + ".status2")&S(code + ".Status2.ModDISt")) > 0 ? colors.redColor : colors.grayBackColor,
        "1": (S(path + ".status2")&S(code + ".Status2.ModDOSt")) > 0 ? colors.redColor : colors.grayBackColor,
        "2": (S(path + ".status2")&S(code + ".Status2.ErrFbk")) > 0 ? colors.redColor : colors.grayBackColor,
        "3": (S(path + ".status2")&S(code + ".Status2.CCEnable")) > 0 ? colors.redColor : colors.grayBackColor,
        "4": (S(path + ".status2")&S(code + ".Status2.Fault")) > 0 ? colors.redColor : colors.grayBackColor,
        "5": (S(path + ".status2")&S(code + ".Status2.CmdFlt")) > 0 ? colors.redColor : colors.grayBackColor,
        "6": (S(path + ".status2")&S(code + ".Status2.AutEnable")) > 0 ? colors.greenColor : colors.grayBackColor,
        "7": (S(path + ".status2")&S(code + ".Status2.AutDisable")) > 0 ? colors.greenColor : colors.grayBackColor
    }
    let arr = [
        object.alarm1.Indicator,
        object.alarm2.Indicator,
        object.alarm3.Indicator,
        object.alarm4.Indicator,
        object.alarm5.Indicator,
        object.alarm6.Indicator,
        object.alarm7.Indicator,
        object.alarm8.Indicator
    ]
     for (let i = 0; i < arr.length; i++)
    {
        let color = alarmColor[i];
        setRGBAColor(arr[i], color);
    }
}

//Считывание режимов.


function modeView(object){
    if((S(path + ".status1")&S(code + ".Status1.Imit")) > 0){
        object.imit.select.point.access.setVisible(true);
         buttonClick(object.imit, "mode.imit", code + ".cmd.DisImit");
    }
    else{
        object.imit.select.point.access.setVisible(false);
        buttonClick(object.imit, "mode.imit", code + ".cmd.EnImit");
    }


    if((S(path + ".status1")&S(code + ".Status1.Disable")) > 0){
        object.rep.select.point.access.setVisible(true);
        clickClear(object.rep, "mode.rep");
    }
    else{
        object.rep.select.point.access.setVisible(false);
        buttonClick(object.rep, "mode.rep", code + ".cmd.Disable");
    }
    if(S(path + ".status1")&S(code + ".Status1.Aut")){
        object.auto.select.point.access.setVisible(true);
        clickClear(object.auto, "mode.auto");
    }
    else{
        object.auto.select.point.access.setVisible(false);
        buttonClick(object.auto, "mode.auto", code + ".cmd.Aut");
    }
    if(S(path + ".status1")&S(code + ".Status1.Man")){
        object.man.select.point.access.setVisible(true);
        clickClear(object.man, "mode.man");
    }
    else{
        object.man.select.point.access.setVisible(false);
        buttonClick(object.man, "mode.man", code + ".cmd.Man");
    }

}


//Кнопки управления
function controlView(object){
    //if (((S(path + ".status1")&S(code + ".status1.Act")) ==0) && ((S(path + ".status2")&S(code + ".status2.MskEnable")) == 0) && ((S(path + ".status2") & 256 <1))) {
   // if (((S(path + ".status1")&S(code + ".Status1.Act")) ==0) && ((S(path + ".status2")&S(code + ".status2.MskEnable")) == 0) && ((S(path + ".status2") & 256 <1))) {
    if((S(path + ".status2")&S(code + ".Status2.MskEnable")) == 0 && (S(path + ".status1")&S(code + ".Status1.Aut")) == 0) {
        setRGBAColor(object.TurnOn.Rectangle, colors.DefaultBluePopupColor);
        setTextRGBAColor(object.TurnOn.Text, colors.whiteColor);
        buttonClick(object.TurnOn, "control.TurnOn", code + ".cmd.TurnOn");
    }
    else {
        setRGBAColor(object.TurnOn.Rectangle, colors.BlockGreyColor);
        setTextRGBAColor(object.TurnOn.Text, colors.VLVGreyColor);
        clickClear(object.TurnOn, "control.TurnOn");
    }
    if((S(path + ".status2")&S(code + ".Status2.MskDisable")) == 0 && (S(path + ".status1")&S(code + ".Status1.Aut")) == 0) {
        setRGBAColor(object.TurnOff.Rectangle, colors.DefaultBluePopupColor);
        setTextRGBAColor(object.TurnOff.Text, colors.whiteColor);
        buttonClick(object.TurnOff, "control.TurnOff", code + ".cmd.TurnOff");
    }
    else {
        setRGBAColor(object.TurnOff.Rectangle, colors.BlockGreyColor);
        setTextRGBAColor(object.TurnOff.Text, colors.VLVGreyColor);
        clickClear(object.TurnOff, "control.TurnOff");
    }


}


