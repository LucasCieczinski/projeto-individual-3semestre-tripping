export function TextField({ id, label, hint, error, className = '', ...props }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={`field ${className}`.trim()}>
      <label className="field__label" htmlFor={id}>{label}</label>
      <input
        className={`field__control ${error ? 'field__control--error' : ''}`.trim()}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <span className="field__message field__message--error" id={`${id}-error`}>{error}</span>
      ) : hint ? (
        <span className="field__message" id={`${id}-hint`}>{hint}</span>
      ) : null}
    </div>
  )
}
