export enum Permission {
  ACCOUNT_CREATE = 'account:create',
  ACCOUNT_READ = 'account:read',
  ACCOUNT_UPDATE = 'account:update',
  ACCOUNT_DELETE = 'account:delete',
  PARTICIPANT_CREATE = 'participant:create',
  PARTICIPANT_READ = 'participant:read',
  PARTICIPANT_UPDATE = 'participant:update',
  PARTICIPANT_DELETE = 'participant:delete',
  JUNTA_CREATE = 'junta:create',
  JUNTA_READ = 'junta:read',
  JUNTA_UPDATE = 'junta:update',
  JUNTA_DELETE = 'junta:delete',
  /** A participant reading their own juntas through `/api/me` (BR-15). */
  SELF_READ = 'self:read',
}
