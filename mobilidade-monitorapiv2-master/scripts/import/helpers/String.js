
exports.onlyNumbersAndLetters = function (string) {
    return string.toString().replace(/[^a-z0-9]/gi, '').trim()
}
