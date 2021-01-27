interface Tab_Data {
    title: string;
    description: string;
    contents: string;
}

interface Page_Data {
    title: string;
    tabs: Array<Tab_Data>;
}

interface Website_Data {
    title_light: string;
    title_dark: string;
    pages: Array<Page_Data>;
}

function build_website(data: Website_Data): Website {
    let pages: Array<Page> = [];
    let page_names: Array<string> = [];
    let links: Array<string> = [];
    let popovers: Array<Popover> = [];
    for(const page of data.pages){
        let tabs: Array<Tab> = [];
        for(const tab of page.tabs){
            let tab_desc: Block = new Block(tokenize(tab.description));
            let tab_content: Block = new Block(tokenize(tab.contents));
            let new_tab: Tab = new Tab(tab.title, tab_desc, tab_content);
            tabs.push(new_tab);
        }
        let new_page_title: Block = new Block(tokenize(page.title));
        let new_page: Page = new Page(new_page_title, "", tabs);
        pages.push(new_page);
        page_names.push(page.title);
        links.push("");

    }

    // Create popovers for mobile navbar
    for(var i = 0; i < data.pages.length; i++){
        let longest_length: number = 0;
        let popover_string: string = "";
        for(var j = 0; j < data.pages.length; j++){
            if(data.pages[j].title.length > longest_length){
                longest_length = data.pages[j].title.length;
            }

            if(i == j){
                popover_string += data.pages[j].title;
            } else {
                popover_string += "<a href='#' onclick='site.switch_page(" + j + ")'>";
                popover_string += data.pages[j].title;
                popover_string += "</a>";
            }
            if(j != data.pages.length - 1){
                popover_string += "<br>";
            }
        }
        let popover_content: Block = new Block(tokenize(popover_string));
        let new_popover: Popover = new Popover(i, popover_content, longest_length);
        popovers.push(new_popover);

    }

    let nav_light_title: Block = new Block(tokenize(data.title_light));
    let nav_dark_title: Block = new Block(tokenize(data.title_dark));
    let nav: Navbar = new Navbar(nav_light_title, page_names, links, nav_dark_title);
    let site: Website = new Website(700, nav, pages, popovers);
    return site;

}
