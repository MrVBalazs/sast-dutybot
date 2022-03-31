
module.exports = {
    formatSecondsAsString (time) {
        return `${Math.round(time/60)}ó ${Math.round(((time/60)-Math.floor(time/60))*60)}p`
    }
}