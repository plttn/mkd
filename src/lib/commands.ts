import matter from "gray-matter";
import type { Config, Deps } from "./deps";

export type Post = {
  file: string;
  content: string;
};

export type Frontmatter = Record<string, unknown>;

/** Read all files from the blog directory and return them as Post objects */
export async function readPosts(pfs: Deps["pfs"], config: Config): Promise<Post[]> {
  const files = (await pfs.readdir(config.blogDir)) as string[];
  const posts: Post[] = [];

  for (const file of files) {
    const content = await pfs.read(`${config.blogDir}/${file}`);
    posts.push({ file, content });
  }

  return posts;
}

/** Parse frontmatter from a Post */
export function parseFrontmatter(post: Post): Frontmatter {
  const { data } = matter(post.content);
  return data as Frontmatter;
}

/** Convert Posts to prompt option objects (value/label/hint) */
export function postsToOptions(posts: Post[], config: Config) {
  return posts.map((post) => {
    const fm = parseFrontmatter(post);
    const title = String(fm[config.titleKey] ?? post.file);

    return {
      value: post.file,
      label: title,
      hint: post.file,
    };
  });
}

/** Take the raw selected values returned by the prompt and return matching Post[] */
export function selectedValuesToPosts(selected: string[] | symbol, posts: Post[]): Post[] {
  if (typeof selected === "symbol") return [];
  return posts.filter((p) => selected.includes(p.file));
}

export function findPostByFile(posts: Post[], fileName: string): Post | undefined {
  return posts.find((p) => p.file === fileName);
}
