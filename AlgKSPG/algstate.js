#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "AlgKSPG/algstatePopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new algStatePopup(publisher, { rootPath : getAliasesPathFromDiagram() });
    showBack(back, "back")
    diagNameMouse = 'algstate';

#ONCE_EXECUTION_END
publisher.checkUpdates();
