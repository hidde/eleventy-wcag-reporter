const translations = require("../_data/translations.json");
const totalsperLevel = require("../_data/totals_per_level.json");
const countSCOnce = require("./countSCOnce.js");

function scTable(allIssues, language, targetLevel, targetWcagVersion) {
  if (!allIssues || !language || !targetLevel) {
    return ``
  }
 
  // use string representation of WCAG version to avoid unwanted conversion from e.g. 2.0 to index 2
  const totals = totalsperLevel[targetWcagVersion.toString()][targetLevel];

  let perceivable = allIssues.filter(issue => issue.data.sc && issue.data.sc.startsWith("1.")).reduce(countSCOnce, []);
  let operable = allIssues.filter(issue => issue.data.sc && issue.data.sc.startsWith("2.")).reduce(countSCOnce, []);
  let understandable = allIssues.filter(issue => issue.data.sc && issue.data.sc.startsWith("3.")).reduce(countSCOnce, []);
  let robust = allIssues.filter(issue => issue.data.sc && issue.data.sc.startsWith("4.")).reduce(countSCOnce, []);

  let totalConforming = 
    (totals.perceivable - perceivable.length) + 
    (totals.operable - operable.length) +
    (totals.understandable - understandable.length) + 
    (totals.robust - robust.length);
  return `
  <table class="sc-table">
  <thead>
    <tr>
      <td>${translations["principle"][language]}</td>
      <td>${translations["results_per_principle"][language]}</td>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>${translations["perceivable"][language]}</td>
    <td>${totals.perceivable - perceivable.length} ${translations["of"][language]} ${totals.perceivable}</td>
  </tr>
  <tr>
      <td>${translations["operable"][language]}</td>
      <td>${totals.operable - operable.length} ${translations["of"][language]} ${totals.operable} </td>
  </tr>
  <tr>
      <td>${translations["understandable"][language]}</td>
      <td>${totals.understandable - understandable.length} ${translations["of"][language]} ${totals.understandable} </td>
  </tr>
  <tr>
      <td>${translations["robust"][language]}</td>
      <td>${totals.robust - robust.length} ${translations["of"][language]} ${totals.robust} </td>
  </tr>
  <tr>
      <td>${translations["total"][language]}</td>
      <td>${totalConforming} ${translations["of"][language]} ${totals.all}</td>
  </tr>
  <tbody>
  </table>`;
}

module.exports = scTable;
