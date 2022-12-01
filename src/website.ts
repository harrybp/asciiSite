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
    popovers: Array<Popover>;

    // Page dimensions (given in characters)
    page_width: number;
    left_padding: number;
    right_padding: number;
    content_width: number;

    dark_mode: boolean;
    light_style: Page_Style;
    dark_style: Page_Style;

    constructor(content_width: number, navbar: Navbar, pages: Array<Page>, popovers: Array<Popover>){
        this.navbar = navbar;
        this.target_content_pixel_width = content_width;
        this.selected_page = 0;
        this.pages = pages;
        this.popovers = popovers;

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
    render(): string {
        this.update_dimensions();
        let rendered: Array<Array<Token>> = this.navbar.render(this.page_width, this.left_padding, this.selected_page, this.dark_mode);
        rendered = rendered.concat(this.pages[this.selected_page].render(this.page_width, this.content_width, this.left_padding, this.right_padding));

        for(const popover of this.popovers){
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
        let page_width: number = pixel_width / char_pixel_width;

        // If page_width is a round number then need to minus one
        let floor_page_width: number = Math.floor(pixel_width / char_pixel_width);
        if(floor_page_width == page_width){
            floor_page_width -= 1;
        }

        this.page_width = floor_page_width;
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

    // ----------------------------------------------------------------------------
    // Reload: Renders the page
    reload(): void {
        let new_html: string = this.render();
        document.body.innerHTML = new_html;
        this.reload_style();
    }

    // -----------------------------------------------------------------------------
    // Update the page colour-scheme
    reload_style(): void {
        let page_style: Page_Style = this.get_page_style();
        document.body.style.backgroundColor = page_style.background_colour;
        document.body.style.color = page_style.text_colour;

        let page_links: any = document.getElementsByTagName("a");
        for(var i = 0; i < page_links.length; i++){
            if(page_links[i].href){
                page_links[i].style.color = page_style.link_colour;
            }
        }
    }

    // ----------------------------------------------------------------------------
    // Switch Tab
    switch_tab(tab_index: number): void {
        this.pages[this.selected_page].selected_tab = tab_index;
        console.log("Selected tab: " + tab_index);
        this.reload();
    }

    // ----------------------------------------------------------------------------
    // Switch Page
    switch_page(page_index: number): void {
        for(var i = 0; i < this.popovers.length; i++){
            this.popovers[i].active = false;
        }
        this.selected_page = page_index;
        console.log("Selected page: " + page_index);
        this.reload();
    }

    // ----------------------------------------------------------------------------
    // Open Popover
    open_popover(id_number: number): void {
        console.log("Opening " + id_number);
        for(var i = 0; i < this.popovers.length; i++){
            if(i == id_number){
                this.popovers[i].active = true;
            }
        }
        this.reload();
    }

    // ----------------------------------------------------------------------------
    // Close Popover
    close_popover(id_number: number): void {
        for(var i = 0; i < this.popovers.length; i++){
            if(i == id_number){
                this.popovers[i].active = false;
            }
        }
        this.reload();
    }

    // ----------------------------------------------------------------------------
    // Toggle Dark Mode
    toggle_dark_mode(): void{
        this.dark_mode = !this.dark_mode;
        this.reload();
    }
}
