yarn build && ^
scp -r -P 8022 ./public/* root@43.241.72.249:/home/wwwroot/m2np.com/


@REM npm run build && cat ./public/index.html > ./public/index.html.bak && html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true ./public/index.html > ./public/index.html && scp -r -P 8022 ./public/* root@43.241.72.249:/home/wwwroot/m2np.com/ && cat ./public/index.html.bak > ./public/index.html && rm ./public/index.html.bak