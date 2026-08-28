import styles from './Brand.module.css'

export function Brand({ inverse = false }) {
  return (
    <span className={`${styles.brand} ${inverse ? styles.inverse : ''}`}>
      <span className={styles.mark} aria-hidden="true"><i /></span>
      <span className={styles.word}>Trip<span>Ping</span></span>
    </span>
  )
}
