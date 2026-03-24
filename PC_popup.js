#INCLUDE "script.js"

#ONCE_EXECUTION_BEGIN
    path = getAliasesPathFromDiagram();
   // code = diagram.stringPropValue("CONST");
    //pop_symbol.access.setStringValue(path,"Tag");

#ONCE_EXECUTION_END



function PC(object) {
sysDescr.access.setStringValue(accessData.stringValue(path + ".sysDescr"), "Text");
sysUpTime.access.setStringValue(accessData.stringValue(path + ".sysUpTime.Display"), "Text");

systemServices.access.setStringValue(accessData.doubleValue(path + ".sysServices"), "Text");
systemProcesses.access.setStringValue(accessData.stringValue(path + ".SystemProcesses"), "Text");

let SizeStorage=0;
let UsedStorage=0;
let FreeStorage=0;
let SizeRAM=0;
let UsedRAM=0;
let FreeRAM=0;
let CPUStream="";

 for(let i=2;i<10;i++) {
  SizeStorage=SizeStorage+accessData.doubleValue(path +".hrStorageSize.ind" +i ) ;
  UsedStorage=UsedStorage+accessData.doubleValue(path +".hrStorageUsed.ind" +i ) ;
 }

 FreeStorage=SizeStorage-UsedStorage;
 SizeRAM=accessData.doubleValue(path +".hrStorageSize.ind1")*accessData.doubleValue(path +".hrStorageUnits.ind1") ;
 UsedRAM=accessData.doubleValue(path +".hrStorageUsed.ind1" ) *accessData.doubleValue(path +".hrStorageUnits.ind1");
 FreeRAM=SizeRAM-UsedRAM;

  OZU_all.access.setStringValue((SizeRAM / 1000).toFixed(2), "Text");
  OZU_used.access.setStringValue((UsedRAM / 1000).toFixed(2), "Text");
  OZU_free.access.setStringValue((FreeRAM / 1000).toFixed(2), "Text");

  HDD_all.access.setStringValue(SizeStorage.toFixed(2), "Text");
  HDD_used.access.setStringValue(UsedStorage.toFixed(2), "Text");
  HDD_free.access.setStringValue(FreeStorage.toFixed(2), "Text");

   // portcount.access.setStringValue(port_count, "Text");
  CPUStream=accessData.doubleValue(path +".hrProcessorLoad.ind1");

 for(let i=2;i<7;i++) {
   if (i<5) {
     CPUStream=CPUStream + "/" + accessData.doubleValue(path +".hrProcessorLoad.ind" +i );
   }
  else if (accessData.doubleValue(path +".hrProcessorLoad.ind" +i )>0) {
   CPUStream=CPUStream +   "/" + accessData.doubleValue(path +".hrProcessorLoad.ind" +i );
   }
 }

  CPU.access.setStringValue(CPUStream, "Text");


}



