#INCLUDE "Managers/diagramManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/colorSettings.js"
#INCLUDE "Managers/hover.js"
showBack(back, 'back');
diagNameMouse = 'chpass';
keys = {
    0x01000004: "ent", //return
    0x01000005: "ent", //enter
    0x01000000: "esc" //esc
};
inputKey = 0;
PassLog.setVisible(false,'chagedPass')
function NewPassword(object, objectName) {
    let passCurrent = object.current.access.stringValue("Text");
    let passNew = object.newPass.access.stringValue("Text");
    let mouseEvent;
    let changed;

    if(keys[inputKey] == 'ent'){
        mouseEvent = clickRelease(object.changePass, objectName+'.changePass', true);
        }
    else{
        mouseEvent = clickRelease(object.changePass, objectName+'.changePass');
            }
    if(mouseEvent.action == 'release') {
        changed = securityAgent.changePassword(passCurrent, passNew);
        if(changed)
        {
            object.setVisible(true,'chagedPass')
            object.chagedPass.Text_3.setStringValue("Пароль изменен","Text")
            RGBAColoring(object.chagedPass.state, colors.VLV.Fillstate.open, "FillColor")
        }
        else {
              RGBAColoring(object.chagedPass.state, colors.AP.Flt.act, "FillColor")
              object.chagedPass.Text_3.setStringValue("Пароль не изменен","Text")
            object.setVisible(true,'chagedPass')
        }
           

      }
            
}
function closePass(object, objectName) {
    let mouseEvent;
    if(keys[inputKey] == 'ent'){
        mouseEvent = clickRelease(object, objectName+'', true);
        }
    else{
        mouseEvent = clickRelease(object, objectName+'');
            }
    if(mouseEvent.action == 'release') {
       diagram.close()
      }
            
}