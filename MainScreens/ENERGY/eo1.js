#INCLUDE "MainScreens/ENERGY/ENERGY.js"
#INCLUDE "Elem_TS.js"
#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "CheckLink.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "eo1";
//active = true;
diagNameMouse = "eo1"
#ONCE_EXECUTION_END
active = isEmbededDiagramActive('energy', diagName, 'energyscr');