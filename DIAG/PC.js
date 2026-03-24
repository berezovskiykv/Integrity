#INCLUDE "DIAG/PC_popup.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new PC_Popup(publisher, { rootPath : getAliasesPathFromDiagram() });
    showBack(back, "back")
    diagNameMouse = 'pc';

#ONCE_EXECUTION_END
publisher.checkUpdates();
