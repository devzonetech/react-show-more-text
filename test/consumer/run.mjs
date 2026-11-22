import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fixturesDir = join(root, "test/consumer/fixtures");
const fixtureNames = [
  "react18-javascript",
  "react18-typescript",
  "react19-javascript",
  "react19-typescript",
];
const requestedFixture = process.argv.find((argument) =>
  fixtureNames.includes(argument),
);
const packageArgumentIndex = process.argv.indexOf("--package");
let packagePath =
  packageArgumentIndex === -1
    ? undefined
    : resolve(process.argv[packageArgumentIndex + 1]);
const tempDir = packagePath
  ? undefined
  : mkdtempSync(join(tmpdir(), "consumer-tests-"));

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed in ${cwd}`);
  }
}

function findPackageArchive(path) {
  const archives = readdirSync(path)
    .filter((name) => name.endsWith(".tgz"))
    .map((name) => join(path, name));
  if (archives.length !== 1) {
    throw new Error(`Expected one .tgz package archive in ${path}`);
  }
  return archives[0];
}

function verifyArchive(archivePath) {
  const packageInfo = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  );
  const { stdout, error, status } = spawnSync("tar", ["-tzf", archivePath], {
    encoding: "utf8",
  });
  if (error) throw error;
  if (status !== 0) {
    throw new Error(`Unable to inspect package archive ${archivePath}`);
  }

  const archiveFiles = new Set(stdout.split("\n").filter(Boolean));
  const requiredFiles = [
    `package/${packageInfo.main}`,
    `package/${packageInfo.module}`,
    `package/${packageInfo.types}`,
    ...Object.values(packageInfo.exports["."])
      .filter((entry) => entry.startsWith("./"))
      .map((entry) => `package/${entry.slice(2)}`),
  ];
  const missingFiles = requiredFiles.filter((file) => !archiveFiles.has(file));
  if (missingFiles.length) {
    throw new Error(
      `Package archive is missing required files: ${missingFiles.join(", ")}`,
    );
  }
}

function verifyNodeImports(cwd) {
  run(
    "node",
    [
      "--input-type=module",
      "-e",
      'import ShowMoreText, { ShowMoreText as NamedShowMoreText } from "react-show-more-text"; if (typeof ShowMoreText !== "object" || typeof NamedShowMoreText !== "object") process.exit(1);',
    ],
    cwd,
  );
  run(
    "node",
    [
      "-e",
      'const component = require("react-show-more-text"); if (typeof component.default !== "object" || typeof component.ShowMoreText !== "object") process.exit(1);',
    ],
    cwd,
  );
}

try {
  if (!packagePath) {
    run("npm", ["run", "build"], root);
    run("npm", ["pack", "--pack-destination", tempDir], root);
    packagePath = findPackageArchive(tempDir);
  } else if (statSync(packagePath).isDirectory()) {
    packagePath = findPackageArchive(packagePath);
  }

  verifyArchive(packagePath);
  const fixtures = requestedFixture ? [requestedFixture] : fixtureNames;

  for (const fixture of fixtures) {
    const cwd = join(fixturesDir, fixture);
    console.log(`\nTesting consumer fixture: ${fixture}`);
    run(
      "npm",
      [
        "install",
        "--no-audit",
        "--no-fund",
        "--package-lock=false",
        "--no-save",
        "--legacy-peer-deps=false",
        packagePath,
      ],
      cwd,
    );
    run("npm", ["ls", "--depth=0"], cwd);
    verifyNodeImports(cwd);
    run("npm", ["run", "build"], cwd);
    if (fixture.endsWith("-typescript")) {
      run("npm", ["run", "typecheck"], cwd);
    }
  }
} finally {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
}
