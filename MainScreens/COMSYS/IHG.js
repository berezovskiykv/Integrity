#INCLUDE "DP/DiscreteParameter.js"
#INCLUDE "SIR/SirParameter.js"
#INCLUDE "AP/AnalogParameter.js"
#INCLUDE "ALGORITM/ALGKSPG.js"
#INCLUDE "ALGORITM/ALGPAZ.js"
#INCLUDE "ALGORITM/ALGLSPG.js"
#INCLUDE "ALGORITM/BlockState.js"
#INCLUDE "CheckLink.js"
#ONCE_EXECUTION_BEGIN
showBack(back, 'back');
diagName = "ihg";
//active = true;
diagNameMouse = "ihg"
#ONCE_EXECUTION_END
active = isEmbededDiagramActive('comsys', diagName, 'comsysscr');
