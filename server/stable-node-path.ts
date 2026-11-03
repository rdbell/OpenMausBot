// A package manager's node often runs from a versioned folder (Homebrew's Cellar/node/<version>/bin/node) that its next
// upgrade deletes. process.execPath names that real file, and the server starts its helpers and writes hook commands
// with it, so once the folder is gone every child fails with ENOENT until the server restarts. OPENMAUSBOT_NODE_PATH
// names a stable link to the same node (Homebrew's opt/node/bin/node); while it resolves to the node that is running,
// process.execPath becomes that link. Import this first in every server entry, before anything reads process.execPath.
import { realpathSync } from "node:fs";
import { isAbsolute } from "node:path";

export function stableNodePath(
  wanted: string | undefined,
  execPath: string,
  isElectron: boolean,
  real: (path: string) => string = realpathSync,
): string {
  // In the packaged app process.execPath is Electron, which runs helpers as node; leave it alone.
  if (!wanted || !isAbsolute(wanted) || isElectron || wanted === execPath) return execPath;
  try {
    return real(wanted) === real(execPath) ? wanted : execPath;
  } catch {
    return execPath;
  }
}

process.execPath = stableNodePath(process.env.OPENMAUSBOT_NODE_PATH, process.execPath, Boolean(process.versions.electron));
