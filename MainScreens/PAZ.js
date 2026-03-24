#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "VLV/VlvParameter.js"
#INCLUDE "SIR/SirParameter.js"
#INCLUDE "CE/CEParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "PAZ/AP_PAZ.js"
#INCLUDE "PAZ/ZDVPAZParameter.js"

#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "paz";
[position, diagNameMouse] = currentPositionPRJ();
//active = true;
#ONCE_EXECUTION_END

active = isDiagramActive(diagName, position);