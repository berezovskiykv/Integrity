#INCLUDE "Managers/aliasManager.js"
#INCLUDE "Managers/colorManager.js"
#INCLUDE "Managers/objectManager.js"
#INCLUDE "Managers/diagramManager.js"
#INCLUDE "BR_word/BR_popup_wordParam.js"
#INCLUDE "Managers/hover.js"

#ONCE_EXECUTION_BEGIN
    publisher = new Publisher();
    popup = new WordBRPopup(publisher, { rootPath : getAliasesPathFromDiagram(), codes : diagram.stringPropValue("codes") });
    //diagram.setDiagramSize(500, 514);
    //diagram.setSize(500, 514);
    showBack(back, "back")
    diagNameMouse = 'br_word';

#ONCE_EXECUTION_END
publisher.checkUpdates();


