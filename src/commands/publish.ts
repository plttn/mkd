import { command } from "cmd-ts";
import { autocompleteMultiselect, isCancel } from "@clack/prompts";
import matter from "gray-matter";
import type { Config, Deps } from "../lib/deps";

type Frontmatter = Record<string, unknown>;

type Post = {
  file: string;
  content: string;
};

export function makePublishCommand({ config, pfs }: Deps) {
  return command({
    name: "publish",
    description: "Publish a markdown file",
    args: {},
    handler: async () => {
      const drafts = await getDraftPosts(pfs, config);
      let selected = await getPostsToPublish(drafts, config);

      void drafts;
    },
  });
}

async function getDraftPosts(pfs: Deps["pfs"], config: Config) {
  const posts = await getPosts(pfs, config);
  return posts.filter((post) => {
    const frontMatter = getPostFrontMatter(post);
    return frontMatter[config.draftKey] === true;
  });
}

async function getPosts(pfs: Deps["pfs"], config: Config): Promise<Post[]> {
  const files = await pfs.readdir(config.blogDir);
  const posts: Post[] = [];

  for (const file of files) {
    const content = await pfs.read(`${config.blogDir}/${file}`);
    posts.push({ file, content });
  }

  return posts;
}

function getPostFrontMatter(post: Post) {
  const { data } = matter(post.content);
  return data as Frontmatter;
}

async function getPostsToPublish(drafts: Post[], config: Config) {
  const options = drafts.map((draft) => {
    const fm = getPostFrontMatter(draft);
    const title = String(fm[config.titleKey] ?? draft.file);

    return {
      value: draft.file,
      label: title,
      hint: draft.file,
    };
  });

  const selected = await autocompleteMultiselect({
    message: "Select posts to publish",
    options,
  });

  if (isCancel(selected)) {
    return [];
  }

  return drafts.filter((draft) => selected.includes(draft.file));
}
