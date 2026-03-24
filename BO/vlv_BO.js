#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "BO/vlv_BO_Param.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new VLVBOPopup(publisher, { rootPath : getAliasesPathFromDiagram(), 
        bWork : diagram.stringPropValue("bWork"), 
        bAlarm: diagram.stringPropValue("bAlarm"), 
        cmd_on : diagram.stringPropValue("cmd_on"), 
        cmd_off : diagram.stringPropValue("cmd_off"),
        bStart: diagram.stringPropValue("bStart"), 
        bStop: diagram.stringPropValue("bStop")});
    //diagram.setDiagramSize(500, 514);
    //diagram.setSize(500, 514);
    showBack(back, "back")
    diagNameMouse = 'vlv_bo';

#ONCE_EXECUTION_END
publisher.checkUpdates();


