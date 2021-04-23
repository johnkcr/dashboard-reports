import { ServiceType } from '../../../typings/service-type';

export interface Filters {
  startDate: Date;
  endDate: Date;
  serviceTypes?: ServiceType[] | undefined;
}
