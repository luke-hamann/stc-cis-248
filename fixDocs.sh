cd ./docs
find . -type f -name '*.html' -exec sed -i -e 's/href="file:&#x2F;&#x2F;&#x2F;home&#x2F;runner&#x2F;work&#x2F;stc-cis-248&#x2F;stc-cis-248&#x2F;/href="https:&#x2F;&#x2F;github\.com&#x2F;luke-hamann&#x2F;stc-cis-248&#x2F;blob&#x2F;master&#x2F;/g' {} \;
cd ..
