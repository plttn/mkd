import { command, restPositionals, string } from "cmd-ts";
import path from "node:path";
import slugify from "@sindresorhus/slugify";
import filenamify from "filenamify";

export const newCommand = command({
    name: "new",
    description: "Create a new markdown file",
    args: {
        new: restPositionals({
            type: string,
            displayName: "file",
            description: "name of the new post",
        }),
    },
    handler: ({ new: titleArray }) => {
        const title = titleArray.join(" ");
        const slug = slugify(title);
        console.log(slug);
    },
});
