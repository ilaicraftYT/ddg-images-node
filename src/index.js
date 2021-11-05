/* eslint-disable no-async-promise-executor */
const axios = require("axios").default
const url = "https://duckduckgo.com/"

/**
 * Search images on DuckDuckGo
 * @async
 * @see {@link SafetyLevels} Safetylevels for the safetylevel parameter
 * @param {String} keywords The keywords to search
 * @param {Number} safetylevel The safety level of the search
 * @returns {Promise<Object>} The response from DuckDuckGo
 */
module.exports.search = async function (keywords, safetylevel = 1){
    // headers for the request
    const headers = {
        "authority": "duckduckgo.com",
        "accept": "application/json, text/javascript, */*; q=0.01",
        "sec-fetch-dest": "empty",
        "x-requested-with": "XMLHttpRequest",
        "user-agent": "\
                Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4)\
                AppleWebKit/537.36 (KHTML, like Gecko)\
                Chrome/80.0.3987.163 Safari/537.36\
        ",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "referer": "https://duckduckgo.com/",
        "accept-language": "en-US,en;q=0.9"
    }

    const token = await get_token(keywords)
    if(!token) throw new Error("Invalid token")

    const params = {
        "vqd": token,
        "l": "us-en",
        "f": ",,,",
        "q": keywords,
        "o": "json",
        "p": safetylevel.toString() // Strict by default
    }

    function get_token(_keywords){
        return new Promise(async (resolve, reject) =>{
            try {
                const { data } = await axios.get(url, {
                    params: {
                        q: _keywords
                    }
                })
                // eslint-disable-next-line no-useless-escape
                const token = data.match(/vqd=([\d-]+)\&/)
                resolve(token?.[1])
            } catch (err) {
                if (err instanceof Error)
                    reject(err)
            }
        })
    }

    // image getter
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(url + "i.js", {
                params,
                headers
            })
            resolve(data.results)
        } catch (err) {
            if (err instanceof Error)
                reject(err)
        }
    })
}

/** DuckDuckGo safety levels
 * @constant
 * @type {Object}
 * @property {Number} OFF Without filtering (-2)
 * @property {Number} MODERATE More safe than OFF, but still unsafe (-1)
 * @property {Number} STRICT Strict search (1)
 */
module.exports.SafetyLevels = {
    OFF: -2,
    MODERATE: -1,
    STRICT: 1
}