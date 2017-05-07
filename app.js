var fs = require('fs');
var Images = require('images');
var imgFilels = null;
var infoLs = [];
var css = [];
var emptyCanvas = Images(1024, 10240);
var widthTotal = 0;
var heightTotal = 0;
var padding = 0;

let mypromise = new Promise((resolve, reject) => {
	fs.readdir('./', (err, data) => {
		if (err) reject(err);
		resolve(data);
	});
});

mypromise.then((data) => {

	imgFilels = data.filter(v => /png|jpg/.test(v));

	imgFilels.forEach((v, i) => {
		let img = Images(v);
		infoLs.push({
			name: v,
			width: img.width(),
			height: img.height(),
			currentY: heightTotal
		});
		emptyCanvas.draw(img, 0, heightTotal);
		if (img.width() > widthTotal) {
			widthTotal = img.width();
		}
		heightTotal += img.height();
		heightTotal += padding;
	});

	Images(emptyCanvas, 0, 0, widthTotal, heightTotal).save('_dest.png', {
		quality: 50
	});

	infoLs.forEach((v, i) => {
		css.push(
			'.' + v.name.split('.')[0] +
			'{\n' +
			'width: ' + v.width + 'rem;\n' +
			'height: ' + v.height + 'rem;\n' +
			'background-size: ' + 'auto ' + (heightTotal / v.height * 100).toFixed(2) + '%;\n' +
			'background-position: ' + '0 ' + (v.currentY / (heightTotal - v.height) * 100).toFixed(2) + '%;\n' +
			'}'
		);
	});


	fs.writeFile('info.css', css.join('\n'), (err) => {
		if (err) {
			throw err;
		}
		console.log('save to info.css');
	});


}).catch((e) => {
	throw e;
});