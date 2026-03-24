#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "eo1",
    "eo2"
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.upRight.energyscr"), "upRight.energyscr");

#ONCE_EXECUTION_END

changeWindow(layers, "upRight.energyscr");