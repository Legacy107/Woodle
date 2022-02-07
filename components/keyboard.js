import clsx from 'clsx'
import styles from './keyboard.module.scss'

export default function Keyboard({word, guesses}) {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ]
  const charStatus = Object.fromEntries(
    rows.reduce((res, row) => [
      ...res,
      ...(row.map(char => [char, -1]))
    ], [])
  )

  guesses.forEach(guess => {
    Array.from(guess).forEach((char, idx) => {
      let value = 0;
      if (word[idx] === char)
        value = 2
      else if (word.indexOf(char) !== -1)
        value = 1
      charStatus[char] = Math.max(charStatus[char], value)
    })
  })

  return (
    <div className={styles.container}>
    { rows.map((row, rowId) => (
        <div key={`keyboard-row-${rowId}`} className={styles.row}>
        { row.map(char => (
            <div
              className={clsx(
                styles.cell, {
                  [styles.wrong]: charStatus[char] === 0,
                  [styles.partial]: charStatus[char] === 1,
                  [styles.correct]: charStatus[char] === 2,
                  [styles.empty]: charStatus[char] === -1,
                }
              )}
              key={`keyboard-key-${char}`}
            >
              {char}
            </div>
          ))
        }
        </div>
    ))}
    </div>
  )
}