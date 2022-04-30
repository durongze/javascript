<script src="./b64.js"></script>
<script src="../LZWEncoder.js"></script>
<script src="../NeuQuant.js"></script>
<script src="../GIFEncoder.js"></script>
<script src="../hanzi-writer.js"></script>
<script src="../jquery-3.4.1.js"></script>
<script src="../html2canvas.js"></script>
<script src="../canvg.js"></script>
<img id="image">
<style type="text/css">
.box {width: 100px; height: 100px; background: red; border: 5px solid yellow;}
</style>
<script>
	var svg_tmr;
	var img_idx = 0;

	function CreateDiv(word, width, height)
	{
		var word_div = document.createElement('div');
		word_div.id = word;
		word_div.width = width;
		word_div.height = height;
		document.body.appendChild(word_div);
		return word_div;
	}

	function CreateWordList(text, width, height) {
		for (var i = 0; i < text.length; ++i) {
			var word = text.substr(i, 1);
			CreateDiv(word, width, height);
			var wheat = HanziWriter.create(word, word, {width:width, height:height, padding:5, delayBetweenLoops:3000});
			wheat.loopCharacterAnimation();			
		}
	}

	function CreateCanvasId(red, green, blue)
	{
		return red + "_" + green + "_" + blue;
	}

	function CreateCanvas(red, green, blue, width, height)
	{
		var id = CreateCanvasId(red, green, blue);
		var canvas = document.createElement('canvas');
		canvas.id = id;
		canvas.width = width;
		canvas.height = height;

		var context = canvas.getContext('2d');
		context.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";
		context.fillRect(0, 0, canvas.width, canvas.height);
		return context;
	}

	function CreateGif(width, height)
	{
		encoder = new GIFEncoder();
		console.log(encoder.start());
		encoder.setRepeat(1000); //auto-loop
		encoder.setDelay(200);
		encoder.setSize(width, height);

		var context_red = CreateCanvas(255, 0, 0, width, height);
		var context_green = CreateCanvas(0, 255, 0, width, height);

		encoder.addFrame(context_red);
		encoder.addFrame(context_green);
		return encoder;
	}

	function UpdateNode(parentNode, canvas_svg)
	{
		if (parentNode.childNodes.length > 1) {
			parentNode.replaceChild(canvas_svg, parentNode.lastChild);
		} else {
			parentNode.appendChild(canvas_svg);
		}
	}

	function SaveCanvas(canvas_svg, img_name)
	{
		var strDataURI = canvas_svg.toDataURL("image/jpeg");
		var image = strDataURI.replace("image/jpeg", "image/octet-stream");
		var link = document.createElement('a');
		link.setAttribute('href', image);
		link.setAttribute('download', img_name + '.jpg');
		// link.click();
	}

	function SvgCallBack(index, node) {
		var canvas_svg = document.createElement('canvas');
		canvas_svg.id = 'svg_canvas';
		canvg(canvas_svg, node.outerHTML.trim());

		UpdateNode(node.parentNode, canvas_svg);

		encoder.addFrame(canvas_svg.getContext('2d'));

		SaveCanvas(canvas_svg, ++img_idx);
	}

	function Svg2Canvas() {
		if (img_idx > GetTimeByWordIdx(text.length - 1)) {
			clearInterval(svg_tmr);
			encoder.finish();
			img_idx = 0;
			document.getElementById('image').src = 'data:image/gif;base64,'+encode64(encoder.stream().getData());
			return ;
		}
		var word_idx = GetWordIdxByImgIdx(img_idx);
		var img_div = "#" + text.substr(word_idx, 1);
		console.log("img_div:" + img_div);
		var svgElem = $(img_div).find('svg');
		svgElem.each(SvgCallBack);
	};

	function GetTimeByWordIdx(index) 
	{
		var tm = 0;
		for (var i = 0; i <= index; ++i) {
			tm += text_tm[i];	
		}
		return tm;
	}

	function GetWordIdxByImgIdx(img_idx)
	{
		for (var i = 0; i < text.length - 1; ++i) 
		{
			var tm = GetTimeByWordIdx(i);
			if (tm > img_idx) {
				break;
			}
		}
		console.log(tm + ":" + img_idx + ":" + i);
		return i;
	}
	
	var width = 100;
	var height = 100;
	
	var text = "麦思五一快乐";
	var text_tm = [5, 9, 19, 7, 3, 10, 6];

	CreateWordList(text, width, height);
	var encoder = CreateGif(width, height);
	svg_tmr = setInterval("Svg2Canvas()", 1000);

</script>
