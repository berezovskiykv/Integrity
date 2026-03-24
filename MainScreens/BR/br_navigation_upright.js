#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "br",
    "bpt",
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.upRight.brscr"), "upRight.brscr");

#ONCE_EXECUTION_END

changeWindow(layers, "upRight.brscr");