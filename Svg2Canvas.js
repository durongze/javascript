/* <script type="application/javascript" src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/canvg/1.5/canvg.js"></script>
<script type="application/javascript" src="https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js"></script>
<script type="application/javascript" src="https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.svg.js"></script>*/
function Svg2Canvas()
{
		var nodesToRecover = [];
		var nodesToRemove = [];
		var svgElem = $("#target").find('svg');
		svgElem.each(function (index, node) {
						var parentNode = node.parentNode;
						var svg = node.outerHTML.trim();

						var canvas_svg = document.createElement('canvas');
						canvg(canvas_svg, svg); 
						/*if (node.style.position) 
						  {
						  canvas_svg.style.position += node.style.position;
						  canvas_svg.style.left += node.style.left;
						  canvas_svg.style.top += node.style.top;
						  }*/

						nodesToRecover.push({parent: parentNode, child: node});
						// parentNode.removeChild(node);

						nodesToRemove.push({parent: parentNode, child: canvas_svg});
						parentNode.appendChild(canvas_svg);
						var base64Str = canvas_svg.toDataURL();
						// $('<img>',{src:base64Str}).appendTo($('body'));
						// var canvas = document.querySelector("#canvas");
						var strDataURI = canvas_svg.toDataURL("image/jpeg");
						var image = strDataURI.replace("image/jpeg", "image/octet-stream");
						// window.location.href = image;
						let odate = new Date();
						var link = document.createElement('a');
						link.setAttribute('href', image);
						link.setAttribute('download', 'file' + odate.getMinutes() + "_" + odate.getSeconds() + '.jpg');
						link.click();
		});
}
