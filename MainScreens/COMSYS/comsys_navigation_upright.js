#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "drainage",
    "ihg",
    "knspt",
    "apk",
    "kns",

];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.upRight.comsysscr"), "upRight.comsysscr");

#ONCE_EXECUTION_END

changeWindow(layers, "upRight.comsysscr");