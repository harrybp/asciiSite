// ----------------------------------------------------------------------------
// A navbar has a brand and a number of links to pages
class Navbar {
    page_names: Array<string>; // To be pages?
    page_links: Array<string>;
    brand: string;
    centered: boolean;

    // Dimensions (given in characters)
    start_brand_index: number; // Spacing before the brand
    initial_spacing: number; // Spacing between brand and first link
    spacing: number; // Spacing between subsequent links
    mobile_spacing: number; // Spacing between brand and hamburger
    mobile_cutoff: number;

    constructor(brand: string, page_names: Array<string>, page_links: Array<string>){
        this.brand = brand;
        this.page_names = page_names;
        this.page_links = page_links;
        this.centered = true;
    }

    // ------------------------------------------------------------------------
    // Render the navbar to a string
    render(width: number, left_padding: number, selected_page: number): Array<string> {
        this.update_dimensions(width, left_padding);

        // Build the html lines
        let html: Array<string> = [];
        html.push(Array(width+1).join(" ")); // Blank line
        html = html.concat((this.mobile_cutoff < width)? this.render_desktop_line(selected_page) : this.render_mobile_line());
        html.push(Array(width+1).join("_"));
        return html;
    }

    // ------------------------------------------------------------------------
    // Render the navbar line for desktop
    render_desktop_line(selected_page: number): Array<string> {

        // Brand spacing ~ Brand ~ Initial spacing ~ link0 ~ spacing ~ link1
        let html_string: string = Array(this.start_brand_index).join(" ");
        html_string += this.brand;
        html_string += Array(this.initial_spacing).join(" ");
        for(var i = 0; i < this.page_names.length; i++){
            if(i == selected_page){
                html_string += "[" + this.page_names[i] + "]";
            } else {
                html_string += " <a href='#' onclick='switch_page(" + i + ")'>" + this.page_names[i] + "</a> ";
            }
            if(i != (this.page_names.length - 1)){
                html_string += Array(this.spacing).join(" ");
            }
        }
        return [html_string];
    }

    // ------------------------------------------------------------------------
    // Render the navbar line for mobile
    render_mobile_line(): Array<string> {
        let html_string: string = Array(this.start_brand_index).join(" ");
        html_string += this.brand;
        html_string += Array(this.mobile_spacing).join(" ");
        html_string += '[<a href="#" onclick=openPopover("nav")>X</a>]';
        return [html_string];
    }

    // ------------------------------------------------------------------------
    // Update the dimensions
    update_dimensions(page_width: number, left_padding: number): void {
        let link_length: number = this.page_names.reduce((x,y) => x + y).length + 4;

        // Calculate the spacing between the navbar elements
        if(this.centered){
            this.start_brand_index = left_padding + 2;
            let side_padding: number = this.start_brand_index * 2;
            this.initial_spacing = Math.floor((page_width - side_padding - link_length) * 0.6);
            this.spacing = Math.floor((page_width - side_padding - link_length - this.brand.length - this.initial_spacing) / (this.page_names.length - 1));
            this.mobile_cutoff = link_length + this.brand.length + (2 * this.start_brand_index) + this.initial_spacing + this.page_names.length;
        } else {
            this.start_brand_index = Math.floor(page_width / 10);
            this.initial_spacing = page_width - link_length - this.brand.length - ((links.length + 1) * this.start_brand_index);
            this.spacing = this.start_brand_index + 1;
            this.mobile_cutoff = link_length + this.brand.length + (4 * this.start_brand_index);
        }
        this.mobile_spacing = page_width - 2 - (2 * this.start_brand_index) - this.brand.length;
    }
}
