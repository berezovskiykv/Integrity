#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
    code = diagram.stringPropValue("CONST");
    diagram.setDiagramSize(520, 264);
    diagram.setSize(520, 264);
    alarmHide.hide.access.setVisible(false);
   // IO.Sensor_Name.access.setStringValue(S(path + ".ID"), "Text");
     pop_symbol.access.setStringValue(path,"Tag");
#ONCE_EXECUTION_END



function Symbol_pop(object){
    vlvMode(object, path);
    vlvState(object, path);
}
//Считывание режимов.


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
    if(S(path + ".status1")&S(code + ".Status1.sAut")){
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

//Динамики элемента задвижки
function VLV_dynamics(object){
    vlvState(object, path, code);
    vlvMode(object, path, code);
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
        [object.alarm3, "sFault"],
        [object.alarm4, "sExt_Flt"],
        [object.alarm5, "sNordy"],
        [object.alarm6, "sCmdOpenFlt"],
        [object.alarm7, "sCmdCloseFlt"],
        [object.alarm8, "sUnappmove"],
        [object.alarm9, "sNoMove"],
        [object.alarm10, "sTorque"],
        [object.alarm11, "sLock"],
        [object.alarm12, "sErrCmdAut"]
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
    let h_min=264;
    let h_max=510;
    //let w_min=410;
    let w=520;

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
