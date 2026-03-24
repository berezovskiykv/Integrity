#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/colorsManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "AlgKSPG/algconfirmBoxPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new algconfirmBoxPopup(publisher, { 
                                    rootPath : diagram.stringPropValue("tag"),
                                    message : diagram.stringPropValue("message"),
                                    alarm : diagram.stringPropValue("alarm"),
                                    code : diagram.stringPropValue("code"),
                                    popup_num : diagram.stringPropValue("popup_num")

                                });
    showBack(back, "back")
    diagNameMouse = 'acb';
#ONCE_EXECUTION_END
publisher.checkUpdates();
//popup.inputKey = keyInput();

// if(popup.keys[popup.inputKey] == 'tab') {
//     popup.myFocus = (popup.myFocus+1) % 2;
// }
    if(!accessData.boolValue(diagram.stringPropValue("state")))
        diagram.close();