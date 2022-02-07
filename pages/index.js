import clsx from 'clsx'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import Layout from '../components/layout'
import maxGuesses from '../utils/gamemodes'

export default function Home() {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Woodle
        </h1>
        { Object.keys(maxGuesses).map(length => (
            <Link href={`/game/${length}`} key={`mode-${length}`}>
              <div className={clsx(styles.button, styles[`mode-${length}`])}>
                {`${length} characters`}
              </div>
            </Link>
          ))
        }
      </main>

      <footer className={styles.footer}>
        Powered by
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vercel
        </a>
        and
        <a
          href="https://www.wordnik.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wordnik
        </a>
      </footer>
    </Layout>
  )
}
