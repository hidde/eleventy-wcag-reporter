const sc_to_slug = require("../_data/sc_to_slug.json");

function scName(sc, targetWcagVersion, language) {
  let name;

  if (sc_to_slug[targetWcagVersion] && 
      sc_to_slug[targetWcagVersion][language] && 
      sc_to_slug[targetWcagVersion][language][sc]) {
    name = sc_to_slug[targetWcagVersion][language][sc]["name"] || "";
    return `${sc}: ${name}`;
  } else {
    console.error(`‼️ Cannot generate name for ${sc}, as it cannot be found in the data. Add it to "./_data/sc_to_slug.json"`);
    return `${sc}`;
  }
 }

 module.exports = scName;