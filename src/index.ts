#!/usr/bin/env node
import { run, subcommands } from "cmd-ts";
import { PoweredFileSystem } from "pwd-fs";
import { loadConfig } from "./deps";
import { makeNewCommand } from "./commands/new";

async function main() {
  const pfs = new PoweredFileSystem();
  const config = await loadConfig(pfs);
  const deps = { config, pfs };

  const app = subcommands({
    name: "mkd",
    cmds: {
      new: makeNewCommand(deps),
    },
  });

  await run(app, process.argv.slice(2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
