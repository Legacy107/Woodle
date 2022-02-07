import { useState, useMemo, useEffect, useRef, Fragment } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ReactLoading from 'react-loading'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/Game.module.scss'
import Layout from '../../components/layout'
import Guess from '../../components/guess'
import Keyboard from '../../components/keyboard'
import { maxGuesses, wordPattern, wordAntiPattern } from '../../utils/gamemodes'
import shootConfetti from '../../utils/shootConfetti'

export default function Game() {
  const router = useRouter()
  const [length, setLength] = useState()
  const [word, setWord] = useState()
  const [loading, setLoading] = useState(true)
  const [tryCount, setTry] = useState(0)
  const [guesses, setGuesses] = useState([])
  const [result, setResult] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    setLength(parseInt(router.query.length))
  }, [router])

  useEffect(() => {
    if (length)
      setGuesses(Array.from(
        {length: maxGuesses[length]},
        (v, i) => ''
      ))
  }, [length])

  useEffect(() => {
    if (length && Object.keys(maxGuesses).indexOf(`${length}`) === -1)
      router.push('/')
  }, [length])

  useEffect(() => {
    if (length)
      fetch(`/api/word?length=${length}`)
        .then(response => response.json())
        .then(data => setWord(data.word))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
  }, [length])

  const reset = () => {
    setLoading(true)
    setGuesses([])
    setWord('')
    setTry(0)
    setResult('')
    lockFocus()
    setLength(0)
    setTimeout(() => setLength(parseInt(router.query.length)), 100)
  }

  const handleInput = (event) => {
    const { value } = event.target

    if (
      result ||
      (value && value.search(wordAntiPattern) !== -1)
    )
      return

    setGuesses(guesses.map((guess, idx) => (
      idx === tryCount ? value : guess
    )))
  }

  const isValidWord = async (word) => {
    const response = await fetch(`/api/validate?word=${word}`)
    if (response.status !== 200)
      return false

    return await response.json()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (guesses[tryCount].length < length || result)
      return;

    if (guesses[tryCount] === word) {
      setResult('You win')
      shootConfetti()
    }
    else if (!(await isValidWord(guesses[tryCount]))) {
      toast.info("Invalid word")
      return
    }
    else if (tryCount === maxGuesses[length] - 1)
      setResult('You lose')

    setTry(tryCount + 1)
  }

  const lockFocus = () => {
    if (result)
      return

    inputRef.current.focus()
  }

  return (
    <Layout>
      <main className={styles.main}>
      { result &&
        <>
          <h1>{result}</h1>
          { result === 'You lose' &&
            <h3 className={styles.subTitle}>{`The word is "${word}"`}</h3>
          }
          <div className={styles.actionContainer}>
            <div
              className={clsx(styles.button, styles.playAgain)}
              onClick={reset}
            >
              Play Again
            </div>
            <Link href="/">
              <div className={clsx(styles.button, styles.mainMenu)}>
                Main Menu
              </div>
            </Link>
          </div>
        </>
      }
      { loading ?
        <ReactLoading type={"bars"} className={styles.loading} /> : (
          !word ?
          <h1>Failed to get a word. Please try again later.</h1> :
          <>
          { guesses.map((guess, idx) => (
              <Guess
                tryCount={tryCount}
                row={idx}
                length={length}
                word={word}
                guess={guess}
                key={`row-${idx}`}
              />
            ))
          }
          { !!result ||
            <>
              <Keyboard
                word={word}
                guesses={guesses.filter((guess, idx) => idx < tryCount)}
              />
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  ref={inputRef}
                  value={guesses[tryCount]}
                  maxLength={length}
                  pattern={wordPattern}
                  onChange={handleInput}
                  onBlur={lockFocus}
                  autoFocus
                />
              </form>
            </>
          }
            <ToastContainer
              position="top-right"
              theme="colored"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </>
        )
      }
      </main>
    </Layout>
  )
}
