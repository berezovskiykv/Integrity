function transformerT(object, path){

    let pathParts = path.split('.');
    let pathParts2 = object.access.stringValue('CONST');
    path = pathParts.slice(0, -2).join('.') + '.' + pathParts2;

    accessData.setIntValue(1, path);
}
