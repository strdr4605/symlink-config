#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const GREEN = "\x1b[0m\x1b[32m";
const BOLD_YELLOW = "\x1b[1m\x1b[33m";
const PURPLE = "\x1b[0m\x1b[35m";
const RESET = "\x1b[0m";

const _dirname = process.cwd();
const sourceDir = path.join(_dirname, "./support/root/");

const targets = fs
  .readdirSync(sourceDir)
  // Exclude the `readme.md` file from being symlinked.
  .filter((filename) => !filename.endsWith("readme.md"))
  .map((filename) => ({
    original: path.join(sourceDir, filename),
    target: path.join(_dirname, filename),
  }));

/**
 * Safely get the stats for a file.
 *
 * @param {string} target
 */
function getFileStatSync(target) {
  try {
    return fs.lstatSync(target);
  } catch {
    return;
  }
}

/**
 * Delete a file or folder recursively.
 *
 * @param {string} filePath
 *
 * @returns {void}
 */
function deletePath(filePath) {
  const stat = getFileStatSync(filePath);

  if (!stat) {
    return;
  }

  if (stat.isFile()) {
    console.log("deleting file", filePath);
    fs.unlinkSync(filePath);
  }

  if (!stat.isDirectory()) {
    return;
  }

  // Delete all nested paths
  for (const file of fs.readdirSync(filePath)) {
    deletePath(path.join(filePath, file));
  }

  // Delete the directory
  fs.rmdirSync(filePath);
}

/**
 * Check that the path is linked to the target.
 *
 * @param {string} path
 * @param {string} target
 */
function isLinkedTo(path, target) {
  try {
    const checkTarget = fs.readlinkSync(path);
    return checkTarget === target;
  } catch {
    return false;
  }
}

for (const { original, target } of targets) {
  const targetStat = getFileStatSync(target);

  // Nothing to do since the path is linked correctly.
  if (isLinkedTo(target, original)) {
    continue;
  }

  // The file or directory exists but is not symlinked correctly. It should be deleted.
  if (targetStat) {
    console.log("deleting path", target);
    deletePath(target);
  }

  console.log(
    `${BOLD_YELLOW}linking ${GREEN}${original.replace(
      _dirname + "/",
      ""
    )} ${BOLD_YELLOW}to ${PURPLE}${target.replace(_dirname + "/", "")}${RESET}`
  );
  fs.symlinkSync(original, target);
}

console.log(
  "\n\u001B[32mSuccessfully symlinked the `support/root` files to the root directory.\u001B[0m\n"
);
