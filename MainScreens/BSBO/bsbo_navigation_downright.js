#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "bs",
    "bo",
    "drain_column",
    "bo_bkk"
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.downRight.bsboscr"), "downRight.bsboscr");

#ONCE_EXECUTION_END

changeWindow(layers, "downRight.bsboscr");