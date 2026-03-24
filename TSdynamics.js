function RGBAColoring(r, g, b, a, object, attribute){
	object.access.setRGBAColorValue(r, g, b, a, attribute);
}

function spotlightMP(object){
    let pathOn = getAliasesPath(object);
    let pathOff = pathOn.replace(/..$/, String(Number(pathOn.slice(-2)) + 1).padStart(2, '0'));
    let pathReady = pathOff.replace(/..$/, String(Number(pathOff.slice(-2)) + 1).padStart(2, '0'));

    let connectionOn = accessData.intValue(pathOn + '.Quality');
    let connectionOff = accessData.intValue(pathOff + '.Quality');
    let connectionReady = accessData.intValue(pathReady + '.Quality');

    let on = accessData.intValue(pathOn);
    let off = accessData.intValue(pathOff);
    let ready = accessData.intValue(pathReady);

    object.access.stringValue('name.Text') ? object.name.access.setStringValue(accessData.stringValue(pathOn + '.Name_Object'), 'Text'): {};

    // если есть связь
    if(connectionOn >= 192 && connectionOff >=192 && connectionReady >= 192){
        // если готов
        if(ready){
            if(events.hasMouseClick(objectName)){
                runTumblerPopup(object, object.access.stringValue('CONST'));
            }
            // если включен
            if(on){
                // и одновременно выключен
                if(off){
                    // неопределенность (синий)
                    RGBAColoring.apply(null, Object.values(blueColor).concat(object.indicator.front, 'FillColor'));
                    RGBAColoring.apply(null, Object.values(darkBlueColor).concat(object.indicator.front, 'BackgroundColor'));
                // иначе просто включить (красный)
                } else{
                    RGBAColoring.apply(null, Object.values(redColor).concat(object.indicator.front, 'FillColor'));
                    RGBAColoring.apply(null, Object.values(darkRedColor).concat(object.indicator.front, 'BackgroundColor'));
                }
            // если выключен
            } else{
                // и одновременно включен
                if(!off){
                    // неопределенность (синий)
                    RGBAColoring.apply(null, Object.values(blueColor).concat(object.indicator.front, 'FillColor'));
                    RGBAColoring.apply(null, Object.values(darkBlueColor).concat(object.indicator.front, 'BackgroundColor'));
                // иначе просто выключить (зеленый)
                } else{
                    RGBAColoring.apply(null, Object.values(greenColor).concat(object.indicator.front, 'FillColor'));
                    RGBAColoring.apply(null, Object.values(darkGreenColor).concat(object.indicator.front, 'BackgroundColor'));
                }
            }
        // не готов (жёлтая)
        } else{
            RGBAColoring.apply(null, Object.values(yellowColor).concat(object.indicator.front, 'FillColor'));
            RGBAColoring.apply(null, Object.values(darkYellowColor).concat(object.indicator.front, 'BackgroundColor'));
        }
    // нет связи (маджента)
    } else{
        RGBAColoring.apply(null, Object.values(magentaColor).concat(object.indicator.front, 'FillColor'));
        RGBAColoring.apply(null, Object.values(darkMagentaColor).concat(object.indicator.front, 'BackgroundColor'));
    }


}

//цветовая индикация
function spotlight(object, objprop, name = ''){
    let pathOn = getAliasesPath(objprop);
    let pathOnParts = pathOn.split('.');
    let num = Number(pathOnParts[pathOnParts.length - 1].slice(-2)) + 1;
    if(num > 16){
        let num2 = Number(pathOnParts[pathOnParts.length - 3].slice(-2)) + 1;
        num -= 16;
        pathOnParts[pathOnParts.length - 3] = pathOnParts[pathOnParts.length - 3].replace(/..$/, String(num2).padStart(2, '0'));
    }
    pathOnParts[pathOnParts.length - 1] = pathOnParts[pathOnParts.length - 1].replace(/..$/, String(num).padStart(2, '0'));
    let pathOff = pathOnParts.join('.');

    let connectionOn = accessData.intValue(pathOn + '.Quality');
    let connectionOff = accessData.intValue(pathOff + '.Quality');
    let on = accessData.intValue(pathOn);
    let off = accessData.intValue(pathOff);

    name ? {} : name = accessData.stringValue(pathOn + '.Name_Object');
    object.access.stringValue('name.Text') ? object.access.setStringValue(name, 'name.Text'): {};

    // если есть связь
    if(connectionOn >= 192 && connectionOff >=192){
        // если включен
        if(on){
            // и одновременно выключен
            if(off){
                // неопределенность (синий)
                RGBAColoring.apply(null, Object.values(blueColor).concat(object.indicator.front, 'FillColor'));
                RGBAColoring.apply(null, Object.values(darkBlueColor).concat(object.indicator.front, 'BackgroundColor'));
            // иначе просто включить (красный)
            } else{
                RGBAColoring.apply(null, Object.values(redColor).concat(object.indicator.front, 'FillColor'));
                RGBAColoring.apply(null, Object.values(darkRedColor).concat(object.indicator.front, 'BackgroundColor'));
            }
        // если выключен
        } else{
            // и одновременно включен
            if(!off){
                // неопределенность (синий)
                RGBAColoring.apply(null, Object.values(blueColor).concat(object.indicator.front, 'FillColor'));
                RGBAColoring.apply(null, Object.values(darkBlueColor).concat(object.indicator.front, 'BackgroundColor'));
            // иначе просто выключить (зеленый)
            } else{
                RGBAColoring.apply(null, Object.values(greenColor).concat(object.indicator.front, 'FillColor'));
                RGBAColoring.apply(null, Object.values(darkGreenColor).concat(object.indicator.front, 'BackgroundColor'));
            }
        }
    // нет связи (маджента)
    } else{
        RGBAColoring.apply(null, Object.values(magentaColor).concat(object.indicator.front, 'FillColor'));
        RGBAColoring.apply(null, Object.values(darkMagentaColor).concat(object.indicator.front, 'BackgroundColor'));
    }

}

//вывод названия потребителя
function consumer(object){
    let path = getAliasesPath(object);
    object.consumer.topText.access.setStringValue(accessData.stringValue(path + '.Name_Object'), 'Text');
    let text = accessData.stringValue(path + '.Name_Object1').split(' ');
    object.consumer.bottomText.access.setStringValue((text[0] + '\n' + text.slice(1).join(' ')).trim(), 'Text');
}



