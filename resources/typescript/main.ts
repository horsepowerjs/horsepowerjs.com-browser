class navburger extends hp.element {
  clicked() {
    this.siblingElement('.pure-navbar--menu', item =>
      item.enableClass(!item.hasClass('pure-navbar--menu_is-active'), 'pure-navbar--menu_is-active'))
  }
}

class beautify extends hp.element {
  public created() {
    if (this.hasClass('language-javascript'))
      this.text = js_beautify(this.text, { indent_size: 2 })
    else if (this.hasClass('language-html'))
      this.text = html_beautify(this.text, { indent_size: 2, indent_inner_html: true })
    else if (this.hasClass('language-css'))
      this.text = css_beautify(this.text, { indent_size: 2 })

    Prism.highlightElement(this.element)
  }
}

hp.observe('.pure-navbar--burger', navburger)
hp.observe('code.language-javascript, code.language-html, code.language-css', beautify)