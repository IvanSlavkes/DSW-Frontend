import type { Match } from "../types/match";

export function getMatchCapacity(match: Match) {
  const positions = match.teams?.flatMap((team) => team.positions ?? []) ?? [];
  const confirmed = positions.filter(
    (position) => position.status === "occupied" || position.occupantId != null,
  ).length;
  const free = positions.filter(
    (position) => position.status === "free" && position.occupantId == null,
  ).length;
  return { confirmed, free, total: positions.length };
}

export function isMatchFull(match: Match) {
  const capacity = getMatchCapacity(match);
  return match.status.toLowerCase() === "full" ||
    (capacity.total > 0 && capacity.free === 0);
}
