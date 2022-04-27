<script src="./b64.js"></script>
<script src="../LZWEncoder.js"></script>
<script src="../NeuQuant.js"></script>
<script src="../GIFEncoder.js"></script>
<script src="../hanzi-writer.js"></script>
<script src="../jquery-3.4.1.js"></script>
<script src="../html2canvas.js"></script>
<script src="../canvg.js"></script>
<canvas id="bitmap_red" width = "100px" height="100px" ></canvas>
<canvas id="bitmap_green" width = "100px" height="100px" ></canvas>
<img id="image">
<div id="wheat_div" class="box"></div>
<div id="mind_div" class="box"></div>
<style type="text/css">
.box {width: 100px; height: 100px; background: red; border: 5px solid yellow;}
</style>
<script>
	var svg_tmr;
	var img_idx = 0;

	var wheat = HanziWriter.create('wheat_div', '麦', {width:100, height:100, padding:5, delayBetweenLoops:3000});
	wheat.loopCharacterAnimation();  
	var mind = HanziWriter.create('mind_div', '思', {width:100, height:100, padding:5, delayBetweenLoops:3000});
	mind.loopCharacterAnimation();

	var encoder = null;
	function CreateGif(width, height)
	{
		encoder = new GIFEncoder();
		console.log(encoder.start());
		encoder.setRepeat(1000); //auto-loop
		encoder.setDelay(200);
		encoder.setSize(width, height);

		var canvas_red = document.getElementById('bitmap_red');
		var context_red = canvas_red.getContext('2d');
		context_red.fillStyle = "rgb(255, 0, 0)";
		context_red.fillRect(0,0,canvas_red.width, canvas_red.height); 

		var canvas_green = document.getElementById('bitmap_green');
		var context_green = canvas_green.getContext('2d');
		context_green.fillStyle = "rgb(0, 255, 0)";
		context_green.fillRect(0, 0, canvas_green.width, canvas_green.height); 

		encoder.addFrame(context_red);
		encoder.addFrame(context_green);
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
		link.setAttribute('download', img_idx + '.jpg');
		// link.click();
		img_idx += 1;
	}

	function SvgCallBack(index, node) {
		var parentNode = ;
		var svg = node.outerHTML.trim();

		var canvas_svg = document.createElement('canvas');
		canvas_svg.id = 'svg_canvas';
		canvg(canvas_svg, svg);

		UpdateNode(node.parentNode, canvas_svg);

		encoder.addFrame(canvas_svg.getContext('2d'));

		SaveCanvas(canvas_svg);
	}

	function Svg2Canvas() {
		if (img_idx > 26) {
			clearInterval(svg_tmr);
			encoder.finish();
			document.getElementById('image').src = 'data:image/gif;base64,'+encode64(encoder.stream().getData());
			return ;
		}
		var img_div = img_idx < 13 ? "#wheat_div" : "#mind_div";
		var svgElem = $(img_div).find('svg');
		svgElem.each(SvgCallBack);
	};

	svg_tmr = setInterval("Svg2Canvas()", 1000);

</script>
