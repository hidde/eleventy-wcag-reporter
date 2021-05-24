#! /bin/sh

echo "  What should the report be called?"

read reportname

cp -vr ./src/reports/example ./src/reports/$reportname

echo ""
echo ""
echo "  Folder created!"
echo "  Don't forget to add <$reportname> to reports.json."

echo ""
read -p "<< Press ENTER to open reports.json >>"

vi reports.json

echo ""
echo ""
echo " Almost there. "
echo " (1) Remove excludeFromCollections:true from the report's index.njk"
echo " (2) Check all metadata and ensure it is correct for your new report"

echo ""
read -p "<< Press ENTER to open index.njk >>"

vi ./src/reports/$reportname/index.njk
