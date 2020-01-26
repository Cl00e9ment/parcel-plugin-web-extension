const path = require('path')
const glob = require('fast-glob')
const fs = require('fs');

function WebExtensionPlugin(bundler) {
    bundler.addAssetType('json', require.resolve('./ManifestAsset'))

    const options = bundler.options
    const locales = glob.sync(
        path.resolve(options.rootDir, '_locales/**/messages.json')
    )
    bundler.entryFiles.push(...locales)

    // update entry files atime and mtime to avoid caching
    const now = Date.now();
    for (const file of bundler.entryFiles) {
        try {
            fs.utimesSync(file, now, now);
        } catch (err) {
            fs.closeSync(fs.openSync(file, 'w'));
        }
    }
}

module.exports = WebExtensionPlugin
