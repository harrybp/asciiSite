function build_website(data) {
    var pages = [];
    var page_names = [];
    var links = [];
    var popovers = [];
    for (var _i = 0, _a = data.pages; _i < _a.length; _i++) {
        var page = _a[_i];
        var tabs = [];
        for (var _b = 0, _c = page.tabs; _b < _c.length; _b++) {
            var tab = _c[_b];
            var tab_desc = new Block(tokenize(tab.description));
            var tab_content = new Block(tokenize(tab.contents));
            var new_tab = new Tab(tab.title, tab_desc, tab_content);
            tabs.push(new_tab);
        }
        var new_page_title = new Block(tokenize(page.title));
        var new_page = new Page(new_page_title, "", tabs);
        pages.push(new_page);
        page_names.push(page.title);
        links.push("");
    }
    for (var i = 0; i < data.pages.length; i++) {
        var longest_length = 0;
        var popover_string = "";
        for (var j = 0; j < data.pages.length; j++) {
            if (data.pages[j].title.length > longest_length) {
                longest_length = data.pages[j].title.length;
            }
            if (i == j) {
                popover_string += data.pages[j].title;
            }
            else {
                popover_string += "<a href='#' onclick='site.switch_page(" + j + ")'>";
                popover_string += data.pages[j].title;
                popover_string += "</a>";
            }
            if (j != data.pages.length - 1) {
                popover_string += "<br>";
            }
        }
        var popover_content = new Block(tokenize(popover_string));
        var new_popover = new Popover(i, popover_content, longest_length);
        popovers.push(new_popover);
    }
    var nav_light_title = new Block(tokenize(data.title_light));
    var nav_dark_title = new Block(tokenize(data.title_dark));
    var nav = new Navbar(nav_light_title, page_names, links, nav_dark_title);
    var site = new Website(700, nav, pages, popovers);
    return site;
}
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
        this.no_link_end = false;
        this.no_link_begin = false;
        this.no_space_end = false;
    }
    Word.prototype.length = function () {
        return this.text.length;
    };
    Word.prototype.render = function () {
        var value = this.text;
        if (this.bold) {
            value = "<b>" + value + "</b>";
        }
        if (this.italic) {
            value = "<i>" + value + "</i>";
        }
        if (this.linked) {
            var new_value = "";
            if (!this.no_link_begin) {
                new_value += "<a ";
                if (this.link_href.length > 0) {
                    new_value += "href='" + this.link_href + "' ";
                }
                if (this.link_onclick.length > 0) {
                    new_value += "onclick='" + this.link_onclick + "' ";
                }
                new_value += ">";
            }
            new_value += value;
            if (!this.no_link_end) {
                new_value += "</a>";
            }
            value = new_value;
        }
        return value;
    };
    return Word;
}());
var Space = (function () {
    function Space(space_length, space_value) {
        if (space_value === void 0) { space_value = " "; }
        this.space_length = space_length;
        this.space_value = space_value;
    }
    Space.prototype.length = function () {
        return this.space_length;
    };
    Space.prototype.render = function () {
        if (this.space_length < 0)
            console.log("Space of length: " + this.space_length);
        return Array(this.space_length + 1).join(this.space_value);
    };
    return Space;
}());
function get_token_array_length(tokens) {
    var total_length = 0;
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        total_length += token.length();
    }
    return total_length;
}
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
var Block = (function () {
    function Block(text) {
        this.contents = text;
    }
    Block.prototype.wrap = function (width) {
        if (width < 0) {
            width = 999999;
        }
        var lines = [];
        var line_lengths = [];
        var current_line = [];
        var current_line_length = 0;
        var too_long = true;
        while (too_long) {
            too_long = false;
            var new_contents = [];
            for (var _i = 0, _a = this.contents; _i < _a.length; _i++) {
                var word = _a[_i];
                if (word.length() <= width) {
                    new_contents.push(word);
                }
                else {
                    var half_way = Math.floor(word.length() / 2);
                    var first_half = new Word(word.text.substr(0, half_way), word.bold, word.italic, word.linked, word.link_href, word.link_onclick);
                    var second_half = new Word(word.text.substr(half_way, word.length()), word.bold, word.italic, word.linked, word.link_href, word.link_onclick);
                    first_half.no_space_end = true;
                    second_half.no_space_end = word.no_space_end;
                    new_contents.push(first_half);
                    new_contents.push(second_half);
                    too_long = true;
                }
            }
            if (too_long) {
                this.contents = new_contents;
            }
        }
        for (var _b = 0, _c = this.contents; _b < _c.length; _b++) {
            var word = _c[_b];
            if ((width < 0) || (!word.new_line && (word.text.length + current_line_length < width))) {
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
        var rendered_lines = [];
        var current_line;
        for (var i = 0; i < data.lines.length; i++) {
            var line = data.lines[i];
            current_line = [];
            for (var j = 0; j < line.length; j++) {
                var word = line[j];
                word.no_link_end = false;
                word.no_link_begin = false;
                current_line.push(word);
                if ((word != line[line.length - 1]) && (!word.no_space_end)) {
                    current_line.push(new Space(1));
                }
            }
            if (width > 0) {
                current_line.push(new Space(width - data.lengths[i] - 1));
            }
            rendered_lines.push(current_line);
        }
        var previous_link;
        var previous_link_valid = false;
        var previous_link_index = 0;
        for (var i = 0; i < rendered_lines.length; i++) {
            previous_link_valid = false;
            for (var j = 0; j < rendered_lines[i].length; j++) {
                if (rendered_lines[i][j] instanceof Word) {
                    var this_word = rendered_lines[i][j];
                    if (this_word.linked) {
                        if (previous_link_valid && (previous_link.link_href == this_word.link_href) &&
                            (previous_link.link_onclick == this_word.link_onclick)) {
                            previous_link.no_link_end = true;
                            this_word.no_link_begin = true;
                        }
                        previous_link = this_word;
                        previous_link_valid = true;
                        previous_link_index = j;
                    }
                    else {
                        previous_link_valid = false;
                    }
                }
            }
        }
        return rendered_lines;
    };
    return Block;
}());
var Popover = (function () {
    function Popover(id_number, content, width) {
        this.id_number = id_number;
        this.content = content;
        this.active = false;
        this.width = width + 1;
    }
    Popover.prototype.render = function (page_contents, width) {
        if (this.active) {
            var new_lines = [];
            var indexes = this.get_trigger_index(page_contents);
            var line_index = indexes[0];
            var token_index = indexes[1];
            var pre_trigger_length = indexes[2];
            var trigger = page_contents[line_index][token_index];
            var trigger_length = trigger.length();
            var relative_left_offset = Math.floor((this.width + 4 - page_contents[line_index][token_index].length()) / 2);
            var left_offset = get_token_array_length(page_contents[line_index].slice(0, token_index)) - relative_left_offset;
            var right_offset = left_offset + this.width + 3;
            if (left_offset < 1) {
                var difference = 1 - left_offset;
                left_offset += difference;
                right_offset += difference;
            }
            if (right_offset > (width - 1)) {
                var difference = right_offset - (width - 1);
                right_offset -= difference;
                left_offset -= difference;
            }
            var popover_rendered = [];
            var popover_top = [];
            popover_top.push(new Space(pre_trigger_length - 1 - left_offset - 1, "_"));
            popover_top.push(new Word("[" + trigger.text + "]", trigger.bold, trigger.italic, trigger.linked, trigger.link_href, "site.close_popover(" + this.id_number + ")"));
            popover_top.push(new Space(right_offset - pre_trigger_length - trigger_length - 2, "_"));
            popover_rendered.push(popover_top);
            popover_rendered = popover_rendered.concat(this.content.render(this.width));
            var popover_bottom = [];
            popover_bottom.push(new Space(this.width + 1, "&#175;"));
            popover_rendered.push(popover_bottom);
            for (var i = 0; i < popover_rendered.length; i++) {
                var stage = 0;
                var index = line_index + i;
                var this_line = page_contents[index];
                var new_line = [];
                var j_1 = 0;
                while (j_1 < this_line.length) {
                    var token = this_line[j_1];
                    var line_so_far = this_line.slice(0, j_1);
                    switch (stage) {
                        case 0:
                            var result_0 = this.stage_0(token, line_so_far, left_offset);
                            stage = result_0.next_stage;
                            new_line = new_line.concat(result_0.output);
                            if (stage == 0) {
                                j_1++;
                            }
                            break;
                        case 1:
                            var result_1 = this.stage_1(token, line_so_far, left_offset, popover_rendered[i], (i == popover_rendered.length - 1) || (i == 0));
                            stage = result_1.next_stage;
                            new_line = new_line.concat(result_1.output);
                            if (stage == 1) {
                                j_1++;
                            }
                            break;
                        case 2:
                            var result_2 = this.stage_2(token, line_so_far, right_offset);
                            stage = result_2.next_stage;
                            new_line = new_line.concat(result_2.output);
                            j_1++;
                            break;
                        case 3:
                            new_line.push(token);
                            j_1++;
                            break;
                    }
                }
                new_lines.push(new_line);
            }
            for (var j = 0; j < new_lines.length; j++) {
                var index = j + line_index;
                page_contents[index] = new_lines[j];
            }
        }
        return page_contents;
    };
    Popover.prototype.stage_0 = function (token_in, line, left_offset) {
        var token_out;
        var new_stage;
        var line_length = get_token_array_length(line);
        var token_length = token_in.length();
        var still_space = (line_length + token_length) < left_offset;
        if (still_space) {
            token_out = token_in;
            new_stage = 0;
        }
        else {
            token_out = new Space(0);
            new_stage = 1;
        }
        return { output: [token_out], next_stage: new_stage };
    };
    Popover.prototype.stage_1 = function (token_in, line, left_index, popover_content, no_border) {
        var tokens_out = [];
        var line_length = get_token_array_length(line);
        var token_length = token_in.length();
        var difference = line_length + token_length - left_index;
        var new_token_length = token_length - difference;
        if (token_in instanceof Space) {
            var old_space = token_in;
            var trimmed_space = new Space(new_token_length, token_in.space_value);
            tokens_out.push(trimmed_space);
        }
        else {
            var old_word = token_in;
            var trimmed_word = new Word(old_word.text.substr(0, new_token_length), old_word.bold, old_word.italic, old_word.linked, old_word.link_href, old_word.link_onclick);
            tokens_out.push(trimmed_word);
        }
        if (!no_border) {
            tokens_out.push(new Word("|"));
        }
        tokens_out.push(new Space(1));
        tokens_out = tokens_out.concat(popover_content);
        tokens_out.push(new Space(1));
        if (!no_border) {
            tokens_out.push(new Word("|"));
        }
        return { output: tokens_out, next_stage: 2 };
    };
    Popover.prototype.stage_2 = function (token_in, line, right_index) {
        var token_out;
        var next_stage;
        var line_length = get_token_array_length(line);
        var token_length = token_in.length();
        if (line_length + token_length > right_index) {
            var new_token_length = line_length + token_length - right_index;
            if (token_in instanceof Space) {
                var old_space = token_in;
                var trimmed_space = new Space(new_token_length, token_in.space_value);
                token_out = trimmed_space;
            }
            else {
                var old_word = token_in;
                var trimmed_word = new Word(old_word.text.substr(token_length - new_token_length, token_length), old_word.bold, old_word.italic, old_word.linked, old_word.link_href, old_word.link_onclick);
                token_out = trimmed_word;
            }
            next_stage = 3;
        }
        else {
            token_out = new Space(0);
            next_stage = 2;
        }
        return { output: [token_out], next_stage: next_stage };
    };
    Popover.prototype.get_trigger_index = function (page_contents) {
        var line_index;
        var token_index;
        var pre_length;
        for (var i = 0; i < page_contents.length; i++) {
            var line = page_contents[i];
            for (var j = 0; j < line.length; j++) {
                var token = line[j];
                if ((token instanceof Word) && token.linked &&
                    (token.link_onclick.indexOf("open_popover(" + this.id_number + ")") >= 0)) {
                    line_index = i;
                    token_index = j;
                    pre_length = get_token_array_length(line.slice(0, j));
                }
            }
        }
        return [line_index, token_index, pre_length];
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
        var rendered = this.render_description(width, left_padding, right_padding);
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var rendered_line = [];
            rendered_line.push(new Space(left_padding));
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(1));
            rendered_line = rendered_line.concat(line);
            rendered_line.push(new Space(1));
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(right_padding));
            rendered.push(rendered_line);
        }
        return rendered;
    };
    Tab.prototype.render_description = function (width, left_padding, right_padding) {
        var rendered_line = [];
        var rendered = [];
        var rendered_desc = this.description.render(width - 5);
        for (var i = 0; i < rendered_desc.length; i++) {
            var desc = rendered_desc[i];
            rendered_line = [];
            rendered_line.push(new Space(left_padding));
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(2));
            if (i == 0) {
                rendered_line.push(new Word(">"));
            }
            else {
                rendered_line.push(new Space(1));
            }
            rendered_line.push(new Space(1));
            rendered_line = rendered_line.concat(desc);
            rendered_line.push(new Word("|"));
            rendered_line.push(new Space(right_padding));
            rendered.push(rendered_line);
        }
        rendered_line = [];
        rendered_line.push(new Space(left_padding));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(width - 2));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(right_padding));
        rendered.push(rendered_line);
        return rendered;
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
        var rendered = [];
        var rendered_line = [];
        rendered_line.push(new Space(page_width));
        rendered.push(rendered_line);
        rendered = rendered.concat(this.render_title(page_width, left_padding, content_width));
        rendered = rendered.concat(this.render_tab_selector(page_width, left_padding, content_width));
        rendered = rendered.concat(this.tabs[this.selected_tab].render(content_width, left_padding, right_padding));
        rendered = rendered.concat(this.render_bottom(left_padding, content_width, right_padding));
        return rendered;
    };
    Page.prototype.render_bottom = function (left_padding, content_width, right_padding) {
        var rendered = [];
        var rendered_line = [];
        rendered_line.push(new Space(left_padding));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(content_width - 2));
        rendered_line.push(new Word("|"));
        rendered_line.push(new Space(right_padding));
        rendered.push(rendered_line);
        rendered_line = [];
        rendered_line.push(new Space(left_padding + 1));
        rendered_line.push(new Space(content_width - 2, "&#175;"));
        rendered_line.push(new Space(right_padding + 2));
        rendered.push(rendered_line);
        return rendered;
    };
    Page.prototype.render_title = function (width, left_padding, content_width) {
        var rendered_lines = [];
        var rendered_title = this.title.render(content_width - 1);
        for (var _i = 0, rendered_title_1 = rendered_title; _i < rendered_title_1.length; _i++) {
            var line = rendered_title_1[_i];
            var rendered_line = [];
            rendered_line.push(new Space(left_padding + 2));
            rendered_line = rendered_line.concat(line);
            rendered_line.push(new Space(width - left_padding - content_width));
            rendered_lines.push(rendered_line);
        }
        return rendered_lines;
    };
    Page.prototype.render_tab_selector = function (width, left_padding, content_width) {
        var rendered = [];
        var line_1 = [];
        var line_2 = [];
        var line_3 = [];
        line_1.push(new Space(left_padding + 3));
        line_2.push(new Space(left_padding + 2));
        line_2.push(new Word("|"));
        line_3.push(new Space(left_padding));
        line_3.push(new Word("|"));
        line_3.push(new Space(1, "&#175;"));
        var index = 0;
        for (var _i = 0, _a = this.tabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            line_1.push(new Space(tab.title.length + 2, "_"));
            line_1.push(new Space(1));
            if (index == this.selected_tab) {
                line_2.push(new Space(1));
                line_2.push(new Word(tab.title));
                line_2.push(new Space(1));
                line_2.push(new Word("|"));
                line_3.push(new Space(tab.title.length + 3));
            }
            else {
                line_2.push(new Space(1));
                line_2.push(new Word(tab.title, false, false, true, "#", "site.switch_tab(" + index + ")"));
                line_2.push(new Space(1));
                line_2.push(new Word("|"));
                line_3.push(new Space(tab.title.length + 3, "&#175;"));
            }
            index++;
        }
        line_1.push(new Space(width - get_token_array_length(line_1)));
        line_2.push(new Space(width - get_token_array_length(line_2)));
        line_3.push(new Space(content_width + left_padding - get_token_array_length(line_3) - 1, "&#175;"));
        line_3.push(new Word("|"));
        line_3.push(new Space(width - get_token_array_length(line_3)));
        rendered.push(line_1);
        if (this.tabs.length > 0) {
            rendered.push(line_2);
        }
        rendered.push(line_3);
        return rendered;
    };
    return Page;
}());
var Navbar = (function () {
    function Navbar(brand, page_names, page_links, dark_brand) {
        if (dark_brand === void 0) { dark_brand = brand; }
        this.brand = brand;
        this.dark_brand = dark_brand;
        this.page_names = page_names;
        this.page_links = page_links;
    }
    Navbar.prototype.render = function (width, left_padding, selected_page, dark_mode) {
        this.update_dimensions(width, left_padding, dark_mode);
        var rendered = [];
        var rendered_line = [];
        rendered_line.push(new Space(width));
        rendered.push(rendered_line);
        if (width < this.mobile_cutoff) {
            rendered.push(this.render_mobile_line(selected_page, dark_mode));
        }
        else {
            rendered.push(this.render_desktop_line(selected_page, dark_mode));
        }
        rendered_line = [];
        rendered_line.push(new Space(width, "_"));
        rendered.push(rendered_line);
        return rendered;
    };
    Navbar.prototype.render_desktop_line = function (selected_page, dark_mode) {
        var brand = (dark_mode) ? this.dark_brand.render(-1)[0] : this.brand.render(-1)[0];
        var rendered_line = [];
        rendered_line.push(new Space(this.start_brand_index - 1));
        rendered_line = rendered_line.concat(brand);
        rendered_line.push(new Space(this.initial_spacing - 1));
        for (var i = 0; i < this.page_names.length; i++) {
            if (i == selected_page) {
                rendered_line.push(new Word("["));
                rendered_line.push(new Word(this.page_names[i]));
                rendered_line.push(new Word("]"));
            }
            else {
                rendered_line.push(new Space(1));
                rendered_line.push(new Word(this.page_names[i], false, false, true, "#", "site.switch_page(" + i + ")"));
                rendered_line.push(new Space(1));
            }
            if (i != (this.page_names.length - 1)) {
                rendered_line.push(new Space(this.spacing - 1));
            }
            else {
                rendered_line.push(new Space(this.right_spacing));
            }
        }
        return rendered_line;
    };
    Navbar.prototype.render_mobile_line = function (selected_page, dark_mode) {
        var brand = (dark_mode) ? this.dark_brand.render(-1)[0] : this.brand.render(-1)[0];
        var rendered_line = [];
        rendered_line.push(new Space(this.start_brand_index - 1));
        rendered_line = rendered_line.concat(brand);
        rendered_line.push(new Space(this.mobile_spacing - 1));
        rendered_line.push(new Word("["));
        rendered_line.push(new Word("X", false, false, true, "#", "site.open_popover(" + selected_page + ")"));
        rendered_line.push(new Word("]"));
        rendered_line.push(new Space(this.right_spacing));
        return rendered_line;
    };
    Navbar.prototype.update_dimensions = function (page_width, left_padding, dark_mode) {
        var link_length = this.page_names.reduce(function (x, y) { return x + y; }).length + 4;
        var brand = (dark_mode) ? this.dark_brand.render(-1)[0] : this.brand.render(-1)[0];
        var brand_length = get_token_array_length(brand);
        this.start_brand_index = left_padding + 3;
        var side_padding = this.start_brand_index * 2;
        this.initial_spacing = Math.floor((page_width - side_padding - link_length) * 0.6);
        this.spacing = Math.floor((page_width - side_padding - link_length - brand_length - this.initial_spacing) / (this.page_names.length - 1));
        this.mobile_cutoff = link_length + brand_length + (2 * this.start_brand_index) + this.initial_spacing + this.page_names.length;
        this.right_spacing = page_width - this.start_brand_index - brand_length - this.initial_spacing - link_length - ((this.page_names.length - 1) * this.spacing) + 3;
        this.mobile_spacing = page_width - (2 * this.start_brand_index) - brand_length;
    };
    return Navbar;
}());
var Website = (function () {
    function Website(content_width, navbar, pages, popovers) {
        this.navbar = navbar;
        this.target_content_pixel_width = content_width;
        this.selected_page = 0;
        this.pages = pages;
        this.popovers = popovers;
        this.dark_mode = false;
        this.light_style = { background_colour: "#e3e3e3", text_colour: "black", link_colour: "blue" };
        this.dark_style = { background_colour: "#171717", text_colour: "#a6a6a6", link_colour: "#9c0000" };
    }
    Website.prototype.get_page_style = function () {
        return this.dark_mode ? this.dark_style : this.light_style;
    };
    Website.prototype.render = function () {
        this.update_dimensions();
        var rendered = this.navbar.render(this.page_width, this.left_padding, this.selected_page, this.dark_mode);
        rendered = rendered.concat(this.pages[this.selected_page].render(this.page_width, this.content_width, this.left_padding, this.right_padding));
        for (var _i = 0, _a = this.popovers; _i < _a.length; _i++) {
            var popover = _a[_i];
            rendered = popover.render(rendered, this.page_width);
        }
        var html = "";
        for (var _b = 0, rendered_1 = rendered; _b < rendered_1.length; _b++) {
            var line = rendered_1[_b];
            for (var _c = 0, line_1 = line; _c < line_1.length; _c++) {
                var token = line_1[_c];
                html += token.render();
            }
            html += "\n";
        }
        return html;
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
    Website.prototype.reload = function () {
        var new_html = this.render();
        document.body.innerHTML = new_html;
        this.reload_style();
    };
    Website.prototype.reload_style = function () {
        var page_style = this.get_page_style();
        document.body.style.backgroundColor = page_style.background_colour;
        document.body.style.color = page_style.text_colour;
        var page_links = document.getElementsByTagName("a");
        for (var i = 0; i < page_links.length; i++) {
            if (page_links[i].href) {
                page_links[i].style.color = page_style.link_colour;
            }
        }
    };
    Website.prototype.switch_tab = function (tab_index) {
        this.pages[this.selected_page].selected_tab = tab_index;
        console.log("Selected tab: " + tab_index);
        this.reload();
    };
    Website.prototype.switch_page = function (page_index) {
        for (var i = 0; i < this.popovers.length; i++) {
            this.popovers[i].active = false;
        }
        this.selected_page = page_index;
        console.log("Selected page: " + page_index);
        this.reload();
    };
    Website.prototype.open_popover = function (id_number) {
        console.log("Opening " + id_number);
        for (var i = 0; i < this.popovers.length; i++) {
            if (i == id_number) {
                this.popovers[i].active = true;
            }
        }
        this.reload();
    };
    Website.prototype.close_popover = function (id_number) {
        for (var i = 0; i < this.popovers.length; i++) {
            if (i == id_number) {
                this.popovers[i].active = false;
            }
        }
        this.reload();
    };
    Website.prototype.toggle_dark_mode = function () {
        this.dark_mode = !this.dark_mode;
        this.reload();
    };
    return Website;
}());
