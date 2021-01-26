interface Page_Style {
    background_colour: string;
    text_colour: string;
    link_colour: string;
}

class Website {
    navbar: Navbar;
    target_content_pixel_width: number;
    pages: Array<Page>;
    selected_page: number;

    // Page dimensions (given in characters)
    page_width: number;
    left_padding: number;
    right_padding: number;
    content_width: number;

    dark_mode: boolean;
    light_style: Page_Style;
    dark_style: Page_Style;

    constructor(content_width: number, navbar: Navbar, pages: Array<Page>){
        this.navbar = navbar;
        this.target_content_pixel_width = content_width;
        this.selected_page = 0;
        this.pages = pages;

        this.dark_mode = false;
        this.light_style = { background_colour: "#e3e3e3", text_colour: "black", link_colour: "blue" };
        this.dark_style = { background_colour: "#171717", text_colour: "#a6a6a6", link_colour: "#9c0000" };

    }

    // ------------------------------------------------------------------------
    // Return the colour-scheme
    get_page_style() {
        return this.dark_mode? this.dark_style : this.light_style;
    }

    // ------------------------------------------------------------------------
    // Render the website to the DOM
    render(popovers: Array<Popover>): string {
        this.update_dimensions();
        let rendered: Array<Array<Token>> = this.navbar.render(this.page_width, this.left_padding, this.selected_page, this.dark_mode);
        rendered = rendered.concat(this.pages[this.selected_page].render(this.page_width, this.content_width, this.left_padding, this.right_padding));

        for(const popover of popovers){
            rendered = popover.render(rendered, this.page_width);
        }

        // Convert tokens to html
        let html: string = "";
        for(const line of rendered){
            for(const token of line){
                html += token.render();
            }
            html += "\n";
        }
        return html;
    }

    // ------------------------------------------------------------------------
    // Update the content width and the padding amounts
    update_dimensions(): void {
        let pixel_width: number = this.get_page_width();
        let char_pixel_width: number = this.get_character_width();
        this.page_width = Math.floor(pixel_width / char_pixel_width);
        let min_line_chars: number = 50;

        // No need to shrink things down
        if((pixel_width > this.target_content_pixel_width) && (this.page_width > min_line_chars)){
            this.content_width = Math.floor(this.target_content_pixel_width / char_pixel_width);
            this.left_padding = Math.floor((this.page_width - this.content_width) / 2);
            this.right_padding = this.page_width - this.content_width - this.left_padding;

        // Shrink
        } else {
            this.left_padding = 1;
            this.right_padding = 1;
            this.content_width = Math.floor(pixel_width / char_pixel_width) - 2;
        }
    }

    // ------------------------------------------------------------------------
    // Get width of the page in pixels
    get_page_width(): number {
        return Math.min(document.body.clientWidth, document.body.scrollWidth);
    }

    // ------------------------------------------------------------------------
    // Get width of a single character in pixels
    get_character_width(): number {
        // Create a span with ten characters
        let sizing_span = document.createElement("span");
        sizing_span.innerHTML = '--------------------';
        sizing_span.style.cssText += 'position: absolute; top: -100px; padding: 0px;';
        document.body.insertBefore(sizing_span, document.body.firstChild);

        // Get its width
        let width: number = sizing_span.clientWidth/20;

        // Delete it and return
        sizing_span.parentNode.removeChild(sizing_span);
        return width;

    }
}
