import { Brand } from '../../components/brand/Brand'
import { AppLink } from '../../navigation/AppLink'
import styles from './LandingPage.module.css'

const reminders = [
  ['Datas', 'Ida e volta sem procurar na conversa'],
  ['Moeda', 'O código certo para cada destino'],
  ['Notas', 'Reservas e lembretes no mesmo lugar'],
]

export function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <AppLink to="/" aria-label="TripPing, página inicial"><Brand /></AppLink>
        <AppLink className={styles.login} to="/identificar">Minha agenda <span aria-hidden="true">↗</span></AppLink>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>TripPing — caderno de viagem</span>
            <h1>A próxima viagem começa <em>antes da mala.</em></h1>
            <p>Guarde datas, moeda e aqueles detalhes que sempre acabam espalhados entre notas, mensagens e prints.</p>
            <div className={styles.heroActions}>
              <AppLink className={styles.primaryAction} to="/identificar">Abrir minha agenda <span aria-hidden="true">→</span></AppLink>
              <span>Leva menos de um minuto.</span>
            </div>
          </div>

          <div className={styles.folio} aria-label="Prévia de uma viagem para Lisboa">
            <div className={styles.folioTop}><span>TRIP / 001</span><strong>LIS</strong></div>
            <div className={styles.folioBody}>
              <span className={styles.postmark}>Tudo<br />certo</span>
              <p>Próxima parada</p>
              <h2>Lisboa</h2>
              <div className={styles.route}><span>12 SET</span><i /><span>20 SET</span></div>
              <div className={styles.folioMeta}><span>PORTUGAL</span><span>EUR</span><span>8 DIAS</span></div>
            </div>
            <div className={styles.folioNote}>“Hospedagem perto do centro. Conferir o horário do voo na véspera.”</div>
          </div>
        </section>

        <section className={styles.reminderSection} aria-labelledby="reminder-title">
          <div className={styles.sectionIntro}><span>Um lugar só</span><h2 id="reminder-title">Feito para lembrar o que costuma ficar espalhado.</h2></div>
          <div className={styles.reminderList}>{reminders.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </section>
      </main>

      <footer className={styles.footer}><Brand /><p>Seus planos, do seu jeito.</p></footer>
    </div>
  )
}
