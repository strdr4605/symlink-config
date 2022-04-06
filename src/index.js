#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const GREEN = "\x1b[0m\x1b[32m";
const BOLD_YELLOW = "\x1b[1m\x1b[33m";
const PURPLE = "\x1b[0m\x1b[35m";
const RESET = "\x1b[0m";

const _dirname = process.cwd();
if (!fs.existsSync(path.join(_dirname, "./package.json"))) {
  console.log("No package.json found, please run command at root of project");
  process.exit(1);
}

const packageJSON = JSON.parse(
  fs.readFileSync(path.join(_dirname, "./package.json"))
);

const sourceDirName = packageJSON["symlink-config"]?.path || "./support/root";

const sourceDir = path.join(_dirname, sourceDirName);

const [, , arg] = process.argv;

if (arg) {
  if (!fs.existsSync(path.join(_dirname, arg))) {
    console.log(`${arg} does not exists.`);
    return;
  }
  if (fs.existsSync(path.join(sourceDir, arg))) {
    console.log(
      `${arg} already exists in ${sourceDir.replace(_dirname + "/", "")}`
    );
    return;
  }
  try {
    if (!fs.existsSync(sourceDir)) {
      fs.mkdirSync(sourceDir, { recursive: true });
      console.log("Directory support/root was created.");
    }

    fs.renameSync(path.join(_dirname, arg), path.join(sourceDir, arg));
    fs.appendFileSync(path.join(_dirname, ".gitignore"), `/${arg}`);
    child_process.execSync(`git rm -rf ${arg}`);
  } catch (err) {
    console.log(err);
  }
}

if (!fs.existsSync(sourceDir)) {
  console.log(
    `${sourceDir.replace(
      _dirname + "/",
      ""
    )} does not exists, create manually, or run\n\nnpx symlink-config .examplerc`
  );
  process.exit(1);
}

const targets = fs
  .readdirSync(sourceDir)
  // Exclude the `readme.md` file from being symlinked.
  .filter((filename) => !filename.toLowerCase().endsWith("readme.md"))
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
  `\n\u001B[32mSuccessfully symlinked the ${sourceDirName} files to the root directory.\u001B[0m\n`
);
