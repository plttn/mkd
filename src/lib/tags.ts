import matter from "gray-matter";
import type { Deps } from "./deps";

export type GetAllTagsOptions = {
	concurrency?: number; // how many files to parse in parallel
	lowerCase?: boolean; // normalize tags to lowercase
	sort?: boolean; // sort result
};

/**
 * Read all markdown files in `config.blogDir`, extract tags using the configured `tagsKey`,
 * normalize & dedupe them, and return the list.
 *
 * This implementation uses the PoweredFileSystem API (pfs) for all path resolution and IO
 * instead of `path.join` so it respects the pfs instance's `pwd` resolution semantics.
 */
export async function getAllTags(
	deps: Deps,
	opts: GetAllTagsOptions = {},
): Promise<string[]> {
	const { pfs, config } = deps;
	const { concurrency = 8, lowerCase = true, sort = true } = opts;

	const files = (await pfs.readdir(config.blogDir)) as string[];
	const mdFiles = files.filter(
		(f) => f.endsWith(".md") || f.endsWith(".markdown"),
	);

	// split into batches of size `concurrency`
	const batches: string[][] = [];
	for (let i = 0; i < mdFiles.length; i += concurrency) {
		batches.push(mdFiles.slice(i, i + concurrency));
	}

	const tagSet = new Set<string>();

	async function parseFile(file: string): Promise<string[]> {
		try {
			// Resolve using pfs so it respects the base directory configured on the instance
			const filePath = pfs.resolve(`${config.blogDir}/${file}`);
			const content = await pfs.read(filePath);
			const { data } = matter(content);
			const raw = (data as Record<string, unknown>)[config.tagsKey];
			return parseRawTags(raw);
		} catch {
			// ignore single-file failures
			return [];
		}
	}

	for (const batch of batches) {
		const results = await Promise.all(batch.map(parseFile));
		for (const tags of results) {
			for (let t of tags) {
				if (!t) continue;
				t = t.trim();
				if (!t) continue;
				if (lowerCase) t = t.toLowerCase();
				tagSet.add(t);
			}
		}
	}

	const out = Array.from(tagSet);
	if (sort) out.sort();
	return out;
}

function parseRawTags(raw: unknown): string[] {
	if (!raw) return [];
	if (Array.isArray(raw))
		return raw
			.map(String)
			.flatMap(splitOnSeparators)
			.map((s) => s.trim())
			.filter(Boolean);
	if (typeof raw === "string")
		return splitOnSeparators(raw)
			.map((s) => s.trim())
			.filter(Boolean);
	return [];
}

function splitOnSeparators(s: string): string[] {
	// Accept comma separated values and newline-separated lists, plus plain single tag strings
	if (s.includes(",") || s.includes("\n")) {
		return s
			.split(/[,\n]+/)
			.map((x) => x.trim())
			.filter(Boolean);
	}
	return [s];
}
