#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "BO/BO_AP_Param.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new AnalogBOPopup(publisher, { rootPath : getAliasesPathFromDiagram(), cmd_on : diagram.stringPropValue("cmd_on"), cmd_off : diagram.stringPropValue("cmd_off"), type : diagram.stringPropValue("type")});
    //diagram.setDiagramSize(500, 514);
    //diagram.setSize(500, 514);
    showBack(back, "back")
    diagNameMouse = 'ap_bo';

#ONCE_EXECUTION_END
publisher.checkUpdates();


