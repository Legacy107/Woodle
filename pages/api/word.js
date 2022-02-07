export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    const { length } = req.query
    const regex = /[^a-z]/g

    fetch(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=${length}&maxLength=${length}&limit=10&api_key=${process.env.WORDNIK_KEY}`)
      .then(response => response.json())
      .then(data => {
        if (data.statusCode && data.statusCode !== 200)
          throw new Error(data.message)

        data = data.map(({word}) => word)
        let sent = false

        for (const word of data)
          if (word.search(regex) === -1) {
            res.status(200).json({word})
            resolve()
            sent = true
            break
          }

        if (!sent)
          throw new Error('Valid word not found')
      })
      .catch(err => {
        console.log(err)
        res.status(500).send(err.message)
        resolve()
      })
  })
}
