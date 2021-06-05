import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import App from '@/App'

const factory = (values = {}) => {
  return shallowMount(App, {
    data () {
      return {
        ...values
      }
    }
  })
}

describe('App.vue', () => {
  it('should render correct contents', () => {
    const wrapper = factory()
    expect(vm.$el.querySelector('v-toolbar__title').textContent)
    .toEqual('Stackables')
  })
})
