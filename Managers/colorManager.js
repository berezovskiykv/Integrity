//не используется - удалить когда нибудь !!!
// //установка цвета заливки по RGB
// function setRGBAColor(object, color){
//     object.access.setRGBAColorValue(color.r, color.g, color.b, color.a, "FillColor");
// }

// //установка цвета линий по RGB
// function setLineRGBAColor(object, color){
//     object.access.setRGBAColorValue(color.r, color.g, color.b, color.a, "LineColor");
// }

// //установка цвета текста по RGB
// function setTextRGBAColor(object, color){
//     object.access.setRGBAColorValue(color.r, color.g, color.b, color.a, "TextColor");
// }
// //установка цвета текста по RGB (c префиксом)
// function setRGBAColorPrefix(object, color, prefix) {
//     object.access.setRGBAColorValue(color.r, color.g, color.b, color.a, prefix + ".FillColor");
// }

function RGBAColoring(object, color, field) {
    object.setRGBAColorValue(color.r, color.g, color.b, color.a, field);
}

function compCol(col1, col2){
    if(col1 == undefined || col2 == undefined) return false;
    return Object.entries(col1).sort().map(x => x[1]).toString() == Object.entries(col2).sort().map(x => x[1]).toString();
}