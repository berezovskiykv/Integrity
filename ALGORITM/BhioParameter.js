#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "ALGORITM/BhioPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new BHIOPopup(publisher, { rootPath : getAliasesPathFromDiagram(),
        LT91 : diagram.stringPropValue("tagLT91"), LT92 : diagram.stringPropValue("tagLT92")
     });
    showBack(back, "back")
    diagNameMouse = 'bhiopopup';

#ONCE_EXECUTION_END
publisher.checkUpdates();

if(!accessData.boolValue(diagram.stringPropValue("codes"))) {
    diagram.close();
}
