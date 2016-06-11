const mapKoskenranta = (str, currentDate) => separateWeekDays(stripTags(str.replace(/[\n|\t]/g, '').match(/(LOUNAS vko.*)<img width="300" height="169"/)[1]), currentDate)

const mapKahvitupa = str => stripTags(str.replace(/[\n\r]+/g, '')
    .match(/(<table style="width: 830px.*)<img src="images\/footer.jpg/)[1]
    .replace(/<p>&nbsp;<\/p>/g, '')).join('<br>\n')

module.exports = {
    mapKoskenranta,
    mapKahvitupa
}
const weekdays = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai'].map(x=>x.toUpperCase())
const matchWeekday = new RegExp(`(${weekdays.join('|')})`, 'g')
const separateWeekDays = (strs, currentDate)=> {
    return strs.reduce((days, line) => {
        if(line.match(matchWeekday))
            days.push({date: strToDate(line.split(' ')[0]), markup: [`<br><strong>${line}</strong>`]})
        else if(days.length)
            days[days.length - 1].markup.push(line)
        return days
    }, [])
        .filter(({date}) => date >= toMidnight(currentDate))
        .map(({markup}) => markup.join('<br>\n'))
        .join('<br>\n')
}
const stripTags = str => str.replace(/<[^>]+>/g, 'DIVIDER').split('DIVIDER')
    .map(x => x.replace(/&nbsp;/g, '')).filter(x=>x.trim().length)

const strToDate = str => {
    const dmy = str.split('.')
    return new Date(+dmy[2], +dmy[1], +dmy[0])
}

const toMidnight = date => {
    date.setHours(0)
    date.setMinutes(0)
    date.setMilliseconds(0)
    return date
}