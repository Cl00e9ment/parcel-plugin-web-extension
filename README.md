[![Build Status](https://travis-ci.org/kevincharm/parcel-plugin-web-extension.svg?branch=master)](https://travis-ci.org/kevincharm/parcel-plugin-web-extension)

# parcel-plugin-web-extension

This [parcel](https://github.com/parcel-bundler/parcel) plugin enables you to use a WebExtension `manifest.json` as an entry point. For more information about `manifest.json`, please refer to the [MDN docs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json).

## Installation

Install via npm:
```sh
npm install --save-dev parcel-plugin-web-extension
```
or via yarn:
```sh
yarn add -D parcel-plugin-web-extension
```

## Usage

### Quick Start

After installing this plugin, use `manifest.json` as your entry point, like so:
```sh
parcel src/manifest.json
```
Your assets will now be resolved from the contents of your manifest file.

Assets resolved by this plugin:
- `background.scripts`
- `background.page`
- `content_scripts`
- `browser_action.default_popup`
- `browser_action.default_icon`
- `page_action.default_popup`
- `page_action.default_icon`
- `icons`
- `web_accessible_resources`
- `chrome_url_overrides.bookmarks`
- `chrome_url_overrides.newtab`
- `chrome_url_overrides.history`

### Dynamic Manifest

It is possible to generate a manifest that depends of:
- the environment (development / production)
- the targeted browser
- the version
- etc...

#### Example

Given this `manifest.json`:

```json
{
	"manifest_version": 2,
	"name": "Example",
	"version": {
		"$replaceByVariable": "npm_package_version"
	},
	"permissions": [
		"storage",
		{
			"$keepIf": "NODE_ENV is development",
			"$replaceByValue": "https://localhost/*"
		},
		{
			"$keepIf": "NODE_ENV is production",
			"$replaceByValue": "https://example.com/*"
		}
	],
	"applications": {
		"$keepIf": "VENDOR is firefox",
		"gecko": {
			"id": "example@example.com"
		}
	}
}
```

If you execute this command,

```bash
VENDOR=firefox parcel src/manifest.json
```

...you will get this generated manifest:

```json
{
	"manifest_version": 2,
	"name": "Example",
	"version": "1.0.0",
	"permissions": [
		"storage",
		"https://localhost/*",
	],
	"applications": {
		"gecko": {
			"id": "example@example.com"
		}
	}
}
```

What happend?  
- The manifest `version` key was replaced by the `npm_package_version` environment variable. It corresponds to the version stored in your `package.json`. Here it's `1.0.0`.
- The `localhost` permission was kept but the `example.com` one was droped because you are in a development environment. Use `parcel build` to switch to production environment.
- The `applications` object was kept because we set the `VENDOR` environment variable to `firefox`. Please note that unless `npm_package_version` or `NODE_ENV` that are automatically set by NPM, the `VENDOR` environment variable is defined by you. You can use other variables that way if you want.

For more information please see [Simple JSON Templater](https://www.npmjs.com/package/simple-json-templater)

## Licence

Apache 2.0
