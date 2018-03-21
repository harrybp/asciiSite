function getCharacterWidth(){
	var sizingSpan = document.createElement("span");
	sizingSpan.innerHTML = '--------------------';
	sizingSpan.style.cssText += 'position: absolute; top: -100px; padding: 0px;';
	document.body.insertBefore(sizingSpan, document.body.firstChild);
	sizingSpan.parentNode.removeChild(sizingSpan);
	return sizingSpan.clientWidth/20;
}

function drawLine() {
  var finished = getGlobalLeftPadding();;
	for(var x = 0; x < pageWidth-1; x++) finished += '-';
  return finished + '\n';
}

function writeCentered(text){
  var finished = getGlobalLeftPadding() + '|';
  var leftPadding = Math.floor((pageWidth-4 - text.length) /2);
  var rightPadding = pageWidth-4 - leftPadding - text.length ;
  for(x = 0; x < leftPadding; x++) finished += '&nbsp;';
  finished += text;
  for(x = 0; x < rightPadding; x++) finished += '&nbsp;';
  return finished + ' | \n';
}

function navbar(links){
  var finished = getGlobalLeftPadding()+'|';
  var widthPerNav = Math.floor((pageWidth - 2 - links.length-1) / links.length);
  var shortage = pageWidth - (widthPerNav*3 + 2 + 3);
  var largest = 0;
  for(var linkIndex in links){
    var link = links[linkIndex];
    if(link.text.length + 2 > largest) largest = link.text.length + 2;
  }
  var totalLength = (largest * links.length) + links.length - 1 + 8;
  if(totalLength > pageWidth){
    var finished = '';
    for(var linkIndex in links){
      var link = links[linkIndex];
      finished += navbar([link]);
    }
    return finished;
  }


  for(var linkIndex in links){
    var link = links[linkIndex];
    var leftPadding = Math.floor((widthPerNav - 2 - link.text.length) /2);
    var rightPadding = widthPerNav - 2 - leftPadding - link.text.length;
    for(x = 0; x < leftPadding; x++) {
      if(link.selected) finished += '#';
      else finished += '&nbsp;';
    }
    finished += '[<a href=\'' + link.link + '\'>' + link.text + '</a>]';
    for(x = 0; x < rightPadding; x++) {
      if(link.selected) finished += '#';
      else finished += '&nbsp;';
    }
    if(shortage > 0){
      if(link.selected) finished += '#';
      else finished += '&nbsp;';
      shortage--;
    }
    if(linkIndex < links.length-1) finished += '|';  
  }
  return finished + '|\n';
}

function writeMultiCentered(text){
  var finished = '';
  var lines = text.split('\n');
  for(var lineIndex in lines)
    finished+=writeCentered(lines[lineIndex]);
  return finished;

}
function getGlobalLeftPadding(){
  var text = '';
  for(var x = 0; x < globalLeftPadding; x++) text += '&nbsp;';
  return text;
}
function addGlobalRightPadding(text){
  for(var x = 0; x < globalRightPadding; x++) text += '&nbsp;';
  return text;
}

function go(){
  document.body.innerHTML = '';
	var charWidth = getCharacterWidth();
	pageWidth = Math.floor(window.innerWidth/9.6);
  intWidth = Math.floor(700/9.6);
  if(intWidth < pageWidth){
    var difference = pageWidth-intWidth;
    globalLeftPadding = Math.floor(difference/2);
    globalRightPadding = difference - globalLeftPadding;
    pageWidth = intWidth;
  } else {
    globalLeftPadding = globalRightPadding = 0;
  }


  var text = '';
	text += drawLine();
  text += writeCentered('Harry Bond-Preston')
  text += drawLine();

  var links = [
    { text: 'About Me', link: '#', selected: true },
    { text: 'Web Projects', link: '#', selected: false },
    { text: 'Github', link: '#', selected: false }
  ]
  text += navbar(links);
  text += drawLine();
  text += writeCentered('');
  text += writeCentered('About Me');
  text += writeCentered('');
  text += drawLine();


  document.body.innerHTML = text;

}

go();

window.onresize = function(event) {
  go();
};