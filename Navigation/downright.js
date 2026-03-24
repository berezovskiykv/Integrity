#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "paz",
    "overview",
    "birg",
    "br",
    "lspg",
    "bsbo",
    "bpaiv",
    "comsys",
    "energy",
    "diag",
    "sphr"
];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.downRight.main"), "downRight.main");

#ONCE_EXECUTION_END

changeWindow(layers, "downRight.main");