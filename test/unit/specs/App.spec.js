import { Vuetify } from 'vuetify'
import { createLocalVue, mount } from '@vue/test-utils'
import App from '@/App'

describe('App.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountFunction = options => {
    return mount(App, {
      localVue,
      vuetify,
      ...options
    })
  }

  it('should render correct contents', () => {
    const wrapper = mountFunction({
      copyright: 'Mathew Moose © ' + new Date().getFullYear(),
      drawer: false,
      dialog: false,
      items: [],
      names: ['Collection', 'Group', 'Assemblage', 'Assortment', 'Compilation', 'Lot', 'Selection', 'Set', 'Accumulation', 'Stack', 'Kit', 'Hoard', 'Heap', 'Grathering', 'Cluster', 'Clump', 'Batch'],
      options: {
        borderRadius: 100
      },
      active: null,
      colors: 'black',
      fullHeight: document.documentElement.height,
      fullWidth: document.documentElement.width
    })
    expect(wrapper.vm.$el.querySelector('v-toolbar__title').textContent).toEqual('Stackables')
  })
})
