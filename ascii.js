//-----------------------------------------------------------------------------
//  ASCII Webpage
//    - By HarryBP
//
//  Define properties with config
      var config = { width: 700 }
//
//  Define page structure with build() method
      function build(){
        drawLine('-');
        writeCentered('Harry Bond-Preston');
        drawLine('-');
        var links = [
          { text: 'About Me', link: '#', selected: true },
          { text: 'Web Projects', link: '#', selected: false },
          { text: 'Github', link: '#', selected: false }
        ]
        navbar(links);
        drawLine('-');
        writeCentered('');
        writeCentered('About Me');
        writeCentered('');
        drawLine('-');
      }
//
//-----------------------------------------------------------------------------




//-----------------------------------------------------------------------------
//               _____ _____ 
//         /\   |  __ \_   _|     drawLine()
//        /  \  | |__) || |       writeCentered(text)
//       / /\ \ |  ___/ | |       navbar(links)
//      / ____ \| |    _| |_      
//     /_/    \_\_|   |_____|
//
//-----------------------------------------------------------------------------
//  Draws a line of given character across the screen width
function drawLine(char) {
  var finished = getGlobalLeftPadding();;
  for(var x = 0; x < pageWidth; x++) finished += char;
  text +=  (finished + '\n');
}

//-----------------------------------------------------------------------------
//  Writes given text centered in the screen
function writeCentered(content){
  var finished = getGlobalLeftPadding() + '|';
  var leftPadding = Math.floor((pageWidth - 2 - content.length) /2);
  var rightPadding = pageWidth - 2 - leftPadding - content.length ;
  for(x = 0; x < leftPadding; x++) finished += '&nbsp;';
  finished += content;
  for(x = 0; x < rightPadding; x++) finished += '&nbsp;';
  text += (finished + '|\n');
}

//-----------------------------------------------------------------------------
//  Adds a navbar given an array of links objects:
//    { 
//      text:     (String - The link display text),
//      link:     (String - The link url),
//      selected: (Boolean - True if link is for current page)
//    }
function navbar(links){
  var widthPerNav = Math.floor(((pageWidth - 2 - (links.length-1)) / links.length));
  var missed = pageWidth - (links.length*widthPerNav) - links.length-1;
  var largest = 0;
  for(var linkIndex in links){
    var link = links[linkIndex];
    if(link.text.length > largest) largest = link.text.length;
  }

  //Catch small screens
  if(largest+2 > widthPerNav){
    if(links.length > 1){
      var total = '';
      for(var linkI in links){
        navbar([links[linkI]]);
      }
      return;
    }
  }

  var finished = getGlobalLeftPadding()+'|';
  for(var linkIndex in links){
    var link = links[linkIndex];
    var leftPadding = Math.floor((widthPerNav - 2 - link.text.length) /2);
    var rightPadding = widthPerNav - 2 - leftPadding - link.text.length;
    for(x = 0; x < leftPadding; x++) {
      if(link.selected) finished += '>';
      else finished += '&nbsp;';
    }
    finished += '[<a href=\'' + link.link + '\'>' + link.text + '</a>]';
    for(x = 0; x < rightPadding; x++) {
      if(link.selected) finished += '<';
      else finished += '&nbsp;';
    }
    if(missed > 0){
      if(link.selected) finished += '<';
      else finished += '&nbsp;';
      missed--;
    }
    if(linkIndex < links.length-1) finished += '|';
  }
  text += finished + '|\n';
}

//-----------------------------------------------------------------------------
//  Helper functions
function getCharacterWidth(){
	var sizingSpan = document.createElement("span");
	sizingSpan.innerHTML = '--------------------';
	sizingSpan.style.cssText += 'position: absolute; top: -100px; padding: 0px;';
	document.body.insertBefore(sizingSpan, document.body.firstChild);
  var width = sizingSpan.clientWidth/20;
	sizingSpan.parentNode.removeChild(sizingSpan);
	return width;
}
function getGlobalLeftPadding(){
  var text = '';
  for(var x = 0; x < globalLeftPadding; x++) text += '&nbsp;';
  return text;
}
function calculate(){
  var configuration = (typeof config !== 'undefined')? config : {width:700};
  var siteWidth = (configuration.width);
  text = '';
  document.body.innerHTML = '';
  var charWidth = getCharacterWidth();
  pageWidth = Math.floor(window.innerWidth/charWidth);
  intWidth = Math.floor(siteWidth/charWidth);
  if(intWidth < pageWidth){
    globalLeftPadding = Math.floor((pageWidth-intWidth)/2);
    pageWidth = intWidth;
  } else {
    globalLeftPadding = 0;
  }
  build();
  document.body.innerHTML = text;
}
window.onload = function(){ calculate() };
window.onresize = function(event) { calculate(); };