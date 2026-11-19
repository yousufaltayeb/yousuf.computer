import type { ReactNode } from "react";
import PoolResultsChart from "./PoolResultsChart";
import PoolSimulator from "./PoolSimulator";

/**
 * Visuals a post can embed by putting `{{viz:<name>}}` alone on a line of its
 * markdown. Unknown names render nothing rather than leaking the marker.
 */
const VISUALS: Record<string, () => ReactNode> = {
  "pool-direct": () => <PoolSimulator />,
  "pool-bouncer": () => <PoolSimulator bouncer />,
  "results-direct": () => <PoolResultsChart test="direct" />,
  "results-bouncer": () => <PoolResultsChart test="bouncer" />,
};

const MARKER = /<p>\{\{viz:([a-z0-9-]+)\}\}<\/p>/;

/** Rendered post HTML with each visual marker swapped for its component. */
export default function PostBody({ html }: { html: string }) {
  // split() with one capture group alternates: html, name, html, name, …
  return html.split(MARKER).map((part, index) => {
    if (index % 2 === 1) {
      const render = VISUALS[part];
      return render ? <div key={index}>{render()}</div> : null;
    }
    return part.trim() ? (
      <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
    ) : null;
  });
}
