import { exists } from "fs-extra";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "../../types/config";
import { defaultConfig } from "../defaultConfig";
import { packageConfigs } from "../package";

let config: Config = defaultConfig;

export const getConfig = async () => {
  return config;
};

export const setConfig = async () => {
  if (await configFileExists()) {
    config = await import(pathToFileURL(path.resolve(process.cwd(), packageConfigs.configFileName)).href);
  }
};

const configFileExists = async (): Promise<boolean> => {
  const filePath = path.resolve(process.cwd(), packageConfigs.configFileName);
  return await exists(filePath);
};
