export interface Health {
  status: 'ok' | 'error';
  database: 'up' | 'down';
  env: string;
  version: string;
}
