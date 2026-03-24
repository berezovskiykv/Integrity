#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
layers = [
    "drainage",
    "ihg",
    "knspt",
    "apk",
    "kns",

];
layerWorker(layers, accessData.stringValue("HMIVariable.nav.upLeft.comsysscr"), "upLeft.comsysscr");

#ONCE_EXECUTION_END

changeWindow(layers, "upLeft.comsysscr");