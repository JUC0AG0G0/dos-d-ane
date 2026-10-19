import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

/**
 * Le ValidationPipe global s'applique aussi aux messages WebSocket, mais son
 * erreur HTTP (400) y deviendrait « Internal server error », journalisée à
 * chaque message : un appareil qui envoie un message invalide remplirait les
 * logs. On la renvoie au client comme une erreur WebSocket ordinaire.
 */
@Catch(BadRequestException)
export class WsValidationFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = exception.getResponse();
    const details =
      typeof response === 'object' && 'message' in response
        ? response.message
        : exception.message;
    super.catch(
      new WsException({
        status: 'error',
        message: 'Message invalide',
        details,
      }),
      host,
    );
  }
}
