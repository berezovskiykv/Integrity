#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
   // code = diagram.stringPropValue("CONST");
    //pop_symbol.access.setStringValue(path,"Tag");
	sysDescr.access.setStringValue(accessData.stringValue(path + ".system.sysDescr"), "Text");
#ONCE_EXECUTION_END



function interfaces(object) {
    sysDescr.access.setStringValue(accessData.stringValue(path + ".system.sysName"), "Text");
    sysUpTime.access.setStringValue(accessData.stringValue(path + ".system.sysUpTime.Display"), "Text");

    //let tag = object.access.stringValue("Tag");
    let clr = colors.grayBackColor;
    let port_count = 0;
    let state_text = "Вкл.";
    let i = 1;
    for(i = 1; (accessData.dataExists(path + ".interfaces.ifDescr.port"+i)) && (i < 29); i++) {
        if (accessData.dataExists(path + ".interfaces.ifDescr.port" + i)) {
            port_count++;
            if ((i % 2) > 0) { clr = colors.grayLightColor; } 
            else { clr = colors.grayMidColor; }
            
            setRGBAColorPrefix(object, clr, ".port" + i + ".Field" );

            object.access.setStringValue(i + ".", "port" + i + ".Num.Text");

            object.access.setStringValue(accessData.stringValue(path + ".interfaces.ifDescr.port" + i ) , ".port" + i + ".Name.Text");
            object.access.setStringValue((accessData.doubleValue(path + ".interfaces.ifSpeed.port" + i) / 1048576).toFixed(2), ".port" + i + ".Speed.Text");
            object.access.setStringValue((accessData.doubleValue(path + ".interfaces.ifInOctets.port" +i ) / 1048576).toFixed(2), ".port" + i + ".In.Text");
            object.access.setStringValue((accessData.doubleValue(path + ".interfaces.ifOutOctets.port" + i) / 1048576).toFixed(2), ".port" + i + ".Out.Text");
            object.access.setStringValue((accessData.doubleValue(path + ".interfaces.ifInDiscards.port" + i) / 1048576).toFixed(2), ".port" + i + ".InDiscard.Text");
            object.access.setStringValue((accessData.doubleValue(path + ".interfaces.ifOutDiscards.port" + i) / 1048576).toFixed(2), ".port" + i + ".OutDiscard.Text");

            if (accessData.stringValue(path + ".interfaces.ifOperStatus.port" + i) == 1)  {
                state_text = "Вкл."; 
                clr = colors.greenTextAPColor;
            } else if (accessData.stringValue(path +".interfaces.ifOperStatus.port" +i) == 2) {
                state_text = "Откл."; 
                clr = colors.blackColor;
            } else if (accessData.stringValue(path +".interfaces.ifOperStatus.port" +i) == 3) {
                state_text = "Тест"; 
                clr = colors.brownColor;
            } else  {
                state_text="Н/Д"; 
                clr = colors.grayDarkColor;
            }

            object.access.setStringValue(state_text, ".port" + i + ".State.Text");
            setTextRGBAColorPrefix(object, clr, ".port" + i + ".State" );

            }

    }
    let h_form = 608 - 18 * (29 - i) - 1;
        diagram.setDiagramSize(799, h_form);diagram.setSize(799, h_form);

}




