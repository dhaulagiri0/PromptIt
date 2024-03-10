export default function() {
    function includeSetOfWords(prompt: string, setOfWords: string[]) {
        var res = 0
        prompt.split(" ").forEach(word => {
            if (setOfWords.includes(word)) {
                setOfWords = setOfWords.filter(e => e !== word) // remove word from set
                res += 2
            }
        })
        return res
    }

    function hardWordLimit(prompt: string, limit: number) {
        var l = prompt.split(" ").length
        if ( l == limit) {
          return 20
        }
        else if (l < limit) {
          return 5
        }
        else {
          return 0
        }
    }

    function excludeWords(prompt: string, words: string[]) {
        prompt.split(" ").forEach(word => {
            if (words.includes(word)) {
                words = words.filter(e => e !== word) // remove word from set
            }
        })
        return words.length * 2
    }

    function individualWordCharLimit(prompt: string, limit: number) {
        if (prompt.split(" ").every(word => {word.length > limit})) {
            return 5
        } else {return 0}
    }

    return {
        includeSetOfWords,
        hardWordLimit,
        excludeWords,
        individualWordCharLimit
    }
}