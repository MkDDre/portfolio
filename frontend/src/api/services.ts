import { CreateServiceRequestDto, ServiceDto } from '../types';
import { getJson, patchJson, postJson } from './http';

const getValidatedServices = async (): Promise<ServiceDto[]> =>
  getJson<ServiceDto[]>('/api/service/validated/all');

const getPendingServices = async (token: string): Promise<ServiceDto[]> =>
  getJson<ServiceDto[]>('/api/service/pending/all', token);

const getMyServices = async (token: string): Promise<ServiceDto[]> =>
  getJson<ServiceDto[]>('/api/service/my-services', token);

const createService = async (
  payload: CreateServiceRequestDto,
  token: string,
): Promise<ServiceDto> =>
  postJson<ServiceDto, CreateServiceRequestDto>('/api/service', payload, token);

const validateService = async (
  serviceId: number,
  token: string,
): Promise<ServiceDto> =>
  patchJson<ServiceDto, never>(
    `/api/service/${serviceId}/validate`,
    undefined,
    token,
  );

const denyService = async (
  serviceId: number,
  token: string,
): Promise<ServiceDto> =>
  patchJson<ServiceDto, never>(
    `/api/service/${serviceId}/deny`,
    undefined,
    token,
  );

const maskService = async (
  serviceId: number,
  token: string,
): Promise<ServiceDto> =>
  patchJson<ServiceDto, never>(
    `/api/service/${serviceId}/mask`,
    undefined,
    token,
  );

export {
  getValidatedServices,
  getPendingServices,
  getMyServices,
  createService,
  validateService,
  denyService,
  maskService,
};
