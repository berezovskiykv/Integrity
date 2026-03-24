#INCLUDE "managers/objectManager.js"
#INCLUDE "managers/colorsManager.js"
#INCLUDE "managers/aliasManager.js"
#INCLUDE "errorBox/errorBoxPopup.js"
#INCLUDE "managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new errorBoxPopup(publisher, { 
                                    rootPath : diagram.stringPropValue("tag"),
                                    message : diagram.stringPropValue("message"),
                                });
    showBack(back, "back")
    diagNameMouse = 'eb';
#ONCE_EXECUTION_END
popup.inputKey = keyInput();

