function analog(object){
    print(object, getAliasesPath(object), 0);
    runPopup(object);
}

function runPopup(object){
    let mouseEvent = click(object);
    if(mouseEvent){
        let posX = mouseEvent['globalPosX'];
        let posY = mouseEvent['globalPosY'];
        let path = getAliasesPath(object);
        let aliases = getAliases(object);
        let popupName = accessData.stringValue(path + '.Popup');
        let tryLoad = accessDiagram.loadAndRunDiagram(popupName, path);
        if(tryLoad){
            let diagramWindow = accessDiagram.getWindow(path);
            diagramWindow.winTitle = 'Аналоговый параметр';
            diagramWindow.setStringPropValue(aliases.ADMPREFIX, "ADMPREFIX");
            diagramWindow.setStringPropValue(aliases.NODE, "NODE");
            diagramWindow.setStringPropValue(aliases.OBJ, "OBJ");
            diagramWindow.setStringPropValue(aliases.SUBJ, "SUBJ");
            diagramWindow.setStringPropValue(aliases.TAG, "TAG");
            diagramWindow.setStringPropValue(aliases.CONST, "CONST");

            posX + diagramWindow.width > 1920 ? posX -= posX + diagramWindow.width - 1920 : {};
            posY + diagramWindow.height > 1080 ? posY -= posY + diagramWindow.height - 1080 : {};
            diagramWindow.setPos(posX, posY);

        } else{
            return 0;
        }
    }
}

function fillPopup(object){
    let path = getAliasesPathFromDiagram();
    let data = getDataAp(path);

    let header = accessData.stringValue(path + '.Name_Object1') + '\n' + accessData.stringValue(path + '.Name_Object');
    object.access.stringValue('header.Text') ? object.access.setStringValue(header, 'header.Text') : {};

    object.access.stringValue('field.value.Text') ? object.access.setStringValue(accessData.doubleValue(path).toFixed(0), 'field.value.Text') : {};
    object.access.stringValue('field.unit.Text') ? object.access.setStringValue(accessData.stringValue(path + '.EUnit'), 'field.unit.Text') : {};

    let i = 1;
    for(let param in data){
        object.access.stringValue('param' + i.toString() + '.Text') ? object.access.setStringValue(accessData.stringValue(data[param] + '.Description'), 'param' + i.toString() + '.Text') : {};
        object.access.stringValue('value' + i.toString() + '.Text') ? object.access.setStringValue(accessData.doubleValue(data[param]).toFixed(0), 'value' + i.toString() + '.Text') : {};
        object.access.stringValue('unit' + i.toString() + '.Text') ? object.access.setStringValue(accessData.stringValue(data[param] + '.EUnit'), 'unit' + i.toString() + '.Text') : {};
        i++;
    }
}

function runIW(object, path){
    let mouseEvent = click(object);
    if(mouseEvent){
        let posX = mouseEvent['globalPosX'];
        let posY = mouseEvent['globalPosY'];
        path = getDataAp(path)['param' + objectName.split('value')[1]];
        let tryLoad = accessDiagram.loadAndRunDiagram('inputWindow', path);
        if(tryLoad){
            let diagramWindow = accessDiagram.getWindow(path);
            diagramWindow.winTitle = 'Окно ввода';
            diagramWindow.setStringPropValue(path, 'TAG');

            posX + diagramWindow.width > 1920 ? posX -= posX + diagramWindow.width - 1920 : {};
            posY + diagramWindow.height > 1080 ? posY -= posY + diagramWindow.height - 1080 : {};
            diagramWindow.setPos(posX, posY);

        } else{
            return 0;
        }
    }
}

function write(object){

    if(click(object)){
        let path = diagram.stringPropValue('TAG');
        let button = objectName.split('button')[1];
        let displayValue = display.access.stringValue('Text');

        switch(button){
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                display.access.setStringValue(Number(displayValue + button), 'Text');
                break;

            case 'Clear':
                display.access.setStringValue('0', 'Text');
                break;

            case 'Backspace':
                 if(displayValue.length == 1){
                     display.access.setStringValue('0', 'Text');
                } else{
                    display.access.setStringValue(displayValue.slice(0, -1), 'Text');
                }
                break;

            case 'Dot':
                if(!displayValue.includes('.')){
                    display.access.setStringValue(displayValue + '.', 'Text');
                }
                break;

            case 'Minus':
                display.access.setStringValue(Number(displayValue) * -1, 'Text');
                break;

            case 'Cancel':
                accessDiagram.getWindow(path).close();
                break;

            case 'OK':
                accessData.setStringValue(displayValue, path + '.wvalue');
                accessDiagram.getWindow(path).close();
                break;
        }
    }
}

function runAlarmPopup(object, path)
{
    if (click(object)){
       accessDiagram.loadAndRunDiagram('popup_alarms', 'popupAlarms');
       let diagramWindow = accessDiagram.getWindow('popupAlarms')
       diagramWindow.setStringPropValue(path, 'tag')
    }
}


function runTrendPopup(object, path){
    if (click(object)){
        accessDiagram.loadAndRunDiagram('popup_trends', 'popupTrends');
        let diagramWindow = accessDiagram.getWindow('popupTrends');
        diagramWindow.setStringPropValue(path, 'tag');
    }
}

function runTumblerPopup(object, path){
    let mouseEvent = click(object);
    if(mouseEvent){
        let posX = mouseEvent['globalPosX'];
        let posY = mouseEvent['globalPosY'];
        let tryLoad = accessDiagram.loadAndRunDiagram('popup_tumbler', path);
        if(tryLoad){
            let diagramWindow = accessDiagram.getWindow(path);
            diagramWindow.setStringPropValue(path, 'TAG'); // откуда берется состояние
            diagramWindow.setStringPropValue(getAliasesPath(object), 'tag'); // куда записывать(для мотор-привода)
            object.access.stringValue('name.Text') ? {} : diagramWindow.setStringPropValue('fider', 'type');
            object.access.stringValue('Tooltip') == 'Мотор-привод' ? diagramWindow.setStringPropValue('mp', 'type') : {};

            posX + diagramWindow.width > 1920 ? posX -= posX + diagramWindow.width - 1920 : {};
            posY + diagramWindow.height > 1080 ? posY -= posY + diagramWindow.height - 1080 : {};
            diagramWindow.setPos(posX, posY);

        } else{
            return 0;
        }
    }
}

function tumblerPopupMessage(object){
    let path = diagram.stringPropValue('TAG');
    let pathParts  = path.split('.');
    let bitNum = Number(pathParts[pathParts.length - 1].slice(-2));
    pathParts[pathParts.length - 2] = 'cmd.in';
    let curState = accessData.doubleValue(path);

    if(diagram.stringPropValue('type') == 'fider'){
        bitNum -= 9;
        if(bitNum < 1){
            bitNum += 16;
            pathParts[pathParts.length - 3] = pathParts[pathParts.length - 3].replace(/..$/, String(Number(pathParts[pathParts.length - 3].slice(-2)) - 1).padStart(2, '0'));
        }
    } else if(diagram.stringPropValue('type') == 'mp'){
        curState = accessData.doubleValue(path.replace(/..$/, String(bitNum + Math.floor(bitNum/2)).padStart(2, '0')));
    }

    let pathCMD = pathParts.slice(0, -1).join('.');

    if(!curState){
        object.access.setStringValue('Подтвердите действие: ' + accessData.stringValue(pathCMD + String(bitNum) + '.Description'), 'Text');
    } else{
        if(bitNum<16){
            object.access.setStringValue('Подтвердите действие: ' + accessData.stringValue(pathCMD + String(bitNum+1) + '.Description'), 'Text');
        } else{
            let sts = Number(pathParts[pathParts.length - 3].slice(-2)) + 1;
            pathParts[pathParts.length - 3] = pathParts[pathParts.length - 3].replace(/..$/, String(sts).padStart(2, '0'));
            pathCMD = pathParts.slice(0, -1).join('.');
            object.access.setStringValue('Подтвердите действие: ' + accessData.stringValue(pathCMD + '1.Description'), 'Text');
        }
    }

}

function tumblerPopup(object){
    // для мотор-привода где-то есть смещение, где-то нет
    // для фидеров смещение 9
    // для выключателей всё норм
    if(click(object)){
        let button = objectName.split('button')[1];
        if(button == 'OK'){
            let path = diagram.stringPropValue('TAG');
            let pathParts = path.split('.');
            let bitNum = Number(pathParts[pathParts.length - 1].slice(-2));
            let pathCMD;
            let curState = accessData.intValue(path);
            let value1 = 1; // команда включить
            let value2 = 0; // команда выключить


            if(diagram.stringPropValue('type') == 'fider'){
                bitNum -= 9;
                if(bitNum < 1){
                    bitNum += 16;
                    let sts = Number(pathParts[pathParts.length - 3].slice(-2)) - 1;
                    pathParts[pathParts.length - 3] = pathParts[pathParts.length - 3].replace(/..$/, String(sts).padStart(2, '0'));
                }
            } else if(diagram.stringPropValue('type') == 'mp'){
                curState = accessData.intValue(diagram.stringPropValue('tag'));
            }

            if(curState){
                value1 = 0;
                value2 = 1;
            }

            pathCMD = pathParts.slice(0, -2).join('.') + '.cmd.in';
            accessData.setIntValue(value1, pathCMD + String(bitNum));

            if(bitNum == 16){
                let sts = Number(pathParts[pathParts.length - 3].slice(-2)) + 1;
                pathParts[pathParts.length - 3] = pathParts[pathParts.length - 3].replace(/..$/, String(sts).padStart(2, '0'));
                pathCMD = pathParts.slice(0, -2).join('.') + '.cmd.in';

                accessData.setIntValue(value2, pathCMD + '1');
            } else{
                accessData.setIntValue(value2, pathCMD + String(bitNum+1));
            }

        }
        let diagramWindow = accessDiagram.getWindow(getAliasesPathFromDiagram());
        diagramWindow.close();
    }
}

function runGpesPopup(object, path){
    let mouseEvent = click(object);
    if(mouseEvent){
        let posX = mouseEvent['globalPosX'];
        let posY = mouseEvent['globalPosY'];
        let tryLoad = accessDiagram.loadAndRunDiagram('popup_gpesParam', path);
        if(tryLoad){
            let diagramWindow = accessDiagram.getWindow(path);
            diagramWindow.setStringPropValue(path, 'TAG');
            diagramWindow.winTitle = 'Параметры ГПЭС';

            posX + diagramWindow.width > 1920 ? posX -= posX + diagramWindow.width - 1920 : {};
            posY + diagramWindow.height > 1080 ? posY -= posY + diagramWindow.height - 1080 : {};
            diagramWindow.setPos(posX, posY);

        } else{
            return 0;
        }
    }
}


function runStatesPopup(object, path, numBits = 16){
    let text = accessData.stringValue(path.split('.').slice(0, -2).join('.') + '.Name_Object1').split(' ');
    text = (text.slice(0, 2).join(' ') + '\n' + text.slice(2).join(' ')).replace(/НМ(.*)/, '').trim()
    object.access.stringValue('value.descrip.Text') ? object.access.setStringValue(text, 'value.descrip.Text') : {};   // текст в поле

    let mouseEvent = click(object);
    if(mouseEvent){
        let posX = mouseEvent['globalPosX'];
        let posY = mouseEvent['globalPosY'];
        let tryLoad = accessDiagram.loadAndRunDiagram('popup_states', path);
        if(tryLoad){
            let diagramWindow = accessDiagram.getWindow(path);
            diagramWindow.setStringPropValue(path, 'TAG');
            diagramWindow.setStringPropValue(numBits, 'CONST');
            diagramWindow.winTitle = text;

            posX + diagramWindow.width > 1920 ? posX -= posX + diagramWindow.width - 1920 : {};
            posY + diagramWindow.height > 1080 ? posY -= posY + diagramWindow.height - 1080 : {};
            diagramWindow.setPos(posX, posY);

        } else{
            return 0;
        }
    }
}

function states(object){
    let path = diagram.stringPropValue('TAG');
    let pathParts = path.split('.');

    let stsNum = Number(pathParts[pathParts.length-3].slice(-2));
    let bitNum = Number(pathParts[pathParts.length-1].slice(-2));
    let numBits = Number(diagram.stringPropValue('CONST'));


    let text = accessData.stringValue(diagram.stringPropValue('TAG').split('.').slice(0, -2).join('.') + '.Description');
    object.access.setStringValue(text, 'header.Text');

    for(let i=1; i < numBits+1; i++){
        object.access.setStringValue(accessData.stringValue(pathParts.join('.') + '.Description'), 'i' + String(i) + '.text.Text');

        let curBit = accessData.intValue(pathParts.join('.'));
        if(curBit){
            RGBAColoring.apply(null, Object.values(yellowColor).concat(object, 'j' + String(i) + '.FillColor'));
            object.access.setStringValue(true, 'j' + String(i) + '.Tooltip');
        } else{
            RGBAColoring.apply(null, Object.values(darkGrayColor).concat(object, 'j' + String(i) + '.FillColor'));
            object.access.setStringValue(false, 'j' + String(i) + '.Tooltip');
        }

        if(bitNum % 16 == 0){
            stsNum += 1;
            pathParts[pathParts.length-3] = pathParts[pathParts.length-3].replace(/..$/, String(stsNum).padStart(2, '0'));

            bitNum -= 15;
            pathParts[pathParts.length-1] = pathParts[pathParts.length-1].replace(/..$/, String(bitNum).padStart(2, '0'));
        } else{
            bitNum += 1;
            pathParts[pathParts.length-1] = pathParts[pathParts.length-1].replace(/..$/, String(bitNum).padStart(2, '0'));
        }
    }

    for(let i=numBits+1; i < 19; i++){
        object.access.setStringValue('Не используется', 'i' + String(i) + '.text.Text');
        object.access.setStringValue('', 'j' + String(i) + '.Tooltip');
    }
}

function runNMPopup(object, path){
    let mouseEvent = click(object);
    if(mouseEvent){
        let posX = mouseEvent['globalPosX'];
        let posY = mouseEvent['globalPosY'];
        let tryLoad = accessDiagram.loadAndRunDiagram('popup_nm', path);
        if(tryLoad){
            let diagramWindow = accessDiagram.getWindow(path);
            diagramWindow.setStringPropValue(path, 'TAG');
            diagramWindow.setStringPropValue(object.access.stringValue('CONST'), 'CONST');
            diagramWindow.winTitle = 'Команды управления НМ';

            posX + diagramWindow.width > 1920 ? posX -= posX + diagramWindow.width - 1920 : {};
            posY + diagramWindow.height > 1080 ? posY -= posY + diagramWindow.height - 1080 : {};
            diagramWindow.setPos(posX, posY);

        } else{
            return 0;
        }
    }
}

function NMPopup(object, numBits1 = 8, numBits2 = 8){
    let path = diagram.stringPropValue('TAG');

    object.access.setStringValue(accessData.stringValue(path + '.cmd.Description'), 'header.Text');

    for(let i=1; i < numBits1+1; i++){
        object.access.setStringValue(accessData.stringValue(path + '.cmd.in' + String(i) + '.Description'), 'i' + String(i) + '.Text');
    }
    for(let j=1; j < numBits2+1; j++){
        object.access.setStringValue(accessData.stringValue(path + '.cmd1.in' + String(j) + '.Description'), 'j' + String(j) + '.Text');
    }

    for(let i=numBits1+1; i < 17; i++){
        object.access.setStringValue('Не используется', 'i' + String(i) + '.Text');
    }
    for(let j=numBits2+1; j < 17; j++){
        object.access.setStringValue('Не используется', 'j' + String(j) + '.Text');
    }
}

function NMPopupButtons(object, end = '.cmd.in'){
    let mouseEvent = click(object);
    if(object.access.stringValue('Text') != 'Не используется' && mouseEvent){
        let path = diagram.stringPropValue('TAG');
        let value = Number(objectName.split('.')[1].slice(1));
        while(value>16){
            value -= 16;
            path = path.replace(/..$/,String(Number(path.slice(-2))+1).padStart(2, '0'));
        }

        accessData.setIntValue(1, path + end + String(value));
    }
}

function runLSPopup(object, path){
    let text = accessData.stringValue(path + '.cmd.Description').split(' ').slice(3);
    text = text.slice(0, 2).join(' ') + '\n' + text.slice(2+3).join(' ');
    object.access.stringValue('value.descrip.Text') ? object.access.setStringValue(text, 'value.descrip.Text') : {};   // текст в поле

    let mouseEvent = click(object);
    if(mouseEvent){
        let posX = mouseEvent['globalPosX'];
        let posY = mouseEvent['globalPosY'];
        let tryLoad = accessDiagram.loadAndRunDiagram('popup_ls', path);
        if(tryLoad){
            let diagramWindow = accessDiagram.getWindow(path);
            diagramWindow.setStringPropValue(path, 'TAG');
            diagramWindow.setStringPropValue(object.access.stringValue('CONST'), 'CONST');
            diagramWindow.winTitle = text;

            posX + diagramWindow.width > 1920 ? posX -= posX + diagramWindow.width - 1920 : {};
            posY + diagramWindow.height > 1080 ? posY -= posY + diagramWindow.height - 1080 : {};
            diagramWindow.setPos(posX, posY);

        } else{
            return 0;
        }
    }
}

function LSPopup(object, numBits1 = 8, numBits2 = 8){
    let path = diagram.stringPropValue('TAG');
    let pathParts = path.split('.');
    let end = pathParts[pathParts.length-1];
    let bitNum = 1;
    let stsNum = Number(pathParts[pathParts.length-1].slice(-2));

    object.access.setStringValue(accessData.stringValue(path + '.cmd.Description'), 'header.Text');

    for(let i=1; i < numBits1+1; i++){
        object.access.setStringValue(accessData.stringValue(pathParts.join('.') + '.cmd.in' + String(bitNum) + '.Description'), 'i' + String(i) + '.Text');
        bitNum += 1;
        if(bitNum > 16){
            bitNum -= 16;
            stsNum += 1;
            pathParts[pathParts.length-1] = pathParts[pathParts.length-1].replace(/..$/, String(stsNum).padStart(2, '0'));
        }
    }

    bitNum = 1;
    pathParts[pathParts.length-1] = end;
    stsNum = Number(pathParts[pathParts.length-1].slice(-2));

    for(let j=1; j < numBits2+1; j++){
        object.access.setStringValue(accessData.stringValue(pathParts.join('.') + '.cmd1.in' + String(bitNum) + '.Description'), 'j' + String(j) + '.Text');
        bitNum += 1;
        if(bitNum > 16){
            bitNum -= 16;
            stsNum += 1;
            pathParts[pathParts.length-1] = pathParts[pathParts.length-1].replace(/..$/, String(stsNum).padStart(2, '0'));
        }
    }

    for(let i=numBits1+1; i < 19; i++){
        object.access.setStringValue('Не используется', 'i' + String(i) + '.Text');
    }
    for(let j=numBits2+1; j < 19; j++){
        object.access.setStringValue('Не используется', 'j' + String(j) + '.Text');
    }
}

function click(object){
    let mouseEvent = events.mouseClick(objectName);
    let tmpEnableProcess = (!0 | (mouseEvent.modifiers & 0x04000000)) &&
        (!0 | (mouseEvent.modifiers & 0x02000000)) &&
        (!1 | (mouseEvent.button & 0x00000001)) &&
        (!0 | (mouseEvent.button & 0x00000002));
    if (object.clicked === undefined) {
        object.clicked = 0;
    }
    if (tmpEnableProcess && (mouseEvent.timeStamp != object.clicked)) {
        object.clicked = mouseEvent.timeStamp;
        return mouseEvent;
    }
    return false;
}



function baseLog(base, value){
    return Math.log(value) / Math.log(base);
}









