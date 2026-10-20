import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import type { AuthContext } from '../auth/auth.guard.js';
import { CurrentAuth, Public } from '../auth/decorators.js';
import { SessionDeviceDto } from '../auth/dto/auth-responses.dto.js';
import {
  ClaimPairingDto,
  PairingStatusDto,
  PollPairingDto,
} from './dto/pairing.dto.js';
import { PairingService } from './pairing.service.js';

/**
 * Appairage par code d'étiquette (edge/docs/liaison-serveur.md §2). Nombre de
 * requêtes limité (DevicesModule) : `poll` est public et chaque nouveau code
 * crée une ligne ; `claim` ne doit pas permettre de deviner un code.
 */
@ApiTags('devices')
@Controller('devices/pairing')
@UseGuards(ThrottlerGuard)
@ApiTooManyRequestsResponse({ description: 'Trop d’essais' })
export class PairingController {
  constructor(private readonly pairing: PairingService) {}

  @Public()
  @Post('poll')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle({ pairingClaimIp: true, pairingClaimAccount: true })
  @ApiOperation({
    summary: 'Le Raspberry Pi sans clé attend d’être ajouté à un compte',
    description:
      'Envoyé toutes les 5 s par le Pi. La 1re demande lie le secret au code. Une fois le code validé par un compte : deviceId et key, une seule fois.',
  })
  @ApiOkResponse({ type: PairingStatusDto })
  @ApiBadRequestResponse({ description: 'Code ou secret invalide' })
  @ApiConflictResponse({
    description: 'Code lié à un autre secret, ou clé déjà relevée',
  })
  poll(@Body() dto: PollPairingDto): Promise<PairingStatusDto> {
    return this.pairing.poll(dto.code, dto.secret);
  }

  @Post('claim')
  @SkipThrottle({ pairingPoll: true })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ajoute au compte le Raspberry Pi dont on a tapé le code',
    description:
      'Code imprimé sur l’étiquette du Pi ; le Pi doit être allumé (vu il y a moins de 2 min). Il relève sa clé à sa demande suivante.',
  })
  @ApiCreatedResponse({ type: SessionDeviceDto })
  @ApiBadRequestResponse({ description: 'Code ou nom invalide' })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  @ApiForbiddenResponse({
    description: 'Réservé aux comptes, pas aux appareils',
  })
  @ApiNotFoundResponse({
    description: 'Code inconnu, déjà utilisé ou Raspberry Pi éteint',
  })
  claim(
    @CurrentAuth() auth: AuthContext,
    @Body() dto: ClaimPairingDto,
  ): Promise<SessionDeviceDto> {
    return this.pairing.claim(auth.userId, dto.code, dto.name);
  }
}
