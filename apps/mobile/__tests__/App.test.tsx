import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  afterEach(() => jest.restoreAllMocks());

  it("affiche l'avertissement santé et l'état de l'API", async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', env: 'test', version: '1.0.0' }),
    } as Response);

    render(<App />);

    expect(
      screen.getByText(/ne remplace pas l'avis\s+d'un professionnel de santé/),
    ).toBeOnTheScreen();
    expect(
      await screen.findByText('API connectée (test, version 1.0.0)'),
    ).toBeOnTheScreen();
  });

  it("affiche une erreur quand l'API est indisponible", async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({ ok: false, status: 503 } as Response);

    render(<App />);

    expect(await screen.findByText('API indisponible (503)')).toBeOnTheScreen();
  });
});
