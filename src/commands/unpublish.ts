import matter from "@11ty/gray-matter";
import { autocomplete, intro, isCancel, outro } from "@clack/prompts";
import { command } from "cmd-ts";
import { findPostByFile, type Post, postsToOptions, readPosts } from "../lib/commands";
import type { Config, Deps } from "../lib/deps";

export function makeUnPublishCommand({ config, pfs }: Deps) {
  return command({
    name: "unpublish",
    description: "Unpublish a post",
    args: {},
    handler: async () => {
      const posts = await readPosts(pfs, config);
      const post = await getPostToUnpub(posts, config);
      if (!post) return;

      await unpubPost(post, { config, pfs });
    },
  });
}

async function getPostToUnpub(posts: Post[], config: Config): Promise<Post | null> {
  const options = postsToOptions(posts, config);

  intro("Unpublish a post");

  const selected = await autocomplete({
    message: "Select post to unpublish",
    options,
  });

  if (isCancel(selected)) {
    outro("Unpublish cancelled.");
    return null;
  }
  outro("Post unpublished.");

  const found = findPostByFile(posts, selected as string);
  return found ?? null;
}

async function unpubPost(post: Post, deps: Deps) {
  const parsed = matter(post.content);
  const fm = parsed.data as Record<string, unknown>;
  fm[deps.config.draftKey] = true;
  const updatedContent = matter.stringify(parsed.content, fm);
  await deps.pfs.write(`${deps.config.blogDir}/${post.file}`, updatedContent);
  return { ...post, content: updatedContent };
}
