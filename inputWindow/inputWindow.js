#INCLUDE "managers/objectManager.js"
#INCLUDE "managers/colorsManager.js"
#INCLUDE "managers/aliasManager.js"
#INCLUDE "inputWindow/inputWindowPopup.js"
#INCLUDE "managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new InputWindowPopup(publisher, { 
                                    rootPath : diagram.stringPropValue("tag"),
                                    message : diagram.stringPropValue("message"),
                                    alarm : diagram.stringPropValue("alarm")
                                });
    showBack(back, "back")
    diagNameMouse = popup.tag + 'iw';
#ONCE_EXECUTION_END

popup.inputKey = keyInput();