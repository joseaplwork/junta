import { Permission, Role } from '@server/enums';

export interface AuthTokenPayload {
  username: string;
  sub: string;
  roles: Role[];
  permissions: Permission[];
}
