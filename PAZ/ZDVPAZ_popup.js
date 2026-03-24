#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "PAZ/ZDVPAZParameterPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    //popup = new ZDVPAZParameterPopup(publisher, { rootPath : getAliasesPathFromDiagram() });
    popup = new ZDVPAZParameterPopup(publisher, {});
    showBack(back, "back")
    diagNameMouse = 'zdv_position_1';

#ONCE_EXECUTION_END
publisher.checkUpdates();