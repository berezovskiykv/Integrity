#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "AP_BR/BR_popupParam.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new AnalogBRPopup(publisher, { rootPath : getAliasesPathFromDiagram() });
    //diagram.setDiagramSize(500, 514);
    //diagram.setSize(500, 514);
    showBack(back, "back")
    diagNameMouse = 'ap_br';

#ONCE_EXECUTION_END
publisher.checkUpdates();


