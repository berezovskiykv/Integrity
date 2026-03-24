#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/colorsManager.js"
#INCLUDE "Managers/aliasManager.js"
#INCLUDE "ALGORITM/BhioPumpPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new algconfirmBoxPopupPump(publisher, { 
                                    rootPath : diagram.stringPropValue("tag"),
                                    message : diagram.stringPropValue("message"),
                                    alarm : diagram.stringPropValue("alarm"),
                                    code : diagram.stringPropValue("code"),
                                    popup_num : diagram.stringPropValue("popup_num"),
                                    cmd1 : diagram.stringPropValue("cmd1"),
                                    cmd2 : diagram.stringPropValue("cmd2"),
                                    conf : diagram.stringPropValue("conf")

                                });
    showBack(back, "back")
    diagNameMouse = 'pumppop';
#ONCE_EXECUTION_END
publisher.checkUpdates();
//popup.inputKey = keyInput();

// if(popup.keys[popup.inputKey] == 'tab') {
//     popup.myFocus = (popup.myFocus+1) % 2;
// }
//if(diagram.stringPropValue("conf")==1) {
    if(!accessData.boolValue(diagram.stringPropValue("state"))) {
    diagram.close();
//}
}

