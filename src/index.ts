#!/usr/bin/env node
import { run, subcommands } from "cmd-ts";
import { newCommand } from "./commands/new";

const app = subcommands({
    name: "mkd",
    cmds: {
        new: newCommand,
    },
});

run(app, process.argv.slice(2));
