#INCLUDE "managers/aliasManager.js"
#INCLUDE "managers/colorManager.js"
#INCLUDE "managers/objectManager.js"
#INCLUDE "managers/diagramManager.js"
#INCLUDE "CE/CEParameterPopup.js"
#INCLUDE "managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new CEParameterPopup(publisher, { rootPath : getAliasesPathFromDiagram() });
    showBack(back, "back")
    diagNameMouse = 'CE32';

#ONCE_EXECUTION_END
publisher.checkUpdates();