import { ConfigDataTypes } from '../../enum/config-data-types';

// TODO: validate casing on key. should allow non space cases
export interface UpdateConfigurationDTO {
  key: string;
  value: string;
  dataType: ConfigDataTypes;
  environmentId: string;
  secretPath?: string;
}
