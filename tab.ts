// ----------------------------------------------------------------------------
// The tab actually holds the page's content
class Tab {
    title: string;
    description: string;
    content: Block;

    constructor(title: string, description: string, content: Block){
        this.title = title;
        this.description = description;
        this.content = content;
    }

    // ------------------------------------------------------------------------
    // Render the contents of the tab to a html string
    render(width: number, left_padding: number, right_padding: number): Array<string> {
        let lines: Array<string> = this.content.render(width - 3);
        let html: Array<string> = this.render_description(width, left_padding, right_padding);

        for(const line of lines){
            let html_string: string = Array(left_padding + 1).join(" ") + "| ";
            html_string += line + " |";
            html_string += Array(right_padding + 1).join(" ");
            html.push(html_string);
        }
        return html;
    }

    // ------------------------------------------------------------------------
    // Render the description to a html string
    render_description(width: number, left_padding: number, right_padding: number): Array<string> {
        let html_string: string = "";
        let html: Array<string> = [];
        let desc_padding: number = width - this.description.length;

        // Description line
        html_string += Array(left_padding + 1).join(" ") + "| ";
        html_string += " > " + this.description + Array(desc_padding + 1 - 4 - 3).join(" ") + " |";
        html_string += Array(right_padding + 1).join(" ");
        html.push(html_string);

        // Empty line
        html_string = Array(left_padding + 1).join(" ") + "| ";
        html_string += Array(width + 1 - 4).join(" ") + " |";
        html_string += Array(right_padding + 1).join(" ");
        html.push(html_string);

        return html;
    }
}