import { describe, expect, it } from "vitest";

import { stableNodePath } from "./stable-node-path.ts";

const KEG = "/brew/Cellar/node/26.13.0_1/bin/node";
const LINK = "/brew/opt/node/bin/node";
const links: Record<string, string> = { [LINK]: KEG, [KEG]: KEG, "/brew/opt/other/bin/node": "/brew/Cellar/node/25.0.0/bin/node" };
const real = (path: string) => {
  const target = links[path];
  if (!target) throw Object.assign(new Error(`ENOENT: ${path}`), { code: "ENOENT" });
  return target;
};

describe("stableNodePath", () => {
  it("names children's node by the stable link when it is the node that is running", () => {
    expect(stableNodePath(LINK, KEG, false, real)).toBe(LINK);
  });

  it("keeps the running node without a link, or with a relative one", () => {
    expect(stableNodePath(undefined, KEG, false, real)).toBe(KEG);
    expect(stableNodePath("", KEG, false, real)).toBe(KEG);
    expect(stableNodePath("opt/node/bin/node", KEG, false, real)).toBe(KEG);
  });

  it("keeps the running node when the link is missing or names another node", () => {
    expect(stableNodePath("/brew/opt/gone/bin/node", KEG, false, real)).toBe(KEG);
    expect(stableNodePath("/brew/opt/other/bin/node", KEG, false, real)).toBe(KEG);
  });

  it("never replaces Electron", () => {
    expect(stableNodePath(LINK, KEG, true, real)).toBe(KEG);
  });
});
