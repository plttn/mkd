import type { PoweredFileSystem } from "pwd-fs";

export type Config = {
  blogDir: string;
  titleKey: string;
  author: string;
  publishedAtKey: string;
  modifiedAtKey: string;
  authorKey: string;
  draftKey: string;
  descriptionKey: string;
  tagsKey: string;
};

export type Deps = {
  config: Config;
  pfs: PoweredFileSystem;
};

const defaultConfig: Config = {
  blogDir: "./src/blog",
  titleKey: "title",
  author: "",
  publishedAtKey: "publishedAt",
  modifiedAtKey: "updatedAt",
  authorKey: "author",
  draftKey: "draft",
  descriptionKey: "description",
  tagsKey: "tags",
};

export async function loadConfig(pfs: PoweredFileSystem): Promise<Config> {
  try {
    const raw = await pfs.read("./mkd.json");

    if (!raw.trim()) {
      return defaultConfig;
    }

    const parsed = JSON.parse(raw);

    if (!isRecord(parsed)) {
      return defaultConfig;
    }

    const { $schema: _schema, ...config } = parsed;

    return {
      ...defaultConfig,
      ...config,
    };
  } catch {
    return defaultConfig;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
