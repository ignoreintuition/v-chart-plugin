"use strict";
const chalk = require("chalk");
const semver = require("semver");
const packageConfig = require("../package.json");
const shell = require("shelljs");

function exec(cmd) {
  return require("child_process")
    .execSync(cmd)
    .toString()
    .trim();
}

const versionRequirements = [
  {
    name: "node",
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  }
];

if (shell.which("npm")) {
  versionRequirements.push({
    name: "npm",
    currentVersion: exec("npm --version"),
    versionRequirement: packageConfig.engines.npm
  });
}

module.exports = function() {
  const warnings = versionRequirements.reduce((warnings, mod) => {
    if (semver.satisfies(mod.currentVersion, mod.versionRequirement))
      return warnings;
    return [
      ...warnings,
      `${mod.name}: ${chalk.red(mod.currentVersion)} should be ${chalk.green(
        mod.versionRequirement
      )}`
    ];
  }, []);

  if (warnings.length) {
    console.log("");
    console.log(
      chalk.yellow(
        "To use this template, you must update following to modules:"
      )
    );
    console.log();

    warnings.forEach(warning => console.log(`  ${warning}`));

    console.log();
    process.exit(1);
  }
};
