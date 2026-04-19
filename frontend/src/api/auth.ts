import { AuthRequestDto, AuthResponseDto, RegisterRequestDto } from '../types';
import { postJson } from './http';

const AUTH_BASE_PATH = '/api/auth';

const register = async (
  payload: RegisterRequestDto,
): Promise<AuthResponseDto> =>
  postJson<AuthResponseDto, RegisterRequestDto>(
    `${AUTH_BASE_PATH}/register`,
    payload,
  );

const login = async (payload: AuthRequestDto): Promise<AuthResponseDto> =>
  postJson<AuthResponseDto, AuthRequestDto>(`${AUTH_BASE_PATH}/login`, payload);

export { register, login };
