// For the results of the state-machine stages
interface Stage_Result {
    output: Array<Token>;
    next_stage: number;
}

// ----------------------------------------------------------------------------
// Popovers draw some content on top of the page content
class Popover {
    id_number: number;
    content: Block;
    active: boolean;
    width: number;

    constructor(id_number: number, content: Block, width: number){
        this.id_number = id_number;
        this.content = content;
        this.active = false;
        this.width = width + 1;
    }

    // ------------------------------------------------------------------------
    // Rendering will modify the contents of the entire page
    render(page_contents: Array<Array<Token>>, width: number): Array<Array<Token>> {
        // TODO: width adjustments
        if(this.active){
            let new_lines: Array<Array<Token>> = [];

            let indexes: Array<number> = this.get_trigger_index(page_contents);
            let line_index: number = indexes[0];
            let token_index: number = indexes[1];
            let pre_trigger_length: number = indexes[2];
            let trigger: Word = <Word>page_contents[line_index][token_index];
            let trigger_length: number = trigger.length();


            // Calculate offset
            let relative_left_offset: number = Math.floor((this.width + 4 - page_contents[line_index][token_index].length()) / 2);
            let left_offset: number = get_token_array_length(page_contents[line_index].slice(0, token_index)) - relative_left_offset;
            let right_offset: number = left_offset + this.width + 3;

            if(left_offset < 1){
                let difference: number = 1 - left_offset;
                left_offset += difference;
                right_offset += difference;
            }
            if(right_offset > (width - 1)){
                let difference: number = right_offset - (width - 1);
                right_offset -= difference;
                left_offset -= difference;
            }

            // Contents of the popover
            let popover_rendered: Array<Array<Token>> = [];
            let popover_top: Array<Token> = [];
            popover_top.push(new Space(pre_trigger_length - 1 - left_offset - 1, "_"));
            popover_top.push(new Word("[" + trigger.text + "]", trigger.bold, trigger.italic, trigger.linked, trigger.link_href, "site.close_popover(" + this.id_number +")"));
            popover_top.push(new Space(right_offset - pre_trigger_length - trigger_length - 2, "_"));
            popover_rendered.push(popover_top);


            popover_rendered = popover_rendered.concat(this.content.render(this.width));

            let popover_bottom: Array<Token> = [];
            popover_bottom.push(new Space(this.width + 1, "&#175;"))
            popover_rendered.push(popover_bottom);

            // 4 stages per line:
            // 0: waiting for popover left_index, print the tokens as normal
            // 1: left_index, trim the final token and print the popover contents
            // 2: right_index, trim the token
            // 3: post-index, print the tokens as normal

            // Loop over the necessary Lines
            for(var i = 0; i < popover_rendered.length; i++){

                let stage: number = 0;
                let index: number = line_index + i;
                let this_line: Array<Token> = page_contents[index];
                let new_line: Array<Token> = [];

                //for(var j = 0; j < this_line.length; j++){
                let j: number = 0;
                while(j < this_line.length){
                    let token: Token = this_line[j];
                    let line_so_far: Array<Token> = this_line.slice(0, j);

                    switch(stage){

                        // Case 0 : before we reach start of the popover
                        case 0:
                            let result_0: Stage_Result = this.stage_0(token, line_so_far, left_offset);
                            stage = result_0.next_stage;
                            new_line = new_line.concat(result_0.output);
                            if(stage == 0){
                                j++;
                            }
                            break;

                        // Case 1 : when we reach the start of the popover
                        case 1:
                            let result_1: Stage_Result = this.stage_1(token, line_so_far, left_offset, popover_rendered[i], (i==popover_rendered.length - 1) || (i ==0));
                            stage = result_1.next_stage;
                            new_line = new_line.concat(result_1.output);
                            if(stage == 1){
                                j++;
                            }
                            break;

                        // Case 2 : waiting for the end of the popover
                        case 2:
                            let result_2: Stage_Result = this.stage_2(token, line_so_far, right_offset);
                            stage = result_2.next_stage;
                            new_line = new_line.concat(result_2.output);
                            j++;
                            break;

                        // Case 3 : after passing the end of the popover
                        case 3:
                            new_line.push(token);
                            j++;
                            break;
                    }
                }
                new_lines.push(new_line);
            }

            // Replace the lines with the new lines
            for(var j = 0; j < new_lines.length; j++){
                let index: number = j + line_index;
                page_contents[index] = new_lines[j];
            }
        }

        return page_contents;
    }

    // ------------------------------------------------------------------------
    // Stage 0 : before we reach the start of the popover
    stage_0(token_in: Token, line: Array<Token>, left_offset: number): Stage_Result {
        let token_out: Token;
        let new_stage: number;

        // Get lengths
        let line_length: number = get_token_array_length(line);
        let token_length: number = token_in.length();

        // Check if there is space for this token, if yes add it, otherwise skip to stage 1
        let still_space: boolean = (line_length + token_length) < left_offset;
        if(still_space){
            token_out = token_in;
            new_stage = 0;
        } else {
            token_out = new Space(0);
            new_stage = 1;
        }
        return { output: [token_out], next_stage: new_stage };
    }

    // ------------------------------------------------------------------------
    // Stage 1 : when we reach the start of the popover
    stage_1(token_in: Token, line: Array<Token>, left_index: number, popover_content: Array<Token>, no_border: boolean): Stage_Result {
        let tokens_out: Array<Token> = [];

        // Find the amount to shorten the last token by
        let line_length: number = get_token_array_length(line);
        let token_length: number = token_in.length();
        let difference: number = line_length + token_length - left_index;
        let new_token_length: number = token_length - difference;

        // Shorten the token
        if(token_in instanceof Space){
            let old_space: Space = <Space>token_in;
            let trimmed_space: Space = new Space(new_token_length, token_in.space_value);
            tokens_out.push(trimmed_space);
        } else {
            let old_word: Word = <Word>token_in;
            let trimmed_word: Word = new Word(old_word.text.substr(0, new_token_length), old_word.bold, old_word.italic,
                                              old_word.linked, old_word.link_href, old_word.link_onclick);
            tokens_out.push(trimmed_word);
        }

        // Add the body of the popover
        if(!no_border){
            tokens_out.push(new Word("|"));
        }
        tokens_out.push(new Space(1));
        tokens_out = tokens_out.concat(popover_content);
        tokens_out.push(new Space(1));
        if(!no_border){
            tokens_out.push(new Word("|"));
        }

        return { output: tokens_out, next_stage: 2 };
    }

    // ------------------------------------------------------------------------
    // Stage 2, waiting for end of the popover
    stage_2(token_in: Token, line: Array<Token>, right_index: number): Stage_Result {
        let token_out: Token;
        let next_stage: number;

        // Get the lengths
        let line_length: number = get_token_array_length(line);
        let token_length: number = token_in.length();

        // If we have passed the end of the popover contents, trim the token, else do nothing
        if(line_length + token_length > right_index){
            let new_token_length: number = line_length + token_length - right_index;

            // Shorten the token
            if(token_in instanceof Space){
                let old_space: Space = <Space>token_in;
                let trimmed_space: Space = new Space(new_token_length, token_in.space_value);
                token_out = trimmed_space;
            } else {
                let old_word: Word = <Word>token_in;
                let trimmed_word: Word = new Word(old_word.text.substr(token_length - new_token_length, token_length),
                                                  old_word.bold, old_word.italic, old_word.linked,
                                                  old_word.link_href, old_word.link_onclick);
                token_out = trimmed_word;
            }
            next_stage = 3;
        } else {
            token_out = new Space(0);
            next_stage = 2;
        }
        return { output: [token_out], next_stage: next_stage };
    }

    // ------------------------------------------------------------------------
    // Get trigger index - find the location of the trigger in the page
    get_trigger_index(page_contents: Array<Array<Token>>): Array<number> {
        let line_index: number;
        let token_index: number;
        let pre_length: number;

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
                    pre_length = get_token_array_length(line.slice(0,j));
                }
            }
        }
        return [line_index, token_index, pre_length];
    }



}

