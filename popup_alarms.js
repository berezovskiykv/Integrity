#ONCE_EXECUTION_BEGIN
    tag = diagram.stringPropValue("tag");
    filter = accessData.stringValue(tag + ".Description");
    // accessData.setStringValue(filter, "test");
    if (tag) {
        AlarmsHistorical.addFilterCondition('State', 'ActiveAcknowledged', false, 'Or');
        AlarmsHistorical.addFilterCondition('State', 'Active', false, 'And');
        AlarmsHistorical.access.addFilterCondition('MessageContains', filter, 'And')
        }
    else {
        AlarmsHistorical.addFilterCondition('State', 'ActiveAcknowledged', false, 'Or');
        AlarmsHistorical.addFilterCondition('State', 'Active', false, 'Or');
    }
    AlarmsHistorical.applyFilter();
    AlarmsHistorical.access.connect();
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    let start = date.toISOString();
    let finish = date.setDate(date.getDate() + 1);
    finish = date.toISOString();
    AlarmsHistorical.access.setTimeRange(start, finish);
    //AlarmsHistorical.access.clearFilterConditions();

#ONCE_EXECUTION_END
