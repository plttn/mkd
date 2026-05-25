import { intro, isCancel, outro, text } from "@clack/prompts";
import { command } from "cmd-ts";
import type { Deps } from "../lib/deps";

export function makeInitCommand({ config, pfs }: Deps) {
	return command({
		name: "init",
		description: "Create or update mkd.json configuration",
		args: {},
		handler: async () => {
			intro("Initialize mkd configuration");

			const blogDir = await text({
				message: "Directory where generated posts are written",
				defaultValue: String(config.blogDir ?? "./src/blog"),
			});
			if (isCancel(blogDir)) {
				outro("Init cancelled");
				return;
			}

			const author = await text({
				message: "Default author",
				defaultValue: String(config.author ?? ""),
			});
			if (isCancel(author)) {
				outro("Init cancelled");
				return;
			}

			const titleKey = await text({
				message: "Title frontmatter key",
				defaultValue: String(config.titleKey ?? "title"),
			});
			if (isCancel(titleKey)) {
				outro("Init cancelled");
				return;
			}

			const publishedAtKey = await text({
				message: "Published date frontmatter key",
				defaultValue: String(config.publishedAtKey ?? "publishedAt"),
			});
			if (isCancel(publishedAtKey)) {
				outro("Init cancelled");
				return;
			}

			const modifiedAtKey = await text({
				message: "Modified date frontmatter key",
				defaultValue: String(config.modifiedAtKey ?? "updatedAt"),
			});
			if (isCancel(modifiedAtKey)) {
				outro("Init cancelled");
				return;
			}

			const authorKey = await text({
				message: "Author frontmatter key",
				defaultValue: String(config.authorKey ?? "author"),
			});
			if (isCancel(authorKey)) {
				outro("Init cancelled");
				return;
			}

			const draftKey = await text({
				message: "Draft frontmatter key",
				defaultValue: String(config.draftKey ?? "draft"),
			});
			if (isCancel(draftKey)) {
				outro("Init cancelled");
				return;
			}

			const descriptionKey = await text({
				message: "Description frontmatter key",
				defaultValue: String(config.descriptionKey ?? "description"),
			});
			if (isCancel(descriptionKey)) {
				outro("Init cancelled");
				return;
			}

			const tagsKey = await text({
				message: "Tags frontmatter key",
				defaultValue: String(config.tagsKey ?? "tags"),
			});
			if (isCancel(tagsKey)) {
				outro("Init cancelled");
				return;
			}

			const newConfig = {
				blogDir: String(blogDir),
				author: String(author),
				publishedAtKey: String(publishedAtKey),
				modifiedAtKey: String(modifiedAtKey),
				authorKey: String(authorKey),
				draftKey: String(draftKey),
				descriptionKey: String(descriptionKey),
				tagsKey: String(tagsKey),
				titleKey: String(titleKey),
			};

			await pfs.write("./mkd.json", `${JSON.stringify(newConfig, null, 2)}\n`);

			outro("Configuration saved to mkd.json");
		},
	});
}
