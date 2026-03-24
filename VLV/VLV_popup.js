#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "VLV/VlvParameterPopup.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new VlvParameterPopup(publisher, { rootPath : getAliasesPathFromDiagram() });
    
    //размеры окна
    windowSize = {
                    wmin: 540,
                    wmax: 540,
                    hmin: 310,
                    hmax: 566,
                };
    diagram.setDiagramSize(windowSize.wmin, windowSize.hmin);
    diagram.setSize(windowSize.wmin, windowSize.hmin);
    alarmsHideShow.hide.setVisible(false);


    showBack(back, "back")
    diagNameMouse = 'VlvMot';
    
#ONCE_EXECUTION_END
publisher.checkUpdates();
