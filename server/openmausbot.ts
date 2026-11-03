// Import first: children and hook commands must name node by a path that outlives an upgrade.
import "./stable-node-path.ts";
import { main } from "./cli.ts";
import { exitAfterFlush } from "./exit.ts";
// The sentinel, run from here, reads the server's own lines back in every language it writes them in.
import "./server-line-packs.ts";

main().then(exitAfterFlush, (error) => {
  console.error(error instanceof Error ? error.message : String(error));
  exitAfterFlush(1);
});
