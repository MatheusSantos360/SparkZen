import { exists } from "fs-extra";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "../../types/config";
import { defaultConfig } from "../defaultConfig";
import { packageConfigs } from "../package";

let config: Config = defaultConfig;

const isDev = process.env.NODE_ENV !== "production";

export const getConfig = async () => {
  return config;
};

export const setConfig = async () => {
  if (await configFileExists()) {
    const configPath = isDev ? path.resolve(process.cwd(), packageConfigs.configFileName.replace(".js", ".ts")) : path.resolve(process.cwd(), "dist", packageConfigs.configFileName);

    const fileConfig = await import(pathToFileURL(configPath).href);
    config = { ...defaultConfig, ...fileConfig.config };
  }
};

const configFileExists = async (): Promise<boolean> => {
  const filePath = isDev ? path.resolve(process.cwd(), packageConfigs.configFileName.replace(".js", ".ts")) : path.resolve(process.cwd(), "dist", packageConfigs.configFileName);

  return await exists(filePath);
};
