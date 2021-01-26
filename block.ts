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
        let lines: Array<Array<Word>> = [];
        let line_lengths: Array<number> = [];
        let current_line: Array<Word> = [];
        let current_line_length = 0;
        for(const word of this.contents){

            // If this word fits on the current line
            if(!word.new_line && (word.text.length + current_line_length < width)){
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
                let word: Token = line[j];

                // Clear any previous settings of link wrapping
                if(word instanceof Word){
                    let word_cast: Word = <Word>word;
                    word_cast.no_link_end = false;
                    word_cast.no_link_begin = false;
                    word = word_cast;
                }

                current_line.push(word);
                if(word != line[line.length - 1]){
                    current_line.push(new Space(1));
                }
            }

            // Make the line the correct length
            current_line.push(new Space(width - data.lengths[i] - 1));
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
