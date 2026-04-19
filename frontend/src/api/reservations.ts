import { CreateReservationRequestDto, ReservationDto } from '../types';
import { getJson, patchJson, postJson } from './http';

const createReservation = async (
  payload: CreateReservationRequestDto,
  token: string,
): Promise<ReservationDto> =>
  postJson<ReservationDto, CreateReservationRequestDto>(
    '/api/reservation',
    payload,
    token,
  );

const cancelReservation = async (
  reservationId: number,
  token: string,
): Promise<ReservationDto> =>
  patchJson<ReservationDto, never>(
    `/api/reservation/${reservationId}/cancel`,
    undefined,
    token,
  );

const getMyReservations = async (token: string): Promise<ReservationDto[]> =>
  getJson<ReservationDto[]>('/api/reservation/my', token);

export { createReservation, cancelReservation, getMyReservations };