#!/usr/bin/env node
import { run, subcommands } from "cmd-ts";
import { PoweredFileSystem } from "pwd-fs";
import { loadConfig } from "./lib/deps";
import { makeNewCommand } from "./commands/new";
import { makePublishCommand } from "./commands/publish";

async function main() {
  const pfs = new PoweredFileSystem();
  const config = await loadConfig(pfs);
  const deps = { config, pfs };

  const app = subcommands({
    name: "mkd",
    cmds: {
      new: makeNewCommand(deps),
      publish: makePublishCommand(deps),
    },
  });

  await run(app, process.argv.slice(2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
