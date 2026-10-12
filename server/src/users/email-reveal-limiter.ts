import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export const EMAIL_REVEALS_PER_WINDOW = 10;
const WINDOW_MS = 60 * 60 * 1000;

@Injectable()
export class EmailRevealLimiter {
  private readonly reveals = new Map<string, number[]>();

  consume(adminId: string): void {
    const now = Date.now();
    const recent = (this.reveals.get(adminId) ?? []).filter(
      (time) => now - time < WINDOW_MS,
    );
    if (recent.length >= EMAIL_REVEALS_PER_WINDOW) {
      throw new HttpException(
        `Limite atteinte : ${EMAIL_REVEALS_PER_WINDOW} emails affichés par heure`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    recent.push(now);
    this.reveals.set(adminId, recent);
  }
}
