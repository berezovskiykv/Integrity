#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "eo1",
    "eo2"
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.downRight.energyscr"), "downRight.energyscr");

#ONCE_EXECUTION_END

changeWindow(layers, "downRight.energyscr");