// ----------------------------------------------------------------------------
// Website is constructed here

let games_string: string = "Various Games made by <br>me over the last few years in my spare time. All were made completely from scratch either in pure HTML5 with javascript and the canvas or in C++ and compiled to web assembly. All should run in the browser. Only a couple of them work with mobile devices.<br><br><b>Cave Escape (2019 - Present)</b><br> Avoid the monsters and try to escape the vast cave system. Collect as many coins as possible. Created in C++ and compiled to web-assembly using emscripten. Still a work in progress.<br> <a href='games/cave_escape.html'>Click</a> to play<br><br><b>Ocean Simulator (2018)</b><br> Play with fishes and fish-eating worms in this fun little sandbox. This is an implementation of boids written in javascript.<br> <a href='games/ocean_simulator.html'>Click</a> to play<br><br><b>Bounce (2018)</b><br> Sort of like 2D single-player pong? Keep the ball from escaping! Created in javascript - works on mobile.<br> <a href='games/bounce.html'>Click</a> to play<br><br><b>Zombie Run (2017)</b><br> A side scrolling run-and-shoot type game with randomly generated caves. See how far you can get! Created in javascript - works on mobile.<br> <a href='games/zombie_run.html'>Click</a> to play<br><br><b>Meteor Shower (2017)</b><br> Dodge falling blocks and collect health cubes as you try to survive for as long as possible. Created in javascript.<br> <a href='games/meteor_shower.html'>Click</a> to play<br><br><b>Endless Climb (2017)</b><br> Race against time as you jump upwards from block to block in this fun little concept game. Created in javascript.<br> <a href='games/endless_climb.html'>Click</a> to play<br><br>Check my <a href='https://github.com/harrybp'>github</a> for more stuff";

let other_string: string = "<b>Texture Generation using ML (2018)</b><br> Created as part of my final year project at uni, a demonstration of a few methods of synthesising unique textures using machine learning methods. <br> See the <a href='https://harrybp.github.io/texture_generation_demo/'>demo</a> or check it out on <a href='https://github.com/harrybp/TextureGeneration'>github</a><br><br><b>This website (2017 - Present)</b><br> A text-only interactive website built using javascript with support for a navbar, tabs, pop-ups, pop-overs and columns of text. Hint: try clicking the cat face in the nav bar! <br> Check it out on <a href='https://github.com/harrybp/asciiSite'>github</a>";

let info_string: string = "Hi I'm Harry!<br><br>This website serves as an archive for all of the web projects I have worked on over the years. The stuff on here is all for fun - I have been trying to learn game development so a lot of the projects are little games. Feel free to check them out and contact me with any feedback.";
let contact_string: string = "";


// First create a tab with a block of content
let page0_tab0_content: Block = new Block(tokenize(games_string));
let page0_tab0: Tab = new Tab("Games", "Game Projects", page0_tab0_content);
let page0_tab1_content: Block = new Block(tokenize(other_string));
let page0_tab1: Tab = new Tab("Other", "Other Projects", page0_tab1_content);
let page0_tabs: Array<Tab> = [page0_tab0, page0_tab1];
let page0: Page = new Page("Projects", "projects.html", page0_tabs);

let page1_tab0_content: Block = new Block(tokenize(info_string));
let page1_tab0: Tab = new Tab("Info", "Site Information", page1_tab0_content);
let page1_tab1_content: Block = new Block(tokenize(contact_string));
let page1_tab1: Tab = new Tab("Contact", "Contact Information", page1_tab1_content);
let page1_tabs: Array<Tab> = [page1_tab0, page1_tab1];
let page1: Page = new Page("About Me", "about.html", page1_tabs);

// Then create a navbar
let page_names: Array<string> = ["Projects", "About Me"];
let links: Array<string> = ["projects.html", "about.html"];
let nav: Navbar = new Navbar("harrycats", page_names, links);

let pages: Array<Page> = [page0, page1];

let site: Website = new Website(700, nav, pages);

// Create popovers
let popover_string_0: string = "Projects<br><a href='#' onclick='switch_page(1)'>About Me</a>";
let popover_string_1: string = "<a href='#' onclick='switch_page(0)'>Projects</a><br>About Me";
let popover_content_0: Block = new Block(tokenize(popover_string_0));
let popover_content_1: Block = new Block(tokenize(popover_string_1));
let popover_0: Popover = new Popover(0, popover_content_0, 8);
let popover_1: Popover = new Popover(1, popover_content_1, 8);
let popovers: Array<Popover> = [popover_0, popover_1];


// ----------------------------------------------------------------------------
// Reload: Renders the page
function reload(): void {
    let new_html: string = site.render(popovers);
    document.body.innerHTML = new_html;
}

// ----------------------------------------------------------------------------
// Switch Tab
function switch_tab(tab_index: number): void {
    pages[site.selected_page].selected_tab = tab_index;
    console.log("Selected tab: " + tab_index);
    reload();
}

// ----------------------------------------------------------------------------
// Switch Page
function switch_page(page_index: number): void {
    for(var i = 0; i < popovers.length; i++){
        popovers[i].active = false;
    }
    site.selected_page = page_index;
    console.log("Selected page: " + page_index);
    reload();
}

// ----------------------------------------------------------------------------
// Open Popover
function open_popover(id_number: number): void {
    console.log("Opening " + id_number);
    for(var i = 0; i < popovers.length; i++){
        if(i == id_number){
            popovers[i].active = true;
        }
    }
    reload();
}

// ----------------------------------------------------------------------------
// Close Popover
function close_popover(id_number: number): void {
    for(var i = 0; i < popovers.length; i++){
        if(i == id_number){
            popovers[i].active = false;
        }
    }
    reload();
}


window.onresize = reload;
window.onload = reload;

