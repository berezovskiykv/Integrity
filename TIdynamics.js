// вывод данных
function print(object, path, fracDigits = 2){

    object.access.stringValue('value.text.Text') ? object.access.setStringValue(accessData.doubleValue(path).toFixed(fracDigits), 'value.text.Text') : {};   // зачение
    object.access.stringValue('value.text.Text') ? object.access.setStringValue(accessData.stringValue(path + '.Description'), 'Tooltip') : {}; // тултип
    object.access.stringValue('name1.Text') ? object.access.setStringValue(accessData.stringValue(path + '.ID'), 'name1.Text') : {};    // обозначение на схеме
    object.access.stringValue('name.Text') ? object.access.setStringValue(accessData.stringValue(path + '.Description').split(' ').slice(3).join(' '), 'name.Text') : {};   // параметры ГПЭС
    object.access.stringValue('unit.Text') ? object.access.setStringValue(accessData.stringValue(path + '.EUnit'), 'unit.Text') : {};   // единица измерения


}



