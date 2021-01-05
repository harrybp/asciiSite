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
    render(width: number, left_padding: number, right_padding: number): string {
        let lines: Array<string> = this.content.render(width - 3);
        let html_string: string = "";
        for(const line of lines){
            html_string += Array(left_padding + 1).join(" ") + "| ";
            html_string += line + " |";
            html_string += Array(right_padding + 1).join(" ") + "\n";
        }
        return html_string;
    }
}
