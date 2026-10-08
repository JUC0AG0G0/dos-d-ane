import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthContext } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { CurrentAuth, Public } from './decorators.js';
import {
  LoginResponseDto,
  SessionDto,
  UserDto,
} from './dto/auth-responses.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Crée un compte (rôle user)',
    description: 'Ne connecte pas : appeler ensuite /api/auth/login.',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Champs invalides' })
  @ApiConflictResponse({ description: 'Email ou nom affiché déjà utilisé' })
  register(@Body() dto: RegisterDto): Promise<UserDto> {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion par email et mot de passe',
    description:
      'Ouvre une session sur l’appareil et ferme celle qui y était encore ouverte.',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Champs invalides' })
  @ApiUnauthorizedResponse({ description: 'Email ou mot de passe incorrect' })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.auth.login(dto);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Utilisateur connecté' })
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  me(@CurrentAuth() auth: AuthContext): Promise<UserDto> {
    return this.auth.me(auth);
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Déconnecte la session en cours' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  async logout(@CurrentAuth() auth: AuthContext): Promise<void> {
    await this.auth.revokeSession(auth, auth.sessionId);
  }

  @ApiBearerAuth()
  @Get('sessions')
  @ApiOperation({
    summary: 'Sessions de l’utilisateur, actives et passées',
    description: 'Les 100 plus récentes, la plus récente en premier.',
  })
  @ApiOkResponse({ type: [SessionDto] })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  sessions(@CurrentAuth() auth: AuthContext): Promise<SessionDto[]> {
    return this.auth.listSessions(auth);
  }

  @ApiBearerAuth()
  @Delete('sessions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Déconnecte une session (cet appareil ou un autre)',
  })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  @ApiNotFoundResponse({ description: 'Session introuvable' })
  async revokeSession(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.auth.revokeSession(auth, id);
  }

  @ApiBearerAuth()
  @Delete('sessions')
  @ApiOperation({ summary: 'Déconnecte tous les autres appareils' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { revoked: { type: 'integer', example: 2 } },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Non connecté' })
  async revokeOtherSessions(
    @CurrentAuth() auth: AuthContext,
  ): Promise<{ revoked: number }> {
    return { revoked: await this.auth.revokeOtherSessions(auth) };
  }
}
