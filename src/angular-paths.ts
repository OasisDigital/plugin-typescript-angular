// from Angular QuickStart:
// https://github.com/angular/quickstart/commit/eaf53869d0c2f4011138fc4f311abe913006a99f

const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*)/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

export function adjustPaths(loader: any, load) {
	const url = new URL(load.address);
	const basePathParts = url.pathname.split('/');
	basePathParts.pop();  // remove filename
	const basePath = basePathParts.join('/'); // absolute path
	const baseHref = new URL(loader.baseURL).pathname;

	// QuickStart code did this, for some reason:
	// basePath = basePath.replace(baseHref, '');
	load.source = load.source
		.replace(templateUrlRegex, function (match, quote, url) {
			let resolvedUrl = url;
			if (url.startsWith('.')) {
				resolvedUrl = basePath + url.substr(1);
			}
			return `templateUrl: '${resolvedUrl}'`;
		})
		.replace(stylesRegex, function (match, relativeUrls) {
			const urls = [];
			while ((match = stringRegex.exec(relativeUrls)) !== null) {
				if (match[2].startsWith('.')) {
					urls.push(`'${basePath}${match[2].substr(1)}'`);
				} else {
					urls.push(`'${match[2]}'`);
				}
			}
			return "styleUrls: [" + urls.join(', ') + "]";
		});

	return load;
};
