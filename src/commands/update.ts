import { autocomplete, intro, isCancel, outro } from "@clack/prompts";
import { command } from "cmd-ts";
import matter from "gray-matter";
import {
	findPostByFile,
	type Post,
	postsToOptions,
	readPosts,
} from "../lib/commands";
import type { Config, Deps } from "../lib/deps";

export function makeUpdateCommand({ config, pfs }: Deps) {
	return command({
		name: "update",
		description: "Update a post's modified date",
		args: {},
		handler: async () => {
			const posts = await readPosts(pfs, config);
			const post = await getPostToUpdate(posts, config);
			if (!post) return;

			await updatePostDate(post, { config, pfs });
		},
	});
}

async function getPostToUpdate(
	posts: Post[],
	config: Config,
): Promise<Post | null> {
	const options = postsToOptions(posts, config);

	intro("Update a post");

	const selected = await autocomplete({
		message: "Select post to update",
		options,
	});

	if (isCancel(selected)) {
		outro("Update cancelled.");
		return null;
	}
	outro("Post updated.");

	const found = findPostByFile(posts, selected as string);
	return found ?? null;
}

async function updatePostDate(post: Post, deps: Deps) {
	const parsed = matter(post.content);
	const fm = parsed.data as Record<string, unknown>;
	fm[deps.config.modifiedAtKey] = new Date();
	const updatedContent = matter.stringify(parsed.content, fm);
	await deps.pfs.write(`${deps.config.blogDir}/${post.file}`, updatedContent);
	return { ...post, content: updatedContent };
}
