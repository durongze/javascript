	var svg_tmr;
	var wheat_idx = 0;
	var writer_wheat = HanziWriter.create('wheat_div', '麦', {
		width: 100,
		height: 100,
		padding: 5,
		delayBetweenLoops: 3000
	});   
	writer_wheat.loopCharacterAnimation();  

	var canvas = document.getElementById('bitmap');
	var context = canvas.getContext('2d');

	context.fillStyle = "rgb(255, 0, 0)";
	context.fillRect(0,0,canvas.width, canvas.height); 

	var encoder = new GIFEncoder();
	console.log(encoder.start());
	encoder.setRepeat(0); //auto-loop
	encoder.setDelay(500);
	encoder.setSize(100, 100);

	function Svg2CanvasWheat() {
		if (wheat_idx > 10) {
			clearInterval(svg_tmr);
			encoder.finish();
			document.getElementById('image').src = 'data:image/gif;base64,'+encode64(encoder.stream().getData());
			return ;
		}
		var svgElem = $("#wheat_div").find('svg');
		svgElem.each(function (index, node) {
			var parentNode = node.parentNode;
			var svg = node.outerHTML.trim();

			var canvas_svg = document.createElement('canvas');
			canvg(canvas_svg, svg);
			console.log('parentNode.id:' + parentNode.id + ":" + parentNode.childNodes.length);
			canvas_svg.id = 'svg_canvas';
			if (parentNode.childNodes.length > 1) {
				parentNode.replaceChild(canvas_svg, parentNode.lastChild);
			} else {
				parentNode.appendChild(canvas_svg);
			}
			var strDataURI = canvas_svg.toDataURL("image/jpeg");
			var image = strDataURI.replace("image/jpeg", "image/octet-stream");
			var link = document.createElement('a');
			link.setAttribute('href', image);
			link.setAttribute('download', 'wheat_div' + wheat_idx + '.jpg');
			// link.click();
			wheat_idx += 1;
		});
		// var imageData = $("#wheat_div").lastChild.toDataURL("image/jpeg");
		// encoder.addFrame(imageData, true);
		var svg_canvas = $("#wheat_div").find('canvas');
		// var svg_context = svg_canvas.getContext('2d');
		console.log('svg_canvas:' + svg_canvas[0]);
		encoder.addFrame(context);
		// encoder.addFrame(document.getElementById('svg_context').getContext('2d'));
	};

	svg_tmr = setInterval("Svg2CanvasWheat()", 1000);
