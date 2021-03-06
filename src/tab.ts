// ----------------------------------------------------------------------------
// The tab actually holds the page's content
class Tab {
    title: string;
    description: Block;
    content: Block;

    constructor(title: string, description: Block, content: Block){
        this.title = title;
        this.description = description;
        this.content = content;
    }

    // ------------------------------------------------------------------------
    // Render the contents of the tab to a html string
    render(width: number, left_padding: number, right_padding: number): Array<Array<Token>> {
        let lines: Array<Array<Token>> = this.content.render(width - 3);
        let rendered: Array<Array<Token>> = this.render_description(width, left_padding, right_padding);

        for(const line of lines){
            let rendered_line: Array<Token> = [];
            rendered_line.push(new Space(left_padding));
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(1));
            rendered_line = rendered_line.concat(line);
            rendered_line.push(new Space(1));
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(right_padding));
            rendered.push(rendered_line);

        }
        return rendered;
    }

    // ------------------------------------------------------------------------
    // Render the description to a html string
    render_description(width: number, left_padding: number, right_padding: number): Array<Array<Token>> {
        let rendered_line: Array<Token> = [];
        let rendered: Array<Array<Token>> = [];
        let rendered_desc: Array<Array<Token>> = this.description.render(width - 5);

        // Description line
        for(var i = 0; i < rendered_desc.length; i++){
            let desc: Array<Token> = rendered_desc[i];
            rendered_line = [];
            rendered_line.push(new Space(left_padding));
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(2));
            if(i == 0){
                rendered_line.push(new Word(">"));
            } else {
                rendered_line.push(new Space(1));
            }
            rendered_line.push(new Space(1));
            rendered_line = rendered_line.concat(desc);
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(right_padding));
            rendered.push(rendered_line);
        }

        // Empty Line
        rendered_line = [];
        rendered_line.push(new Space(left_padding));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(width - 2));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(right_padding));
        rendered.push(rendered_line);

        return rendered;
    }
}
