import fs from "fs";
import path from "path";
import prompt from "prompt";
import colors from "colors";
import slugify from "slugify";
import openEditor from "open-editor";

if (process.argv.length < 3) {
  console.error("expected EARL file: node add-earl-report.js earl.json");
  process.exit(1);
}

// settings
const shownSamples = 20;
const shownIssueSamples = 5;

// global state
let totalpages = 0;

// start
prompt.message = "";
prompt.delimiter = "";

prompt.start();

const urlToID = (url) => slugify(url.split("//")[1].replaceAll(".", "").replaceAll(":", "_"));

const dirname = new URL(".", import.meta.url).pathname;
const target = path.join(dirname, "src/reports");

function createIndex(earl, targetFolder, reportname) {
  const samples = {};

  const issues = earl.assertions
    .filter((assertion) => assertion.result.outcome === "earl:failed")
    .map((issue) =>
      issue.subject.forEach((subject) => {
        samples[subject.source] = {
          url: subject.source,
          title: '"' + subject["dct:title"].replaceAll('"', "&quot;") + '"',
        };
      })
    );

  const allSamples = Object.values(samples).map(
    (sample) => `- title: ${sample.title}
  id: ${urlToID(sample.url)}
  url: ${sample.url}
`
  );
  totalpages = allSamples.length;

  const formattedSamples =
    allSamples.slice(0, shownSamples).join("\n") +
    (allSamples.length > shownSamples
      ? `- title: ${allSamples.length - shownSamples} other pages scanned but not listed in the sample.
  id: none
  url: ${earl.project["@id"]}
  `
      : "");

  const indextemplate = `---
layout: report
tags: reports
title: ${reportname}
language: en
evaluation:
  evaluator: ${earl.assertor["doap:name"]}
  commissioner: ${earl.project["commissioner"]}
  target: WCAG 2.1, Level AA
  targetLevel: AA
  targetWcagVersion: 2.1
  date: ${earl.project["dct:date"]}
scope:
  - ${earl.project["dct:description"]}
out_of_scope:
  - Non-crawlable content (PDFs, pages that require login, etc.)
baseline:
  - Chromium (latest)
technologies:
  - HTML
  - CSS
  - JavaScript
  - WAI-ARIA
  - SVG

sample:
${formattedSamples}
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
    const allSamples = issue.subject.map(
      (x) => `- url: "${x.source}"
  id: ${urlToID(x.source)}`
    );

    const onAllPages = allSamples.length === totalpages;
    const total = Math.min(allSamples.length);

    const template = `---
sc: ${issue.test.isPartOf ? issue.test.isPartOf.map((x) => x.title.split(":")[1].trim()).join(", ") : "none"}
title: ${issue.test.title}
onallpages: ${onAllPages}
total: ${total}
sample: 
${allSamples.slice(0, shownIssueSamples).join("\n")}
allsamples: 
${allSamples.join("\n")}
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
  const earlPath = path.relative(dirname, process.argv[2]);
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
  const relativeTargetFolder = path.relative(dirname, targetFolder);

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
  if (!(["y", "yes"].includes(agreement.toLowerCase()) || agreement === "")) {
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

  if (!["y", "yes"].includes(open.toLowerCase()) || open === "") {
    try {
      openEditor([`${targetFolder}/index.njk:0:0`]);
    } catch (error) {
      console.log("");
      console.log(error.message);
    }
  }
})();
