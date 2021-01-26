// ----------------------------------------------------------------------------
// Tokens are the basic building blocks of the website's content
interface Token {
    length(): number;
    render(): string;
}

// ----------------------------------------------------------------------------
// A token which represents a word with various html properties
class Word implements Token {
    text: string;
    bold: boolean;
    italic: boolean;
    linked: boolean;
    link_href: string;
    link_onclick: string;
    new_line: boolean;

    constructor(text: string, bold: boolean = false, italic: boolean = false,
                linked: boolean = false, link_href: string = "", link_onclick: string = "",
                new_line: boolean = false){
        this.text = text;
        this.bold = bold;
        this.italic = italic;
        this.linked = linked;
        this.link_href = link_href;
        this.link_onclick = link_onclick;
        this.new_line = new_line;
    }

    // ------------------------------------------------------------------------
    // Returns the visible length
    length(): number {
        return this.text.length;
    }

    // ------------------------------------------------------------------------
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
            value = "<a href='" + this.link_href + "' onclick='" + this.link_onclick + "'>" + value + "</a>"
        }
        return value;
    }
}

// ----------------------------------------------------------------------------
// A token which represents a space or repeated characters
class Space implements Token {
    space_length: number;
    space_value: string;

    constructor(space_length: number, space_value: string = " "){
        this.space_length = space_length;
        this.space_value = space_value;
    }

    // ------------------------------------------------------------------------
    // Return length
    length(): number {
        return this.space_length;
    }

    // ------------------------------------------------------------------------
    // Render the html
    render(): string {
        return Array(this.space_length + 1).join(this.space_value);
    }
}

// ----------------------------------------------------------------------------
// Get the total length of an array of tokens
function get_token_array_length(tokens: Array<Token>){
    let total_length: number = 0;
    for(const token of tokens){
        total_length += token.length();
    }
    return total_length;
}

// ----------------------------------------------------------------------------
// Add spaces around html tags
function pad_tags(text: string): string {

    // Bold and italic tags
    text = text.replace(/<\/?(b|i|br)>/g, function(x){ return(" " + x + " ") });

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
            link_onclick = "";
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
                link_onclick = this_word.substring(this_word.indexOf("onclick=") + 9, this_word.length);
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

        // Linebreak
        if(this_word == "<br>"){
            let new_word: Word = new Word("", within_bold, within_italics, within_link, link_href, link_onclick, true);
            words.push(new_word);
            continue;
        }

        // Add word
        let new_word: Word = new Word(this_word, within_bold, within_italics, within_link, link_href, link_onclick);
        words.push(new_word);
    }

    return words;
}
