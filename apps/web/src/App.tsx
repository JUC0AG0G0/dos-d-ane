import { ApiStatus } from './components/ApiStatus'
import { Disclaimer } from './components/Disclaimer'

function App() {
  return (
    <main className="app">
      <h1>Dos d'âne</h1>
      <p>Ralentis, redresse-toi : des conseils de posture pour le travail sur écran.</p>
      <Disclaimer />
      <ApiStatus />
    </main>
  )
}

export default App
