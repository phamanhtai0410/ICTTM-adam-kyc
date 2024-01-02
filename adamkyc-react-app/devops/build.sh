#!/usr/bin/env sh

npm run build
rm -rf build/static/media/*.svg
mv build/static/css/main.*.css build/static/css/main.css
sed 's/n.p+"static\/media/adamkyc_plugin_prefix+"static\/media/g' build/static/js/main.*.js > build/static/js/main.js
rm -rf build/static/js/main.*.js
