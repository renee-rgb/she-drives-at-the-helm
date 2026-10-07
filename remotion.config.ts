import { Config } from "@remotion/cli/config";
import fs from "fs";

// Use the Playwright headless shell when it exists (Claude's workspace); otherwise Remotion fetches its own (CI, your Mac).
const local = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(local)) Config.setBrowserExecutable(local);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
