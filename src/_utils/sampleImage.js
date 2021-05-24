const fs = require("fs"); 

function sampleImage(id, report) {
  const expectedFile = `./src/reports/${report}/images/${id}.png`;
  
  if (fs.existsSync(expectedFile)) {
    return `images/${id}.png`;
  } else {
    return "../example/images/default-screenshot.png";
  }
}

module.exports = sampleImage;

