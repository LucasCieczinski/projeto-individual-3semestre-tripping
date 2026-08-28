import { useState } from 'react'
import { Brand } from '../../components/brand/Brand'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/TextField'
import { useApp } from '../../context/useApp'
import { AppLink } from '../../navigation/AppLink'
import { useNavigation } from '../../navigation/useNavigation'
import styles from './IdentificationPage.module.css'

export function IdentificationPage() {
  const { navigate } = useNavigation()
  const { findUser, login, registerUser } = useApp()
  const [stage, setStage] = useState('identify')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleIdentify(event) {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) { setError('Confira o e-mail e tente de novo.'); return }
    setSubmitting(true)
    try {
      const existing = await findUser(normalizedEmail)
      if (existing) { login(existing); navigate('/viagens'); return }
      setStage('register'); setError('')
    } catch {
      setError('Não conseguimos consultar agora. Tente mais uma vez.')
    } finally { setSubmitting(false) }
  }

  async function handleRegister(event) {
    event.preventDefault()
    if (!name.trim()) { setError('Diga como você prefere ser chamado.'); return }
    setSubmitting(true)
    try {
      await registerUser({ name: name.trim(), email: email.trim().toLowerCase() })
      navigate('/viagens')
    } catch {
      setError('Não conseguimos criar sua agenda agora. Tente novamente.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}><AppLink to="/" aria-label="Voltar para o início"><Brand /></AppLink><AppLink to="/">Voltar</AppLink></header>
      <main className={styles.main}>
        <section className={styles.intro}>
          <span>Por aqui, viajante</span>
          <h1>Sua agenda está logo ali.</h1>
          <p>Entre com seu e-mail. Se for sua primeira visita, pedimos só o seu nome no próximo passo.</p>
          <blockquote>“Uma viagem bem lembrada começa com um plano simples.”</blockquote>
        </section>

        <section className={styles.card} aria-labelledby="identification-title">
          <span className={styles.step}>{stage === 'identify' ? '01 / E-mail' : '02 / Seu nome'}</span>
          {stage === 'identify' ? (
            <form onSubmit={handleIdentify} noValidate>
              <div className={styles.cardTitle}><h2 id="identification-title">Qual é o seu e-mail?</h2><p>É por ele que encontramos suas viagens.</p></div>
              <TextField id="email" label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} error={error} autoFocus />
              <Button className={styles.submit} type="submit" disabled={submitting}>{submitting ? 'Procurando…' : 'Continuar'} <span aria-hidden="true">→</span></Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate>
              <div className={styles.cardTitle}><h2 id="identification-title">Como podemos te chamar?</h2><p>Só falta isso para abrir sua agenda.</p></div>
              <div className={styles.emailSlip}><span>E-mail</span><strong>{email.trim().toLowerCase()}</strong></div>
              <TextField id="name" label="Seu nome" autoComplete="name" placeholder="Ex.: Marina" value={name} onChange={(event) => { setName(event.target.value); setError('') }} error={error} autoFocus />
              <Button className={styles.submit} type="submit" disabled={submitting}>{submitting ? 'Preparando…' : 'Criar minha agenda'} <span aria-hidden="true">→</span></Button>
              <button className={styles.back} type="button" onClick={() => { setStage('identify'); setError('') }}>← Trocar o e-mail</button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}
