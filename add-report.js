const fs = require('fs')
const path = require('path')
const prompt = require('prompt')
const colors = require('colors/safe')
const copy = require('copy')
const slugify = require('slugify')
const openEditor = require('open-editor');

prompt.message = ''
prompt.delimiter = ''

prompt.start();

const sourceFolder = path.join(__dirname, 'src/reports/example') 
const target = path.join(__dirname, 'src/reports') 

;(async () => {
console.clear()
console.log(colors.cyan('Add new report'))
console.log('')
console.log('What should the report be called?')

const { reportname } = await prompt.get({ description: '>', name: 'reportname' })
const report = slugify(reportname)
const targetFolder = `${target}/${report}`
const relativeTargetFolder = path.relative(__dirname, targetFolder) 
if (fs.existsSync(targetFolder)) {
  console.log('')
  console.log(colors.red(`./${relativeTargetFolder}`), 'already exist!')
  console.log('')
  console.log('Please remove it, or choose a different name.')
  console.log('')
  return
}

copy(`${sourceFolder}/**/*`, targetFolder, async (error, files) => {
  if (error) return console.error(error)
  console.log('')
  console.log(`Report ${colors.green(reportname)} created successfully.`)
  console.log(colors.yellow(`  ./${relativeTargetFolder}`))
  console.log('')
  console.log('Almost there.')
  console.log(`  (1) Remove ${colors.cyan('excludeFromCollections: true')} from ${colors.yellow(`./${relativeTargetFolder}/index.njk`)}`)
  console.log('  (2) Check all metadata and ensure it is correct for your')
  console.log('')
  console.log(`Do you want to open ${colors.yellow(`./${relativeTargetFolder}/index.njk`)} now?`)
  const { open } = await prompt.get({ description: 'Y/n', name: 'open' })

  if (open.toLowerCase() === 'y' || open === '' ) {
    try {
      openEditor([`${targetFolder}/index.njk:0:0`])
    } catch (error) {
      console.log('')
      console.log(error.message)
    }
  }
})
})()