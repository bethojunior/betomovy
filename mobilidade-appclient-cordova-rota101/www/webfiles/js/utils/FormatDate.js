class FormatDate {
    static brazilianFormat(date) {
        let newDate = new Date(date)
        return newDate.toLocaleString()
    }
}