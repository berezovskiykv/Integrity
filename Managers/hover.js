#ONCE_EXECUTION_BEGIN
objs = {};
hoverMain = events.mouseHover('back');
back.hover = hoverMain;
back.hoverTime = Date.now();
objs['back'] = back.hoverTime;
#ONCE_EXECUTION_END

hoverMain = events.mouseHover('back');
if(hoverMain.globalPosX == back.hover.globalPosX && hoverMain.globalPosY == back.hover.globalPosY){

}
else{
    accessData.setStringValue(diagNameMouse, 'HMIVariable.mouse');
    back.hover = hoverMain;
    back.hoverTime = Date.now();
    objs['back'] = back.hoverTime;
}