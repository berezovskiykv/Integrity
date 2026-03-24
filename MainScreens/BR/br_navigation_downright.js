#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "br",
    "bpt",
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.downRight.brscr"), "downRight.brscr");

#ONCE_EXECUTION_END

changeWindow(layers, "downRight.brscr");