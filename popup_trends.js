
#ONCE_EXECUTION_BEGIN
    TrendsHistorical.removeAllSignals();
    let date = new Date();
    let finish = date.toISOString();
    date.setHours(date.getHours() - 8);
    let start = date.toISOString();
    TrendsHistorical.setTimeRange(start, finish);
    tag = diagram.stringPropValue("tag");
    //tagCount = tags.split(',').length;
    //tagCount > 1 ? tags = tags.split(',') : {};
#ONCE_EXECUTION_END

// TrendsHistorical.addSignal(`NS4|String|HDA.HC.${tags}.val`, 0,0,255);

// if(tagCount > 1){
//     for(let [i, tag] of Object.entries(tags)){
//         let color = generateColor(i, 64);
//         TrendsHistorical.addSignal(`NS4|String|HDA.HC.${tag}.val`, color.r, color.g, color.b);
//     }
// }
// else{
if( !(tag.includes('.BR.')) && (accessData.stringValue(`${tag}.Popup`) != "AP")) {
    
    TrendsHistorical.addSignal(`NS4|String|HDA.HC.${tag}.val`, 0,0,255);
} 
else 
{
    TrendsHistorical.addSignal(`NS4|String|HDA.HC.${tag}`, 0,0,255);
}

        TrendsHistorical.refresh();




function generateColor(count, step){
    let loop = 3*256/step +1;
    let color = {
                    r: 0,
                    g: 0,
                    b: 256
    };

    color.r = Math.max(color.r + (Math.min(count%loop, 256/step) -
                Math.max((count%loop - 256/step), 0))*step, 0);

    color.g = Math.max(color.g - Math.min(count%loop, 256/step)*step, 0) +
                (Math.max(count%loop - 256/step - Math.max(count%loop-256/step*2, 0), 0) -
                Math.max(count%loop-256/step*2, 0))*step;


    color.b = Math.max(color.b - Math.min(count%loop, 256/step*2)*step, 0) + 
                Math.max((count%loop - 256/step*2), 0)*step;
    

    color.r = Math.max(0, color.r-1);
    color.g = Math.max(0, color.g-1);
    color.b = Math.max(0, color.b-1);

    return color;
}

