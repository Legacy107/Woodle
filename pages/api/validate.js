import { promises as fs } from 'fs'
import { join } from 'path'
import { maxGuesses } from '../../utils/gamemodes'

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    const { word } = req.query
    const { length } = word
    const filePath = join(process.cwd(), 'data', `words${length}.txt`)
    const regex = new RegExp(word + '\\r?\\n')

    if (Object.keys(maxGuesses).indexOf(length.toString()) === -1) {
      res.status(400).send('Invalid length')
      resolve()
      return
    }

    fs.readFile(filePath, 'utf-8')
      .then(content => {
        res.status(200).send(regex.test(content))
        resolve()
      })
      .catch(err => {
        console.log(err)
        res.status(500).send(err.message)
        resolve()
      })
  })
}

export const config = {
  unstable_includeFiles: ['data'],
}
