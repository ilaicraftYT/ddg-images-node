/* eslint-disable no-async-promise-executor */
const axios = require("axios").default
const url = "https://duckduckgo.com/"

/**
 * The object result provided by the search function
 * @typedef {Object} Result
 * @property {Number} width The width of the image
 * @property {Number} height The height of the image
 * @property {String} thumbnail Image thumbnail
 * @property {String} image The image url
 * @property {String} title The title of the image
 * @property {String} url The site where the image was found
 * @property {String} source The search engine results like Google or Bing
 */

/**
 * Search images on DuckDuckGo
 * <br><b>SafetyLevel parameter default is STRICT</b>
 * @async
 * @see {@link SafetyLevels} for the safetylevel parameter
 * @param {String} keywords The keywords to search
 * @param {SafetyLevels} safetylevel The safety level of the search
 * @returns {Promise<Result[]>} An array of results of the image search
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

    const token = await getToken(keywords)
    if(!token) throw new Error("Invalid token")

    const params = {
        "vqd": token,
        "l": "us-en",
        "f": ",,,",
        "q": keywords,
        "o": "json",
        "p": safetylevel.toString() // Strict by default
    }

    function getToken(_keywords){
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
 * @typedef {Object} SafetyLevels
 * @property {Number} OFF Without filtering (-2)
 * @property {Number} MODERATE More safe than OFF, but still unsafe (-1)
 * @property {Number} STRICT Strict search (1)
 */
module.exports.SafetyLevels = {
    OFF: -2,
    MODERATE: -1,
    STRICT: 1
}