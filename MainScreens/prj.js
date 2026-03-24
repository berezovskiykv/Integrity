#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/colorSettings.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "CheckEv.js"
#ONCE_EXECUTION_BEGIN
//экран загрузки
layer.setVisible("Loading", true);
accessData.setIntValue(0, "HMIVariable.nav.loader");
accessData.setIntValue(0, "HMIVariable.nav.callCount");
// Инициализация переменных для загрузки
loadingStartTime = Date.now();
loadingDuration = 20000; // 20 секунд
isLoading = true;
loadingProgress = 0;
loadingComplete = false;
// Параметры progressBar
progressBarStartX = 0; // Начальная позиция X
progressBarStartY = 0; // Начальная позиция Y
progressBarDistance = 100; // Дистанция для перемещения (настраивайте по необходимости)
progressBarCurrentOffset = 0; // Текущее смещение
CompName = environment.readFile("/proc/sys/kernel/hostname", "").replace("\n","");
///

showBack(back, 'back');
diagNameMouse = 'prj';
accessData.setStringValue("paz",`HMIVariable.nav.upLeft.main`);
accessData.setStringValue("overview",`HMIVariable.nav.upRight.main`);
accessData.setStringValue("lspg",`HMIVariable.nav.downLeft.main`);
accessData.setStringValue("birg",`HMIVariable.nav.downRight.main`);

accessData.setStringValue(0,`Alarm.event`);
accessData.setStringValue("",`Alarm.event.AE_ObjectDescription`);
accessData.setStringValue("",`Alarm.event.AE_BitOnText`);
accessData.setStringValue(0,`Alarm.event.AE_BitOnSeverity`);

AlarmsOperational_upLeft.addFilterCondition('State', 'Active', false, 'Or');
AlarmsOperational_upLeft.addFilterCondition('State', 'ActiveAcknowledged', false, 'None');
AlarmsOperational_upLeft.applyFilter();
AlarmsOperational_upLeft.access.connect();
AlarmsOperational_upRight.addFilterCondition('State', 'Active', false, 'Or');
AlarmsOperational_upRight.addFilterCondition('State', 'ActiveAcknowledged', false, 'None');
AlarmsOperational_upRight.applyFilter();
AlarmsOperational_upRight.access.connect();
AlarmsOperational_downLeft.addFilterCondition('State', 'Active', false, 'Or');
AlarmsOperational_downLeft.addFilterCondition('State', 'ActiveAcknowledged', false, 'None');
AlarmsOperational_downLeft.applyFilter();
AlarmsOperational_downLeft.access.connect();
AlarmsOperational_downRight.addFilterCondition('State', 'Active', false, 'Or');
AlarmsOperational_downRight.addFilterCondition('State', 'ActiveAcknowledged', false, 'None');
AlarmsOperational_downRight.applyFilter();
AlarmsOperational_downRight.access.connect();
logLayer = false;

keys = {
    0x01000004: "ent", //return
    0x01000005: "ent", //enter
    0x01000000: "esc" //esc
};
inputKey = 0;

#ONCE_EXECUTION_END

if(layer.isVisible("LogLayer")){
    logLayer = true;
    inputKey = keyInput();
}
else{
    logLayer = false;
}

function login(object){
    #ONCE_EXECUTION_BEGIN
        object.setVisible(false, 'reason');
    #ONCE_EXECUTION_END

    if(logLayer){
        try{
            let mouseEvent;

            if(keys[inputKey] == 'ent'){
                mouseEvent = clickRelease(object.alarmsButton, objectName+'.alarmsButton', true);
            }
            else{
                mouseEvent = clickRelease(object.alarmsButton, objectName+'.alarmsButton');
            }
            
            if(mouseEvent.action == 'release') {

                object.setVisible(false, 'reason');
                let login = logView.userList.comboBoxCurrent();
                let pass = logView.log_pass.access.stringValue("Text");
                if(securityAgent.login(login,pass)){
                    layer.setVisible("LogLayer", false);
                    //logView.log_text.access.setStringValue("", "Text");
                    logView.log_pass.access.setStringValue("", "Text");
                    accessData.setDoubleValue( 0, "Alarm.event");
                    accessData.setStringValue( "В системе зарегистрировался пользователь" + " " + login, "Alarm.event.AE_BitOnText");
                    accessData.setDoubleValue( 1, "Alarm.event");
                    accessData.setStringValue( 9,`Alarm.event.AE_BitOnSeverity`);
                }
                else{
                    
                    object.setStringValue(securityAgent.lastAccessDenyReason(), "reason.Text");
                    object.setVisible(true, 'reason');
                }
            }
        }
        catch(e){
            accessData.setStringValue("При авторизации произошла ошибка:\n" + e.message,"service.errorText");
        }
    }
    else{
        object.setVisible(false, 'reason');
    }
}

function closeLog(){
    if(logLayer){
        let mouseEvent;

        if(keys[inputKey] == 'esc'){
            mouseEvent = clickRelease(object, objectName, true);
        }
        else{
            mouseEvent = clickRelease(object, objectName);
        }

        if(mouseEvent.action == 'release'){

            //if(securityAgent.getUserRights('SSLEVEL_SSLEVEL', '')){
                layer.setVisible("LogLayer", false);
            // }
            // else{
            //     runPopup({
            //                 popupName: 'errorBox',
            //                 alias : 'errorBox'
            //             },
            //             {
            //                 message: 'Недостаточно прав для выполнения операции!'
            //             }
            //     );
            // }
        }
    }
}

function logout(object){
    if(logLayer){
        try{
            let mouseEvent = clickRelease(object, objectName);
            if(mouseEvent.action == 'release'){
                securityAgent.logout();
            }
        }
        catch(e){
            accessData.setStringValue("При авторизации произошла ошибка:\n" + e.message,"service.errorText");
        }
    }
}
function chPass(object, objectName){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'release'){
         runPopup({
                        popupName: 'changePass',
                        alias: 'chPass',
                    },
                    {
                    });
        }
}
function getUserList(){
    var users = securityAgent.getLoginInfos();
    for (let i = 0; i < users.length; i++) {
        if(users[i].login != 'guest') logView.userList.comboBoxAdd(users[i].login);
        
    }

}

function exitButton_Click(object){
    let mouseEvent = clickRelease(object, objectName);

    if(mouseEvent.action == 'click'){
        object.clickRespons = mouseEvent.respons;
    }    
    else if(mouseEvent.action == 'release'){
        if(securityAgent.getUserRights('SSLEVEL_SSLEVEL', '')){
            runPopup({
                        popupName: 'accessBox',
                        alias: 'accessBox',
                        posX: object.clickRespons['globalPosX'],
                        posY: object.clickRespons['globalPosY']
                    },
                    {
                        tag: 'Закрыть приложение',
                        message: `Вы уверены, что хотите закрыть приложение?`,
                        alarm: 'Приложение закрыто',
                        valueTag: 0
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

function changeUserButton(object, objectName){
    let mouseEvent = clickRelease(object, objectName);  
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    else if(mouseEvent.action == 'release'){
	    layer.setVisible("LogLayer", true);
    }
}

function Click(object, objectName, popup = "", action = false){
    let mouseEvent = clickRelease(object, objectName);
    if(mouseEvent.action == 'click'){object.clickRespons = mouseEvent.respons;}
    if(mouseEvent.action == 'release'){
        runPopup (
            {
                popupName: popup,
                alias: popup + objectName,
                posX: object.hover['globalPosX'],
                posY: object.hover['globalPosY']
            },
        );
    }
}

function checkEvent(object, ALM, WRN, FLT, PLK) {
    //какая то реализация динамики квадратиков A W S на кнопках навигации через экземпляр ObsetvableObject
  if (!object.parameter) {
        object.name = objectName;
        object.parameter = new checkEv(object, {ALM : ALM, WRN : WRN, FLT : FLT, PLK : PLK});
    }
    object.parameter.checkForUpdates();
    
}

function UpdateData() {
    try {
        // Обработка процесса загрузки
        if (isLoading && !loadingComplete) {
            // Расчет прогресса загрузки (0-1)
            var currentProgress = Math.min(1, (Date.now() - loadingStartTime) / loadingDuration);
            
            // Вычисляем новое смещение для progressBar
            var newOffset = currentProgress * progressBarDistance;
            //accessData.setDoubleValue(newOffset, 'test')
            progressBarCurrentOffset = newOffset;
            
            // Проверка завершения загрузки
            if (currentProgress >= 1) {
                try {
                    isLoading = false;
                    loadingComplete = true;
                    accessData.setStringValue(0,`Alarm.event`);
                    //РАСКОМЕНТИТЬ ПО ЗАВЕРШЕНИИ РАЗРАБОТКИ
                    securityAgent.logout();
                    logView.userList.comboBoxClear();
                    logView.alarmsButton_1.reason.setVisible(false);
                    getUserList();
                    securityAgent.currentUserLogin() != 'guest' ? logView.userList.comboBoxSetCurrent(securityAgent.currentUserLogin()) : {};
                    layer.setVisible("LogLayer", true);
                    ///////////////////////////////////

                    layer.setVisible("Loading", false);
                }
                catch (error) {
                    LogError(error, "CompleteLoading");
                }
            }
        return;
        }
    }
    catch (error) {
        LogError(error, "UpdateData");
    }
}

function GlobKvit(object, objectName, position, pos) {
    let currScreen = accessData.stringValue(`HMIVariable.nav.${position}`);
    let areatag;
    if(currScreen=='birg'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.birgscr`)}`;
        areatag = `KSPG.AreaEvent.${accessData.stringValue(`HMIVariable.nav.${pos}.birgscr`)}`;
    }
    else if(currScreen=='br'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.brscr`)}`;
        areatag = `KSPG.AreaEvent.${accessData.stringValue(`HMIVariable.nav.${pos}.brscr`)}`;
    }
    else if(currScreen=='bsbo') {
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.bsboscr`)}`;
        areatag = `KSPG.AreaEvent.${accessData.stringValue(`HMIVariable.nav.${pos}.bsboscr`)}`;
    }
    else if(currScreen=='comsys'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.comsysscr`)}`;
        areatag = `KSPG.AreaEvent.${accessData.stringValue(`HMIVariable.nav.${pos}.comsysscr`)}`;
    }
    else if(currScreen=='energy'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.energyscr`)}`;
        areatag = `KSPG.AreaEvent.${accessData.stringValue(`HMIVariable.nav.${pos}.energyscr`)}`;
    }
    else{
        cmdTag = `KSPG.GLOB_KVIT.${currScreen}`;
        areatag = `KSPG.AreaEvent.${currScreen}`;
    }
       
    let mouseEvent;
    mouseEvent = clickRelease(object, objectName);
    let mess = `Команда оператора - Глобальное квитирование (экран ${accessData.stringValue(`${cmdTag}.Description`)}) [${securityAgent.currentUserLogin()}/${CompName}]`;
    // runAccessBox(object,
    //             objectName,
    //             {
    //             userName = accessData.stringValue(`${cmdTag}.wvalue.EUnit`),
    //             value = 1,
    //             postfix = '.wvalue',
    //             inputTag = cmdTag,
    //             desc = `Глобальное квитирование (экран ${accessData.stringValue(`${cmdTag}.Description`)})`
    //             }
    // )

    if (mouseEvent.action == 'release') {
        accessData.setBoolValue(true, 'HMIVariable.alarmsKvit.needGlobKvit')
        accessData.setBoolValue(true, `${cmdTag}.wvalue`);
        accessData.setBoolValue(false, `${areatag}.ALM.kvit`);
        accessData.setBoolValue(false, `${areatag}.WRN.kvit`);
        accessData.setBoolValue(false, `${areatag}.FLT.kvit`);
     //   accessData.setStringValue(`${cmdTag}.Description`, 'HMIVariable.alarmsKvit.msgFilter')
       generateAlarms(mess, 4);
    }
}
function KvitAlarms() {

    let needKvitFlag = accessData.boolValue('HMIVariable.alarmsKvit.needKvit');
    let msg = accessData.stringValue('HMIVariable.alarmsKvit.msgFilter');
    if (needKvitFlag) {
        AlarmsOperational.addFilterCondition('MessageContains', msg, false, 'None');
      //  AlarmsOperational.addFilterCondition('State', 'ActiveAcknowledged', false, 'None');
        AlarmsOperational.applyFilter();
        AlarmsOperational.access.connect();
        AlarmsOperational.access.ackAll('', '')
       // AlarmsOperational.clearFilterConditions();
        accessData.setStringValue('', 'HMIVariable.alarmsKvit.msgFilter');
        accessData.setBoolValue(false, 'HMIVariable.alarmsKvit.needKvit');

    }
    else {}
}

function Kvit_alarm_global(){
   let kvit_name = [
    "paz",
    "overview",
    "birg",
    "bvu",
    "bkk",
    "br",
    "bpt",
    "bs",
    "bo",
    "bo_bkk",
    "drain_column",
    "bpaiv",
    "lspg",
    "drainage",
    "ihg",
    "kns",
    "eo1"
];

let need = accessData.boolValue(`HMIVariable.alarmsKvit.needGlobKvit`);
if(need==1)
{
    for (let i=0; i<kvit_name.length; i++)
    {
        let glob_mes = "Глобальное квитирование (экран " + accessData.stringValue(`KSPG.GLOB_KVIT.${kvit_name[i]}.Description`);
     //  accessData.setBoolValue(true, `KSPG.GLOB_KVIT.${kvit_name[i]}.wvalue`);
        AlarmsOperational.addFilterCondition('MessageContains', glob_mes, false, 'Or');
        AlarmsOperational.applyFilter();

        AlarmsOperational.access.connect();
         //Text_9.setStringValue(accessData.stringValue(`KSPG.GLOB_KVIT.${kvit_name[i]}.Description`),"Text")
    }
       accessData.setBoolValue(false, 'HMIVariable.alarmsKvit.needGlobKvit');
        AlarmsOperational.access.ackAll('', '');
}

}
function NavMess(position,pos) {

let currScreen = accessData.stringValue(`HMIVariable.nav.${position}`);
 if(currScreen=='birg'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.birgscr`)}`;
    }
    else if(currScreen=='br'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.brscr`)}`;
    }
    else if(currScreen=='bsbo') {
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.bsboscr`)}`;
    }
    else if(currScreen=='comsys'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.comsysscr`)}`;
    }
    else if(currScreen=='energy'){
        cmdTag = `KSPG.GLOB_KVIT.${accessData.stringValue(`HMIVariable.nav.${pos}.energyscr`)}`;
    }
    else{
        cmdTag = `KSPG.GLOB_KVIT.${currScreen}`;
    }
       
if (accessData.boolValue(`HMIVariable.nav.update.${pos}.sum`)) {
    generateAlarms(`Просмотр экрана ${accessData.stringValue(`${cmdTag}.Description`)} [${securityAgent.currentUserLogin()}/${CompName}]`, 4);
    accessData.setBoolValue(false,`HMIVariable.nav.update.${pos}.sum`)
}
}

