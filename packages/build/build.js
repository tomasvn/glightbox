const fs = require('node:fs');
const path = require('node:path');
const jscompiler = require('./jscompiler');
const postcssCompiler = require('./postcss');
const terser = require('terser');

const root = path.resolve(__dirname, '../glightbox');
const sourceJs = path.join(root, 'src/js/glightbox.js');
const sourceCss = path.join(root, 'src/postcss');
const distJs = path.join(root, 'dist/js');
const distCss = path.join(root, 'dist/css');

async function build() {
    await jscompiler({
        file: sourceJs,
        dest: distJs,
        format: 'umd',
        sourcemap: false,
        moduleID: 'GLightbox'
    });

    const js = fs.readFileSync(path.join(distJs, 'glightbox.js'), 'utf8');
    const minified = await terser.minify(js);
    if (minified.error) {
        throw minified.error;
    }
    fs.writeFileSync(path.join(distJs, 'glightbox.min.js'), minified.code);

    const stylesheets = fs.readdirSync(sourceCss).filter((file) => file.endsWith('.css'));
    for (const stylesheet of stylesheets) {
        await postcssCompiler({
            file: path.join(sourceCss, stylesheet),
            dest: distCss,
            minify: true
        });
    }

    console.log('Build complete');
}

build().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
