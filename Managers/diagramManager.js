#ONCE_EXECUTION_BEGIN
CompName = environment.readFile("/proc/sys/kernel/hostname", "").replace("\n","");

#ONCE_EXECUTION_END

function isDiagramActive(diagName, position){
    //return ((accessData.stringValue('HMIVariable.nav.leftfield') == diagName) || (accessData.stringValue('HMIVariable.nav.rightfield') == diagName)) ? true : false;
    return (accessData.stringValue(`HMIVariable.nav.${position}.main`) == diagName) ? true : false;
}

function currentPositionPRJ() {
    let screens = ["upLeft", "upRight", "downRight", "downLeft"];
    let screensNum = 11;
    let totalPositions = screens.length * screensNum; // 40
    
    let loader = accessData.intValue("HMIVariable.nav.loader") || 0;
    
    // Блокировка после 40 вызовов
    // if (callCount >= totalPositions) {
    //     LogData("Цикл завершён: 40/40 вызовов", 'currentpositionPRJ');
    //     return ["upLeft", "diagName[00]"];
    //     //return null;
    // }
    
    // ТЕКУЩИЙ индекс для этого вызова (0-39)
    let currentIndex = loader;
    let screenIndex = Math.floor(currentIndex / screensNum);
    let schemeIndex = currentIndex % screensNum;
    
    // Подготовка следующего вызова
    accessData.setIntValue(loader + 1, "HMIVariable.nav.loader");
    
    //LogData(`#${callCount}: ${screens[screenIndex]}[${String(schemeIndex).padStart(2,'0')}] ${diagName}[${schemeIndex}]`, 'currentpositionPRJ');
    return [screens[screenIndex], `${diagName}[${schemeIndex}]`];
}
function isEmbededDiagramActive(mainDiagName, diagName, scrTag) {
    const positions = ["upLeft", "upRight", "downRight", "downLeft"];
    let result = positions.some(item => {
        if (mainDiagName == accessData.stringValue(`HMIVariable.nav.${item}.main`)) {
            if (diagName == accessData.stringValue(`HMIVariable.nav.${item}.${scrTag}`)) {
                return true;
            }
            else return false;
        }
        else return false;
    })
    return result
}

function navigation(object,objectName,selectDiagram,position){
    let currentScreen = accessData.stringValue(`HMIVariable.nav.${position}`);
    if (selectDiagram != accessData.stringValue(`HMIVariable.nav.${position}`)){
        let mouseEvent = clickRelease(object, objectName + '.click');
        if(mouseEvent.action == 'click'){
            if(position != "") {accessData.setStringValue(selectDiagram,`HMIVariable.nav.${position}`);}
        }
        if (currentScreen != accessData.stringValue(`HMIVariable.nav.${position}`)){
            accessData.setBoolValue(true,`HMIVariable.nav.update.${position}`);
            // accessData.setBoolValue(true,"needChangeTitle");
        }
    }
    else {
        clickClear(object, objectName + '.click')
    }
}

function navigateButtonState(object, selectDiagram, position) {
    if (selectDiagram == accessData.stringValue(`HMIVariable.nav.${position}`)) {
        RGBAColoring(object.field, colors.SERVICE.NavBtn.act, "FillColor");
    }
    else {
        RGBAColoring(object.field, colors.SERVICE.NavBtn.inact, "FillColor");
    }
}

function changeWindow(layers, position){
    if(accessData.boolValue(`HMIVariable.nav.update.${position}`)){
        layerWorker(layers, accessData.stringValue(`HMIVariable.nav.${position}`), position);
    }
}

function layerWorker(layers,currentScreen,position){
    for (let item of layers) {
        layer.setVisible(item,false);        
    }
    layer.setVisible(currentScreen,true);
    let qwe = position.split(".")
    accessData.setBoolValue(true,`HMIVariable.nav.update.${qwe[0]}.sum`);
    accessData.setBoolValue(false,`HMIVariable.nav.update.${position}`);
    
}

function resize(object, objectname, [wmin, wmax, hmin, hmax], axis = "vertical", security = false){
    let width = diagram.width;
    let height = diagram.height;
    let gap = 20;

    if(axis == "vertical"){
        if(height > hmin + gap){
            object.hide.setVisible(true);
            object.show.setVisible(false);
        }
        else{
            object.hide.setVisible(false);
            object.show.setVisible(true);
        }
    }
    else if (axis == "horizontally"){
        if(width > wmin + gap){
            object.hide.setVisible(true);
            object.show.setVisible(false);
        }
        else{
            object.hide.setVisible(false);
            object.show.setVisible(true);
        }
    }

    if(width < wmin){
        diagram.setDiagramSize(wmin-4, height-4);
        diagram.setSize(wmin, height);
    }
    else if(width > wmax){
        diagram.setDiagramSize(wmax-4, height-4);
        diagram.setSize(wmax, height);
    }
    else if(object.hide.isVisible() && width < wmax){
        diagram.setDiagramSize(wmax-4, height-4);
        diagram.setSize(wmax, height);
    }
    else if(wmin + gap > width && width > wmin){
        diagram.setDiagramSize(wmin-4, height-4);
        diagram.setSize(wmin, height);
    }

    
    if(height < hmin){
        diagram.setDiagramSize(width-4, hmin-4);
        diagram.setSize(width, hmin);
    }
    else if(height > hmax){
        diagram.setDiagramSize(width-4, hmax-4);
        diagram.setSize(width, hmax);
    }
    else if(object.hide.isVisible() && height < hmax){
        diagram.setDiagramSize(width-4, hmax-4);
        diagram.setSize(width, hmax);
    }
    else if(hmin + gap > height && height > hmin){
        diagram.setDiagramSize(width-4, hmin-4);
        diagram.setSize(width, hmin);
    }


    let mouseEvent = clickRelease(object, objectname);
    if(mouseEvent.action == 'release'){
        if(securityAgent.getUserRights("SSLEVEL_SSLEVEL", "") || security == false){
            if(object.hide.isVisible()){
                if(axis == "vertical"){
                    diagram.setDiagramSize(width-4, hmin-4);
                    diagram.setSize(width, hmin);
                }
                else if (axis = "horizontally"){
                    diagram.setDiagramSize(wmin-4, height-4);
                    diagram.setSize(wmin, height);
                }
            }
            else{
                if(axis == "vertical"){
                    diagram.setDiagramSize(width-4, hmax-4);
                    diagram.setSize(width, hmax);
                }
                else if (axis = "horizontally"){
                    diagram.setDiagramSize(wmax-4, height-4);
                    diagram.setSize(wmax, height);
                }
            }
        }
    }
}

function runPopup(
        {
            alias = object.stringValue('inputTag'),
            popupName = accessData.stringValue(alias + '.Popup'),
            screenPos = null,
            posX = 0,
            posY = 0
        } = {},
            propValuesDict = {}
    ){

    let load = accessDiagram.loadAndRunDiagram(popupName, alias);
    if(load){
        let popup = accessDiagram.getWindow(alias);
            for(let [key, value] of Object.entries(propValuesDict)){
                popup.setStringPropValue(value, key);
            }
    
        if(alias == "accessBox" || alias == "errorBox" || alias == 'input_window'){
            posX>1920 ? posX = popup.x + 1920: posX = popup.x;
            posY>1080 ? posY = popup.y + 1080: posY = popup.y;
        }
        else if (alias == 'ALGConfirmPopup') {
            //posX = getOffsetFromPosition(screenPos).offsetX + popup.x
            //posY = getOffsetFromPosition(screenPos).offsetY + popup.y
            posX = popup.x
            posY = popup.y
            //Text_40.setStringValue(`${posX} + ${posY}`, "Text")
            //Text_40.setStringValue(`${popup.x} + ${popup.y}`, "Text")

        }
        else{
            let screenSize = {X:1920,Y:1080};
            if(posX>1920) screenSize.X = 3840;
            if(posY>1080) screenSize.Y = 2160;  
            // accessData.setStringValue(`${posX};${posY}`,"HMIVariable.nav.coord");
            posX + popup.width > screenSize.X ? posX -= posX + popup.width - screenSize.X + 10 : {};
            posY + popup.height > screenSize.Y ? posY -= posY + popup.height - screenSize.Y + 10 : {};
            //accessData.setStringValue(posX, 'a');
            //accessData.setStringValue(posY, 'b');
        }
        popup.setPos(posX, posY);
    }
    else return
}

function closePopup(alias = diagram.stringPropValue('inputTag')){
    let popup = accessDiagram.getWindow(alias);
    popup.close()
}

function runAccessBox(object,
                      objectname,
                      {
                        userName = '',
                        value = '',
                        postfix = '.cmd',
                        codes = '',
                        codeName = '',
                        statebit = '',
                        inputTag = '',
                        desc = ''
                      } = {}){
    let mouseEvent = clickRelease(object, objectname);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        if (userName) {
            user = userName
        } 
        else if ((`${codes}.EUnit`) != "") {
            user = accessData.stringValue(`${codes}.EUnit`);
        }
        else {
            user = "Инженер";
        }
        if(securityAgent.getUserRights('SSLEVEL_SSLEVEL', user)){
            if (codes.includes('MsgOff')) {statebit = !statebit}
            let codeDesc = (statebit !== '') ? getCmdCodeName(statebit, codes) : accessData.stringValue(`${codes}.Description`);
            let tmpMessage = (desc) ? desc : `${accessData.stringValue(`${inputTag}.Description`)} -\n- ${codeName ? codeName : codes ? codeDesc : value}`
            let tmpAlarm = (desc) ? desc : `${accessData.stringValue(`${inputTag}.Description`)} - ${codeName ? codeName : codes ? codeDesc : value}`
            runPopup({
                        popupName: 'accessBox',
                        alias: 'accessBox',
                        posX: object.clickRespons['globalPosX'],
                        posY: object.clickRespons['globalPosY']
                    },
                    {
                        //tag: secondTag ? `${inputTag}${postfix};${secondTag}${postfix}` : `${inputTag}${postfix}`,
                        tag: `${inputTag}${postfix}`,
                        message: `Вы уверены, ${tmpMessage}?`,
                        alarm: `Команда оператора - ${tmpAlarm} [${securityAgent.currentUserLogin()}/${CompName}]`,
                        filter: accessData.stringValue(`${inputTag}.Description`),
                        value: value ? value : codes ? accessData.intValue(codes) : 0
                        //value: secondTag ? `${value};${secondValue}` : value
                    });
        }
        else{
            runPopup({
                        popupName: 'errorBox',
                        alias : 'errorBox',
                        posX: object.clickRespons['globalPosX'],
                        posY: object.clickRespons['globalPosY']
                    },
                    {
                        message: 'Недостаточно прав для выполнения операции!'
                    });
        }
    }
}

function runInputWindow(object, 
                        objectname, 
                        {
                            inputTag = '',
                            postfix = '',
                            codes = ''
                        } = {}){
    let mouseEvent = clickRelease(object, objectname);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons}
    else if(mouseEvent.action == 'release'){
        if ((`${codes}${postfix}.EUnit`) != "") {
            user = accessData.stringValue(`${codes}${postfix}.EUnit`);
        }
        else {
            user = "Инженер";
        }
        if(securityAgent.getUserRights('SSLEVEL_SSLEVEL', user)){
            let tmpMessage = `${accessData.stringValue(`${inputTag}.Description`)} -\n- ${accessData.stringValue(`${inputTag}${postfix}.wvalue.Description`)}`
            let tmpAlarm = `${accessData.stringValue(`${inputTag}.Description`)} - ${accessData.stringValue(`${inputTag}${postfix}.Description`)}`
            runPopup(
                {
                    popupName: 'input_window',
                    alias: 'input_window',
                    posX: object.clickRespons['globalPosX'],
                    posY: object.clickRespons['globalPosY']
                },
                {
                    tag: `${inputTag}${postfix}`,
                    message: `Вы уверены, ${tmpMessage} установить`,
                    alarm: `Команда оператора - ${tmpAlarm}`
                }
            );
        }
        else{
            runPopup(
                {
                    popupName: 'errorBox', 
                    alias : 'errorBox',
                    posX: object.clickRespons['globalPosX'],
                    posY: object.clickRespons['globalPosY']
                },
                {
                    message: 'Недостаточно прав для выполнения операции!'
                }
            );
        }
    }
}

//Открытие трендов с попапа
function trendsClick(object, objectname, inputTag){
    let mouseEvent = clickRelease(object, objectname);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: 'popup_trends', 
                popupName: 'popup_trends', 
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
                tag: inputTag
            });
    }
}

function alarmsClick(object, objectname, inputTag){
    let mouseEvent = clickRelease(object, objectname);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: 'popup_alarms', 
                popupName: 'popup_alarms', 
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
                tag: inputTag
            });
    }
}


function IOClick(object, objectname, inputTag){
    let mouseEvent = clickRelease(object, objectname);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup({
                alias: inputTag + 'IO',
                popupName: 'IO',
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
                },
                {
                tag: inputTag,
            });
    };
};

function helpClick(object, objectName, popup){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
        runPopup(
            {
                alias: popup,
                popupName: popup,
                posX: object.clickRespons['globalPosX'],
                posY: object.clickRespons['globalPosY']
            }
        );
    };
}

function showBack(object, layerName){
    layer.setVisible(layerName, true);
    object.setSize(diagram.width, diagram.height);
    object.setPosition(0, 0);
}

function getOffsetFromPosition(scrPosition) {
    switch (scrPosition) {
        case ('upLeft'):
            offsetX = 0;
            offsetY = 0;
            break;
        case ('upRight'):
            offsetX = 1920;
            offsetY = 0;
            break;
        case ('downRight'):
            offsetX = 1920;
            offsetY = 1080;
            break;
        case ('downLeft'):
            offsetX = 0;
            offsetY = 1080;
            break;
        default:
            offsetX = 0;
            offsetY = 0;
            break; 
    }

    return {offsetX, offsetY}
}
