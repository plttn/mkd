import type { PoweredFileSystem } from "pwd-fs";

export type Config = {
  blogDir: string;
};

export type Deps = {
  config: Config;
  pfs: PoweredFileSystem;
};

const defaultConfig: Config = {
  blogDir: "./src/blog",
};

export async function loadConfig(pfs: PoweredFileSystem): Promise<Config> {
  try {
    const raw = await pfs.read("./mkd.json");

    if (!raw.trim()) {
      return defaultConfig;
    }

    return {
      ...defaultConfig,
      ...JSON.parse(raw),
    };
  } catch {
    return defaultConfig;
  }
}
