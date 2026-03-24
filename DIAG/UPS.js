#INCLUDE "DIAG/UPS_popup.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new UPS_Popup(publisher, { rootPath : getAliasesPathFromDiagram() });
    showBack(back, "back")
    diagNameMouse = 'ups';

#ONCE_EXECUTION_END
publisher.checkUpdates();
