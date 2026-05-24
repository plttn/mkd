import { command } from "cmd-ts";
import {
  autocompleteMultiselect,
  isCancel,
  intro,
  outro,
} from "@clack/prompts";
import matter from "gray-matter";
import type { Config, Deps } from "../lib/deps";
import {
  readPosts,
  parseFrontmatter,
  postsToOptions,
  selectedValuesToPosts,
  Post,
} from "../lib/commands";

export function makePublishCommand({ config, pfs }: Deps) {
  return command({
    name: "publish",
    description: "Undraft a post",
    args: {},
    handler: async () => {
      const posts = await readPosts(pfs, config);
      const drafts = posts.filter(
        (post) => parseFrontmatter(post)[config.draftKey] === true,
      );
      const selected = await getPostsToPublish(drafts, config);

      for (const draft of selected) {
        await updateDraftFrontMatter(draft, { config, pfs });
      }
    },
  });
}

async function getPostsToPublish(
  drafts: Post[],
  config: Config,
): Promise<Post[]> {
  const options = postsToOptions(drafts, config);
  intro("Publishing posts");

  const selected = await autocompleteMultiselect({
    message: "Select posts to publish",
    options,
  });

  if (isCancel(selected)) {
    outro("Publishing cancelled.");
    return [];
  }

  outro("Posts undrafted...");

  return selectedValuesToPosts(selected, drafts);
}

async function updateDraftFrontMatter(draft: Post, deps: Deps) {
  const parsed = matter(draft.content);
  const fm = parsed.data as Record<string, unknown>;
  fm[deps.config.draftKey] = false;
  const updatedContent = matter.stringify(parsed.content, fm);
  await deps.pfs.write(`${deps.config.blogDir}/${draft.file}`, updatedContent);
  return { ...draft, content: updatedContent };
}
