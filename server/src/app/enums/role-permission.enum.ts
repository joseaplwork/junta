import { Permission } from './permission.enum';
import { Role } from './role.enum';

const {
  ADMIN_CREATE,
  ADMIN_READ,
  ADMIN_UPDATE,
  ADMIN_DELETE,
  USER_CREATE,
  USER_READ,
  USER_UPDATE,
  USER_DELETE,
  JUNTA_CREATE,
  JUNTA_READ,
  JUNTA_UPDATE,
  JUNTA_DELETE,
} = Permission;

export const RolePermissionMapping = {
  [Role.SUPER_ADMIN]: [
    JUNTA_CREATE,
    JUNTA_READ,
    JUNTA_UPDATE,
    JUNTA_DELETE,
    USER_CREATE,
    USER_READ,
    USER_UPDATE,
    USER_DELETE,
    ADMIN_CREATE,
    ADMIN_READ,
    ADMIN_UPDATE,
    ADMIN_DELETE,
  ],
  [Role.ADMIN]: [
    JUNTA_CREATE,
    JUNTA_READ,
    JUNTA_UPDATE,
    JUNTA_DELETE,
    USER_CREATE,
    USER_READ,
    USER_UPDATE,
    USER_DELETE,
  ],
  [Role.USER]: [JUNTA_READ, USER_READ],
};
