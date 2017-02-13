const mapKoskenranta = (str, currentDate) => {
    const match = str.replace(/[\n|\t]/g, '').match(/(LOUNASMENU VKO.*)<img width="2480" height="705/)
    return match ? separateWeekDays(stripTags(match[1]), currentDate) : 'Ei tietoja'
}
const mapKahvitupa = str => stripTags(str.replace(/[\n\r]+/g, '')
    .match(/(<table style="width: 830px.*)<img src="images\/footer.jpg/)[1]
    .replace(/<p>&nbsp;<\/p>/g, '')).join('<br>\n')

const formatToday = () => {
    const today = new Date()
    return `${weekdays[today.getDay()]} ${today.getDate()}.${today.getMonth() + 1}`
}

const mapDylanArabia = html => {
    try {
        return html.split('<p>').slice(1).join('\n').split('</div>')[0].replace(/(\d)\s*€/g, '$1&nbsp;€')
    } catch (e) {
        console.error(e)
        return 'N/A'
    }
}

module.exports = {
    mapKoskenranta,
    mapKahvitupa,
    formatToday,
    mapDylanArabia
}
const weekdays = ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'].map(x => x.toUpperCase())
const matchWeekday = new RegExp(`(${weekdays.join('|')})`, 'g')
const separateWeekDays = (strs, currentDate) => {
    const currentMidnight = toMidnight(currentDate)
    return strs.reduce((days, line) => {
        if(line.match(matchWeekday))
            days.push({date: strToDate(line.split(/\s+/)[0]), markup: [`<br><strong>${line}</strong>`]})
        else if(days.length)
            days[days.length - 1].markup.push(line)
        return days
    }, [])
        .filter(({date}) => date >= currentMidnight)
        .sort((a, b) => a.date > b.date)
        .map(({date, markup}) => markup.join('<br>\n'))
        .join('<br>\n')
}
const stripTags = str => str.replace(/<[^>]+>/g, 'DIVIDER').split('DIVIDER')
    .map(x => x.replace(/&nbsp;/g, '')).filter(x => x.trim().length)

const strToDate = str => {
    const dmy = str.split('.')
    return new Date(+dmy[2], (+dmy[1] - 1), +dmy[0])
}

const toMidnight = date => {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}
