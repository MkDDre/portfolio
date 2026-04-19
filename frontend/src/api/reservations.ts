import { CreateReservationRequestDto, ReservationDto } from '../types';
import { patchJson, postJson } from './http';

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

export { createReservation, cancelReservation };