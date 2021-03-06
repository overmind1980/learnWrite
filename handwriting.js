var canvasWidth = Math.min(600 ,$(window).width()-20);
var canvasHeight = canvasWidth;
console.log("canvasWidth==="+canvasWidth);
console.log("canvasHeight==="+canvasHeight);

var row=0,column= -1,current;

var strokeColor = "black";

var isMouseDown = false;
var lastLoc = {x:0,y:0};
var lastTimestamp = 0;
var lastLineWidth = -1;

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

var sample = document.getElementById('sample');
sample.style.fontSize = canvasWidth*0.9+"px";
sample.style.left = canvasWidth*0.1+"px";

var _isAudioInit = false;

var playAudio = function(src) {
	if (typeof device != "undefined") {
		alert(3);
		// Android
		if (device.platform == 'Android') {
			console.log(src);
		}
		var mediaRes = new Media(src, function onSuccess() {
			mediaRes.release();
		}, function onError(e) {
			alert("error playing sound: " + JSON.stringify(e));
		});
		mediaRes.play();
	}else if (typeof Audio != "undefined") {
		if (!_isAudioInit) {
			_audio = new Audio(src);
			_audio.play();
			_isAudioInit = true;
		} else {
			_audio.src = src;
			_audio.play();
		}
	} else {
		alert("no sound API to play: " + src);
	}
}


$("#controller").css("width",canvasWidth+"px");
drawGrid();
$("#clear_btn").click(
	function(e){
		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)

$("#prev_btn").click(
	function(e){
		//alert("row====="+row+"column===="+column);

		if(column==0){
			column=1;
			row--;
		}
		else{
			column=0;
		}
		if(row<0||column<0){
			row=50;
			column=1;

		}
		sample.innerHTML=_word[row][column];
		playAudio("./audio/" + _word[row][2] + ".wav");

		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)

$("#next_btn").click(
	function(e){
		//alert("row====="+row+"column===="+column);
		if(column==1){
			column=0;
			row++;
		}
		else{
			column++;
		}

		sample.innerHTML=_word[row][column];
		playAudio("./audio/" + _word[row][2] + ".wav");

		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)

$("#a_btn").click(
	function(e){
		column=0;
		row=0;
		sample.innerHTML=_word[row][column];
		playAudio("./audio/" + _word[row][2] + ".wav");

		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)


$("#sa_btn").click(
	function(e){
		column=0;
		row=10;
		sample.innerHTML=_word[row][column];
		playAudio("./audio/" + _word[row][2] + ".wav");

		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)

$("#na_btn").click(
	function(e){
		column=0;
		row=20;
		sample.innerHTML=_word[row][column];
		playAudio("./audio/" + _word[row][2] + ".wav");

		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)

$("#ma_btn").click(
	function(e){
		column=0;
		row=30;
		sample.innerHTML=_word[row][column];
		playAudio("./audio/" + _word[row][2] + ".wav");

		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)

$("#ra_btn").click(
	function(e){
		column=0;
		row=40;
		sample.innerHTML=_word[row][column];
		playAudio("./audio/" + _word[row][2] + ".wav");

		context.clearRect(0,0,canvasWidth,canvasHeight);
		drawGrid();
	}
)


$(".font_btn").click(
	function(e){
		$(".font_btn").removeClass("font_btn_selected");
		$(this).addClass("font_btn_selected");
	}
);

function beginStroke(point){
	isMouseDown = true;
	lastLoc = windowToCanvas(point.x,point.y);
	lastTimestamp = new Date().getTime();
}
function endStroke(){
	isMouseDown = false;
}
function moveStroke(point){
	var curLoc = windowToCanvas(point.x,point.y);
	var curTimestamp = new Date().getTime();
	var s = calcDistance(curLoc,lastLoc);
	var t = curTimestamp - lastTimestamp;


	var lineWidth = calcLineWidth(t,s);

	//draw

	context.beginPath();
	context.moveTo(lastLoc.x,lastLoc.y);
	context.lineTo(curLoc.x,curLoc.y);
	context.strokeStyle = strokeColor;
	context.lineWidth = lineWidth;
	context.lineCap = "round";
	context.lineJoin = "round";
	context.stroke();


	lastLoc = curLoc;
	lastTimestamp = curTimestamp;
	lastLineWidth = lineWidth;
}

canvas.onmousedown = function(e){
	e.preventDefault();
	beginStroke({x:e.clientX,y:e.clientY});
}
canvas.onmouseup = function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmouseout = function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmousemove = function(e){
	e.preventDefault();
	if (isMouseDown) {
		moveStroke({x:e.clientX,y:e.clientY});
	}
};

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	touch = e.touches[0];
	beginStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener('touchmove',function(e){
	e.preventDefault();
	if (isMouseDown) {
		touch = e.touches[0];
		moveStroke({x:touch.pageX,y:touch.pageY});
	}
});
canvas.addEventListener('touchend',function(e){
	e.preventDefault();
	endStroke();
});


var maxLineWidth = 20;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;

function calcLineWidth(t,s){

	var v = s/t;
	var resultLineWidth;
	if (v<=minStrokeV) {
		resultLineWidth = maxLineWidth;
	}else if (v>=maxStrokeV) {
		resultLineWidth = minLineWidth;
	}else{
		resultLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
	}
	if (lastLineWidth == -1) {
		return resultLineWidth;
	}
	return lastLineWidth*2/3 + resultLineWidth*1/3;
}


function calcDistance(loc1,loc2){

	return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y));
}



function windowToCanvas(x,y){
	var bbox = canvas.getBoundingClientRect();
	return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)}
}



function drawGrid(){

	context.save();

	context.strokeStyle = "rgb(230,11,9)";

	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();

	context.lineWidth = 6;
	context.stroke();


	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(canvasWidth,canvasHeight);

	context.moveTo(canvasWidth,0);
	context.lineTo(0,canvasHeight);

	context.moveTo(canvasWidth/2,0);
	context.lineTo(canvasWidth/2,canvasHeight);

	context.moveTo(0,canvasHeight/2);
	context.lineTo(canvasWidth,canvasHeight/2);

	context.lineWidth = 1;
	context.stroke();

	context.restore();
}