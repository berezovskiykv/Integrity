#INCLUDE "MainScreens/ENERGY/ENERGY.js"
#INCLUDE "Elem_TS.js"
#INCLUDE "CheckLink.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "eo2";
//active = true;
diagNameMouse = "eo2"
#ONCE_EXECUTION_END
active = isEmbededDiagramActive('energy', diagName, 'energyscr');