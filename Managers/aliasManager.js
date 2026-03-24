// Проверка переменной на содержание значения
function isValue(val) {
    return (val !== undefined && val != null && val != '');
}

//получить алиасы с объекта
function getAliasesPath(object) {
    let tagPath = object.access.stringValue("inputTag");
    return tagPath;
}

function getAliasesPath2(object) {
    let tagPath = object.access.stringValue("inputTag2");
    return tagPath;
}

//получить алиасы с диаграммы
function getAliasesPathFromDiagram() {
    let tagPath = diagram.stringPropValue("inputTag");
    return tagPath;
}


//не используется - удалить когда нибудь !!!
// // Формирование литералов для объекта алиасов
// function setAliases(object) {
//     let path = {
//         Tag: getAliasesPath(object),
//         Codes: object.access.stringValue("CODES")
//     }
//     return path;
// }

// // Формирование литералов для объекта алиасов c диаграммы
// function setAliasesFromDiagram() {
//     let path = {
//         Tag: diagram.stringPropValue("inputTag"),
//         Codes: diagram.stringPropValue("CODES")
//     }
//     return path;
// }
