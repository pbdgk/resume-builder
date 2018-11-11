'use strict'

class BaseRenderer {
  render() {
    this.rememberContainer();
    let url = `/static/app/js/${this.cName}.mst`;
    let pr = fetchData(url)
    for (let i=0; i<this.methods.length; i++){
      pr = pr.then(this.methods[i].bind(this))
    }
    pr.catch(e => {
      console.error(e);
    });
  }
  registerListeners() {
    const len = this.listeners.length;
    for (let i = 0; i < len; i++) {
      let listener = new this.listeners[i](this.container, this.cName);
      listener.listen();
    }
  }

  

  rememberContainer() {
    this.container = document.getElementById(`${this.cName}Target`);
  }
}

class SingleRenderer extends BaseRenderer {
  renderTemplate(template) {
    var rendered = Mustache.render(template, this.data);
    $(`#${this.cName}Target`).html(rendered);
  }
}

class MultipleRenderer extends BaseRenderer {
  renderTemplate(template) {
    var rendered = Mustache.render(template, { [this.cName]: this.data });
    $(`#${this.cName}Target`).html(rendered);
  }
}

class WithDatesRenderer extends MultipleRenderer {
  manageDateFields() {
    let selects = this.container.querySelectorAll(
      "select[data-date-part=year]"
    );
    for (let i = 0; i < selects.length; i++) {
      this.populateYearOptions(selects[i], 50);
    }
    this.setDates();
  }

  populateYearOptions(select, range) {
    let currentYear = new Date().getFullYear();
    for (let i = 0; i <= range; i++) {
      let opt = document.createElement("option");
      opt.value = currentYear - i;
      opt.innerHTML = currentYear - i;
      select.appendChild(opt);
    }
  }

  setDates() {
    let containers = this.container.querySelectorAll("section");
    let dateContainer, data, section;
    for (let i = 0; i < containers.length; i++) {
        dateContainer = containers[i],
        data = this.data[i];
        let dateObj = {
          start: this.parseDate(data.start),
          end: this.parseDate(data.end)
        };
        for (let datePrefix in dateObj){
          for (let datePart in dateObj[datePrefix]){
            this.setYearAndMonth(dateContainer, datePrefix, datePart, dateObj[datePrefix][datePart])
          }
        }
    }
  }

  setYearAndMonth(dateContainer, datePrefix, datePart, data) {
    let block, select;
    block = dateContainer.querySelector(`[data-prefix=${datePrefix}]`)
    select = block.querySelector(`[data-date-part=${datePart}]`)
    this.chooseSelect(select, data)
  }

  parseDate(date) {
    let year, month, d;
    if (date) {
      d = new Date(date);
      year = d.getFullYear();
      month = d.getMonth();
    } else {
      year = "YYYY";
      month = "MM";
    }
    return { year: year, month: month };
  }

  chooseSelect(select, value) {
    let opts = select.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value == value) {
        opts.selectedIndex = i;
        break;
      }
    }
  }
}

class WithRatingsRenderer extends MultipleRenderer {
  manageRatingFields() {
    let containers = document.getElementsByClassName("rating-stars");
    for (let i = 0; i < containers.length; i++) {
      this.setStar(containers[i], this.data[i].rating);
    }
  }

  setStar(container, rating) {
    let onStar = parseInt(rating, 10);
    let stars = container.querySelectorAll(".star");
    let i;
    for (i = 0; i < stars.length; i++) {
      stars[i].classList.remove("selected");
    }
    for (i = 0; i < onStar; i++) {
      stars[i].classList.add("selected");
    }
  }
}
