//-----------------------------------------------------------------------------
//    ==^==     TRASH
//    |[[[|       - Unused or rewriten methods
//    |[[[|       - Kept in case they may be useful for reference
//    '---' 
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
//  Writes given text aligned at certain place of screen
//    Write title:        title aligned at 1/6 of page width
//    Write centered:     title aligned at center
//    Write at position:  title aligned at 1/X of page width
function writeTitle(content, padChar, tabname){ writeAtPosition(content, 0, padChar, tabname); }
function writeCentered(content, padChar, tabname){ writeAtPosition(content, 2, padChar, tabname); }
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
function drawTabs(tabs){
  if(typeof globalTabs[tabs.key] == 'undefined') globalTabs[tabs.key] = tabs;
  for(var x = 0; x < globalTabs[tabs.key].links.length;x++){
    globalTabs[tabs.key].links[x].link = (globalTabs[tabs.key].links[x].link)? globalTabs[tabs.key].links[x].link : globalTabs[tabs.key].links[x].text
  }
  if(typeof tabs.inline == 'undefined' || tabs.inline == true) tabsInline(globalTabs[tabs.key]);
  else tabsNotInline(globalTabs[tabs.key]);
}
function getGlobalRightPadding(){ //Calculate number of spaces to end each line
  var text = '';
  for(var x = 0; x < globalLeftPadding; x++) text += '&nbsp;';
  return text;
}