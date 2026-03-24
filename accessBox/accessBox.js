#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/colorsManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "accessBox/accessBoxPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new accessBoxPopup(publisher, { 
                                    rootPath : diagram.stringPropValue("tag"),
                                    message : diagram.stringPropValue("message"),
                                    alarm : diagram.stringPropValue("alarm"),
                                    filter : diagram.stringPropValue("filter"),
                                    value : diagram.stringPropValue("value")

                                });
    showBack(back, "back")
    diagNameMouse = 'ab';
#ONCE_EXECUTION_END
popup.inputKey = keyInput();

// if(popup.keys[popup.inputKey] == 'tab') {
//     popup.myFocus = (popup.myFocus+1) % 2;
// }
