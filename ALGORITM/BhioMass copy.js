#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "ALGORITM/BhioMassPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new BHIOMassPopup(publisher, { rootPath : getAliasesPathFromDiagram() });
    showBack(back, "back")
    diagNameMouse = 'bhiomasspopup';

#ONCE_EXECUTION_END
publisher.checkUpdates();

if(!accessData.boolValue(diagram.stringPropValue("codes"))) {
    diagram.close();
}
