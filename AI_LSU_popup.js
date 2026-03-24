#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
    code = diagram.stringPropValue("CONST");
    diagram.setDiagramSize(500, 255);
    diagram.setSize(500, 255);
#ONCE_EXECUTION_END

//Отображение аварий
function alarmView(){
    let alarmColor = {
        "0": (S(path + ".state") == S(code + ".state.break")) ? colors.redColor : colors.grayBackColor,
        "1": (S(path + ".state") == S(code + ".state.short")) ? colors.redColor : colors.grayBackColor,
        "2": (S(path + ".state") == S(code + ".state.fault")) ? colors.redColor : colors.grayBackColor
    };
    let arr = [
        alarmsView.alarm1.AlarmRectangle,
        alarmsView.alarm2.AlarmRectangle,
        alarmsView.alarm3.AlarmRectangle,
    ]
    for (let i = 0; i < arr.length; i++)
    {
        let color = alarmColor[i];
        if (!(accessData.signalQuality(path + ".state").indexOf('Good') == 0)) {
            color = colors.grayBackColor;
            setRGBAColor(arr[i], colors.grayTextColor);
        }
        else{
            setRGBAColor(arr[i], colors.blackColor);
        }
        setRGBAColor(arr[i], color);
    }
}

//Отображение пределов
function limView(){
    let limColor = {
        "0": (S(path + ".state") == S(code + ".state.AH")) ? colors.redColor : colors.grayBackColor,
        "1": (S(path + ".state") == S(code + ".state.AL")) ? colors.redColor : colors.grayBackColor,
        "2": (S(path + ".state") == S(code + ".state.WH")) ? colors.orangeColor : colors.grayBackColor,
        "3": (S(path + ".state") == S(code + ".state.WL")) ? colors.orangeColor : colors.grayBackColor
    };
    let arr = [
        limitsView.lim1.AlarmRectangle,
        limitsView.lim2.AlarmRectangle,
        limitsView.lim3.AlarmRectangle,
        limitsView.lim4.AlarmRectangle,
    ]
    for (let i = 0; i < arr.length; i++)
    {
        let color = limColor[i];
        if (!(accessData.signalQuality(path + ".state").indexOf('Good') == 0)) {
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
    object.value.access.setStringValue(S(path + ".value").toFixed(S(path + ".value.FracDigits")),"Text");
    object.eUnit.access.setStringValue(accessData.stringValue(path + ".EUnit"), "Text");
}