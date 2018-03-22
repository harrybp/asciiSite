//-----------------------------------------------------------------------------
//  ASCII Webpage
//    - By HarryBP
//
//  Override properties with config
//  DEFAULTS =    width:  700
      var config = { width: 500};
//
//  Define page structure with build() method
      function build(){
        var links = [
          { text: 'About Me', link: '#', active: false },
          { text: 'Web Projects', link: '#', active: true },
        ];
        navbar('HarryBP', links);
        blankLine();
        writeTitle('Web Projects', ' ')
        var links = [
          { text: 'Games', active: true, link: 'games' },
          { text: 'Other', active: false, link: 'other' }
        ];
        var tabs = { 
          key: 'wp', 
          links: links,
          topPadding: ' ',
          bottomPadding: '|',
        }
        drawTabs(tabs);
        writeTitle(' Games', '|', 'wpgames');
        writeTitle(' Other', '|', 'wpother');
        writeTitle('');
        var text1 = 'A side scrolling run-and-shoot type game. My first attempt at building a HTML5 game.';
        var text2 = 'Keep the ball from escaping! My second game, simpler but more mathematically complex.';
        columns('- Zombie Run', '- Bounce', 'wpgames');
        columns(text1, text2, 'wpgames');
        columns('<a href="#">Click to Play</a>', '<a href="#">Click to Play</a>', 'wpgames');
        drawLine('.');
      }
//
//-----------------------------------------------------------------------------



//ToDO Make columns work properly with links?
//Tidy some methods up
//Popups
//Dropdown for little nav
//-----------------------------------------------------------------------------
//               _____ _____ 
//         /\   |  __ \_   _|     drawLine()
//        /  \  | |__) || |       writeCentered(text)
//       / /\ \ |  ___/ | |       navbar(links)
//      / ____ \| |    _| |_      blankLine()
//     /_/    \_\_|   |_____|
//
//-----------------------------------------------------------------------------
function columns(text1, text2, tab){
  var availableWidth = pageWidth - 8;
  var width1 = Math.floor(availableWidth/2);
  var width2 = availableWidth - width1;
  var finished = '';
  while(text1.length > 0 || text2.length > 0){
    var line = (tab)? '<span class="'+tab+'">' : '';
    if(text1[0] == ' ') text1 = text1.substring(1, text1.length);
    if(text2[0] == ' ') text2 = text2.substring(1, text2.length);
    var x1 = text1;
    var x2 = text2;
    var xWidth1 = (strip(x1).length < width1)? x1.length : width1;
    var xWidth2 = (strip(x2).length < width2)? x2.length : width2;
    while(strip(x1).length < width1) {
      x1 += ' ';
      xWidth1++;
    }
    while(strip(x2).length < width2){
      x2 += ' ';
      xWidth2++;
    }
    line += getGlobalLeftPadding() + "| " + x1.substring(0, xWidth1) + ' | ' + x2.substring(0, xWidth2) + ' |\n';
    if(tab) line += '</span>'
    text1 = text1.substring(xWidth1, text1.length);
    text2 = text2.substring(xWidth2, text2.length);
    finished += line;
  }
  text += finished;
}

function strip(text){
  var div = document.createElement("div");
  div.innerHTML = text;
  return(div.textContent || div.innerText || "");
}



//-----------------------------------------------------------------------------
//  Adds a navigation bar given a brand name and array of links objects:
//    { 
//      text:     (String - The link display text),
//      link:     (String - The link url),
//      selected: (Boolean - True if link is for current page)
//    }
function navbar(brand, links){
  blankLine();
  var linkLength= 2;
  for(var index in links){ linkLength += links[index].text.length; }
  var totalLength = linkLength + brand.length;
  var startBrand = Math.floor(fullwidth / 10);
  var finished = '';
  for(var x = 0; x < startBrand; x++) finished += '&nbsp;';
  finished += brand;
  if(totalLength + 4*startBrand < fullwidth) {
    var startLinks = Math.floor(fullwidth - linkLength - ((links.length)*startBrand));  
    for(var x = 0; x < startLinks - startBrand - brand.length; x++) finished += '&nbsp;';
    for(var index in links){
      var link = links[index];
      if(link.active) finished+= '['+link.text+']';
      else finished += '<a href="'+link.link + '">'+link.text + '</a>';
      for(var x = 0; x < startBrand; x++) finished += '&nbsp;';
    }
  } else {
    var startLinks = fullwidth - 3 - startBrand;
    for(var x = 0; x < startLinks - startBrand - brand.length; x++) finished += '&nbsp;';
    finished += '[<a href="#", onclick="navpopup()">X</a>]';  
  }
  text += finished + '\n';  
  drawLine('_', true);
}


//-----------------------------------------------------------------------------
//  Adds a tabs bar given a tabs object
//  tabs = { 
//      key:            (REQUIRED - Each tabs bar needs a unique string key),
//      links:          (REQUIRED - An Array of link objects),
//      inline:         (Default = True - Set true for inline tabs, false for even spaced),
//      topPadding:     (Default = '|' - For inline only - Padding for first two lines)  
//      bottomPadding:  (Default = '|' or same as top padding - For inline only - Padding for last line)   
//    }
//
//  link = { 
//      text:     (REQUIRED - The display text for the tab),
//      link:     (Default = text - The id for this tab link),
//      active:   (REQUIRED - True if tab is active)
//    }
function drawTabs(tabs){
  if(typeof globalTabs[tabs.key] == 'undefined') globalTabs[tabs.key] = tabs;
  for(var x = 0; x < globalTabs[tabs.key].links.length;x++){
    globalTabs[tabs.key].links[x].link = (globalTabs[tabs.key].links[x].link)? globalTabs[tabs.key].links[x].link : globalTabs[tabs.key].links[x].text
  }
  if(typeof tabs.inline == 'undefined' || tabs.inline == true) tabsInline(globalTabs[tabs.key]);
  else tabsNotInline(globalTabs[tabs.key]);
}

//-----------------------------------------------------------------------------
//  Draws a line of given character across the screen width
//  Set fill = true to draw across full screen
function drawLine(char, fill) {
  var width = (fill)? fullwidth : pageWidth-1;
  if(typeof fill == 'undefined') var finished = getGlobalLeftPadding();
  else finished = '';
  for(var x = 0; x < width; x++) finished += char;
  text += (finished + '\n');
}

//-----------------------------------------------------------------------------
//  Writes a blank line
function blankLine(){ 
  text += '\n';
 }

//-----------------------------------------------------------------------------
//  Writes given text aligned at certain place of screen
//    Write title:        title aligned at 1/6 of page width
//    Write centered:     title aligned at center
//    Write at position:  title aligned at 1/X of page width
function writeTitle(content, padChar, tabname){ writeAtPosition(content, 0, padChar, tabname); }
function writeCentered(content, padChar){ writeAtPosition(content, 2, padChar); }
function writeAtPosition(content, position, padChar, tabname){
  var finished = (typeof tabname !== 'undefined')? '<span class="'+tabname+'">' : '';
  var padding = (padChar)? padChar : '|'
  finished += getGlobalLeftPadding() + padding;
  if(position == 0) var leftPadding = 0; 
  else var leftPadding = Math.floor((pageWidth - 2 - content.length) /position);
  var rightPadding = pageWidth - 3 - leftPadding - content.length ;
  for(x = 0; x < leftPadding; x++) finished += '&nbsp;';
  finished += content;
  for(x = 0; x < rightPadding; x++) finished += '&nbsp;';
  finished+= padding + '\n';
  if(typeof tabname !== 'undefined') finished += '</span>';  
  text += finished;
}



//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//  Helper functions
function tabsInline(tabs){
  var links = tabs.links;
  var paddingAbove = (tabs.topPadding)? tabs.topPadding : '|';
  var paddingBelow = (tabs.bottomPadding) ? tabs.bottomPadding : paddingAbove;
  var line1 = line2 = getGlobalLeftPadding() + paddingAbove;
  var line3 = getGlobalLeftPadding() + paddingBelow;
  line1 += '&nbsp;';
  line2 += '&nbsp;';
  line3 += '&#175;';
  var count = 2;
  for(var index in links){
    var tab = links[index];
    line1 += '&nbsp;_';
    line2 += '|&nbsp;';
    if(tab.active){ line3 += '&nbsp;&nbsp;'; } else { line3 += '&#175;&#175;'; }
    for(var x = 0; x < tab.text.length; x++){
      line1 += '_';
      if(!tab.active)
        line2 += '<a href="#", onclick="showTab(\''+tabs.key+'\',\''+tab.link+'\')">'
      line2 += tab.text[x];
      if(tab.active){ line3 += '&nbsp;'; } else { line3 += '&#175;'; }
      count += 1;
    }
    line1 += '_';
    if(!tab.active)
      line2 += '</a>';
    line2 += '&nbsp;';
    if(tab.active){ line3 += '&nbsp;'; } else { line3 += '&#175;'; }
    count += 3;
  }
  line2 += '|';
  line1 += "&nbsp;";
  line3 += '&#175;';
  var missing = pageWidth - count - 3;
  for(var x = 0; x < missing; x++){
    line3 += '&#175;';
    line1 += "&nbsp;";
    line2 += "&nbsp;";
  }
  line1 += paddingAbove;
  line2 += paddingAbove;
  line3 += paddingBelow;
  text += line1 + '\n' + line2 + '\n' + line3 + '\n';
}

function showTab(key, tabname){
  for(var tabIndex in globalTabs[key].links){
    if(globalTabs[key].links[tabIndex].link == tabname)
      globalTabs[key].links[tabIndex].active = true;
    else 
      globalTabs[key].links[tabIndex].active = false;
  }
  calculate();
}

function tabsNotInline(key, tabs){
  var links = tabs.links;
  var widthPerNav = Math.floor(((pageWidth - 3 - (links.length-1)) / links.length));
  var missed = pageWidth - (links.length*widthPerNav) - links.length-2;
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
        tabsNotInline([links[linkI]]);
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
      if(link.active) finished += '>';
      else finished += '&nbsp;';
    }
    finished += '[<a href=\'' + link.link + '\'>' + link.text + '</a>]';
    for(x = 0; x < rightPadding; x++) {
      if(link.active) finished += '<';
      else finished += '&nbsp;';
    }
    if(missed > 0){
      if(link.active) finished += '<';
      else finished += '&nbsp;';
      missed--;
    }
    if(linkIndex < links.length-1) finished += '|';
  }
  text += finished + '|\n';
}

//-----------------------------------------------------------------------------
//  Helper functions
function getCharacterWidth(){ //Get the width of one monospaced character
	var sizingSpan = document.createElement("span");
	sizingSpan.innerHTML = '--------------------';
	sizingSpan.style.cssText += 'position: absolute; top: -100px; padding: 0px;';
	document.body.insertBefore(sizingSpan, document.body.firstChild);
  var width = sizingSpan.clientWidth/20;
	sizingSpan.parentNode.removeChild(sizingSpan);
	return width;
}
function getGlobalLeftPadding(){ //Calculate number of spaces to begin each line
  var text = '';
  for(var x = 0; x < globalLeftPadding; x++) text += '&nbsp;';
  return text;
}
function getGlobalRightPadding(){ //Calculate number of spaces to begin each line
  var text = '';
  for(var x = 0; x < globalLeftPadding; x++) text += '&nbsp;';
  return text;
}
function calculate(){ //Calculate page size in characters, and render page
  var configuration = (typeof config !== 'undefined')? config : {};
  configuration.width = (typeof config.width !== 'undefined')? config.width : 700;
  document.body.style.cssText += 'white-space:pre-wrap;margin:0px;padding:0px;font-family:\'Courier New\', Courier, monospace;font-size: 16px;';

  text = '';
  document.body.innerHTML = '';
  var charWidth = getCharacterWidth();
  if(window.innerWidth > configuration.width){
    fullwidth =  Math.floor(window.innerWidth/charWidth);
    pageWidth = Math.floor(configuration.width/charWidth);
    globalLeftPadding = Math.floor((fullwidth-pageWidth)/2);
    globalRightPadding = fullwidth - pageWidth - globalLeftPadding;
  }else {
    globalLeftPadding = globalRightPadding = 1;
    pageWidth = fullwidth = Math.floor(window.innerWidth/charWidth) ;
  }
  build();
  document.body.innerHTML = text;
  doTabs();
}

function doTabs(){
  for(var index in globalTabs){
    var tabs = globalTabs[index];
    for(var index2 in tabs.links){
      var link = tabs.links[index2];
      var content = document.getElementsByClassName(tabs.key + "" + link.link);
      if(typeof content == 'undefined') console.log('ddkjdkd')
      for(var itemIndex = 0; itemIndex < content.length; itemIndex++){
        var tabItem = content[itemIndex];
        if(link.active){
          tabItem.style.display = 'inline';
        } else {
          tabItem.style.display = 'none';
        }
      }
    }
  }
}
window.onload = function(){ 
  globalTabs = {};
  calculate() 
};
window.onresize = function(event) { calculate(); };