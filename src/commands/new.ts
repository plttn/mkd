import path from "node:path";
import { intro, isCancel, outro, text } from "@clack/prompts";
import slugify from "@sindresorhus/slugify";
import { command, restPositionals, string } from "cmd-ts";
import filenamify from "filenamify";
import matter from "gray-matter";
import type { Config, Deps } from "../lib/deps";

export function makeNewCommand({ config, pfs }: Deps) {
	return command({
		name: "new",
		description: "Create a new post",
		args: {
			new: restPositionals({
				type: string,
				displayName: "file",
				description: "name of the new post",
			}),
		},
		handler: async ({ new: titleArray }) => {
			intro("Create a new post");
			let title: string;
			if (titleArray.length === 0) {
				title = await generateTitle();
				if (title === "") {
					return;
				}
			} else {
				title = titleArray.join(" ");
			}
			const slug = slugify(title);
			const fileName = filenamify(slug);
			const frontmatter = await generateFrontmatter(title, config);
			const filePath = path.join(config.blogDir, `${fileName}.md`);
			outro(`${title} created successfully`);
			await pfs.write(filePath, frontmatter);
		},
	});
}

async function generateFrontmatter(
	title: string,
	config: Config,
): Promise<string> {
	const description = await makeDescription(title);
	// const now = new Date();

	const data = {
		[config.titleKey]: title,
		[config.publishedAtKey]: new Date("3000-01-01T00:00:00Z"),
		[config.authorKey]: config.author,
		[config.draftKey]: true,
		[config.descriptionKey]: description,
		[config.tagsKey]: [],
	};

	return matter.stringify("", data);
}

async function makeDescription(title: string): Promise<string> {
	const description = await text({
		message: "Enter a description for the post:",
		defaultValue: title,
	});

	if (isCancel(description)) {
		return "";
	}

	return description;
}

async function generateTitle(): Promise<string> {
	const title = await text({
		message: "Enter a title for the post:",
		validate: (value) => {
			if (!value) {
				return "Title required";
			}
			return undefined;
		},
	});

	if (isCancel(title)) {
		return "";
	}

	return title;
}
