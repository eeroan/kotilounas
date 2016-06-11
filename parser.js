const weekdays = ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai'].map(x=>x.toUpperCase())
const separateWeekDays = strs => strs.map(x=> x.match(new RegExp(`(${weekdays.join('|')})`, 'g')) ? `<br><strong>${x}</strong>` : x).join('<br>')
const stripTags = str => str.replace(/<[^>]+>/g, 'DIVIDER').split('DIVIDER')
    .map(x => x.replace(/&nbsp;/g, '')).filter(x=>x.trim().length)

const mapKoskenranta = str => separateWeekDays(stripTags(str.replace(/[\n|\t]/g, '').match(/(LOUNAS vko.*)<img width="300" height="169"/)[1]))

const mapKahvitupa = str => stripTags(str.replace(/[\n\r]+/g, '')
    .match(/(<table style="width: 830px.*)<img src="images\/footer.jpg/)[1]
    .replace(/<p>&nbsp;<\/p>/g, '')).join('<br>')

module.exports = {
    mapKoskenranta,
    mapKahvitupa
}