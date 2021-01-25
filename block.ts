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
    render(width: number): Array<string> {
        let data: Block_Data = this.wrap(width);
        let html_lines: Array<string> = [];
        let current_line: string;

        // For each line in the wrapped text
        for(var i = 0; i < data.lines.length; i++){
            let line: Array<Word> = data.lines[i];
            current_line = "";

            // For each word in the line
            for(const word of line){
                current_line += word.render();
                if(word != line[line.length - 1]){
                    current_line += " ";
                }
            }

            // Make the line the correct length
            current_line += Array(width - data.lengths[i]).join(" ");
            html_lines.push(current_line);
        }
        return html_lines;
    }
}
