const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

test('watcher syncs initial and rebuilt assets to docs', { timeout: 60000 }, async (t) => {
    const root = path.resolve(__dirname, '../..');
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'glightbox-watch-test-'));
    const packages = path.join(temp, 'packages');
    fs.cpSync(__dirname, path.join(packages, 'build'), {
        recursive: true,
        filter: (source) => path.basename(source) !== 'node_modules'
    });
    for (const dir of ['src', 'dist']) {
        fs.cpSync(path.join(root, 'packages', 'glightbox', dir), path.join(packages, 'glightbox', dir), { recursive: true });
    }

    const nodePath = [path.join(root, 'node_modules'), path.join(__dirname, 'node_modules'), process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
    const watcher = spawn(process.execPath, [path.join(packages, 'build', 'watcher.js')], {
        cwd: root,
        env: { ...process.env, NODE_PATH: nodePath }
    });
    let output = '';
    watcher.stdout.on('data', (data) => {
        output += data;
    });
    watcher.stderr.on('data', (data) => {
        output += data;
    });
    t.after(async () => {
        if (watcher.exitCode === null && watcher.signalCode === null) {
            watcher.kill();
            await new Promise((resolve) => watcher.once('exit', resolve));
        }
        fs.rmSync(temp, { recursive: true, force: true });
    });

    async function waitFor(predicate) {
        const deadline = Date.now() + 45000;
        while (!predicate()) {
            if (watcher.exitCode !== null || watcher.signalCode !== null || Date.now() > deadline) {
                throw new Error(`Watcher did not complete successfully:\n${output}`);
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    const library = path.join(packages, 'glightbox');
    const docs = path.join(packages, 'docs', 'public', 'dist');
    const files = [
        ['js', 'glightbox.js'],
        ['js', 'glightbox.min.js'],
        ['css', 'glightbox.css'],
        ['css', 'glightbox.min.css']
    ];
    function assertSynced() {
        for (const [dir, name] of files) {
            assert.equal(fs.readFileSync(path.join(docs, dir, name), 'utf8'), fs.readFileSync(path.join(library, 'dist', dir, name), 'utf8'));
        }
    }

    await waitFor(() => output.includes('Initial scan complete'));
    assertSynced();
    fs.appendFileSync(path.join(library, 'src', 'js', 'glightbox.js'), '\nconsole.log("WATCH_TEST_MARKER");\n');
    fs.appendFileSync(path.join(library, 'src', 'postcss', 'glightbox.css'), '\n.watch-test-marker { color: red; }\n');
    await waitFor(() => output.includes('Javascript Build') && output.includes('PostCSS Build'));
    assertSynced();
    for (const [dir, name] of files) {
        const marker = dir === 'js' ? 'WATCH_TEST_MARKER' : 'watch-test-marker';
        assert.ok(fs.readFileSync(path.join(docs, dir, name), 'utf8').includes(marker), `${name} is stale`);
    }
});
