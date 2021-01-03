//-----------------------------------------------------------------------------
//  ASCII Webpage
//    - By Harry
//-----------------------------------------------------------------------------



// ToDO
// Tidy some methods up
// Popup:can add content better etc
// need one more padding on right??
// imstead of passing function maybe pass id of element to show?
//-----------------------------------------------------------------------------
//               _____ _____
//         /\   |  __ \_   _|     popover(key, content, width)
//        /  \  | |__) || |       popup(key, content, size, position)
//       / /\ \ |  ___/ | |       navbar(brand, links)
//      / ____ \| |    _| |_      write(content, padChar, tabname)
//     /_/    \_\_|   |_____|     columns(text1, text2, tabname, wrapamount)
//                                tabs(tabInfo)
//                                drawLine(char, fill)
//                                blankLine()
//
//
//-----------------------------------------------------------------------------
//  Add popover of specified width and content
//  Open it with openPopup(key)
function popover(key, content, width){ globalPopovers[key] = { content: content, width: width }; }

//-----------------------------------------------------------------------------
//  Adds a popup of width = size located 1/position of the way down the page
//  Open with openpopup(key)
function popup(key, content, size, position, funcOpen, funcClose){
    if(size > fullwidth) size = fullwidth;
    var pos = (position)? position : 2;
    if(typeof globalPopups[key] == 'undefined') globalPopups[key] = { key: key, size: size, position: pos, active: false, content: content };
    globalPopups[key].size = size;
    if(funcOpen) globalPopups[key].function = funcOpen;
    if(funcOpen) globalPopups[key].functionClose = funcClose;

}

//-----------------------------------------------------------------------------
//  Adds a navigation bar given a brand name and array of links objects:
//    {
//      text:     (String - The link display text),
//      link:     (String - The link url),
//      selected: (Boolean - True if link is for current page)
//    }
function navbar(brand, links, centered){
    if(darkMode){
        brand = brand.replace(/\^/gi, 'o');
    }
    blankLine();
    globalNav = {brand: brand, links: links};
    var linkLength= 4;
    var maxLength = 0;
    var mobile = [];

    // Get length of the links
    for(var index in links){
        linkLength += links[index].text.length;
        if(links[index].text.length > maxLength) maxLength = links[index].text.length;
    }

    // Mobile links
    for(var index in links){
        if(!links[index].active)
            mobile.push(pad('<a href="#" onclick="changePage(\'' + links[index].text + '\')">'+links[index].text + '</a>', maxLength, ' '));
        else
            mobile.push(pad(links[index].text, maxLength, ' '));
    }

    var startBrand = centered? getGlobalLeftPadding().length + 2 : Math.floor(fullwidth / 10);
    var finished = new Array(startBrand + 1).join(' ') + brand;

    // Spacing between brand and first link
    var initialSpacing = centered? Math.floor((fullwidth - (startBrand * 2) - linkLength)/1.75) :
                                  Math.floor(fullwidth-linkLength-strip(brand).length-((links.length+1)*startBrand));

    // Spacing between links
    var spacing = centered? Math.floor((fullwidth - linkLength - strip(brand).length - (2 * startBrand) - initialSpacing)/(links.length - 1)) :
                            startBrand + 1;

    // Cutoff
    var cutoff = centered? linkLength + strip(brand).length + 2*startBrand + initialSpacing + links.length : linkLength + strip(brand).length + 4*startBrand;

    // Desktop
    if(cutoff < fullwidth) {

        console.log("spacing: " + initialSpacing + ", " + spacing);
        finished += new Array(initialSpacing).join(' ');
        for(var index in links){
            finished += (links[index].active)? '['+links[index].text+']' : ' <a href="#" onclick="changePage(\'' + links[index].text + '\')">'+links[index].text + '</a> ';
            if(index != links.length - 1)
                finished += new Array(spacing).join(' ');//new Array(startBrand + 1).join(' ')
        }
    } else {
        finished += new Array(fullwidth - 2 - (2*startBrand) - strip(brand).length).join(' ');
        finished += '[<a href="#" onclick=openPopover("nav")>X</a>]';
    }
    popover('nav', mobile, maxLength);
    linesArray.push({content: finished});
    drawLine('_', true);
}

//-----------------------------------------------------------------------------
//  Adds a paragraph to the page
function write(content, padChar, tabname){
    var padding = (padChar)? padChar : '|'
        var lines = wrap(content, pageWidth-5);
    for(var x = 0; x < lines.length; x++){
        var finished = getGlobalLeftPadding() + padding + ' ' + lines[x] + ' ' + padding;
        if(tabname)
            linesArray.push({content: finished, tab: tabname});
        else
            linesArray.push({content: finished});
    }
}

//-----------------------------------------------------------------------------
//  Write two paragraphs in columns to the page
//  Switches to rows when page width < wrapamount
function columns(text1, text2, tabname, wrapamount, seperate){

    var wrapAt = (typeof wrapamount != 'undefined' && wrapamount != null)? wrapamount : 50;
    console.log(seperate)
        if(fullwidth < wrapAt){
            write(text1,'|',tabname);
            if(seperate)
                write(' ','|',tabname);
            write(text2,'|',tabname);
            return;
        }
    var availableWidth = pageWidth - 8;
    var width1 = Math.floor(availableWidth/2);
    var width2 = availableWidth - width1;
    var lines1 = wrap(text1, width1, true);
    var lines2 = wrap(text2, width2);
    var total = '';
    while(lines1.length > 0 || lines2.length > 0){
        if(lines1.length == 0) var line1 = pad(' ', width1, ' ');
        else var line1 = lines1.shift();
        if(lines2.length == 0) var line2 = pad(' ', width2, ' ');
        else var line2 = lines2.shift();
        var finished = getGlobalLeftPadding() + "| " + line1 + ' | ' + line2 + ' |';
        linesArray.push({content: finished, tab: tabname});
    }
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
        if(tab.active) activeTabs.push(tabsGiven.key +''+ tab.link);
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
    linesArray.push({content: line1 + paddingAbove});
    linesArray.push({content: line2 + paddingAbove});
    linesArray.push({content: line3 + paddingBelow});
}

//-----------------------------------------------------------------------------
//  Draws a line of given character across the screen width
//  Set fill = true to draw across full screen
function drawLine(char, fill) {
    var width = (fill)? fullwidth +1: pageWidth-2;
    var finished = (typeof fill == 'undefined' || fill == false)? getGlobalLeftPadding() + ' ' : '';
    finished += new Array(width ).join(char);
    linesArray.push({content: finished});
}

//-----------------------------------------------------------------------------
//  Writes a blank line
function blankLine(){ linesArray.push({content: new Array(fullwidth + 1).join(' ') }); }


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//  UTILITIES:
//    - PAGE SETUP METHODS
//    - TEXT HELPER METHODS
//    - POPUP METHODS
//    - TAB METHODS
window.onload = init;
window.onresize = calculate;
document.addEventListener("DOMContentLoaded", function(event) {
        init();
        });

// ----------------------------------------------------------------------------
// Dark Mode
var darkMode = false;
function toggleDarkMode(){
    darkMode = !darkMode;
    window.location.search = window.location.search.replace('darkmode='+ !darkMode, 'darkmode=' + darkMode);
    calculate();
}

function applyDarkMode(){
    var bgColour = '#e3e3e3';
    var textColour = 'black';
    var linkColour = 'blue';
    if(darkMode){
        bgColour = '#171717';
        textColour = '#a6a6a6';
        linkColour = '#9c0000';
    }
    document.body.style.backgroundColor = bgColour;
    document.body.style.color = textColour;
    var links = document.getElementsByTagName("a");
    for(var i=0; i<links.length; i++){
        if(links[i].href){
            links[i].style.color = linkColour;
        }
    }
}

//
//-----------------------------------------------------------------------------
//  PAGE SETUP METHODS
//    -init()
//    -getWidth()
//    -calculate()
//    -getLineHeight()
//    -getCharacterWidth()
//    -getGlobalLeftPadding()
//
//-----------------------------------------------------------------------------
//  On load, get configurations and initialise variables
function init(){
    activeTabs = [];
    globalTabs = {};
    globalPopups = {};
    globalPopovers = {};
    website.width = (typeof website.width !== 'undefined')? website.width : 700;
    console.log(document.body.style.fontFamily)
        document.body.style.cssText += 'white-space:pre-wrap;margin:0px;padding:0px;font-size: 16px;font-family:\'Courier New\', Courier, monospace;overflow-x:hidden;';
    website.charWidth = getCharacterWidth();
    website.lineHeight = getLineHeight();
    calculate();
}
//-----------------------------------------------------------------------------
//  Set fullwidth = screen width in characters, pageWidth = content width in characters
function getWidth(){
    console.log(document.body.clientWidth+":"+ document.body.scrollWidth)
        var widthToUse = Math.min(document.body.clientWidth, document.body.scrollWidth);
    console.log(widthToUse)
        if(widthToUse > website.width && widthToUse/website.charWidth > 50){
            fullwidth =  Math.floor(widthToUse/website.charWidth) ;
            pageWidth = Math.floor(website.width/website.charWidth);
            globalLeftPadding = Math.floor((fullwidth-pageWidth)/2);
            globalRightPadding = fullwidth - pageWidth - globalLeftPadding;
            console.log("X"+fullwidth);
        }else {
            globalLeftPadding = globalRightPadding =1;
            pageWidth =  Math.floor(widthToUse/website.charWidth) -1;
            fullwidth =Math.floor(widthToUse/website.charWidth);
        }
}
//-----------------------------------------------------------------------------
// Called to draw the page whenever the size changes
function calculate(){
    activeTabs = getActiveTabs();
    getWidth();
    build();
    addPopups();
    writeLines();
    applyDarkMode();
}
//-----------------------------------------------------------------------------
//  Changes page to pageName
function changePage(pageName){
    pageTitle = pageName;
    window.location.search = '?page=' + pageTitle + '&darkmode=' + darkMode;
    build();
    writeLines();
}
//-----------------------------------------------------------------------------
//  Parse website json and build page
function build(){

    // Extract page title and darkmode
    var pageTitle;
    if(window.location.search.indexOf('page=') > 0){
        var param = window.location.search.substring(window.location.search.indexOf('page=')+5, window.location.search.length);
        if(param.indexOf('&') != -1) param= param.substring(0, param.indexOf('&'));
        if(param.length > 0) pageTitle =decodeURIComponent(param);
    }
    else {
        if(window.location.search.indexOf('?') > -1){
            window.location.search += '&page=' + website.pages[0].title;
        } else{
            window.location.search = '?page=' + website.pages[0].title;
        }
    }
    pageTitle = (typeof pageTitle != 'undefined')? pageTitle : website.pages[0].title;
    document.title = pageTitle;

    var darkmode;
    if(window.location.search.indexOf('darkmode=') > 0){
        console.log(window.location.search);
        var param = window.location.search.substring(window.location.search.indexOf('darkmode=')+9, window.location.search.length);
        if(param.indexOf('&') != -1) param= param.substring(0, param.indexOf('&'));
        if(param.length > 0) darkmode =decodeURIComponent(param);
    }
    else {
        if(window.location.search.indexOf('?') > -1){
            window.location.search += '&darkmode=false';
        } else{
            window.location.search += '?darkmode=false';
        }
    }
    pageTitle = (typeof pageTitle != 'undefined')? pageTitle : website.pages[0].title;
    darkMode = (typeof darkmode != 'undefined')? (darkmode.substring(0,4) == 'true') : false;
    console.log('DM ' + darkmode)
    applyDarkMode();

    //Navbar
    linesArray = [];
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
    var centered = true;
    navbar(brand, links, centered);

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
key: 'tabs' + pageTitle,
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
        write(' > '+tab.title, '|', 'tabs' + pageTitle + tab.tabName.toLowerCase());
        write('', '|', 'tabs' + pageTitle + tab.tabName.toLowerCase());
        var content = (tab.content)?tab.content: [];
        for(var y = 0; y < content.length; y++){
            if(typeof content[y] == 'string')
                write(content[y], '|', 'tabs'+ pageTitle + tab.tabName.toLowerCase());
            else {
                switch(content[y].type){
                    case 'columns':
                        columns(content[y].text1, content[y].text2, 'tabs' + pageTitle + tab.tabName.toLowerCase(), null, (content[y].seperate!=false));
                        break;
                }
            }
            if(typeof content[y].seperate == 'undefined' || content[y].seperate)
                write('', '|', 'tabs' + pageTitle + tab.tabName.toLowerCase());
        }
    }
    //Finish
    drawLine('&#175;');

    //Popups
    if(thisPage.popups){
        for(var x = 0; x < thisPage.popups.length; x++){
            var popupInfo = thisPage.popups[x];
            popup(x+1, popupInfo.title, popupInfo.width, popupInfo.position);
        }
    }

    //Pop-overs
    if(thisPage.popovers){
        for(var x = 0; x < thisPage.popovers.length; x++){
            var popoverInfo = thisPage.popovers[x];
            popover(popoverInfo.key, popoverInfo.content, popoverInfo.width);
        }
    }
}
//-----------------------------------------------------------------------------
//  Returns the height of one line in pixels
function getLineHeight(){
    var temp = document.createElement(document.body.nodeName);
    temp.setAttribute("style","margin:0px;padding:0px;font-family:"+document.body.style.fontFamily+";font-size:"+document.body.style.fontSize);
    temp.innerHTML = "test";
    temp = document.body.parentNode.appendChild(temp);
    var ret = temp.clientHeight;
    temp.parentNode.removeChild(temp);
    return ret;
}
//-----------------------------------------------------------------------------
//  Returns the width of one character in pixels
function getCharacterWidth(){ //Get the width of one monospaced character
    var sizingSpan = document.createElement("span");
    sizingSpan.innerHTML = '--------------------';
    sizingSpan.style.cssText += 'position: absolute; top: -100px; padding: 0px;';
    document.body.insertBefore(sizingSpan, document.body.firstChild);
    var width = sizingSpan.clientWidth/20;
    sizingSpan.parentNode.removeChild(sizingSpan);
    console.log(width);
    return width;
}
//-----------------------------------------------------------------------------
//  Returns the padding applied to left of all lines
function getGlobalLeftPadding(){ return new Array(globalLeftPadding+1).join(' '); }
//-----------------------------------------------------------------------------
//  Writes all lines to the page
function writeLines(){
    var total = '';
    for(var x = 0; x < linesArray.length; x++){
        if(typeof linesArray[x].tab == 'undefined' || activeTabs.indexOf(linesArray[x].tab) >= 0)
            total += linesArray[x].content + '\n';
    }
    document.body.innerHTML = total;
}

//-----------------------------------------------------------------------------
//  TEXT HELPER METHODS
//    -wrap()
//    -pad()
//    -strip()
//    -splitText()
//
//-----------------------------------------------------------------------------
//  Wraps a text string into lines of given width
function wrap(content, width, alignRight){
    var wordsSplit = splitText(content);
    var lines = [];
    var line = '';
    while(wordsSplit.length > 0){
        if(strip(line).length + strip(wordsSplit[0].text).length < width){
            var word = wordsSplit.shift();
            if(word.link){
                line += '<a href="' + word.href + '"' +((word.onclick)? ' onclick=' + word.onclick : '') + ((word.onmouseenter)? ' onmouseenter=' + word.onmouseenter : '') + ((word.onmouseleave)? ' onmouseleave=' + word.onmouseleave : '')+ ">" + word.text + "</a> ";
            } else if(word.bold){
                line += '<b>' + word.text + '</b> '
            } else {
                line += word.text + ' ';
            }
            if(line.indexOf('\n') != -1){
                lines.push(pad(line.substring(0, line.indexOf('\n')), width, ' ', alignRight));
                line = '';
            }
        } else if(strip(wordsSplit[0].text).length >= width ){
            var longword = wordsSplit.shift();
            wordsSplit.unshift({text:longword.text.substring(longword.text.length/2, longword.text.length), link: longword.link, bold: longword.bold, href: longword.href, onclick: longword.onclick});
            wordsSplit.unshift({text:longword.text.substring(0, longword.text.length/2), link: longword.link, bold: longword.bold, href: longword.href, onclick: longword.onclick});
        } else {
            lines.push(pad(line, width, ' ', alignRight));
            line = '';
        }
    }
    lines.push(pad(line, width, ' ', alignRight));
    return lines;
}
//-----------------------------------------------------------------------------
//  Pads a string to a given length with a given character
function pad(line, length, character, alignRight){
    if(line.length < 1) line = ' ';
    if(alignRight){
        while(strip(line).length < length){
            line = character + line;
        }
    } else {
        while(strip(line).length < length){
            line += character;
        }
    }
    return line;
}
//-----------------------------------------------------------------------------
//  Removes all html tags and url encodings from a string
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
//-----------------------------------------------------------------------------
//  Splits a string into an array of word objects with link info
function splitText(content){
    var wordsRaw = content.split(' ');
    var words = [];
    var link = false;
    var bold = false;
    var totalWord = "";
    for(var x = 0; x< wordsRaw.length; x++){
        var word = wordsRaw[x];

        // Link beginning
        if(word.indexOf('<a') != -1){
            if(word.length > 2){
                words.push({text: strip(word.substring(0,word.indexOf('<a'))), link: link});
                word = word.substring(word.indexOf('<a'), word.length);
            }
            link = true;
            onclick = "";
            totalWord = word;
            continue;
        }
        // Bold words
        if(word.indexOf("<b>") != -1){
            bold = true;
            totalWord = word;
            continue;
        }

        // Ordinary case
        if(!link & !bold){
            words.push({text: strip(word), link: link, bold: bold});
            continue;
        }
        totalWord += ' ' + word;

        // Bold word ending
        if(word.indexOf("</b>") != -1){
            bold = false;
            var bold_words = strip(totalWord).split(' ');
            for(var y = 0; y < bold_words.length; y++){
                words.push({text: bold_words[y], link: link, bold: true});
            }
        }

        // Link info
        if(word.indexOf('href=') != -1){
            var href = word.substring(6,word.length);
            href = href.substring(0, href.indexOf('"'));
        }
        if(word.indexOf('onclick=') != -1){
            var onclick = word.substring(8,word.length);
            var index = (onclick.indexOf('>') > -1)? onclick.indexOf('>') : onclick.indexOf(' ');
            onclick = onclick.substring(0, index);
        }
        if(word.indexOf('onmouseenter=') != -1){
            var onmouseenter = word.substring(13,word.length);
            var index = (onmouseenter.indexOf('>') > -1)? onmouseenter.indexOf('>') : onmouseenter.indexOf(' ');
            onmouseenter = onmouseenter.substring(0, index);
        }
        if(word.indexOf('onmouseleave=') != -1){
            var onmouseleave = word.substring(13,word.length);
            var index = (onmouseleave.indexOf('>') > -1)? onmouseleave.indexOf('>') : onmouseleave.indexOf(' ');
            onmouseleave = onmouseleave.substring(0, index);
        }

        // Links ending
        if(word.indexOf("</a>") != -1){
            link = false;
            var links = strip(totalWord).split(' ');
            for(var y = 0; y < links.length; y++)
                words.push({text: links[y], link: true, bold: false, href: href, onclick: onclick, onmouseenter: onmouseenter, onmouseleave: onmouseleave});
        }
    }
    return words;
}

//-----------------------------------------------------------------------------
//  POPUP METHODS
//    -openPopup()
//    -closePopup()
//    -addPopups()
//    -getSquare()
//
//-----------------------------------------------------------------------------
//  Sets a given popup to active
function openPopup(key){
    globalPopups[key].active = true;
    calculate();
}
//-----------------------------------------------------------------------------
//  Sets all popups to inactive
function closePopup(){
    for(var key in globalPopups){
        globalPopups[key].active = false;
        // if(globalPopups[key].functionClose) eval(globalPopups[key].functionClose);
    }
    calculate();
}
//-----------------------------------------------------------------------------
//  Adds all active popups to the page
function addPopups(){
    for(var x in globalPopups){
        if(globalPopups[x].active){
            var activeTabs = getActiveTabs();
            var finished = '';
            var popup = globalPopups[x];
            var square = getSquare(popup.size, popup.content, true);
            var startH = Math.floor((Math.floor(window.innerHeight / getLineHeight()) - square.length)/popup.position);
            var startW = Math.floor((fullwidth - popup.size)/2);
            for(var x =  startH; square.length > 0 || x < linesArray.length-1; x++){
                var tabName = (typeof linesArray[x] != 'undefined')? linesArray[x].tab : undefined;
                var line = (x < linesArray.length)? strip(linesArray[x].content) : pad(' ', fullwidth, ' ');
                if(typeof tabName == 'undefined' || activeTabs.indexOf(tabName) >= 0 && square.length > 0){
                    line = line.substring(0, startW) + square.shift() + line.substring(startW + popup.size, line.length) ;
                    if(linesArray[x]) linesArray[x].content = line;
                    else linesArray.push({content: line})
                }
            }
        }
    }
}
//-----------------------------------------------------------------------------
//  Returns the lines of a square with a given width and contents
//  Used for the popup body
function getSquare(width, string, cross){
    var height = Math.floor(width * getCharacterWidth() /getLineHeight());
    var finished = [];
    var content = wrap(string, width - 4)
        finished.push(' ' + new Array(width -1).join('_') + ' ');
    for(var x = 1; x < height-1; x++){
        var thisLine = (content[x-2])? content[x-2] : pad(' ', width - 4, ' ');
        if(cross && x == 1) finished.push("|" +  new Array(width - 4).join(' ') + '[<a href="#", onclick="closePopup()">X</a>]|');
        else finished.push("| " +  thisLine+ ' |');
    }
    finished.push(' ' + new Array(width -1).join('&#175;') + ' ');
    return finished;
}

//-----------------------------------------------------------------------------
//  TAB METHODS
//    -showTab()
//    -getActiveTabs()
//-----------------------------------------------------------------------------
//  Sets a given tab to active
function showTab(key, tabname){
    for(var tabIndex in globalTabs[key].links){
        if(globalTabs[key].links[tabIndex].link == tabname){
            globalTabs[key].links[tabIndex].active = true;
        } else {
            globalTabs[key].links[tabIndex].active = false;
        }
    }
    calculate();
}
//-----------------------------------------------------------------------------
//  Returns array of active tabs
function getActiveTabs(){
    var activeTabs = [];
    for(var index in globalTabs)
        for(var index2 in globalTabs[index].links)
            if(globalTabs[index].links[index2].active)
                activeTabs.push(globalTabs[index].key + "" + globalTabs[index].links[index2].link);
    return activeTabs;
}
//-----------------------------------------------------------------------------
//  POPOVER METHODS
//    -openPopover()
//-----------------------------------------------------------------------------
//  Shows the popover with the selected key
function openPopover(key){
    var width = (globalPopovers[key].width > fullwidth - 4)? fullwidth - 4 : globalPopovers[key].width;
    var data = (typeof globalPopovers[key].content == 'string')? wrap(globalPopovers[key].content, width) : globalPopovers[key].content;
    var writing = false;
    var click = false;
    var startData, endData, difference;
    for(var x = 0; x < linesArray.length; x++){
        var start = linesArray[x].content.indexOf('<a href="#" onmouseenter=openPopover("'+ key + '")');
        if(start == -1 && linesArray[x].content.indexOf('<a href="#" onclick=openPopover("'+ key + '")') != -1){
            start = linesArray[x].content.indexOf('<a href="#" onclick=openPopover("'+ key + '")');
            click = true;
        }
        if(start >= 0){
            var end = linesArray[x].content.substring(start,linesArray[x].content.length);
            end = end.indexOf('</a>')+4+start;
            var linkText = strip(linesArray[x].content.substring(start,end));
            var padLeft = Math.floor((width - linkText.length) / 2);
            var padRight = width - linkText.length - padLeft;
            if(start - padLeft < 0){
                var dif = -(start - padLeft) +2;
                padRight += dif;
                padLeft -= dif;
            } else if(end + padRight >= linesArray[x].content.length){
                var dif2 = linesArray[x].content.length - (end+padRight)-2;
                padRight += dif2;
                padLeft -= dif2;
            }
            startData = start - padLeft;
            endData = end + padRight;
            difference = linesArray[x].content.length - strip(linesArray[x].content).length;
            linesArray[x].content = linesArray[x].content.substring(0, startData-2) + ' '+ new Array(padLeft+1).join('_') + ((click)? '[<a href="#" onclick=calculate()>' : '[<a href="#" onmouseleave=calculate()>' )+ linkText + "</a>]" + new Array(padRight+1).join('_') +' '+ linesArray[x].content.substring(endData+2, linesArray[x].content.length);
            writing = true;
            continue;
        }
        if(writing && (typeof linesArray[x].tab == 'undefined' || activeTabs.indexOf(linesArray[x].tab) >= 0)){
            if(data.length > 0){
                linesArray[x].content = strip(linesArray[x].content).substring(0, startData-2) + "| " + data.shift()+ " |" +linesArray[x].content.substring(endData+2-difference, linesArray[x].content.length);
            } else {
                linesArray[x].content = strip(linesArray[x].content).substring(0, startData-2) + ' ' + new Array(width+3).join("&#175;") +' ' + linesArray[x].content.substring(endData+2-difference, linesArray[x].content.length);
                writing = false;
            }
        }
    }
    writeLines();
}








