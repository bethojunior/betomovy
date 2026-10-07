class ShortWords {
    static reduceText(text) {
        return text.slice(0,45) + ' ...'
    }

    static reduceTextMobile(text) {
        return text.slice(0,30) + ' ...'
    }

    static reduceTextByChars(text,chars) {
        if(text.length >= chars)
            return text.slice(0,chars) + '...'

        return text
    }

    static getFirstWord(text) {
        const splitWords = text.split(" ")

        if(splitWords.length > 1)
            return splitWords[0]

        return text
    }
}