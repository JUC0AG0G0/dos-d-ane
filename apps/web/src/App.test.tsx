import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

function mockFetch(response: Partial<Response>) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(response as Response)
}

describe('App', () => {
  it("affiche l'avertissement santé", () => {
    mockFetch({ ok: true, json: async () => ({}) })
    render(<App />)
    expect(screen.getByRole('note')).toHaveTextContent(
      /ne remplace pas l'avis d'un professionnel de santé/,
    )
  })

  it("affiche l'état de l'API quand elle répond", async () => {
    mockFetch({
      ok: true,
      json: async () => ({ status: 'ok', env: 'test', version: '1.2.3' }),
    })
    render(<App />)
    expect(await screen.findByText(/API connectée \(test, version 1.2.3\)/)).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/health', expect.anything())
  })

  it("affiche une erreur quand l'API est indisponible", async () => {
    mockFetch({ ok: false, status: 502 })
    render(<App />)
    expect(await screen.findByText('API indisponible (502)')).toBeInTheDocument()
  })
})
