const alterDateFormat = (dates) => {
    let formatted = [];
    let totalYears = [];

    dates.forEach(date => {
        let day = date.slice(8, date.length);
        let month = date.slice(5, 7);
        let year = date.slice(0, 4);

        if(totalYears[totalYears.length - 1] !== year)
            totalYears.push(year);

        switch(month) {
            case '01':
                formatted.push({month: 'January', monthNum: '01', year: year, day: day, date: `${day} Jan ${year}`});
                break;
            case '02':
                formatted.push({month: 'February', monthNum: '02', year: year, day: day, date: `${day} Feb ${year}`});
                break;
            case '03':
                formatted.push({month: 'March', monthNum: '03', year: year, day: day, date: `${day} March ${year}`});
                break;
            case '04':
                formatted.push({month: 'April', monthNum: '04', year: year, day: day, date: `${day} April ${year}`});
                break;
            case '05':
                formatted.push({month: 'May', monthNum: '05', year: year, day: day, date: `${day} May ${year}`});
                break;
            case '06':
                formatted.push({month: 'June', monthNum: '06', year: year, day: day, date: `${day} June ${year}`});
                break;
            case '07':
                formatted.push({month: 'July', monthNum: '07', year: year, day: day, date: `${day} July ${year}`});
                break;
            case '08':
                formatted.push({month: 'August', monthNum: '08', year: year, day: day, date: `${day} Aug ${year}`});
                break;
            case '09':
                formatted.push({month: 'September', monthNum: '09', year: year, day: day, date: `${day} Sept ${year}`});
                break;
            case '10':
                formatted.push({month: 'October', monthNum: '10', year: year, day: day, date: `${day} Oct ${year}`});
                break;
            case '11':
                formatted.push({month: 'November', monthNum: '11', year: year, day: day, date: `${day} Nov ${year}`});
                break;
            case '12':
                formatted.push({month: 'December', monthNum: '12', year: year, day: day, date: `${day} Dec ${year}`});
                break;
        }
    });

    return formatted;
}

const rangeSetter = (first, second, firstDate, secondDate, temp) => {
    // Condition because state changers don't immediatelly alter state
    if(first === null)
        first = firstDate;
    else if (second === null)
        second = secondDate;

    let startDay = first.getDate();
    let startMonth = first.getMonth() + 1;
    let startYear = first.getFullYear();

    let endDay = second.getDate();
    let endMonth = second.getMonth() + 1;
    let endYear = second.getFullYear();

    let arr = [];

    // If selected years are different
    if(startYear < endYear) {
        temp.forEach(element => {
            let tempDay = parseInt(element.newDate.day);
            let tempMonth = parseInt(element.newDate.monthNum);
            let tempYear = parseInt(element.newDate.year);
            
            if(tempYear === startYear) {
                if(tempMonth === startMonth) {
                    if(tempDay >= startDay)
                        arr.push(element);
                    } else if(tempMonth >= startMonth)
                        arr.push(element);
            } else if(tempYear >= startYear && tempYear < endYear) {
                arr.push(element);
            } else if(tempYear === endYear) {
                if(tempMonth === endMonth) {
                    if(tempDay <= endDay)
                        arr.push(element);
                } else if(tempMonth <= endMonth)
                    arr.push(element);
            }
        });

    // If selected years are same
    } else {
        temp.forEach(element => {
            let tempDay = parseInt(element.newDate.day);
            let tempMonth = parseInt(element.newDate.monthNum);
            let tempYear = parseInt(element.newDate.year);

            if(tempYear === endYear) {
                if(tempMonth >= startMonth && tempMonth <= endMonth) {
                    if(startMonth !== endMonth) {
                        if(tempMonth === startMonth) {
                            if(tempDay >= startDay)
                                arr.push(element)
                        } else if(tempMonth === endMonth) {
                            if(tempDay <= endDay)
                                arr.push(element);
                        } else {
                            arr.push(element);
                        }
                    } else {
                        if(tempDay >= startDay && tempDay <= endDay)
                            arr.push(element);
                    }
                }
            }
        });
    }

    return arr
}

export {
    alterDateFormat,
    rangeSetter,
}