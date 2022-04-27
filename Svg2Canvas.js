		<div id="target"></div>

		<!-- <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> -->
		<script type="application/javascript" src="../dist/hanzi-writer.js"></script>
		<script type="application/javascript" src="test.js"></script>
		<script type="application/javascript" src="gif.js"></script>
		<script type="application/javascript" src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
		<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/canvg/1.5/canvg.js"></script>
		<script type="application/javascript" src="https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js"></script>
		<script type="application/javascript" src="https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.svg.js"></script>
		<script type="text/javascript">
		var svg_idx = 10;
		var svg_dur = 1;
		var svg_tmr;
                var width = 400;
		var height = 400;

		var gif = null;
		function CreateGif(width, height) {
			gif = new GIF({workers:2, quality:10,	width:width, height:height});

			// add an image element
			var imageElement = document.createElement('image');
			// gif.addFrame(imageElement);

			// or a canvas element
			var canvasElement = document.createElement('canvas');
			canvasElement.style.color = '#FF0000';
			canvasElement.style.width = width;
			canvasElement.style.height = height;
			gif.addFrame(canvasElement, {delay: 200});

			// or copy the pixels from a canvas context
			var ctx = canvasElement.getContext('2d');
			// gif.addFrame(ctx, {copy: true});

			gif.on('finished', function(blob) {	window.open(URL.createObjectURL(blob)); });
		}


		function SvgIdxInit() {
			svg_idx = 10;
		}

		function SvgIdxIncr() {
			return svg_idx++;
		}

		function UpdateNode(parentNode, canvas_svg)
		{
			if (parentNode.childNodes.length > 1) {
				parentNode.replaceChild(canvas_svg, parentNode.lastChild);
			} else {
				parentNode.appendChild(canvas_svg);
			}
		}

		function SaveCanvas(canvas_svg)
		{
			var strDataURI = canvas_svg.toDataURL("image/jpeg");
			var image = strDataURI.replace("image/jpeg", "image/octet-stream");
			var link = document.createElement('a');
			link.setAttribute('href', image);
			link.setAttribute('download', 'file' + SvgIdxIncr() + '.jpg');
			// link.click();
		}

		function SvgCallBack(index, node)
		{
			var canvas_svg = document.createElement('canvas');
			canvg(canvas_svg, node.outerHTML.trim()); 

			UpdateNode(node.parentNode, canvas_svg);

			gif.addFrame(canvas_svg, {delay: 200});

			SaveCanvas(canvas_svg);
		}

		function Svg2Canvas() {
			if (svg_idx > 20 * svg_dur) {
				clearInterval(svg_tmr);
				gif.render();
				SvgIdxInit();
				return ;
			}
			var svgElem = $("#target").find('svg');
			svgElem.each(SvgCallBack);
		};

		CreateGif(width, height);
