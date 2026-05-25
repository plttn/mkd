#!/usr/bin/env node
import { run, subcommands } from "cmd-ts";
import { PoweredFileSystem } from "pwd-fs";
import { makeInitCommand } from "./commands/init";
import { makeNewCommand } from "./commands/new";
import { makePublishCommand } from "./commands/publish";
import { makeUnPublishCommand } from "./commands/unpublish";
import { makeUpdateCommand } from "./commands/update";
import { loadConfig } from "./lib/deps";

async function main() {
  const pfs = new PoweredFileSystem();
  const config = await loadConfig(pfs);
  const deps = { config, pfs };

  const app = subcommands({
    name: "mkd",
    cmds: {
      new: makeNewCommand(deps),
      publish: makePublishCommand(deps),
      update: makeUpdateCommand(deps),
      unpublish: makeUnPublishCommand(deps),
      init: makeInitCommand(deps),
    },
  });

  await run(app, process.argv.slice(2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
