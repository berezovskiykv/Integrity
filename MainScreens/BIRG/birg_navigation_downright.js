#INCLUDE "Managers/diagramManager.js"

#ONCE_EXECUTION_BEGIN
diagNameMouse = 'birg_nav';
layers = [
    "bvu",
    "birg",
    "bkk",
    "bkk2"
];
layerWorker(layers, accessData.stringValue(`HMIVariable.nav.downRight.birgscr`), `downRight.birgscr`);

#ONCE_EXECUTION_END
changeWindow(layers, `downRight.birgscr`);

