#INCLUDE "managers/aliasManager.js"
#INCLUDE "managers/colorManager.js"
#INCLUDE "managers/objectManager.js"
#INCLUDE "managers/diagramManager.js"
#INCLUDE "DiagModulePopup.js"
#INCLUDE "managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new DiagModulePopup(publisher, { rootPath : getAliasesPathFromDiagram() });
    showBack(back, "back")
    diagNameMouse = 'TN';

#ONCE_EXECUTION_END
publisher.checkUpdates();