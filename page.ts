// ----------------------------------------------------------------------------
// Page represents one page of the website, it can hold many tabs
class Page {
    title: string;
    url: string;
    tabs: Array<Tab>;
    selected_tab: number;

    constructor(title: string, url: string, tabs: Array<Tab>) {
        this.title = title;
        this.url = url;
        this.tabs = tabs;
        this.selected_tab = 0;
    }

    // ------------------------------------------------------------------------
    // Render the contents of a page to a html string
    render(page_width: number, content_width: number, left_padding: number, right_padding: number): Array<string> {
        let html: Array<string> = [];
        html.push(Array(page_width + 1).join(" "));
        html = html.concat(this.render_title(page_width, left_padding));
        html = html.concat(this.render_tab_selector(page_width, left_padding, content_width));
        html = html.concat(this.tabs[this.selected_tab].render(content_width, left_padding, right_padding));
        html = html.concat(this.render_bottom(left_padding, content_width, right_padding));
        return html;
    }

    // ------------------------------------------------------------------------
    // The bottom of the tab is a single closing line
    render_bottom(left_padding: number, content_width: number, right_padding: number): Array<string> {
        let html_string: string = Array(left_padding + 1).join(" ") + "|";
        html_string += Array(content_width - 1).join(" ") + "|";
        html_string += Array(right_padding + 1).join(" ") + "\n";
        html_string += Array(left_padding + 1).join(" ") + " ";
        html_string += Array(content_width - 1).join("&#175;") + " ";
        html_string += Array(right_padding + 1).join(" ");
        return [html_string];
    }

    // ------------------------------------------------------------------------
    // The title shows at the top of the page
    render_title(width: number, left_padding: number): Array<string>{
        let html_string: string = Array(left_padding + 2).join(" ");
        html_string += this.title;
        html_string += Array(width - left_padding - this.title.length).join(" ");
        return [html_string];
    }

    // ------------------------------------------------------------------------
    // The tab selector provides navigation between the tabs
    render_tab_selector(width: number, left_padding: number, content_width: number): Array<string>{
        // Line 1 is the tops of the tab selectors
        // Line 2 is the tab names and links
        // Line 3 is the top of the main tab content
        let line_1: string = Array(left_padding + 4).join(" ");
        let line_2: string = Array(left_padding + 3).join(" ") + "|";
        let line_2_length: number = line_2.length;
        let line_3: string = Array(left_padding + 1).join(" ") + "|@";

        let index: number = 0;
        for(const tab of this.tabs){
            line_1 += Array(tab.title.length + 3).join("_") + " ";
            line_2_length += tab.title.length;
            if(index == this.selected_tab){
                line_2 += " " + tab.title + " |";
                line_3 += Array(tab.title.length + 4).join(" ");
            } else {
                line_2 += " <a href='#' onclick='switch_tab(" + index +")'>" + tab.title + "</a> |";
                line_3 += Array(tab.title.length + 4).join("@");
            }
            index++;
        }
        line_1 += Array(width - line_1.length + 1).join(" ");
        line_2 += Array(width - line_2_length).join(" ");
        line_3 += Array(content_width + left_padding - line_3.length).join("@") + "|";
        line_3 += Array(width - line_3.length + 1).join(" ");

        // Done at the end to allow for length calculations
        line_3 = line_3.replace(/@/g, "&#175;");

        // If there are no tabs to select, skip the middle line
        if(this.tabs.length == 0){
            line_2 = "";
        }

        return [line_1, line_2, line_3];
    }
}
