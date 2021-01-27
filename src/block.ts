// ----------------------------------------------------------------------------
// A data structure returned by the wrapping operation
interface Block_Data {
    lines: Array<Array<Word>>;
    lengths: Array<number>;
}

// ----------------------------------------------------------------------------
// A block represents a block of text content, it will be divided into lines
class Block {
    contents: Array<Word>;

    // Create a new block of text
    constructor(text: Array<Word>){
        this.contents = text;
    }

    // Wrap the words to  a set length
    wrap(width: number): Block_Data {
        // Providing a width of -1 will do no wrapping
        if(width < 0){
            width = 999999;
        }

        let lines: Array<Array<Word>> = [];
        let line_lengths: Array<number> = [];
        let current_line: Array<Word> = [];
        let current_line_length = 0;

        // Do a first pass to split up any too-long words
        let too_long: boolean = true;
        while(too_long){
            too_long = false;
            let new_contents: Array<Word> = [];
            for(const word of this.contents){
                if(word.length() <= width){
                    new_contents.push(word);
                } else {
                    let half_way: number = Math.floor(word.length() / 2);
                    let first_half: Word = new Word(word.text.substr(0, half_way), word.bold, word.italic,
                                                    word.linked, word.link_href, word.link_onclick);
                    let second_half: Word = new Word(word.text.substr(half_way, word.length()), word.bold,
                                                     word.italic, word.linked, word.link_href, word.link_onclick);
                    first_half.no_space_end = true;
                    second_half.no_space_end = word.no_space_end;
                    new_contents.push(first_half);
                    new_contents.push(second_half);
                    too_long = true;
                }
            }
            if(too_long){
                this.contents = new_contents;
            }
        }

        for(const word of this.contents){

            // If this word fits on the current line
            if((width < 0) || (!word.new_line && (word.text.length + current_line_length < width))){
                current_line.push(word);
                current_line_length += word.text.length + 1;

            // Else start a new line
            } else {
                lines.push(current_line);

                // Empty lines are a unique case
                if(current_line_length > 0){
                    line_lengths.push(current_line_length - 1);
                } else {
                    line_lengths.push(current_line_length);
                }

                current_line = [];
                if(word.new_line){
                    current_line_length = 0;
                } else {
                    current_line.push(word);
                    current_line_length = word.text.length + 1;
                }
            }
        }

        // At the end
        if(current_line.length > 0){
            lines.push(current_line);
            line_lengths.push(current_line_length - 1);
        }
        return {lines: lines, lengths: line_lengths};
    }

    // ------------------------------------------------------------------------
    // Return the block as lines of html
    render(width: number): Array<Array<Token>> {
        let data: Block_Data = this.wrap(width);
        let rendered_lines: Array<Array<Token>> = [];
        let current_line: Array<Token>;

        // For each line in the wrapped text
        for(var i = 0; i < data.lines.length; i++){
            let line: Array<Word> = data.lines[i];
            current_line = [];

            // For each word in the line
            for(var j = 0; j < line.length; j++){
                let word: Word = line[j];

                // Clear any previous settings of link wrapping
                //if(word instanceof Word){
                //    let word_cast: Word = <Word>word;
                    word.no_link_end = false;
                    word.no_link_begin = false;
                    //word = word_cast;
                //}

                current_line.push(word);
                if((word != line[line.length - 1]) && (!word.no_space_end)){
                    current_line.push(new Space(1));
                }
            }

            // Make the line the correct length
            if(width > 0){
                current_line.push(new Space(width - data.lengths[i] - 1));
            }
            rendered_lines.push(current_line);
        }

        // Do another pass to combine multi-word links
        let previous_link: Word;
        let previous_link_valid: boolean = false;
        let previous_link_index: number = 0;
        for(var i = 0; i < rendered_lines.length; i++){
            previous_link_valid = false;

            for(var j = 0; j < rendered_lines[i].length; j++){
                if(rendered_lines[i][j] instanceof Word){
                    let this_word: Word = <Word> rendered_lines[i][j];
                    // Check if link
                    if(this_word.linked){

                        // Check if it matches the previous link
                        if(previous_link_valid && (previous_link.link_href == this_word.link_href) &&
                           (previous_link.link_onclick == this_word.link_onclick)){

                            // If so, remove end tag from previous and start tag from this
                            previous_link.no_link_end = true;
                            this_word.no_link_begin = true;
                        }

                        // Update previous
                        previous_link = this_word;
                        previous_link_valid = true;
                        previous_link_index = j;
                    } else {
                        previous_link_valid = false;
                    }
                }
            }
        }






        return rendered_lines;
    }
}
