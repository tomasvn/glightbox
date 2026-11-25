const postcss = require('postcss');
const cssnext = require('postcss-preset-env');
const cssnested = require('postcss-nested');
const cssmqpacker = require('css-mqpacker');
const cssprettify = require('postcss-prettify');
const CssClean = require('clean-css');
const path = require('path');
const fs = require('fs');

function postcssCompiler(config) {
    const { file, dest, minify = true } = config;
    const fileName = path.basename(file);
    const from = path.resolve(file);
    const to = path.resolve(dest, fileName);
    const fileNameMin = path.extname(fileName);
    const min = path.resolve(dest, fileName.replace(fileNameMin, `.min${fileNameMin}`));
    const css = fs.readFileSync(from, 'utf8');

    return new Promise((resolve, reject) => {
        return postcss([
            cssnested(),
            cssnext({
                stage: 0,
                browsers: ['last 2 version'],
                features: {
                    calc: false
                }
            }),
            cssmqpacker({
                sort: true
            }),
            cssprettify()
        ])
            .process(css, {
                from,
                to
            })
            .then(async (result) => {
                if (result && result.css) {
                    await fs.promises.writeFile(to, result.css, 'utf8');

                    if (minify) {
                        const minified = new CssClean({}).minify(result.css);
                        await fs.promises.writeFile(min, minified.styles, 'utf8');

                        if (result.map) {
                            await fs.promises.writeFile(to + '.map', result.map, 'utf8');
                        }
                    }

                    resolve(to);
                } else {
                    reject(result);
                }
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

module.exports = postcssCompiler;
