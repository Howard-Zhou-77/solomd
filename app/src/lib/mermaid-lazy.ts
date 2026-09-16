/**
 * Mermaid, loaded the first time a diagram actually needs rendering.
 *
 * It used to be a static import in five modules, which put its ~1 MB of
 * parser and renderer into the entry chunk — paid on every cold start, by
 * every user, including the ones whose notes contain no diagrams at all.
 * Windows felt it worst: WebView2 has to compile the whole entry chunk
 * before the first paint.
 *
 * `initialize` is still last-call-wins on a single shared instance, exactly
 * as it was when each module reached for the singleton directly.
 */
import type mermaidNS from 'mermaid';

type Mermaid = typeof mermaidNS;
type MermaidConfig = Parameters<Mermaid['initialize']>[0];

let loading: Promise<Mermaid> | null = null;

export function loadMermaid(): Promise<Mermaid> {
  if (!loading) loading = import('mermaid').then((m) => m.default);
  return loading;
}

/** Load (once) and configure. Callers are all async already. */
export async function initMermaid(config: MermaidConfig): Promise<Mermaid> {
  const mermaid = await loadMermaid();
  mermaid.initialize(config);
  return mermaid;
}
