#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "BO/BO_setpoints_param.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new SetpointsBOPopup(publisher, { rootPath : getAliasesPathFromDiagram()});
    //diagram.setDiagramSize(500, 514);
    //diagram.setSize(500, 514);
    showBack(back, "back")
    diagNameMouse = 'sets_bo';

#ONCE_EXECUTION_END
publisher.checkUpdates();


