const mapKoskenranta = (str, currentDate) => separateWeekDays(stripTags(str.replace(/[\n|\t]/g, '').match(/(LOUNAS vko.*)<img width="300" height="169"/)[1]), currentDate)

const mapKahvitupa = str => stripTags(str.replace(/[\n\r]+/g, '')
    .match(/(<table style="width: 830px.*)<img src="images\/footer.jpg/)[1]
    .replace(/<p>&nbsp;<\/p>/g, '')).join('<br>\n')

module.exports = {
    mapKoskenranta,
    mapKahvitupa
}

const weekdays = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai'].map(x=>x.toUpperCase())
const separateWeekDays = (strs, currentDate)=> strs.map(x=>
    x.match(new RegExp(`(${weekdays.join('|')})`, 'g')) ? `WEEKDAY_SEPARATOR${x.split(' ')[0]}KEY_SEPARATOR<br><strong>${x}</strong>` : x)
    .join('<br>')
    .split('WEEKDAY_SEPARATOR')
    .map(x=>x.split('KEY_SEPARATOR'))
    .map(x => ({date:strToDate(x[0]), markup: x[1]}))
    .filter(({date}) => date >= toMidnight(currentDate))
    .map(x=>x.markup).join('').replace(/<br>/g, '<br>\n')
const stripTags = str => str.replace(/<[^>]+>/g, 'DIVIDER').split('DIVIDER')
    .map(x => x.replace(/&nbsp;/g, '')).filter(x=>x.trim().length)

const strToDate = str => {
    const dmy = str.split('.')
    return new Date(+dmy[2],+dmy[1],+dmy[0])
}

const toMidnight = date => {
    date.setHours(0)
    date.setMinutes(0)
    date.setMilliseconds(0)
    return date
}