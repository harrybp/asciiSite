var Block = (function () {
    function Block(text) {
        this.contents = text;
    }
    Block.prototype.wrap = function (width) {
        var lines = [];
        var line_lengths = [];
        var current_line = [];
        var current_line_length = 0;
        for (var _i = 0, _a = this.contents; _i < _a.length; _i++) {
            var word = _a[_i];
            if (!word.new_line && (word.text.length + current_line_length < width)) {
                current_line.push(word);
                current_line_length += word.text.length + 1;
            }
            else {
                lines.push(current_line);
                if (current_line_length > 0) {
                    line_lengths.push(current_line_length - 1);
                }
                else {
                    line_lengths.push(current_line_length);
                }
                current_line = [];
                if (word.new_line) {
                    current_line_length = 0;
                }
                else {
                    current_line.push(word);
                    current_line_length = word.text.length + 1;
                }
            }
        }
        if (current_line.length > 0) {
            lines.push(current_line);
            line_lengths.push(current_line_length - 1);
        }
        return { lines: lines, lengths: line_lengths };
    };
    Block.prototype.render = function (width) {
        var data = this.wrap(width);
        var html_lines = [];
        var current_line;
        for (var i = 0; i < data.lines.length; i++) {
            var line = data.lines[i];
            current_line = "";
            for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                var word = line_1[_i];
                current_line += word.render();
                if (word != line[line.length - 1]) {
                    current_line += " ";
                }
            }
            current_line += Array(width - data.lengths[i]).join(" ");
            html_lines.push(current_line);
        }
        return html_lines;
    };
    return Block;
}());
var Popover = (function () {
    function Popover(id_number, content) {
        this.id_number = id_number;
        this.content = content;
        this.active = false;
        this.width = 8;
    }
    Popover.prototype.render = function (page_contents, width) {
        if (this.active) {
            var popover_html = this.content.render(this.width);
            var search_string = "open_popover(" + this.id_number + ")";
            for (var i = 0; i < page_contents.length; i++) {
                var line = page_contents[i];
                var index = line.indexOf(search_string);
                if (index >= 0) {
                    page_contents[i] = "poop";
                }
            }
        }
        return page_contents;
    };
    return Popover;
}());
var Tab = (function () {
    function Tab(title, description, content) {
        this.title = title;
        this.description = description;
        this.content = content;
    }
    Tab.prototype.render = function (width, left_padding, right_padding) {
        var lines = this.content.render(width - 3);
        var html = this.render_description(width, left_padding, right_padding);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var html_string = Array(left_padding + 1).join(" ") + "| ";
            html_string += line + " |";
            html_string += Array(right_padding + 1).join(" ");
            html.push(html_string);
        }
        return html;
    };
    Tab.prototype.render_description = function (width, left_padding, right_padding) {
        var html_string = "";
        var html = [];
        var desc_padding = width - this.description.length;
        html_string += Array(left_padding + 1).join(" ") + "| ";
        html_string += " > " + this.description + Array(desc_padding + 1 - 4 - 3).join(" ") + " |";
        html_string += Array(right_padding + 1).join(" ");
        html.push(html_string);
        html_string = Array(left_padding + 1).join(" ") + "| ";
        html_string += Array(width + 1 - 4).join(" ") + " |";
        html_string += Array(right_padding + 1).join(" ");
        html.push(html_string);
        return html;
    };
    return Tab;
}());
var Page = (function () {
    function Page(title, url, tabs) {
        this.title = title;
        this.url = url;
        this.tabs = tabs;
        this.selected_tab = 0;
    }
    Page.prototype.render = function (page_width, content_width, left_padding, right_padding) {
        var html = [];
        html.push(Array(page_width + 1).join(" "));
        html = html.concat(this.render_title(page_width, left_padding));
        html = html.concat(this.render_tab_selector(page_width, left_padding, content_width));
        html = html.concat(this.tabs[this.selected_tab].render(content_width, left_padding, right_padding));
        html = html.concat(this.render_bottom(left_padding, content_width, right_padding));
        return html;
    };
    Page.prototype.render_bottom = function (left_padding, content_width, right_padding) {
        var html_string = Array(left_padding + 1).join(" ") + "|";
        html_string += Array(content_width - 1).join(" ") + "|";
        html_string += Array(right_padding + 1).join(" ") + "\n";
        html_string += Array(left_padding + 1).join(" ") + " ";
        html_string += Array(content_width - 1).join("&#175;") + " ";
        html_string += Array(right_padding + 1).join(" ");
        return [html_string];
    };
    Page.prototype.render_title = function (width, left_padding) {
        var html_string = Array(left_padding + 2).join(" ");
        html_string += this.title;
        html_string += Array(width - left_padding - this.title.length).join(" ");
        return [html_string];
    };
    Page.prototype.render_tab_selector = function (width, left_padding, content_width) {
        var line_1 = Array(left_padding + 4).join(" ");
        var line_2 = Array(left_padding + 3).join(" ") + "|";
        var line_2_length = line_2.length;
        var line_3 = Array(left_padding + 1).join(" ") + "|@";
        var index = 0;
        for (var _i = 0, _a = this.tabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            line_1 += Array(tab.title.length + 3).join("_") + " ";
            line_2_length += tab.title.length;
            if (index == this.selected_tab) {
                line_2 += " " + tab.title + " |";
                line_3 += Array(tab.title.length + 4).join(" ");
            }
            else {
                line_2 += " <a href='#' onclick='switch_tab(" + index + ")'>" + tab.title + "</a> |";
                line_3 += Array(tab.title.length + 4).join("@");
            }
            index++;
        }
        line_1 += Array(width - line_1.length + 1).join(" ");
        line_2 += Array(width - line_2_length).join(" ");
        line_3 += Array(content_width + left_padding - line_3.length).join("@") + "|";
        line_3 += Array(width - line_3.length + 1).join(" ");
        line_3 = line_3.replace(/@/g, "&#175;");
        if (this.tabs.length == 0) {
            line_2 = "";
        }
        return [line_1, line_2, line_3];
    };
    return Page;
}());
var Navbar = (function () {
    function Navbar(brand, page_names, page_links) {
        this.brand = brand;
        this.page_names = page_names;
        this.page_links = page_links;
        this.centered = true;
    }
    Navbar.prototype.render = function (width, left_padding, selected_page) {
        this.update_dimensions(width, left_padding);
        var html = [];
        html.push(Array(width + 1).join(" "));
        html = html.concat((this.mobile_cutoff < width) ? this.render_desktop_line(selected_page) : this.render_mobile_line());
        html.push(Array(width + 1).join("_"));
        return html;
    };
    Navbar.prototype.render_desktop_line = function (selected_page) {
        var html_string = Array(this.start_brand_index).join(" ");
        html_string += this.brand;
        html_string += Array(this.initial_spacing).join(" ");
        for (var i = 0; i < this.page_names.length; i++) {
            if (i == selected_page) {
                html_string += "[" + this.page_names[i] + "]";
            }
            else {
                html_string += " <a href='#' onclick='switch_page(" + i + ")'>" + this.page_names[i] + "</a> ";
            }
            if (i != (this.page_names.length - 1)) {
                html_string += Array(this.spacing).join(" ");
            }
        }
        return [html_string];
    };
    Navbar.prototype.render_mobile_line = function () {
        var html_string = Array(this.start_brand_index).join(" ");
        html_string += this.brand;
        html_string += Array(this.mobile_spacing).join(" ");
        html_string += '[<a href="#" onclick=openPopover("nav")>X</a>]';
        return [html_string];
    };
    Navbar.prototype.update_dimensions = function (page_width, left_padding) {
        var link_length = this.page_names.reduce(function (x, y) { return x + y; }).length + 4;
        if (this.centered) {
            this.start_brand_index = left_padding + 2;
            var side_padding = this.start_brand_index * 2;
            this.initial_spacing = Math.floor((page_width - side_padding - link_length) * 0.6);
            this.spacing = Math.floor((page_width - side_padding - link_length - this.brand.length - this.initial_spacing) / (this.page_names.length - 1));
            this.mobile_cutoff = link_length + this.brand.length + (2 * this.start_brand_index) + this.initial_spacing + this.page_names.length;
        }
        else {
            this.start_brand_index = Math.floor(page_width / 10);
            this.initial_spacing = page_width - link_length - this.brand.length - ((links.length + 1) * this.start_brand_index);
            this.spacing = this.start_brand_index + 1;
            this.mobile_cutoff = link_length + this.brand.length + (4 * this.start_brand_index);
        }
        this.mobile_spacing = page_width - 2 - (2 * this.start_brand_index) - this.brand.length;
    };
    return Navbar;
}());
var Website = (function () {
    function Website(content_width, navbar, pages) {
        this.navbar = navbar;
        this.target_content_pixel_width = content_width;
        this.selected_page = 0;
        this.pages = pages;
    }
    Website.prototype.render = function (popovers) {
        this.update_dimensions();
        var new_html = this.navbar.render(this.page_width, this.left_padding, this.selected_page);
        new_html = new_html.concat(this.pages[this.selected_page].render(this.page_width, this.content_width, this.left_padding, this.right_padding));
        for (var _i = 0, popovers_1 = popovers; _i < popovers_1.length; _i++) {
            var popover_1 = popovers_1[_i];
            new_html = popover_1.render(new_html, this.page_width);
        }
        return new_html.join("\n");
    };
    Website.prototype.update_dimensions = function () {
        var pixel_width = this.get_page_width();
        var char_pixel_width = this.get_character_width();
        this.page_width = Math.floor(pixel_width / char_pixel_width);
        var min_line_chars = 50;
        if ((pixel_width > this.target_content_pixel_width) && (this.page_width > min_line_chars)) {
            this.content_width = Math.floor(this.target_content_pixel_width / char_pixel_width);
            this.left_padding = Math.floor((this.page_width - this.content_width) / 2);
            this.right_padding = this.page_width - this.content_width - this.left_padding;
        }
        else {
            this.left_padding = 1;
            this.right_padding = 1;
            this.content_width = Math.floor(pixel_width / char_pixel_width) - 2;
        }
    };
    Website.prototype.get_page_width = function () {
        return Math.min(document.body.clientWidth, document.body.scrollWidth);
    };
    Website.prototype.get_character_width = function () {
        var sizing_span = document.createElement("span");
        sizing_span.innerHTML = '--------------------';
        sizing_span.style.cssText += 'position: absolute; top: -100px; padding: 0px;';
        document.body.insertBefore(sizing_span, document.body.firstChild);
        var width = sizing_span.clientWidth / 20;
        sizing_span.parentNode.removeChild(sizing_span);
        return width;
    };
    return Website;
}());
var Word = (function () {
    function Word(text, bold, italic, linked, link_href, link_onclick, new_line) {
        if (bold === void 0) { bold = false; }
        if (italic === void 0) { italic = false; }
        if (linked === void 0) { linked = false; }
        if (link_href === void 0) { link_href = ""; }
        if (link_onclick === void 0) { link_onclick = ""; }
        if (new_line === void 0) { new_line = false; }
        this.text = text;
        this.bold = bold;
        this.italic = italic;
        this.linked = linked;
        this.link_href = link_href;
        this.link_onclick = link_onclick;
        this.new_line = new_line;
    }
    Word.prototype.render = function () {
        var value = this.text;
        if (this.bold) {
            value = "<b>" + value + "</b>";
        }
        if (this.italic) {
            value = "<i>" + value + "</i>";
        }
        if (this.linked) {
            value = "<a href='" + this.link_href + "' onclick='" + this.link_onclick + "'>" + value + "</a>";
        }
        return value;
    };
    return Word;
}());
function pad_tags(text) {
    text = text.replace(/<\/?(b|i|br)>/g, function (x) { return (" " + x + " "); });
    text = text.replace(/<a.*?>/g, function (x) { return (" " + x + " "); });
    text = text.replace(/<\/a>/g, " </a> ");
    return text;
}
function tokenize(text) {
    text = pad_tags(text);
    var raw_words = text.split(" ");
    var words = [];
    var within_link = false;
    var within_link_info = false;
    var link_href;
    var link_onclick;
    var within_bold = false;
    var within_italics = false;
    for (var _i = 0, raw_words_1 = raw_words; _i < raw_words_1.length; _i++) {
        var rawWord = raw_words_1[_i];
        var this_word = rawWord;
        if (this_word.length < 1) {
            continue;
        }
        if (this_word == "<a") {
            within_link_info = true;
            link_href = "";
            link_onclick = "";
            continue;
        }
        if (within_link_info) {
            if (this_word.indexOf("href=") != -1) {
                link_href = this_word.substring(this_word.indexOf("href=") + 6, this_word.length);
                var end_index = link_href.indexOf('"');
                if (end_index == -1) {
                    end_index = link_href.indexOf("'");
                }
                link_href = link_href.substring(0, end_index);
            }
            if (this_word.indexOf("onclick=") != -1) {
                link_onclick = this_word.substring(this_word.indexOf("onclick=") + 9, this_word.length);
                var end_index = link_onclick.indexOf('"');
                if (end_index == -1) {
                    end_index = link_onclick.indexOf("'");
                }
                link_onclick = link_onclick.substring(0, end_index);
            }
            if (this_word.indexOf(">") != -1) {
                within_link_info = false;
                within_link = true;
            }
            continue;
        }
        if (within_link && this_word == "</a>") {
            within_link = false;
            continue;
        }
        if (this_word == "<b>" || this_word == "</b>") {
            within_bold = this_word == "<b>";
            continue;
        }
        if (this_word == "<i>" || this_word == "</i>") {
            within_italics = this_word == "<i>";
            continue;
        }
        if (this_word == "<br>") {
            var new_word_1 = new Word("", within_bold, within_italics, within_link, link_href, link_onclick, true);
            words.push(new_word_1);
            continue;
        }
        var new_word = new Word(this_word, within_bold, within_italics, within_link, link_href, link_onclick);
        words.push(new_word);
    }
    return words;
}
var games_string = "Various Games made by <br>me over the last few years in my spare time. All were made completely from scratch either in pure HTML5 with <a href='#' onclick='open_popover(0)'>javascript</a> and the canvas or in C++ and compiled to web assembly. All should run in the browser. Only a couple of them work with mobile devices.<br><br><b>Cave Escape (2019 - Present)</b><br> Avoid the monsters and try to escape the vast cave system. Collect as many coins as possible. Created in C++ and compiled to web-assembly using emscripten. Still a work in progress.<br> <a href='games/cave_escape.html'>Click</a> to play<br><br><b>Ocean Simulator (2018)</b><br> Play with fishes and fish-eating worms in this fun little sandbox. This is an implementation of boids written in javascript.<br> <a href='games/ocean_simulator.html'>Click</a> to play<br><br><b>Bounce (2018)</b><br> Sort of like 2D single-player pong? Keep the ball from escaping! Created in javascript - works on mobile.<br> <a href='games/bounce.html'>Click</a> to play<br><br><b>Zombie Run (2017)</b><br> A side scrolling run-and-shoot type game with randomly generated caves. See how far you can get! Created in javascript - works on mobile.<br> <a href='games/zombie_run.html'>Click</a> to play<br><br><b>Meteor Shower (2017)</b><br> Dodge falling blocks and collect health cubes as you try to survive for as long as possible. Created in javascript.<br> <a href='games/meteor_shower.html'>Click</a> to play<br><br><b>Endless Climb (2017)</b><br> Race against time as you jump upwards from block to block in this fun little concept game. Created in javascript.<br> <a href='games/endless_climb.html'>Click</a> to play<br><br>Check my <a href='https://github.com/harrybp'>github</a> for more stuff";
var other_string = "<b>Texture Generation using ML (2018)</b><br> Created as part of my final year project at uni, a demonstration of a few methods of synthesising unique textures using machine learning methods. <br> See the <a href='https://harrybp.github.io/texture_generation_demo/'>demo</a> or check it out on <a href='https://github.com/harrybp/TextureGeneration'>github</a><br><br><b>This website (2017 - Present)</b><br> A text-only interactive website built using javascript with support for a navbar, tabs, pop-ups, pop-overs and columns of text. Hint: try clicking the cat face in the nav bar! <br> Check it out on <a href='https://github.com/harrybp/asciiSite'>github</a>";
var info_string = "Hi I'm Harry!<br><br>This website serves as an archive for all of the web projects I have worked on over the years. The stuff on here is all for fun - I have been trying to learn game development so a lot of the projects are little games. Feel free to check them out and contact me with any feedback.";
var contact_string = "";
var page0_tab0_content = new Block(tokenize(games_string));
var page0_tab0 = new Tab("Games", "Game Projects", page0_tab0_content);
var page0_tab1_content = new Block(tokenize(other_string));
var page0_tab1 = new Tab("Other", "Other Projects", page0_tab1_content);
var page0_tabs = [page0_tab0, page0_tab1];
var page0 = new Page("Projects", "projects.html", page0_tabs);
var page1_tab0_content = new Block(tokenize(info_string));
var page1_tab0 = new Tab("Info", "Site Information", page1_tab0_content);
var page1_tab1_content = new Block(tokenize(contact_string));
var page1_tab1 = new Tab("Contact", "Contact Information", page1_tab1_content);
var page1_tabs = [page1_tab0, page1_tab1];
var page1 = new Page("About Me", "about.html", page1_tabs);
var page_names = ["Projects", "About Me"];
var links = ["projects.html", "about.html"];
var nav = new Navbar("harrycats", page_names, links);
var pages = [page0, page1];
var site = new Website(700, nav, pages);
var popover_string = "Projects<br>About Me";
var popover_content = new Block(tokenize(popover_string));
var popover = new Popover(0, popover_content);
var popovers = [popover];
function reload() {
    var new_html = site.render(popovers);
    document.body.innerHTML = new_html;
}
function switch_tab(tab_index) {
    pages[site.selected_page].selected_tab = tab_index;
    console.log("Selected tab: " + tab_index);
    reload();
}
function switch_page(page_index) {
    site.selected_page = page_index;
    console.log("Selected page: " + page_index);
    reload();
}
function open_popover(id_number) {
    console.log("Opening " + id_number);
    for (var i = 0; i < popovers.length; i++) {
        if (i == id_number) {
            popover.active = true;
        }
        else {
            popover.active = false;
        }
    }
    reload();
}
window.onresize = reload;
window.onload = reload;
