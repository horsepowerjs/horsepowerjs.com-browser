/// <reference path="../../../../horsepower/lib/hp.d.ts"/>
class checklist extends hp.template {
  bind() {
    this.index = 0
    return {
      templateUrl: 'template.html',
      data: []
    }
  }
  addItem(value) {
    this.data.push({ id: this.index++, task: value })
  }
  removeItem(index) {
    let idx = this.data.findIndex(i => i.id === index)
    idx > -1 && this.data.splice(idx, 1)
  }
}
hp.observe('#checklist-app', checklist)

class input extends hp.text {
  created() {
    this.focus()
  }
  accepted(value) {
    this.broadcastTo(checklist, 'addItem', value)
    this.value('')
  }
}
hp.observe('input[type=text]', input)

class checkbox extends hp.checkbox {
  toggled(status) {
    this.closestElement('li', li => li.enableClass(status, 'completed'))
  }
}
hp.observe('input[type=checkbox]', checkbox)

class button extends hp.button {
  accepted(value) {
    this.findElements('li.completed', li => {
      li.broadcastTo(checklist, 'removeItem', li.getInt('data-id'))
    })
  }
}
hp.observe('input[type=button]', button)