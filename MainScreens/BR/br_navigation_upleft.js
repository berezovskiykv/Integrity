#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "br",
    "bpt",
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.upLeft.brscr"), "upLeft.brscr");

#ONCE_EXECUTION_END

changeWindow(layers, "upLeft.brscr");