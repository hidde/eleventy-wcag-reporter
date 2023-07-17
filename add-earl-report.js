const fs = require("fs");
const path = require("path");
const prompt = require("prompt");
const colors = require("colors/safe");
const copy = require("copy");
const slugify = require("slugify");
const openEditor = require("open-editor");

if (process.argv.length < 3) {
  console.error("expected EARL file: node add-earl-report.js earl.json");
  process.exit(1);
}

prompt.message = "";
prompt.delimiter = "";

prompt.start();

const target = path.join(__dirname, "src/reports");

function createIndex(earl, targetFolder, reportname) {
  const indextemplate = `---
layout: report
tags: reports
title: ${reportname}
language: en
evaluation:
  evaluator: ${earl.assertor["doap:name"]}
  commissioner: TODO
  target: WCAG 2.1, Level AA
  targetLevel: AA
  targetWcagVersion: 2.1
  date: TODO
scope:
  - ${earl.project["dct:description"]}
out_of_scope:
  - Non-crawlable content
baseline:
  - Chromium (latest)
technologies:
  - HTML
  - CSS
  - JavaScript
  - WAI-ARIA
  - SVG
---`;

  fs.writeFileSync(`${targetFolder}/index.njk`, indextemplate);
}
function createSummary(earl, targetFolder) {
  const hasIssues = earl.assertions.some((assertion) => assertion.result.outcome === "earl:failed");

  const summaryString = hasIssues
    ? "This website is partly accessible. Some issues were found and described in this report."
    : "There have been no accessibility issues found by the scanner.";

  const summaryTemplate = `---
eleventyExcludeFromCollections: true
---
  
${summaryString}
`;

  fs.writeFileSync(`${targetFolder}/summary.md`, summaryTemplate);
}
function createIssueFiles(earl, targetFolder) {
  const issues = earl.assertions.filter((assertion) => assertion.result.outcome === "earl:failed");

  issues.forEach((issue) => {
    const template = `---
sc: ${issue.test.isPartOf ? issue.test.isPartOf.map((x) => x.title.split(":")[1].trim()).join(", ") : "none"}
severity: TODO
difficulty: TODO
title: ${issue.test.title}
sample: ${issue.subject.map((x) => x.source).join(", ")}
---

#### Problem

${issue.test.description}

#### Solution

[@TODO]
`;

    fs.writeFileSync(`${targetFolder}/${slugify(issue.test.title.toLowerCase())}.md`, template);
  });
}

(async () => {
  let earl = false;
  const earlPath = path.relative(__dirname, process.argv[2]);
  if (!fs.existsSync(earlPath)) {
    console.error(`EARL file ${earlPath} does not exist`);
    process.exit(1);
  }

  try {
    earl = JSON.parse(fs.readFileSync(earlPath, "utf8"));
  } catch (e) {
    console.error(e);
    console.error(`EARL file ${earlPath} is not valid JSON`);
    process.exit(1);
  }

  const reportname = earl.project["dct:title"];
  const report = slugify(reportname);
  const targetFolder = `${target}/${report}`;
  const relativeTargetFolder = path.relative(__dirname, targetFolder);

  if (fs.existsSync(targetFolder)) {
    console.log("");
    console.log(colors.red(`./${relativeTargetFolder}`), "already exist!");
    console.log("");
    return;
  }

  console.clear();
  console.log("EARL report wizard");
  console.log(colors.cyan("Name for new report:"), reportname);
  console.log("Do you want to generate a new report in", colors.yellow(`./${relativeTargetFolder}`) + "?");
  const { agreement } = await prompt.get({ description: "Y/n", name: "agreement" });
  if (!["y", "yes"].includes(agreement.toLowercase()) || agreement === "") {
    console.error("aborting");
    process.exit(1);
  }

  fs.mkdirSync(targetFolder);
  createIndex(earl, targetFolder, reportname);
  createSummary(earl, targetFolder, reportname);
  createIssueFiles(earl, targetFolder, reportname);

  console.log(`report created in folder ${colors.yellow(relativeTargetFolder)}`);

  console.log(`Do you want to open ${colors.yellow(`./${relativeTargetFolder}/index.njk`)} now?`);
  const { open } = await prompt.get({ description: "Y/n", name: "open" });

  if (!["y", "yes"].includes(open.toLowercase()) || open === "") {
    try {
      openEditor([`${targetFolder}/index.njk:0:0`]);
    } catch (error) {
      console.log("");
      console.log(error.message);
    }
  }
})();
