
function init(){
  activeTabs = []; 
  globalTabs = {};
  globalPopups = {}; 
  globalPopovers = {}; 
  website.width = (typeof website.width !== 'undefined')? website.width : 700;
  document.body.style.cssText += 'white-space:pre-wrap;margin:0px;padding:0px;font-family:\'Courier New\', Courier, monospace;font-size: 16px;';
  website.charWidth = getCharacterWidth();
  website.lineHeight = getLineHeight();
  calculate();
}

//-----------------------------------------------------------------------------
//  Set fullwidth = screen width in characters, pageWidth = content width in characters
function getWidth(){
  if(window.innerWidth > website.width && window.innerWidth/website.charWidth > 50){
    fullwidth =  Math.floor(window.innerWidth/website.charWidth);
    pageWidth = Math.floor(website.width/website.charWidth);
    globalLeftPadding = Math.floor((fullwidth-pageWidth)/2);
    globalRightPadding = fullwidth - pageWidth - globalLeftPadding;
  }else {
    globalLeftPadding = globalRightPadding = 1;
    pageWidth = fullwidth = Math.floor(window.innerWidth/website.charWidth) ;
    //pageWidth++;
  }
}
//-----------------------------------------------------------------------------
// Called to draw the page whenever the size changes
function calculate(){ 
  linesArray =  [];
  activeTabs = getActiveTabs();
  getWidth();
  build();
  addPopups();
  writeLines()
}

function build(){
  //Navbar 
  var links = [];
  var thisPage;
  for(var i = 0; i < website.pages.length; i++){
    var page = website.pages[i];
    var title = page.title;
    var link = page.link;
    if(title == pageTitle) thisPage = page;
    links.push({text: title, link: link, active: (title == pageTitle)});
  }
  var brand = website.name;
  navbar(brand, links);

  //Page title
  blankLine();
  write(pageTitle, ' ')

  //Tabs
  if(thisPage.tabs.length > 1){
    var links = [];
    for(var x = 0; x < thisPage.tabs.length; x++){
      links.push({text: thisPage.tabs[x].tabName, link: thisPage.tabs[x].tabName.toLowerCase(), active: (x == 0)});
    }
    var tabsInfo = {
      key: 'tabs',
      links: links,
      topPadding: ' ',
      bottomPadding: '|'
    }
    tabs(tabsInfo);
  } else {
    drawLine('_');
    write(' ');
  }
  
  //Content
  for(var x = 0; x < thisPage.tabs.length; x++){
    var tab = thisPage.tabs[x];
    write(tab.title, '|', 'tabs' + tab.tabName.toLowerCase());
    write('', '|', 'tabs' + tab.tabName.toLowerCase());
    var content = (tab.content)?tab.content: [];
    for(var y = 0; y < content.length; y++){
      if(typeof content[y] == 'string')
        write(content[y], '|', 'tabs' + tab.tabName.toLowerCase());
      else {
        console.log(content[y].type)
        switch(content[y].type){
          case 'columns':
            console.log('s')
            columns(content[y].text1, content[y].text2, 'tabs' + tab.tabName.toLowerCase());
            break;
        }
      }
      write('', '|', 'tabs' + tab.tabName.toLowerCase());
    }
  }
  //Finish
  drawLine('&#175;');

  //Popups
  for(var x = 0; x < page.popups.length; x++){
    var popupInfo = page.popups[x];
    popup(x+1, popupInfo.title, popupInfo.width, popupInfo.position);
  }
}


/*var links = [
      { text: 'Info', active: true, link: 'info' },
      { text: 'Contact', active: false, link: 'cont' },
    ];
    var tabsInfo = { 
      key: 'main', 
      links: links,
      topPadding: ' ',
      bottomPadding: '|',
    }
    tabs(tabsInfo);*/