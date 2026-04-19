import { ServiceDto } from '../types';
import { getJson } from './http';

const getValidatedServices = async (): Promise<ServiceDto[]> =>
  getJson<ServiceDto[]>('/api/service/validated/all');

export { getValidatedServices };