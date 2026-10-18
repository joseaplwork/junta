/** See the roles table in docs/domain.md (BR-12, BR-16). */
export enum Role {
  /** System administrators. Never created through the app. */
  ADMIN = 'admin',
  /** Creates and runs their own juntas. */
  ORGANIZER = 'organizer',
  /** Every app user: sees the juntas they belong to. */
  PARTICIPANT = 'participant',
}
