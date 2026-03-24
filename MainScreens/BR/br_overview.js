#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/colorSettings.js"
#INCLUDE "Managers/hover.js"
#INCLUDE "CheckEv.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = 'brOW';
[position, diagNameMouse] = currentPositionPRJ();
switch (position) {
    case 'upLeft':
        DiagramWidget.access.setStringValue('br_nav_upleft', "DiagramName");
        break;
    case 'upRight':
        DiagramWidget.access.setStringValue('br_nav_upright', "DiagramName");
        break;
    case 'downRight':
        DiagramWidget.access.setStringValue('br_nav_downright', "DiagramName");
        break;
        case 'downLeft':
        DiagramWidget.access.setStringValue('br_nav_downleft', "DiagramName");
        break;
}

accessData.setStringValue("br",`HMIVariable.nav.${position}.brscr`);
#ONCE_EXECUTION_END


function checkEvent(object, ALM, WRN, FLT) {
    //какая то реализация динамики квадратиков A W S на кнопках навигации через экземпляр ObsetvableObject
  if (!object.parameter) {
        object.name = objectName;
        object.parameter = new checkEv(object, {ALM : ALM, WRN : WRN, FLT : FLT});
    }
    object.parameter.checkForUpdates();
    
}