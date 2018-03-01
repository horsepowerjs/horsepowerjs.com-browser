namespace hpweb {
  class gettingStartedTab extends hp.element {
    public clicked() {
      this.rootScope.active = this
      this.addClass('active')
    }

    public onScopeActive() {
      this.removeClass('active')
    }
  }

  class gettingStartedItem extends hp.element {
    public onScopeActive(val) {
      this.addClass('hidden')
      if (this.isTarget(val.getAttribute('data-target'))) {
        this.removeClass('hidden')
      }
    }
  }

  class copyToClipBoard extends hp.link {
    clicked() {
      let target = this.getAttribute('data-target')
      this.find(target, item => {
        let range = document.createRange()
        let selection = window.getSelection()
        range.selectNodeContents(item.element)
        selection.removeAllRanges()
        selection.addRange(range)
        let success = document.execCommand('copy')
        selection.removeAllRanges()
      })
    }
  }

  hp.observe('ul.getting-started > li', gettingStartedTab)
  hp.observe('.getting-started-items > .item', gettingStartedItem)
  hp.observe('.copy', copyToClipBoard)
}