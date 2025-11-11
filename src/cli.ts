#!/usr/bin/env node
import { Command } from "commander";
import { analyze } from "./analyze.js";

const program = new Command();

program
  .name("selda")
  .description("Analyze any business from a link")
  .argument("<url>", "Website URL")
  .action(async (url) => {
    const res = await analyze(url);
    console.log(JSON.stringify(res, null, 2));
  });

program.parse();

