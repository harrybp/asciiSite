// ----------------------------------------------------------------------------
// Page represents one page of the website, it can hold many tabs
class Page {
    title: Block;
    url: string;
    tabs: Array<Tab>;
    selected_tab: number;

    constructor(title: Block, url: string, tabs: Array<Tab>) {
        this.title = title;
        this.url = url;
        this.tabs = tabs;
        this.selected_tab = 0;
    }

    // ------------------------------------------------------------------------
    // Render the contents of a page to a html string
    render(page_width: number, content_width: number, left_padding: number, right_padding: number): Array<Array<Token>> {
        let rendered: Array<Array<Token>> = [];
        let rendered_line: Array<Token> = [];
        rendered_line.push(new Space(page_width));
        rendered.push(rendered_line);
        rendered = rendered.concat(this.render_title(page_width, left_padding, content_width));
        rendered = rendered.concat(this.render_tab_selector(page_width, left_padding, content_width));
        rendered = rendered.concat(this.tabs[this.selected_tab].render(content_width, left_padding, right_padding));
        rendered = rendered.concat(this.render_bottom(left_padding, content_width, right_padding));
        return rendered;
    }

    // ------------------------------------------------------------------------
    // The bottom of the tab is a single closing line
    render_bottom(left_padding: number, content_width: number, right_padding: number): Array<Array<Token>> {
        let rendered: Array<Array<Token>> = [];
        let rendered_line: Array<Token> = [];
        rendered_line.push(new Space(left_padding));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(content_width - 2));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(right_padding));
        rendered.push(rendered_line);

        rendered_line = [];
        rendered_line.push(new Space(left_padding + 1));
        rendered_line.push(new Space(content_width - 2, "&#175;"));
        rendered_line.push(new Space(right_padding + 1));
        rendered.push(rendered_line);

        return rendered;
    }

    // ------------------------------------------------------------------------
    // The title shows at the top of the page
    render_title(width: number, left_padding: number, content_width: number): Array<Array<Token>>{
        let rendered_lines: Array<Array<Token>> = [];
        let rendered_title: Array<Array<Token>> = this.title.render(content_width - 1);
        for(const line of rendered_title){
            let rendered_line: Array<Token> = [];
            rendered_line.push(new Space(left_padding + 2));
            rendered_line = rendered_line.concat(line);
            rendered_line.push(new Space(width - left_padding - content_width));
            rendered_lines.push(rendered_line);
        }
        return rendered_lines;
    }

    // ------------------------------------------------------------------------
    // The tab selector provides navigation between the tabs
    render_tab_selector(width: number, left_padding: number, content_width: number): Array<Array<Token>>{
        // Line 1 is the tops of the tab selectors
        // Line 2 is the tab names and links
        // Line 3 is the top of the main tab content
        let rendered: Array<Array<Token>> = [];
        let line_1: Array<Token> = [];
        let line_2: Array<Token> = [];
        let line_3: Array<Token> = [];

        // Left padding area
        line_1.push(new Space(left_padding + 3));
        line_2.push(new Space(left_padding + 2));
        line_2.push(new Word("|"));
        line_3.push(new Space(left_padding));
        line_3.push(new Word("|"));
        line_3.push(new Space(1, "&#175;"));

        // Tab selection area
        let index:number = 0;
        for(const tab of this.tabs){
            line_1.push(new Space(tab.title.length + 2, "_"));
            line_1.push(new Space(1));
            if(index == this.selected_tab){
                line_2.push(new Space(1));
                line_2.push(new Word(tab.title));
                line_2.push(new Space(1));
                line_2.push(new Word("|"));
                line_3.push(new Space(tab.title.length + 3));
            } else {
                line_2.push(new Space(1));
                line_2.push(new Word(tab.title, false, false, true, "#", "switch_tab(" + index + ")"));
                line_2.push(new Space(1));
                line_2.push(new Word("|"));
                line_3.push(new Space(tab.title.length + 3, "&#175;"));
            }
            index++;
        }

        // Right padding area
        line_1.push(new Space(width - get_token_array_length(line_1)));
        line_2.push(new Space(width - get_token_array_length(line_2)));
        line_3.push(new Space(content_width + left_padding - get_token_array_length(line_3) - 1, "&#175;"));
        line_3.push(new Word("|"));
        line_3.push(new Space(width - get_token_array_length(line_3)));

        rendered.push(line_1);
        if(this.tabs.length > 0){ // If there are no tabs to select, skip line 2
            rendered.push(line_2);
        }
        rendered.push(line_3);
        return rendered;
    }
}
