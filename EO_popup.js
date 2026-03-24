#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "EO_popupParam.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();

    popup = new EO_popup(publisher, { rootPath : getAliasesPathFromDiagram(), num : diagram.stringPropValue("num"), word2 : diagram.stringPropValue("word2")});
    //diagram.setDiagramSize(500, 514);
    //diagram.setSize(500, 514);
    showBack(back, "back")
    diagNameMouse = 'eo';

#ONCE_EXECUTION_END
publisher.checkUpdates();


