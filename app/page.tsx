import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  const clubs = [
    { id: 'LEVEL', name: 'LEVEL' },
    { id: 'SPACE', name: 'SPACE' },
    { id: 'PINGWIN', name: 'PINGWIN' },
  ]

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Выберите клуб</h1>
        <p className={styles.subtitle}>Чтобы оставить отзыв, выберите клуб из списка</p>

        <div className={styles.grid}>
          {clubs.map((club) => (
            <Link key={club.id} href={`/${club.id}`} className={styles.clubButton}>
              {club.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
