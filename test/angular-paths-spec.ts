import { adjustPaths } from '../src/angular-paths';

const baseURL = 'http://localhost:6233/foo/';

function callIt(address: string, source: string) {
	const loader = {
		baseURL
	}
	const modu = {
		name: 'ignored',
		address,
		source
	}
	return adjustPaths(loader, modu).source;
}

const example = `
System.register(["@angular/core"], function (exports_1, context_1) {
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
		 var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
		 if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
		 else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		 return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __moduleName = context_1 && context_1.id;
	var core_1, ThirdComponent;
	return {
		 setters: [
			  function (core_1_1) {
					core_1 = core_1_1;
			  }
		 ],
		 execute: function () {
			  ThirdComponent = /** @class */ (function () {
					function ThirdComponent() {
					}
					ThirdComponent = __decorate([
						 core_1.Component({
							  selector: 'app-third',
							  template: "\n    <div class=\"outline-box\">Third Component</div>\n  ",
							  styleUrls: ['./third.component.css']
							  // , encapsulation: ViewEncapsulation.None
							  // , encapsulation: ViewEncapsulation.Native // Look in global.css at shadow selector
						 })
					], ThirdComponent);
					return ThirdComponent;
			  }());
			  exports_1("ThirdComponent", ThirdComponent);
		 }
	};
});`;

describe('Angular Paths', () => {
	const { URL } = require('url');
	global['URL'] = URL;

	it('empty works', () => {
		const source = `styleUrls: []`;
		callIt(baseURL + '1.ts', source).should.equal(source);
	});

	it('plain path works', () => {
		const source = `styleUrls: ['app.component.css']`;
		callIt(baseURL + '1.ts', source).should.equal(source);
	});

	it('dot path works', () => {
		const source = `styleUrls: ['./app.component.css']`;
		callIt(baseURL + '1.ts', source).should.equal(
			`styleUrls: ['/foo/app.component.css']`
		);
	});

	it('deeper path works', () => {
		const source = `styleUrls: ['./app.component.css']`;
		callIt(baseURL + 'bar/1.ts', source).should.equal(
			`styleUrls: ['/foo/bar/app.component.css']`
		);
	});

	it('two paths work', () => {
		const source = `styleUrls: ['./app.component.css', "./foo.scss"]`;
		callIt(baseURL + 'bar/1.ts', source).should.equal(
			`styleUrls: ['/foo/bar/app.component.css', '/foo/bar/foo.scss']`
		);
	});

	it('example works', () => {
		const expected = example.replace(
			`styleUrls: ['./third.component.css']`,
			`styleUrls: ['/foo/bar/third.component.css']`)
		callIt(baseURL + 'bar/1.ts', example).should.equal(expected);
	});
});
