#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "BO/CKPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new CKPopup(publisher, { rootPath : getAliasesPathFromDiagram()});
    //diagram.setDiagramSize(500, 514);
    //diagram.setSize(500, 514);
    showBack(back, "back")
    diagNameMouse = 'ck';

#ONCE_EXECUTION_END
publisher.checkUpdates();


