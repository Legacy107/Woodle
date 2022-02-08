import clsx from 'clsx'
import styles from './guess.module.scss'

export default function Guess({tryCount, length, word, guess, row}) {
  return (
    <div className={styles.container}>
    { Array.from({length: length}, (v, idx) => (
        <div
          className={clsx(
            styles.cell, {
              [styles.wrong]: guess[idx] || word?.indexOf(guess[idx]) === -1,
              [styles.partial]: guess[idx] && word?.indexOf(guess[idx]) !== -1,
              [styles.correct]: guess[idx] && word[idx] === guess[idx],
              [styles.empty]: tryCount <= row,
            }
          )}
          key={`row-${row}-cell-${idx}`}
        >
          {guess[idx] || ""}
        </div>
    ))}
    </div>
  )
}
