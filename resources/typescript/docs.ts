namespace hpweb {
  class navListLink extends hp.link {
    public clicked() {
      // Toggle the activity on the parent li item
      this.parentElement(item => {
        item.toggleClass('pure-nav--active')
        item.findChildElements('.pure-nav--active', item => item.removeClass('pure-nav--active'))
      })

      // unbold all links
      this.broadcastTo(navListLink, 'unbold')
      // make the item and its upstream nav-group bold
      this.upstream('a.nav-group', item => {
        item.parentElement(parent => {
          if (parent.hasClass('pure-nav--active')) {
            item.addClass('selected')
          }
        })
      })
      if (this.hash.length > 0) {
        window.location.href = this.hash
      }
    }
    public unbold() {
      this.removeClass('selected')
    }
  }

  class doc extends hp.template {
    public bind() {
      return {
        template: '/templates/docs/messages',
        data: '/data/docs/messages'
      }
    }
  }

  class beautify extends hp.element {
    public created() {
      this.text = js_beautify(this.text, { indent_size: 2 })
      Prism.highlightElement(this.element)
    }
  }

  hp.observe('.pure-nav  a', navListLink)
  hp.observe('code.language-javascript', beautify)
  hp.observe('.doc', doc)
}
