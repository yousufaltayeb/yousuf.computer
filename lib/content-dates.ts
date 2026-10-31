import { execFileSync } from "node:child_process";

/**
 * Last commit date for a content file, so routes whose markdown carries no date
 * of its own can still report `lastModified` in the sitemap.
 *
 * Returns undefined whenever git has no answer — shallow clone, untracked file,
 * git not on PATH — so the field is omitted rather than invented.
 */
export function lastCommitDate(relativePath: string): string | undefined {
  try {
    const stdout = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] },
    );
    return stdout.trim() || undefined;
  } catch {
    return undefined;
  }
}

/** Most recent commit date across several files, for index routes. */
export function newestCommitDate(
  relativePaths: string[],
): string | undefined {
  const dates = relativePaths
    .map(lastCommitDate)
    .filter((date): date is string => Boolean(date))
    .sort();
  return dates.at(-1);
}
