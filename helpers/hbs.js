const moment = require("moment");

module.exports = {
  // Format idea string to be size we'd like for card prievew
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  }, // Regex to strip html tags
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, " ");
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  select: function(selected, options) {
    // This regex matches the current selected value and sets it in our edit form.
    return options
      .fn(this)
      .replace(new RegExp(' value="' + selected + '"'), '$&selected="selected"')
      .replace(
        new RegExp(">" + selected + "</option>"),
        'selected="selected"$&'
      );
  },
  editIcon: function(ideaUser, loggedUser, ideaId, floating = true) {
    if (ideaUser == loggedUser) {
      if (floating) {
        return `<a href="/ideas/edit/${ideaId}" class="btn-floating halfway-fab btn"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/ideas/edit/${ideaId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return "";
    }
  }
};
