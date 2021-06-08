---
name: Add language support
about: Use this issue if you'd like to work on adding a new language
title: 'Add translation: [language]'
labels: i18n
assignees: ''

---

I'd like to add language support for [language]. 

* [ ] Add one or more WCAG versions in the new language to [sc_to_slug.json](https://github.com/hidde/eleventy-wcag-reporter/blob/main/src/_data/sc_to_slug.json)
* [ ] Add translations for the new language to [translations.json](https://github.com/hidde/eleventy-wcag-reporter/blob/main/src/_data/translations.json)
* [ ] Update [README](https://github.com/hidde/eleventy-wcag-reporter#supported-languages) with the new language (please add your GitHub handle to the “Credits” column)

To get a specific WCAG version in a specific language in the expected format, you can: 

* open the WCAG document in the browser, eg https://www.w3.org/Translations/WCAG21-nl/
* open the browser dev tools and go to the Console
* run [the scraper code](https://github.com/hidde/eleventy-wcag-reporter/blob/main/src/_data/scraper.md)
* copy the logged object
