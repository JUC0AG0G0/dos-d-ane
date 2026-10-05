import { useEffect, useState } from 'react'
import { fetchHealth, type Health } from '../api/client'

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; health: Health }
  | { kind: 'error'; message: string }

export function ApiStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetchHealth(controller.signal)
      .then((health) => setState({ kind: 'ok', health }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Erreur inconnue',
        })
      })
    return () => controller.abort()
  }, [])

  switch (state.kind) {
    case 'loading':
      return <p>Connexion à l'API…</p>
    case 'error':
      return <p className="status status--error">{state.message}</p>
    case 'ok':
      return (
        <p className="status status--ok">
          API connectée ({state.health.env}, version {state.health.version})
        </p>
      )
  }
}
