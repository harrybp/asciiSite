// ----------------------------------------------------------------------------
// Popovers draw some content on top of the page content
class Popover {
    id_number: number;
    content: Block;
    active: boolean;
    width: number;

    constructor(id_number: number, content: Block){
        this.id_number = id_number;
        this.content = content;
        this.active = false;
        this.width = 19;
    }

    // ------------------------------------------------------------------------
    // Rendering will modify the contents of the entire page
    render(page_contents: Array<Array<Token>>, width: number): Array<Array<Token>> {
        // TODO: width adjustments
        if(this.active){

            // Contents of the popover
            let popover_rendered: Array<Array<Token>> = this.content.render(this.width);

            let line_index: number;
            let token_index: number;

            // Find the trigger index
            for(var i = 0; i < page_contents.length; i++){
                let line: Array<Token> = page_contents[i];
                for(var j = 0; j < line.length; j++){
                    let token: Token = line[j];
                    if((token instanceof Word) && token.linked &&
                       (token.link_onclick.indexOf("open_popover("+ this.id_number + ")") >= 0)){

                        // Found the trigger
                        line_index = i;
                        token_index = j;
                    }
                }
            }

            let new_lines: Array<Array<Token>> = [];

            // Calculate offset
            let relative_left_offset: number = Math.floor((this.width + 4 - page_contents[line_index][token_index].length()) / 2);
            let left_offset: number = get_token_array_length(page_contents[line_index].slice(0, token_index)) - relative_left_offset;

            // 6 stages per line:
            // 0: pre-index print the tokens as normal
            // 1: index, trim the final token if necessary
            // 2: popover body
            // 3: waiting for end of popover
            // 4: index, trim the token if necessary
            // 5: post-index, print the tokens as normal

            // Loop over the necessary Lines
            for(var i = 0; i < popover_rendered.length; i++){

                let index: number = i + line_index + 1;
                let new_line: Array<Token> = [];
                let new_line_length: number = 0;
                let popover_drawn: boolean = false;
                let draw_as_normal: boolean = false;
                let popover_line_length: number = 0;
                var old_line: Array<Token> = page_contents[index].slice(0);

                // Loop over the tokens in that line
                for(var j = 0; j < page_contents[index].length; j++){
                    let token_length: number = page_contents[index][j].length();

                    // Remainder of the line
                    if(draw_as_normal){
                        new_line.push(page_contents[index][j]);

                    // Post pop-over
                    } else if(popover_drawn){
                        let token: Token = page_contents[index][j];
                        let line_length: number = get_token_array_length(page_contents[index].slice(0, j));
                        let token_length: number = token.length();

                        // If we have passed the popover
                        if(line_length + token_length > popover_line_length){

                            // Find how much we have passed it by
                            let new_token_length: number = line_length + token_length - popover_line_length;
                            if(token instanceof Space){
                                let old_space: Space = <Space> token;
                                let trimmed_space: Space = new Space(new_token_length, old_space.space_value);
                                new_line.push(trimmed_space);
                                if(new_token_length > 0){
                                    new_line.push(trimmed_space);
                                }
                            } else {
                                let old_word: Word = <Word>token;
                                let trimmed_word: Word = new Word(old_word.text.substr(old_word.text.length - new_token_length, old_word.text.length),
                                                                 old_word.bold, old_word.italic, old_word.linked, old_word.link_href, old_word.link_onclick);
                                new_line.push(trimmed_word);
                            }
                            draw_as_normal = true;
                        } else {
                            continue;
                        }

                    // Keep going until we reach the offset
                    } else if(new_line_length + token_length < left_offset){
                        new_line.push(old_line[j]);
                        new_line_length += token_length;
                    } else {

                        let difference: number = new_line_length + token_length - left_offset;
                        let new_token_length = token_length - difference;
                        if(old_line[j] instanceof Space){
                            let old_space: Space = <Space> old_line[j];
                            let trimmed_space: Space = new Space(new_token_length, old_space.space_value);
                            new_line.push(trimmed_space);
                        } else {
                            let old_word: Word = <Word>old_line[j];
                            let trimmed_word: Word = new Word(old_word.text.substr(0, new_token_length), old_word.bold, old_word.italic,
                                                              old_word.linked, old_word.link_href, old_word.link_onclick);
                            new_line.push(trimmed_word);
                        }
                        new_line.push(new Word("|"));
                        new_line.push(new Space(1));
                        new_line = new_line.concat(popover_rendered[i]);
                        new_line.push(new Space(1));
                        new_line.push(new Word("|"));
                        popover_drawn = true;
                        popover_line_length = get_token_array_length(new_line);
                    }
                }
                new_lines.push(new_line);
            }

            // Replace the lines with the new lines
            for(var j = 0; j < new_lines.length; j++){
                let index: number = j + line_index + 1;
                page_contents[index] = new_lines[j];
            }


        }

        return page_contents;

    }



}

