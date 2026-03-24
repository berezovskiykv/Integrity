#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "AP/AnalogParameterPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new AnalogParameterPopup(publisher, { rootPath : getAliasesPathFromDiagram() });

    windowSize = {

                    wmin: 500,
                    wmax: 996,
                    hmin: 580,
                    hmax: 580,
                };
    diagram.setDiagramSize(windowSize.wmin, windowSize.hmin);
    diagram.setSize(windowSize.wmin, windowSize.hmin);
    alarmsHideShow.hide.setVisible(false);


    showBack(back, "back")
    diagNameMouse = 'AP';

#ONCE_EXECUTION_END
publisher.checkUpdates();


