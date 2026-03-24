#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "SIR/SirParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "Elem_AP.js"
#INCLUDE "Elem_DP.js"
#INCLUDE "Elem_AT.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"
#INCLUDE "TS_avar.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "lspg";
[position, diagNameMouse] = currentPositionPRJ();
//active = true;
#ONCE_EXECUTION_END

active = isDiagramActive(diagName, position);