#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";
import { writeFile } from "fs/promises";
import chalk from "chalk";
import { stringify as yamlStringify } from "yaml";
import { analyze } from "./analyze";

dotenv.config();

type CliOptions = {
  save?: string;
  format?: string;
};

const program = new Command();

program
  .name("selda")
  .description("Analyze any business from a link")
  .argument("<url>", "Website URL")
  .option("-s, --save <file>", "Save output to a file on disk")
  .option("-f, --format <format>", "Output format: json | yaml", "json")
  .action(async (url: string, options: CliOptions) => {
    try {
      const format = (options.format ?? "json").toLowerCase();
      if (!["json", "yaml"].includes(format)) {
        throw new Error(`Unsupported format "${options.format}". Use "json" or "yaml".`);
      }

      const result = await analyze(url);
      const payload =
        format === "yaml" ? yamlStringify(result, { indent: 2 }) : JSON.stringify(result, null, 2);

      if (options.save) {
        await writeFile(options.save, `${payload}\n`, "utf8");
        console.log(chalk.green(`✓ Analysis saved to ${options.save}`));
      }

      console.log(chalk.bold.cyan("\nSelda Analysis"));
      console.log(chalk.gray(`Format: ${format.toUpperCase()}\n`));
      console.log(format === "json" ? payload : payload.trimEnd());
      console.log("\n---");
      console.log(`
🌍  Find your customers — automatically.
Give us your website, and Selda will analyze your business, find your best customers, and book meetings for you.

No setup. No learning curve. Just growth.
→  https://selda.ai
`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`✗ Failed to analyze ${url}: ${message}`));
      process.exitCode = 1;
    }
  });

program.parseAsync().catch((error) => {
  console.error(chalk.red(String(error)));
  process.exit(1);
});

