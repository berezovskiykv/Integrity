#INCLUDE "IO/IOPopup.js"
#INCLUDE "managers/aliasManager.js"
#INCLUDE "managers/colorManager.js"
#INCLUDE "managers/objectManager.js"
#INCLUDE "managers/diagramManager.js"
#INCLUDE "managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new IOPopup(publisher, { rootPath : diagram.stringPropValue("tag")});
    showBack(back, "back")
    diagNameMouse = 'io';

#ONCE_EXECUTION_END
publisher.checkUpdates();
