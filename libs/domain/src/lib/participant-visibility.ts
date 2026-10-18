/**
 * BR-15: a participant sees only the juntas they belong to, and within one
 * only their own group. Returns that group, or undefined when the participant
 * is not a member.
 */
export function findOwnGroup<Group extends { members: { id: string }[] }>(
  groups: readonly Group[],
  participantId: string,
): Group | undefined {
  return groups.find(group =>
    group.members.some(member => member.id === participantId),
  )
}
