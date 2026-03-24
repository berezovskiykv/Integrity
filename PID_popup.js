#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
    code = diagram.stringPropValue("CONST");
    diagram.setDiagramSize(449, 422);
    diagram.setSize(449, 422);
    alarmHide.hide.access.setVisible(false);
    alarmHide.unhide.access.setVisible(true);
    pop_symbol.access.setStringValue(path,"Tag");

#ONCE_EXECUTION_END



function Symbol_pop(object){
    let arr = [
        [object.PV, "PV"],
        [object.ER_PV, "ER_PV"],
        [object.ER_MV, "ER_MV"],
        [object.FbkMV, "FbkMV"],
        [object.SP_Int, "SP_Int"],
        [object.OutLLim, "OutLLim"],
        [object.OutHLim, "OutHLim"],

    ]

    for (let i = 0; i < arr.length; i++){
        if (i > 3) {
            arr[i][0].access.setStringValue(S(path + ".xa." + arr[i][1]).toFixed(S(path + ".xa." + arr[i][1] + ".FracDigits")), "Text");
            setpointsClick(arr[i][0], "pop_symbol." + arr[i][1] , code + ".xa." + arr[i][1], path + ".xa." + arr[i][1]);
        } else {
            arr[i][0].access.setStringValue(S(path + "." + arr[i][1]).toFixed(S(path + "." + arr[i][1] + ".FracDigits")), "Text");
        }
    }

    if((S(path + ".status1")&S("codes.PID.Status1.Man")) > 0) {
        object.Out.access.setStringValue(S(path + ".xa.MV_Man").toFixed(2), "Text");
        setpointsClick(object.Out, "pop_symbol.Out"  , code + ".xa.MV_Man" , path + ".xa.MV_Man" );
    } else {
        object.Out.access.setStringValue(S(path + ".Out").toFixed(2), "Text");
    }
}

//Изменение размера шкалы
function scaleValue(object){
    let x = S(path + ".FbkMV");

    var scaleX = utils.rangeTransform(x, S(path + ".xa.OutLLim"),S(path + ".xa.OutHLim"), 0, 100);
    var scaleY = 100;
    object.FbkMV_line.access.setScaleXY(scaleX, scaleY, 0);

    if((S(path + ".status1")&S("codes.PID.Status1.Man")) > 0) {x = S(path + ".xa.MV_Man");}
    else {x = S(path + ".Out");}

    scaleX = utils.rangeTransform(x, S(path + ".xa.OutLLim"),S(path + ".xa.OutHLim"), 0, 100);
    object.MV_Man_line.access.setScaleXY(scaleX, scaleY, 0);
}

//Вывод временных уставок
function reg_val(object) {
        let arr = [
        [object.Out_P, "Out_P"],
        [object.Out_I, "Out_I"],
        [object.Out_D, "Out_D"],

    ]

    for (let i = 0; i < arr.length; i++){
     arr[i][0].label.access.setStringValue(accessData.stringValue(path + "." + arr[i][1] + ".Description"), "Text");
     arr[i][0].value.access.setStringValue(S(path + "." + arr[i][1]).toFixed(S(path + "." + arr[i][1] + ".FracDigits")), "Text");
    }
}



function reg_set(object) {

    if((S(path + ".status1")&S(code + ".Status1.P_SEL")) > 0){
        object.P.select.point.access.setVisible(true);
         buttonClick(object.P, "reg_sett.P", code + ".cmd.DisP");
    }
    else{
        object.P.select.point.access.setVisible(false);
        buttonClick(object.P, "reg_sett.P", code + ".cmd.EnP");
    }

    if((S(path + ".status1")&S(code + ".Status1.I_SEL")) > 0){
        object.I.select.point.access.setVisible(true);
         buttonClick(object.I, "reg_sett.I", code + ".cmd.DisI");
    }
    else{
        object.I.select.point.access.setVisible(false);
        buttonClick(object.I, "reg_sett.I", code + ".cmd.EnI");
    }

    if((S(path + ".status1")&S(code + ".Status1.D_SEL")) > 0){
        object.D.select.point.access.setVisible(true);
         buttonClick(object.D, "reg_sett.D", code + ".cmd.DisD");
    }
    else{
        object.D.select.point.access.setVisible(false);
        buttonClick(object.D, "reg_sett.D", code + ".cmd.EnD");
    }

}

function timeSetsView(object){
    let arr = [
        [object.TI, "TI"],
        [object.TD, "TD"],
        [object.TM_LAG, "TM_LAG"],

        [object.Gain, "Gain"],
        [object.DB, "DB"],
        [object.I_InitVal, "I_InitVal"],

        [object.PV_Factor, "PV_Factor"],
        [object.PV_Offset, "PV_Offset"],
        [object.Out_Factor, "Out_Factor"],
        [object.Out_Offset, "Out_Offset"]
    ]

    for (let i = 0; i < arr.length; i++) {
        arr[i][0].label.access.setStringValue(accessData.stringValue(path + ".xa." + arr[i][1] + ".Name_Object"), "Text");
        arr[i][0].value.access.setStringValue(S(path + ".xa." + arr[i][1]).toFixed(S(path + ".xa." + arr[i][1] + ".FracDigits")), "Text");
        setpointsClick(arr[i][0].value, "timesets." + arr[i][1] + ".value", code + ".xa." + arr[i][1], path + ".xa." + arr[i][1]);
        }
}


//   setpointsClick(arr[i][0].value, "timesets." + arr[i][1] + ".value", code + ".xa." + arr[i][1], path + ".xa." + arr[i][1]);

//Отображение аварий
function alarmsView(object) {
   let alarmColor = {
        "0": (S(path + ".status2") & S(code + ".Status2.ModAISt")) > 0 ? colors.redColor : colors.grayBackColor,
        "1": (S(path + ".status2") & S(code + ".Status2.ModAOSt")) > 0 ? colors.redColor : colors.grayBackColor,
        "2": (S(path + ".status2") & S(code + ".Status2.Ext_Flt")) > 0 ? colors.redColor : colors.grayBackColor,
        "3": (S(path + ".status2") & S(code + ".Status2.HLimAct")) > 0 ? colors.redColor : colors.grayBackColor,
        "4": (S(path + ".status2") & S(code + ".Status2.LLimAct")) > 0 ? colors.redColor : colors.grayBackColor,
        "5": (S(path + ".status1") & S(code + ".Status1.Restart")) > 0 ? colors.greenColor : colors.grayBackColor,

    }
    let arr = [
        object.alarm1.Indicator,
        object.alarm2.Indicator,
        object.alarm3.Indicator,
        object.alarm4.Indicator,
        object.alarm5.Indicator,
        object.alarm6.Indicator,
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


    if((S(path + ".status1")&S(code + ".Status1.Neg")) > 0){
        object.neg.select.point.access.setVisible(true);
         buttonClick(object.neg, "mode.neg", code + ".cmd.DisNeg");
    }
    else{
        object.neg.select.point.access.setVisible(false);
        buttonClick(object.neg, "mode.neg", code + ".cmd.EnNeg");
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
    if((S(path + ".status1")&S(code + ".status1.Restart")) == 0 && (S(path + ".status1")&S(code + ".status1.Aut")) == 0) {
        setRGBAColor(object.Restart.Rectangle, colors.DefaultBluePopupColor);
        setTextRGBAColor(object.Restart.Text, colors.whiteColor);
        buttonClick(object.Restart, "control.Restart", code + ".cmd.Restart");
    }
    else {
        setRGBAColor(object.Restart.Rectangle, colors.BlockGreyColor);
        setTextRGBAColor(object.Restart.Text, colors.VLVGreyColor);
        clickClear(object.Restart, "control.Restart");
    }
}

function Resize(object, alias){
    let w_min=449;
    let w_max=892;
    //let w_min=410;
    let h=422;

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

