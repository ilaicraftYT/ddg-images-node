# DDG-Images for Node
DuckDuckGo API Wrapper for images.

## Note
This is a fork of [Le-Val's DDGImages for Deno](https://github.com/Le-Val/ddg-images) but adapted for Node.

## Usage
```js
const { search, SafetyLevels } = require("ddgimages-node")

// remember that await is only for async functions
const duck = await ddiamges.search('ducks')
const nsfw = await ddimages.search('hentai', ddimages.SafetyLevels.STRICT) // doesn't throws any NSFW result

console.log(duck[0]?.image, nsfw[0]?.image)
```
