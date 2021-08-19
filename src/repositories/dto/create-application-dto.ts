export interface CreateApplicationDTO {
  teamId: string;
  name: string;
  environments?: {name: string}[];
}
