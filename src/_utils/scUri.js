const sc_to_slug = require("../_data/sc_to_slug.json");
const translations = require("../_data/translations.json");

function scUri(sc, targetWcagVersion, language) {
  const base_uri = translations["base_uri"][language];
  let slug;

  if (sc_to_slug[targetWcagVersion] && 
      sc_to_slug[targetWcagVersion][language] &&
      sc_to_slug[targetWcagVersion][language][sc]) {
    slug = sc_to_slug[targetWcagVersion][language][sc]["id"] || "";
  } else {
    console.error(`‼️ Cannot generate URL for ${sc}, as it cannot be found in the data. Add it to "./_data/sc_to_slug.json"`);
    return
  }
  return `${base_uri}#${slug}`;
 }

 module.exports = scUri;