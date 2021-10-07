#!/bin/bash

CAT_CODE_GIT_URL='https://raw.githubusercontent.com/citizenlab/test-lists/master/lists/00-LEGEND-new_category_codes.csv'
OUTPUT_FILE=components/lib/category_codes.json

[[ ! -f ${OUTPUT_FILE} ]] &&
  echo "Usage:
yarn run category_codes" &&
  exit

echo "{" > $OUTPUT_FILE

curl -q $CAT_CODE_GIT_URL 2> /dev/null |\
sed 1d |\
sort |\
while IFS=, read -r DESC CODE OLD_CODE FULL_DESC
do
  echo \ \ \"${CODE}\": [\"${DESC}\", \"$(echo ${FULL_DESC} | tr -d \")\"], >> $OUTPUT_FILE
done

# Remove extra trailing "," for last entry
sed -i -e '$ s/,$//' $OUTPUT_FILE

echo "}" >> $OUTPUT_FILE