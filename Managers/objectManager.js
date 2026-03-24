
//обработака нажатий клавиш
function keyInput() {
    if (events.hasKeyPress()) {
        let ans = events.keyPressed();
        return ans.keys.slice(-1);
    }
    else {
        return 0;
    }
}

//моргание с color1 на color2
function flashing(object, color1, color2, field, time) {
    let now = time ? time : new Date();
    let nowSec = now.getSeconds();
    if (nowSec % 2 ===  0){
        RGBAColoring(object, color1, field);
    }
    else{
        RGBAColoring(object, color2, field);
    }
}
//какая то хрень, надо разобарться зачем нам это все
// function traversVisible(object, code) {
//     path = object.access.stringValue("inputTag");
//     if (S(path) == code) {
//         object.setVisible(true);
//     }
//     else {
//         object.setVisible(false);
//     }

// }

// function dlgButton(object) {
//     path = getAliasesPath(object);
//     if (S(path + ".Value") >= 256 && S(path + ".Value") <= 2048) {
//         object.access.setVisible(true);
//         flashing(object.Font, clayColor, orangeColor)
//     }
//     else {
//         object.access.setVisible(false);
//     }
// }

// function dlgButton1(object) {
//     path = getAliasesPath(object);
//     if (S(path + ".Value") >= 2) {
//         object.access.setVisible(true);
//         flashing(object.Font, clayColor, orangeColor)
//     }
//     else {
//         object.access.setVisible(false);
//     }
// }

// function checkLink(object) {
//     path = getAliasesPath(object);
//     if (accessData.boolValue(path + ".LINK")) {
//         RGBAColoring(object, greenColor, "TextColor");
//     }
//     else {
//         RGBAColoring(object, clayColor, "TextColor");
//     }
// }

// function checkAlarm(object, property, path = '') {
//     if (path == '') path = getAliasesPath(object);
//     path = `${path}${property}`;
//     if (S(path) >= 1) {
//         flashing(object.Font, redColor, clayColor);
//     }
//     else {
//         RGBAColoring(object.Font, clayColor, "FillColor");
//     }
// }

// function AlarmStopAll(object) {
//     path = getAliasesPath(object);
//     if (S(`${path}.state.status`) == 4) {
//         object.access.setVisible(true);
//         flashing(object.Font, clayColor, orangeColor)
//     }
//     else {
//         object.access.setVisible(false);
//     }
// }

//Генерация алармов по камандам оператора
function generateAlarms(message, severity) {
    accessData.setDoubleValue(0, "Alarm.event");
    accessData.setDoubleValue(severity, "Alarm.event.AE_BitOnSeverity");
    accessData.setStringValue(message, "Alarm.event.AE_BitOnText");
    accessData.setDoubleValue(1, "Alarm.event");
}

/** Проверка качества указанного сигнала
 * @param {String} path путь сигнала в дереве данных
 * @returns {Boolean} true при хорошем качестве, false при плохом
 */
function getSignalQuality(path) {
    let quality = accessData.signalQuality(path);
    return  quality ? quality.includes('Good') : false;
}

function clickRelease(object, name = objectName, imitClick = false, noClick = false, needFocus = false){
    let mouseEvent1;
    let mouseEvent2;

    if(imitClick){
        object.imitClicked === undefined ? object.imitClicked = 0 : {};
        if(object.imitClicked){
            mouseEvent1 = {
                "button": 0x00000001,
                "timeStamp": object.clicked,
            };
            mouseEvent2 = events.mouseRelease(name);
        }
        else{
            mouseEvent1 = {
                "button": 0x00000001,
                "timeStamp": Date.now(),
            };
            mouseEvent2 = events.mouseRelease(name);
            object.imitClicked += 1;
        }
    }
    else if(object.imitClicked){
        mouseEvent1 = events.mouseClick(name);
        mouseEvent2 = {
            "button": 0x00000001,
            "timeStamp": Date.now(),
        };
        object.imitClicked = 0;
    }
    else{
        mouseEvent1 = events.mouseClick(name);
        mouseEvent2 = events.mouseRelease(name);
    }

    object.clicked === undefined ? object.clicked = 0 : {};
    object.released === undefined ? object.released = 0 : {};

    let color = hoverF(object, name, noClick, needFocus);
    if(mouseEvent1.timeStamp > object.clicked && mouseEvent1.button == 0x00000001){
        object.clicked = mouseEvent1.timeStamp;
        let col = noClick ? color : colors.SERVICE.Frame.set;
        !compCol(object.clickColor, col) ? (object.clickColor = col, RGBAColoring(object, col, 'click.LineColor')) : {};
        return {'action': 'click', 'respons': mouseEvent1};
    }
    else if(mouseEvent2.timeStamp > object.released && mouseEvent2.button == 0x00000001){
        object.released = mouseEvent2.timeStamp;
        !compCol(object.clickColor, color) ? (object.clickColor = color, RGBAColoring(object, color, 'click.LineColor')) : {};
        return {'action': 'release', 'respons': mouseEvent2};
    }
    else if(object.clicked > object.released){
        return {'action': 'hold'};
    }
    !compCol(object.clickColor, color) ? (object.clickColor = color, RGBAColoring(object, color, 'click.LineColor')) : {};
    return 0;
}

function hoverF(object, objectName, noClick, needFocus){
    let hover = events.mouseHover(objectName);
    let hover2 = events.mouseHover(objectName.split('.')[0]);
    object.hover ? {} : (object.hover = hover, object.hoverTime = 0, objs[objectName] = object.hoverTime);
    let lastObj = Object.keys(objs).reduce((a, b) => objs[a] >= objs[b] ? a : b);

    
    if(hover.globalPosX == object.hover.globalPosX && hover.globalPosY == object.hover.globalPosY){
        if(noClick){
            return colors.SERVICE.Frame.reset;
        }
        else if(lastObj == objectName && accessData.stringValue('HMIVariable.mouse') == diagNameMouse &&
            hover2.globalPosX == object.hover.globalPosX && hover2.globalPosY == object.hover.globalPosY){
            return colors.SERVICE.Frame.set;
        }
        else if(needFocus){
            return colors.SERVICE.Frame.reset;
        }
        else{
            return colors.SERVICE.Frame.reset;
        }
    }
    else{
        accessData.setStringValue(diagNameMouse, 'HMIVariable.mouse');
        object.hover = hover;
        object.hoverTime = Date.now();
        objs[objectName] = object.hoverTime;
        if(noClick){
            return colors.SERVICE.Frame.reset;
        }
        return colors.SERVICE.Frame.set;
    }
}

//Сброс нажатий мыши
function clickClear(object, objectName){
    let tmp = clickRelease(object, objectName, false, true);
}

// Перенос текста по строкам
function wrapText(text, maxLineLength) {
    if (!text) return "";
    
    const result = [];
    let currentLine = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Если текущая строка достигла максимальной длины
        if (currentLine.length >= maxLineLength) {
            // Пытаемся найти место для переноса по пробелу
            const lastSpaceIndex = currentLine.lastIndexOf(' ');
            
            if (lastSpaceIndex > 0 && lastSpaceIndex < currentLine.length - 5) {
                // Переносим по пробелу
                const firstPart = currentLine.substring(0, lastSpaceIndex);
                const secondPart = currentLine.substring(lastSpaceIndex + 1) + char;
                
                result.push(firstPart);
                currentLine = secondPart;
            } else {
                // Принудительный перенос
                result.push(currentLine);
                currentLine = char;
            }
        } else {
            currentLine += char;
        }
    }
    
    // Добавляем последнюю строку, если она не пустая
    if (currentLine) {
        result.push(currentLine);
    }
    
    return result.join('\n'); // Объединяем строки с переносом
}

//дата/время для попапов
function getDate(date) {
    let validateDate = (val) => {return (val < 10) ? "0" + val : val}

    return `${validateDate(date.getDate())}.${validateDate(date.getMonth() + 1)}.${date.getFullYear()} ${validateDate(date.getHours())}:${validateDate(date.getMinutes())}:${validateDate(date.getSeconds())}`
}

//конкретизация текста по командам
function getCmdCodeName(statebit, cmdcode) {
    let cmdDesc = accessData.stringValue(`${cmdcode}.Description`)
    let newcmdDesc;
    switch (true) {
        case (cmdDesc.includes('Включить/Отключить')):
            newcmdDesc = (statebit) ? cmdDesc.replace('Включить/Отключить', 'Отключить') : cmdDesc.replace('Включить/Отключить', 'Включить');
            break;
        case (cmdDesc.includes('Установить/Снять')):    //в защитах кажется должна быть инверсия, надо потестить
            //newcmdDesc = cmdDesc.replace('Установить/Снять', 'Установить')
            newcmdDesc = (statebit) ? cmdDesc.replace('Установить/Снять', 'Снять') : cmdDesc.replace('Установить/Снять', 'Установить');
            break;
        default:
            newcmdDesc = cmdDesc;
            break;
    }
    return newcmdDesc;
}

//возвращает обобщенный результат в виду boolean по состоянию элементов массива blockConditionArray в объекте stateObject
//blockConditionArray имеет вид ['state1', '!state2', 'state3', ...]. (! - инверсия).
//если любое из условий массива в stateObject = true, block вернeт true, иначе false;
function getBlockResult(blockConditionArray, stateObject) {
    return block = blockConditionArray.some(item => {
                                const isNegated = item.startsWith('!');
                                const key = isNegated ? item.slice(1) : item;
                                const value = key in stateObject ? stateObject[key] : false;
                                return isNegated ? !value : value;
                                });
}

//конвертация времени
function timeConvertH (time) {
    hour = Math.floor(time/3600);
    min = Math.floor((time % 3600)/60);
    sec = (time % 3600) % 60;
    newtime = hour.toString().padStart(2, '0') + ":" + min.toString().padStart(2, '0') + ":" + sec.toString().padStart(2, '0');
    return newtime;
}
function timeConvertM (time) {
    min = Math.floor (time / 60);
    sec = (time % 60) % 60;
    newtime = min.toString().padStart(2, '0') + ":" + sec.toString().padStart(2, '0');
    return newtime;
}

//логирование
function LogData(data, functionName) {
    let timeStamp = new Date().toLocaleString();
    let dataMessage = `[${timeStamp}] [Функция: ${functionName}] : ${data}\n: ${data}\n\n`;

    let logFile = `${environment.projectDir()}/scripts/logs.txt`;
    let currentLogs = environment.readFile(logFile, "UTF-8") || "";

    environment.writeFile(currentLogs + dataMessage, logFile);
}