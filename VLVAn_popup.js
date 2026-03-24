#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
    code = diagram.stringPropValue("CONST");
    diagram.setDiagramSize(520, 357);
    diagram.setSize(520, 357);
    alarmHide.hide.access.setVisible(false);
   // IO.Sensor_Name.access.setStringValue(S(path + ".ID"), "Text");
     pop_symbol.access.setStringValue(path,"Tag");
#ONCE_EXECUTION_END



function Symbol_pop(object){
    vlvMode(object, path);
    vlvState(object, path);
}
//Считывание режимов.

function viewCurrPos(object){
        let arr = [
        [object.OutPosPerc, "OutPosPerc"],
        [object.OutMV, "OutMV"],
    ]

    for (let i = 0; i < arr.length; i++) { 
        //arr[i][0].access.setStringValue(S(path + "." + arr[i][1]).toFixed(S(path + "." + arr[i][1] + ".FracDigits")), "Text");       
        arr[i][0].access.setStringValue(S(path + "." + arr[i][1]).toFixed(2), "Text");  
    }
}


function set_pos(object) {
    let arr = ["SP_Ext","SP_Int"];
    let sSP_Ext=0;

    if((S(path + ".status1")&S(code + ".Status1.sSP_Ext")) > 0){
        sSP_Ext=0;
        object.ext.select.point.access.setVisible(true);
        object.intern.select.point.access.setVisible(false);
         buttonClick(object.intern, "xa_pos.intern", code + ".cmd.Int");
    }
    else{
        sSP_Ext=1;
        object.ext.select.point.access.setVisible(false);
        object.intern.select.point.access.setVisible(true);
        buttonClick(object.ext, "xa_pos.ext", code + ".cmd.Ext");
    }


      object.SP_Ust.value.access.setStringValue(S(path + ".xa." + arr[sSP_Ext]).toFixed(S(path + ".xa." + arr[sSP_Ext] + ".FracDigits")), "Text");
      object.SP_Ust.eUnit.access.setStringValue(accessData.stringValue(path + ".xa." + arr[sSP_Ext] + ".EUnit"), "Text");
      setpointsClick(object.SP_Ust.value, "xa_pos.SP_Ust.value", code + ".xa." + arr[sSP_Ext], path + ".xa." + arr[sSP_Ext]);


}


function AutoCmdText(object) {
      if((S(path + ".status3")&S(code + ".Status3.sAutStop")) > 0){
        object.access.setStringValue("В автомат. режиме СТОП", "Text");
        }
      else if((S(path + ".status3")&S(code + ".Status3.sAutOpen")) > 0){
        object.access.setStringValue("В автомат. режиме ОТКРЫТЬ", "Text");
        }
      else if((S(path + ".status3")&S(code + ".Status3.sAutClose")) > 0){
        object.access.setStringValue("В автомат. режиме ЗАКРЫТЬ", "Text");
        }
      else  {object.access.setStringValue("", "Text");}
}

function modeView(object){
    if((S(path + ".status1")&S(code + ".Status1.sImit")) > 0){
        object.imit.select.point.access.setVisible(true);
         buttonClick(object.imit, "mode.imit", code + ".cmd.DisImit");
    }
    else{
        object.imit.select.point.access.setVisible(false);
        buttonClick(object.imit, "mode.imit", code + ".cmd.EnImit");
    }


    if((S(path + ".status1")&S(code + ".Status1.sDisable")) > 0){
        object.rep.select.point.access.setVisible(true);
        clickClear(object.rep, "mode.rep");
    }
    else{
        object.rep.select.point.access.setVisible(false);
        buttonClick(object.rep, "mode.rep", code + ".cmd.Disable");
    }
    if(S(path + ".status1")&S(code + ".Status1.sAuto")){
        object.auto.select.point.access.setVisible(true);
        clickClear(object.auto, "mode.auto");
    }
    else{
        object.auto.select.point.access.setVisible(false);
        buttonClick(object.auto, "mode.auto", code + ".cmd.Aut");
    }
    if(S(path + ".status1")&S(code + ".Status1.sMan")){
        object.man.select.point.access.setVisible(true);
        clickClear(object.man, "mode.man");
    }
    else{
        object.man.select.point.access.setVisible(false);
        buttonClick(object.man, "mode.man", code + ".cmd.Man");
    }
    if(S(path + ".status1")&S(code + ".Status1.sLocal")){
        object.local.select.point.access.setVisible(true);
        clickClear(object.local, "mode.local");
    }
    else{
        object.local.select.point.access.setVisible(false);
        buttonClick(object.local, "mode.local", code + ".cmd.Local");
    }
}



//Кнопки управления
function controlView(object){
       if (((S(path + ".status1")&S(code + ".Status1.sOpened")) == 0)  && ((S(path + ".status3")&S(code + ".Status3.sMskCmdOpen")) == 0) ) {
        setRGBAColor(object.open.Rectangle, colors.DefaultBluePopupColor);
        setTextRGBAColor(object.open.Text, colors.whiteColor);
        buttonClick(object.open, "control.open", code + ".cmd.Open");
    }
    else {
        setRGBAColor(object.open.Rectangle, colors.BlockGreyColor);
        setTextRGBAColor(object.open.Text, colors.VLVGreyColor);
        clickClear(object.open, "control.open");
    }
    if (((S(path + ".status1")&S(code + ".Status1.sClosed")) == 0) && ((S(path + ".status3")&S(code + ".Status3.sMskCmdClose")) == 0) ) {
        setRGBAColor(object.close.Rectangle, colors.DefaultBluePopupColor);
        setTextRGBAColor(object.close.Text, colors.whiteColor);
        buttonClick(object.close, "control.close", code + ".cmd.Close");
    }
    else {
        setRGBAColor(object.close.Rectangle, colors.BlockGreyColor);
        setTextRGBAColor(object.close.Text, colors.VLVGreyColor);
        clickClear(object.close, "control.close");
    }
    if  ((S(path + ".status3")&S(code + ".Status3.sMskCmdReset")) == 0)  {
        setRGBAColor(object.deblock.Rectangle, colors.DefaultBluePopupColor);
        setTextRGBAColor(object.deblock.Text, colors.whiteColor);
        buttonClick(object.deblock, "control.deblock", code + ".cmd.Reset");
    }
    else {
        setRGBAColor(object.deblock.Rectangle, colors.BlockGreyColor);
        setTextRGBAColor(object.deblock.Text, colors.VLVGreyColor);
        clickClear(object.deblock, "control.deblock");
    }
        if  ((S(path + ".status3")&S(code + ".Status3.sMskCmdStop")) == 0)  {
        setRGBAColor(object.stop.Rectangle, colors.DefaultBluePopupColor);
        setTextRGBAColor(object.stop.Text, colors.whiteColor);
        buttonClick(object.stop, "control.stop", code + ".cmd.Stop");
    }
    else {
        setRGBAColor(object.stop.Rectangle, colors.BlockGreyColor);
        setTextRGBAColor(object.stop.Text, colors.VLVGreyColor);
        clickClear(object.stop, "control.stop");
    }
}

//Отображение состояния задвижки текстом
function stateText(object) {
    if ((S(path + ".status1")&S(code + ".Status1.sOpened")) > 0) {
        object.access.setStringValue("Открыта", "Text");
    }
    else if ((S(path + ".status1")&S(code + ".Status1.sOpening")) > 0) {
        object.access.setStringValue("Открывается", "Text");
    }
    else if ((S(path + ".status1")&S(code + ".Status1.sMiddle")) > 0) {
        object.access.setStringValue("В промежутке", "Text");
    }
    else if ((S(path + ".status1")&S(code + ".Status1.sClosing")) > 0) {
        object.access.setStringValue("Закрывается", "Text");
    }
    else if ((S(path + ".status1")&S(code + ".Status1.sClosed")) > 0) {
        object.access.setStringValue("Закрыта", "Text");
    }
    else {
        object.access.setStringValue("Неопределенное состояние", "Text");
    }
}

//Вывод временных уставок
function timeSetsView(object){
    let arr = [
        [object.Tpos, "Tpos"],
        [object.Tmove, "Tmove"],
    ]
    
    for (let i = 0; i < arr.length; i++) {
        arr[i][0].label.access.setStringValue(accessData.stringValue(path + ".xa." + arr[i][1] + ".Name_Object"), "Text");
        arr[i][0].value.access.setStringValue(S(path + ".xa." + arr[i][1]).toFixed(S(path + ".xa." + arr[i][1] + ".FracDigits")), "Text");
        arr[i][0].eUnit.access.setStringValue(accessData.stringValue(path + ".xa." + arr[i][1] + ".EUnit"), "Text");
        setpointsClick(arr[i][0].value, "timesets." + arr[i][1] + ".value", code + ".xa." + arr[i][1], path + ".xa." + arr[i][1]);
        }
}

//Отображение аварий
function alarmView(object){
     let arr = [
        [object.alarm1, "sModDISt"],
        [object.alarm2, "sModDOSt"],
        [object.alarm3, "sModAISt"],
        [object.alarm4, "sModAOSt"],
        [object.alarm5, "sFault"],
        [object.alarm6, "sExt_Flt"],
        [object.alarm7, "sNordy"],
        [object.alarm8, "sCmdOpenFlt"],
        [object.alarm9, "sCmdCloseFlt"],
        [object.alarm10, "sCmdStopFlt"],
        [object.alarm11, "sSPFlt"],
        [object.alarm12, "sUnappmove"],
        [object.alarm13, "sNoMove"],
        [object.alarm14, "sTorque"],
        [object.alarm15, "sLock"],
        [object.alarm16, "sNoLink"]
    ]
    let alarmColor = {
        "0": (S(path + ".status2")&S(code + ".Status2." + arr[0][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "1": (S(path + ".status2")&S(code + ".Status2." + arr[1][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "2": (S(path + ".status2")&S(code + ".Status2." + arr[2][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "3": (S(path + ".status2")&S(code + ".Status2." + arr[3][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "4": (S(path + ".status2")&S(code + ".Status2." + arr[4][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "5": (S(path + ".status2")&S(code + ".Status2." + arr[5][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "6": (S(path + ".status2")&S(code + ".Status2." + arr[6][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "7": (S(path + ".status2")&S(code + ".Status2." + arr[7][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "8": (S(path + ".status2")&S(code + ".Status2." + arr[8][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "9": (S(path + ".status2")&S(code + ".Status2." + arr[9][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "10": (S(path + ".status2")&S(code + ".Status2." + arr[10][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "11": (S(path + ".status2")&S(code + ".Status2." + arr[11][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "12": (S(path + ".status2")&S(code + ".Status2." + arr[12][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "13": (S(path + ".status2")&S(code + ".Status2." + arr[13][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "14": (S(path + ".status2")&S(code + ".Status2." + arr[14][1])) > 0 ? colors.redColor : colors.grayBackColor,
        "15": (S(path + ".status2")&S(code + ".Status2." + arr[15][1])) > 0 ? colors.redColor : colors.grayBackColor,
    };

    for (let i = 0; i < arr.length; i++)
    {
        let color = alarmColor[i];
        if (S(path + ".status2.Quality") < 192){
            color = colors.grayBackColor;
            setRGBAColor(arr[i][0].AlarmRectangle, colors.grayTextColor);
        }
        else{
            setRGBAColor(arr[i][0].AlarmRectangle, colors.blackColor);
        }
        arr[i][0].TextAlarm.access.setStringValue(accessData.stringValue(code + ".Status2." + arr[i][1] + ".Description"), "Text");
        setRGBAColor(arr[i][0].AlarmRectangle, color);
    }

    if (S(path + ".status2") > 0) {
        setRGBAColor(object.alarmTitle, colors.redColor);
    }
    else {
        setRGBAColor(object.alarmTitle, colors.VLVGreyColor);
    }
}

function Resize(object, alias){
    let h_min=357;
    let h_max=684;
    //let w_min=410;
    let w=519;

    sizePar = diagram.height;

    if (sizePar == h_min) {
        object.hide.access.setVisible(false);
        object.unhide.access.setVisible(true);
    }
    else {
        object.unhide.access.setVisible(false);
        object.hide.access.setVisible(true);
    }

    let mouseEvent = events.mouseClick(alias);
    let tmpEnableProcess = (!0 | (mouseEvent.modifiers & 0x04000000)) &&
                (!0 | (mouseEvent.modifiers & 0x02000000)) &&
                (!1 | (mouseEvent.button & 0x00000001)) &&
                (!0 | (mouseEvent.button & 0x00000002));
    if (object.clicked === undefined) object.clicked = 0;

    if (tmpEnableProcess && (mouseEvent.timeStamp != object.clicked)){
        object.clicked = mouseEvent.timeStamp;

        //let sizePar = diagram.stringPropValue("WindowHeight");
         //let sizePar=headBackground.access.getSize().width;

        if (sizePar == h_min) {
            diagram.setDiagramSize(w,h_max);
            diagram.setSize(w,h_max);
            //headBackground.access.setSize(w_max,33);
        }
        else {
            diagram.setDiagramSize(w,h_min);
            diagram.setSize(w,h_min);
            //headBackground.access.setSize(w_min,33);
        }
    }
}
