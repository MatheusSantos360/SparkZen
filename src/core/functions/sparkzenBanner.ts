import { bold, dim } from "logfy-x";

export const sparkzenBanner = (message: string, color: (str: string) => string) => {
  const tag = color(bold(" SPARKZEN "));
  const line = dim("─".repeat(10 * 2 + message.length + 2));
  console.log(`\n${tag} ${bold(message)} ${tag}\n${line}`);
}
