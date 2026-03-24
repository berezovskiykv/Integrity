#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
diagNameMouse = 'birg_nav';
layers = [
    "bvu",
    "birg",
    "bkk",
    "bkk2"
];
layerWorker(layers, accessData.stringValue(`HMIVariable.nav.upLeft.birgscr`), `upLeft.birgscr`);

#ONCE_EXECUTION_END
changeWindow(layers, `upLeft.birgscr`);
