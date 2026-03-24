#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "AlgKSPG/alg_setpointsPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new ALGSetpointsPopup(publisher, {});
    showBack(back, "back")
    diagNameMouse = 'algset';

#ONCE_EXECUTION_END
publisher.checkUpdates();