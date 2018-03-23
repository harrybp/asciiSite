//-----------------------------------------------------------------------------
//  ASCII Webpage
//    - By HarryBP
//
//  Override properties with config
//  DEFAULTS =    width:  700
      var config = { width: 700};
//
//  Define page structure with build() method
      function build(){
        var links = [
          { text: 'About Me', link: '#', active: false },
          { text: 'Web Projects', link: '#', active: true },
        ];
        navbar('HarryBP', links);
        blankLine();
        write('Web Projects', ' ')
        var links = [
          { text: 'Games', active: true, link: 'games' },
          { text: 'Other', active: false, link: 'other' }
        ];
        var tabsInfo = { 
          key: 'wp', 
          links: links,
          topPadding: ' ',
          bottomPadding: '|',
        }
        tabs(tabsInfo);
        write('Games', '|', 'wpgames');
        write('Other', '|', 'wpother');
        write('');
        var text1 = '- Zombie Run \n A side scrolling run-and-shoot type game. My first attempt at building a HTML5 game. \n <a href="#" onclick=openPopup("one")>Click</a> to Play';
        var text2 = '- Bounce \n Keep the ball from escaping! My second game, simpler but more mathematically complex. \n <a href="#" onclick=openPopup("two")>Click</a> to Play';
        columns(text1, text2, 'wpgames');
        write(' ', '|', 'wpgames');
        write('More games coming soon most likely..', '|', 'wpgames');
        write(' ', '|', 'wpgames');
        drawLine('&#175;', false, 2);
        popup('one',35, 5);
        popup('two',35, 2);
      }
//
//-----------------------------------------------------------------------------



//ToDO Make columns work properly with links? and wrap text properly
//Tidy some methods up
//Popup: needs properly sizing, not destroy links, toggle-able, can add content etc
//Dropdown for little nav
// need one more padding on right??
//-----------------------------------------------------------------------------
//               _____ _____ 
//         /\   |  __ \_   _|     navbar(brand, links)
//        /  \  | |__) || |       write(text)
//       / /\ \ |  ___/ | |       columns(text1, text2)
//      / ____ \| |    _| |_      tabs(tabsData)
//     /_/    \_\_|   |_____|
//
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//  Adds a popup of width = size located 1/position of the way down the page
//  Open with openpopup(key)
function popup(key, size, position){
  if(size > fullwidth) size = fullwidth;
  var pos = (position)? position : 2;
  if(typeof globalPopups[key] == 'undefined') globalPopups[key] = { key: key, size: size, position: pos, active: false };
  globalPopups[key].size = size;
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
  globalNav = {brand: brand, links: links};
  var linkLength= 2;
  for(var index in links){ linkLength += links[index].text.length; }
  var startBrand = Math.floor(fullwidth / 10);
  var finished = new Array(startBrand + 1).join(' ') + brand;
  if(linkLength + brand.length + 4*startBrand < fullwidth) {
    finished += new Array(Math.floor(fullwidth-linkLength-brand.length-((links.length+1)*startBrand))).join(' ');
    for(var index in links){
      finished += (links[index].active)? '['+links[index].text+']' : '<a href="'+links[index].link + '">'+links[index].text + '</a>';
      finished += new Array(startBrand + 1).join(' ')
    }
  } else {
    finished += new Array(fullwidth - 2 - (2*startBrand) - brand.length).join(' ');  
    finished += '[<a href="#", onclick="navpopup()">X</a>]';  
  }
  text += finished + '\n';  
  drawLine('_', true);
}

//-----------------------------------------------------------------------------
//  Adds a paragraph to the page
function write(content, padChar, tabname){
  var padding = (padChar)? padChar : '|'
  var lines = wrap(content, pageWidth-5);
  for(var x = 0; x < lines.length; x++){
    var finished = (typeof tabname !== 'undefined')? '<span class="'+tabname+'">' : '';
    finished += getGlobalLeftPadding() + padding + ' ' + lines[x] + ' ' + padding+ '\n';
    if(typeof tabname !== 'undefined') finished += '</span>'; 
    text += finished ;
  }
}

//-----------------------------------------------------------------------------
//  Write two paragraphs in columns to the page
//  Switches to rows when page width < wrapamount
function columns(text1, text2, tabname, wrapamount){
  var wrapAt = (typeof wrapamount != 'undefined')? wrapamount : 50;
  if(fullwidth < wrapAt){
    write(text1,'|',tabname);
    write(' ','|',tabname);
    write(text2,'|',tabname);
    return;
  }
  var availableWidth = pageWidth - 8;
  var width1 = Math.floor(availableWidth/2);
  var width2 = availableWidth - width1;
  var lines1 = wrap(text1, width1);
  var lines2 = wrap(text2, width2);
  var total = '';
  while(lines1.length > 0 || lines2.length > 0){
    if(lines1.length == 0) var line1 = pad(' ', width1, ' ');
    else var line1 = lines1.shift();
    if(lines2.length == 0) var line2 = pad(' ', width2, ' '); 
    else var line2 = lines2.shift();
    var finished = (typeof tabname !== 'undefined')? '<span class="'+tabname+'">' : '';
    finished += getGlobalLeftPadding() + "| " + line1 + ' | ' + line2 + ' |\n';
    if(typeof tabname !== 'undefined') finished += '</span>'; 
    total += finished;
  }
  text += total;
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
function tabs(tabsGiven){
  if(typeof globalTabs[tabsGiven.key] == 'undefined') globalTabs[tabsGiven.key] = tabsGiven;
  for(var x = 0; x < globalTabs[tabsGiven.key].links.length;x++){
    globalTabs[tabsGiven.key].links[x].link = (globalTabs[tabsGiven.key].links[x].link)? globalTabs[tabsGiven.key].links[x].link : globalTabs[tabsGiven.key].links[x].text
  }
  var tabs = globalTabs[tabsGiven.key];
  var links = tabs.links;
  var paddingAbove = (tabs.topPadding)? tabs.topPadding : '|';
  var paddingBelow = (tabs.bottomPadding) ? tabs.bottomPadding : paddingAbove;
  var line1 = line2 = getGlobalLeftPadding() + paddingAbove + ' ';
  var line3 = getGlobalLeftPadding() + paddingBelow + '&#175;';
  var count = 2;
  for(var index = 0; index < links.length; index++){
    var tab = links[index];
    line1 += ' ' + new Array(tab.text.length + 2 + 1).join('_');
    line2 += '| ';
    if(!tab.active) line2 += '<a href="#", onclick="showTab(\''+tabs.key+'\',\''+tab.link+'\')">'
    line2 += tab.text;
    if(!tab.active) line2 += '</a>'
    line2 += " ";
    var line3Char = (tab.active)? ' ' : '&#175;';
    line3 += line3Char + new Array(tab.text.length + 2 + 1).join(line3Char);
    count += 3+ tab.text.length;
  }
  line2 += '|';
  line1 += " ";
  line3 += '&#175;';
  var missing = pageWidth - count - 3;
  for(var x = 0; x < missing; x++){
    line3 += '&#175;';
    line1 += " ";
    line2 += " ";
  }
  text += line1 + paddingAbove + '\n' + line2 + paddingAbove + '\n' + line3 + paddingBelow +'\n';
}

//-----------------------------------------------------------------------------
//  Draws a line of given character across the screen width
//  Set fill = true to draw across full screen
function drawLine(char, fill) {
  var width = (fill)? fullwidth +1: pageWidth-2;
  var finished = (typeof fill == 'undefined' || fill == false)? getGlobalLeftPadding() + ' ' : '';
  text += (finished + new Array(width ).join(char) + '\n');
}

//-----------------------------------------------------------------------------
//  Writes a blank line
function blankLine(){ text += new Array(fullwidth + 1).join(' ') + '\n'; }

//-----------------------------------------------------------------------------
//          ________            Helper functions:
//      _jgN########Ngg_          wrap(text, width): 
//    _N##N@@""  ""9NN##Np_         - wraps text to set width, returns array of lines
//   d###P            N####p      pad(text,length,char):
//   "^^"              T####        - pads text to set width with given char, returns padded text
//                     d###P      strip(text):
//                  _g###@F         - returns text with all url encoded chars and html tags stripped out
//               _gN##@P          getGlobalLeftPadding()
//             gN###F"              - returns a string of spaces used to pad each lines
//            d###F               getCharacterWidth()
//           0###F                  - returns the width in pixels of one character
//           0###F                showTab(key,tabname)
//          0###F                   - sets tabname tab active in the tabs menu with key = key
//           "NN@'                doTabs()
//                                  - shows active tab content and hides inactive tab content
//            ___                 calculate()
//           q###r                  - called to calculate size of and render the page
//            ""                  navpopup()
//                                  - shows the dropdown links for mobile navbar
//                                addPopups()
//                                  - adds all active popups to the screen
//                                openPopup(key)
//                                  - opens the popup with given key
//                                closePopup()
//                                  - closes any open popup
//
      window.onload = function(){ globalTabs = {}; globalPopups = {}; calculate(); };
      window.onresize = function(event) { calculate(); };
//
//-----------------------------------------------------------------------------
function wrap(text, width){
  var text = text.split(' ');
  var lines = [];
  var line = '';
  while(text.length > 0){
    if(strip(line).length + strip(text[0]).length < width){
      line += text.shift() + ' ';
      if(line.indexOf('\n') != -1){
        lines.push(pad(line.substring(0, line.indexOf('\n')), width, ' '));
        line = '';
      }
    } else if(strip(text[0]).length >= width ){
      var longword = text.shift();
      console.log(longword);
      text.unshift(longword.substring(longword.length/2, longword.length));
      text.unshift(longword.substring(0, longword.length/2));
    } else {
      lines.push(pad(line, width, ' '));
      line = '';
    }
  }
  lines.push(pad(line, width, ' '));
  return lines;
} 
function pad(line, length, character){
  if(line.length < 1) line = ' ';
  while(strip(line).length < length){
    line += character;
  }
  return line;
}
function strip(text){
  var div = document.createElement("div");
  div.innerHTML = text;
  var text = div.textContent || div.innerText || "";
  if(text.indexOf('onclick=') != -1){
    var x = text.substring(text.indexOf('onclick='), text.length);
    text = text.substring(0,text.indexOf('onclick=')) + x.substring(x.indexOf('>'), x.length);
  }
  return text.replace(/ /g, ' ');
}
function getGlobalLeftPadding(){ //Calculate number of spaces to begin each line
  var text = '';
  for(var x = 0; x < globalLeftPadding; x++) text += ' ';
  return text;
}
function getCharacterWidth(){ //Get the width of one monospaced character
  var sizingSpan = document.createElement("span");
  sizingSpan.innerHTML = '--------------------';
  sizingSpan.style.cssText += 'position: absolute; top: -100px; padding: 0px;';
  document.body.insertBefore(sizingSpan, document.body.firstChild);
  var width = sizingSpan.clientWidth/20;
  sizingSpan.parentNode.removeChild(sizingSpan);
  return width;
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
function doTabs(){
  for(var index in globalTabs){
    var tabs = globalTabs[index];
    for(var index2 in tabs.links){
      var link = tabs.links[index2];
      var content = document.getElementsByClassName(tabs.key + "" + link.link);
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
  var spans = document.body.querySelectorAll("span");
  for(var i = 0; i < spans.length; i++){
    if(spans[i].style.display == 'none')
      document.body.removeChild(spans[i]);
  }
}
function calculate(){ //Calculate page size in characters, and render page
  var configuration = (typeof config !== 'undefined')? config : {};
  configuration.width = (typeof config.width !== 'undefined')? config.width : 700;
  document.body.style.cssText += 'white-space:pre-wrap;margin:0px;padding:0px;font-family:\'Courier New\', Courier, monospace;font-size: 16px;';
  text = '';
  document.body.innerHTML = '';
  var charWidth = getCharacterWidth();
  if(window.innerWidth > configuration.width && window.innerWidth/charWidth > 50){
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
  addPopups();
}
function navpopup(){
  var lines = text.split('\n');
  var width = 0;
  for(var x = 0; x < globalNav.links.length; x++)
    if(globalNav.links[x].text.length > width) width = globalNav.links[x].text.length;
  var startBrand = Math.floor(fullwidth / 10) ;
  lines[1] = new Array(startBrand + 1).join(' ') + globalNav.brand + new Array(fullwidth-width-startBrand-globalNav.brand.length-2).join(' ') + new Array(width - startBrand + 1).join('_') + '[<a href="#", onclick="calculate()">X</a>]' + new Array(startBrand).join('_')
  for(var x = 0; x < globalNav.links.length; x++){
    lines[x+2] = lines[x+2].substring(0, fullwidth - width - 4) + '| ' + pad((globalNav.links[x].active)? globalNav.links[x].text : '<a href="'+globalNav.links[x].link + '">'+globalNav.links[x].text + '</a>', width, ' ') + " |";
  }
  lines[globalNav.links.length+2] = lines[x+2].substring(0, fullwidth - width - 4) + ' ' + new Array(width+3).join('&#175;') + " ";
  document.body.innerHTML = lines.join('\n');
  doTabs();
}
function addPopups(){  
  for(var x in globalPopups){
    if(globalPopups[x].active){
      var lines = document.body.innerHTML.split('\n');
      var finished = '';
      var popup = globalPopups[x];
      var square = getSquare(popup.size, true);
      var startH = Math.floor((Math.floor(window.innerHeight / getLineHeight()) - square.length)/popup.position);
      var startW = Math.floor((fullwidth - popup.size)/2);
      for(var x = 0; x < startH + square.length || x < lines.length; x++){
        var line = (x < lines.length-1)? strip(lines[x]) + '\n' : pad(' ', fullwidth, ' ') + '\n'; 
        if(x >= startH && x < startH + square.length){
          line = line.substring(0, startW) + square[x-startH] + line.substring(startW + popup.size, line.length) ;
        }
        finished += line;
      }
      document.body.innerHTML = finished;
    }
  }
}
function openPopup(key){
  globalPopups[key].active = true;
  calculate();
}
function closePopup(){
  for(var key in globalPopups){
    globalPopups[key].active = false;
  }
  calculate();
}
