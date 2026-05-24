import { command, restPositionals, string } from "cmd-ts";
import path from "node:path";
import slugify from "@sindresorhus/slugify";
import filenamify from "filenamify";
import matter from "gray-matter";
import type { Deps } from "../deps";

export function makeNewCommand({ config, pfs }: Deps) {
  return command({
    name: "new",
    description: "Create a new markdown file",
    args: {
      new: restPositionals({
        type: string,
        displayName: "file",
        description: "name of the new post",
      }),
    },
    handler: async ({ new: titleArray }) => {
      const title = titleArray.join(" ");
      const slug = slugify(title);
      const fileName = filenamify(slug);
      const frontmatter = generateFrontmatter(title);
      const filePath = path.join(config.blogDir, `${fileName}.md`);

      await pfs.write(filePath, frontmatter);
    },
  });
}

function generateFrontmatter(title: string): string {
  const data = {
    title,
    date: new Date().toISOString(),
  };

  return matter.stringify("", data);
}
