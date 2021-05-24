#! /bin/sh

prince ./dist/reports/$1/index.html -o pdfs/$1.pdf --pdf-profile="PDF/UA-1"

open pdfs/$1.pdf