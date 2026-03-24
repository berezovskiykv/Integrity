#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "br",
    "bpt",
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.downLeft.brscr"), "downLeft.brscr");

#ONCE_EXECUTION_END

changeWindow(layers, "downLeft.brscr");