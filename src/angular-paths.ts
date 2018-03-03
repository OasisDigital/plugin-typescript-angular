// from Angular QuickStart:
// https://github.com/angular/quickstart/commit/eaf53869d0c2f4011138fc4f311abe913006a99f

const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*)/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

interface Loader {
	baseURL: string;
}

export function adjustPaths(loader: Loader, modu: Module) {
	if (modu.source.indexOf('moduleId') != -1) return modu;

	const url = new URL(modu.address);
	const basePathParts = url.pathname.split('/');
	basePathParts.pop();  // remove filename
	let basePath = basePathParts.join('/'); // absolute path
	const baseHref = new URL(loader.baseURL).pathname;
	// basePath = basePath.replace(baseHref, '');
	modu.source = modu.source || '';
	modu.source = modu.source
		.replace(templateUrlRegex, function (match, quote, url) {
			let resolvedUrl = url;
			if (url.startsWith('.')) {
				resolvedUrl = basePath + url.substr(1);
			}
			return `templateUrl: '${resolvedUrl}'`;
		})
		.replace(stylesRegex, function (substr: string, relativeUrls) {
			const urls = [];
			let match: RegExpExecArray;
			while ((match = stringRegex.exec(relativeUrls)) !== null) {
				if (match[2].startsWith('.')) {
					const adjustedUrl = `'${basePath}${match[2].substr(1)}'`;
					// console.log(adjustedUrl);
					urls.push(adjustedUrl);
				} else {
					urls.push(`'${match[2]}'`);
				}
			}
			return "styleUrls: [" + urls.join(', ') + "]";
		});

	return modu;
};
