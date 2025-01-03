import { Permission } from './permission.enum';
import { Role } from './role.enum';

const {
  AdminCreate,
  AdminRead,
  AdminUpdate,
  AdminDelete,
  UserCreate,
  UserRead,
  UserUpdate,
  UserDelete,
  JuntaCreate,
  JuntaRead,
  JuntaUpdate,
  JuntaDelete,
} = Permission;

export const RolePermissionMapping = {
  [Role.SuperAdmin]: [
    JuntaCreate,
    JuntaRead,
    JuntaUpdate,
    JuntaDelete,
    UserCreate,
    UserRead,
    UserUpdate,
    UserDelete,
    AdminCreate,
    AdminRead,
    AdminUpdate,
    AdminDelete,
  ],
  [Role.Admin]: [
    JuntaCreate,
    JuntaRead,
    JuntaUpdate,
    JuntaDelete,
    UserCreate,
    UserRead,
    UserUpdate,
    UserDelete,
  ],
  [Role.User]: [JuntaRead, UserRead],
};
