const fs = require('node:fs');
const chokidar = require('chokidar');
const path = require('node:path');
const jscompiler = require('./jscompiler');
const postcssCompiler = require('./postcss');
const terser = require('terser');

const root = path.resolve(__dirname, '../glightbox');
let config = {
    js: {
        src: path.join(root, 'src/js'),
        dest: path.join(root, 'dist/js')
    },
    css: {
        src: path.join(root, 'src/postcss'),
        dest: path.join(root, 'dist/css')
    },
    docs: {
        js: path.join(root, '../docs/public/dist/js'),
        css: path.join(root, '../docs/public/dist/css')
    }
};

function syncDocs(dest, files) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of files) {
        fs.copyFileSync(file, path.join(dest, path.basename(file)));
    }
}

/**
 * Handle Javascript files
 * compile the javascript files
 * to es2015, minify and sync the files
 *
 * @param {string} file path
 */
async function handleJavascript(file) {
    file = path.join(config.js.src, 'glightbox.js');

    const name = path.basename(file);

    await jscompiler({
        file,
        dest: config.js.dest,
        format: 'umd',
        sourcemap: false,
        moduleID: 'GLightbox'
    });

    const minName = name.replace('.js', '.min.js');
    const processed = path.join(config.js.dest, name);
    const code = fs.readFileSync(processed, 'utf8');
    const minified = await terser.minify(code);
    if (minified.error) {
        throw minified.error;
    }
    const minifyPath = path.join(config.js.dest, minName);
    fs.writeFileSync(minifyPath, minified.code);
    syncDocs(config.docs.js, [processed, minifyPath]);

    console.log('Javascript Build', `Compiled and Minified ${name}`);
}

/**
 * Handle Postcss files
 * compile the css files
 *
 * @param {string} file path
 */
async function handlePostCSS(file) {
    const name = path.basename(file);
    const dest = config.css.dest;

    await postcssCompiler({
        file,
        dest,
        minify: true
    });
    syncDocs(config.docs.css, [path.join(dest, name), path.join(dest, name.replace(/\.css$/, '.min.css'))]);
    console.log('PostCSS Build', `Compiled and Minified ${name}`);
}

/**
 * Watcher
 * what the files for the backedn
 * this includes js and css files
 */
function filesWatcher() {
    try {
        syncDocs(config.docs.js, [path.join(config.js.dest, 'glightbox.js'), path.join(config.js.dest, 'glightbox.min.js')]);
        syncDocs(config.docs.css, [path.join(config.css.dest, 'glightbox.css'), path.join(config.css.dest, 'glightbox.min.css')]);
    } catch (error) {
        console.error('Initial docs sync failed:', error);
    }

    const watcher = chokidar.watch(path.join(root, 'src'), {
        ignored: ['**/.DS_Store', '**/.jshintrc', '**/.babelrc'],
        persistent: true,
        depth: 3,
        awaitWriteFinish: {
            stabilityThreshold: 500,
            pollInterval: 500
        }
    });

    let pending = Promise.resolve();
    watcher.on('change', (file) => {
        pending = pending
            .then(() => {
                if (file.endsWith('.js')) {
                    return handleJavascript(file);
                }
                if (file.endsWith('.css')) {
                    return handlePostCSS(file);
                }
            })
            .catch((error) => console.error('Watch build failed:', error));
    });
    watcher.on('ready', () => console.log('Watching files', 'Initial scan complete. Ready for changes'));
}
filesWatcher();
