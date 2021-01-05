
// ----------------------------------------------------------------------------
// Class to represent a word with various html properties
class Word {
    text: string;
    bold: boolean;
    italic: boolean;
    linked: boolean;
    link_href: string;

    constructor(text: string, bold: boolean = false, italic: boolean = false, linked: boolean = false, link_href: string = ""){
        this.text = text;
        this.bold = bold;
        this.italic = italic;
        this.linked = linked;
        this.link_href = link_href;
    }

    // Return the html for this word to be rendered properly
    render(): string {
        let value: string = this.text;
        if(this.bold){
            value = "<b>" + value + "</b>";
        }
        if(this.italic){
            value = "<i>" + value + "</i>";
        }
        if(this.linked){
            value = "<a href='" + this.link_href + "'>" + value + "</a>"
        }
        return value;
    }
}

// ----------------------------------------------------------------------------
// Add spaces around html tags
function pad_tags(text: string): string {

    // Bold and italic tags
    text = text.replace(/<\/?(b|i)>/g, function(x){ return(" " + x + " ") });

    // Links
    text = text.replace(/<a.*?>/g, function(x){ return(" " + x + " ") });
    text = text.replace(/<\/a>/g, " </a> ");
    return text;
}

// ----------------------------------------------------------------------------
// Split a block of text into an array of words
function tokenize(text: string) : Array<Word> {
    text = pad_tags(text);
    let raw_words: Array<string> = text.split(" ");
    let words: Array<Word> = [];

    let within_link: boolean = false;
    let within_link_info: boolean = false;
    let link_href: string;
    let link_onclick: string;
    let within_bold: boolean = false;
    let within_italics: boolean = false;

    for(const rawWord of raw_words) {
        let this_word: string = rawWord;
        if(this_word.length < 1){
            continue;
        }

        // Link beginning
        if(this_word == "<a"){
            within_link_info = true;
            link_href = "";
            continue;
        }

        // Link info
        if(within_link_info){

            // Get href
            if(this_word.indexOf("href=") != -1){
                link_href = this_word.substring(this_word.indexOf("href=") + 6, this_word.length);
                let end_index: number = link_href.indexOf('"');
                if(end_index == -1){
                    end_index = link_href.indexOf("'");
                }
                link_href = link_href.substring(0, end_index);
            }

            // Get onclick
            if(this_word.indexOf("onclick=") != -1){
                link_onclick = this_word.substring(this_word.indexOf("href=") + 9, this_word.length);
                let end_index: number = link_onclick.indexOf('"');
                if(end_index == -1){
                    end_index = link_onclick.indexOf("'");
                }
                link_onclick = link_onclick.substring(0, end_index);
            }

            // Get link info ending
            if(this_word.indexOf(">") != -1){
                within_link_info = false;
                within_link = true;
            }
            continue;
        }

        // Link ending
        if(within_link && this_word == "</a>"){
            within_link = false;
            continue;
        }

        // Bold tags
        if(this_word == "<b>" || this_word == "</b>"){
            within_bold = this_word == "<b>";
            continue
        }

        // Italics tags
        if(this_word == "<i>" || this_word == "</i>"){
            within_italics = this_word == "<i>";
            continue
        }

        // Add word
        let newWord = new Word(this_word, within_bold, within_italics, within_link, link_href);
        words.push(newWord);
    }

    return words;
}


let test_string: string = "hello <a href='d' onclick='asd'>sjsjs djdj</a> <b>ok baby</b> djdj <i> dkd</i> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam scelerisque mattis magna sed pellentesque. Quisque a tristique metus. In iaculis est feugiat massa porta, efficitur auctor mi commodo. Phasellus sit amet libero mi. Proin elementum, elit eget interdum faucibus, magna neque suscipit enim, nec blandit nisi elit id ipsum. Etiam malesuada dictum dolor in rhoncus. Donec blandit est ornare nunc ornare, et tempor tortor scelerisque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur quis orci tempor, lobortis sapien ultrices, tristique eros. Nulla arcu est, ornare et finibus at, ullamcorper a tortor. Etiam luctus, nisl at pellentesque elementum, mi diam ultrices diam, sed imperdiet diam velit sodales leo. Nam mollis eros ut turpis semper finibus. Duis tellus ante, euismod eget euismod et, euismod sit amet sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla facilisi. Suspendisse finibus sollicitudin ipsum quis malesuada. Suspendisse fermentum velit rutrum, rhoncus lorem vel, posuere dolor. Pellentesque mattis convallis aliquet. Aenean ornare, tellus nec interdum consequat, ante sapien tincidunt enim, sit amet vehicula tortor quam in lectus. Proin erat arcu, tincidunt quis blandit a, ullamcorper quis justo. Fusce libero tortor, pharetra a tincidunt quis, egestas at lorem. Pellentesque blandit ut ipsum ac commodo. Integer ac libero non magna condimentum varius.";

// First create a tab with a block of content
let tab_content: Block = new Block(tokenize(test_string));
let tab0: Tab = new Tab("Games", "Game Projects", tab_content);
let tabs: Array<Tab> = [tab0];

// Then create a navbar
let page_names: Array<string> = ["Projects", "About Me"];
let links: Array<string> = ["projects.html", "about.html"];
let nav: Navbar = new Navbar("harrycats", page_names, links);

let page0: Page = new Page("Projects", "projects.html", tabs);
let pages: Array<Page> = [page0];

let site: Website = new Website(700, nav, pages);

function resize(): void {
    let new_html: string = site.render();
    document.body.innerHTML = new_html;
}

window.onresize = resize;
window.onload = resize;

