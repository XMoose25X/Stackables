<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer v-model="drawer" hide-overlay clipped temporary app :stateless="dialog">
      <v-list dense>
        <draggable v-model="items">
          <v-list-group v-for="(group, index) in items" v-bind:key="index" lazy no-action v-model="group.active">
            <v-list-tile slot="activator">
              <v-list-tile-action>
                <v-icon :color="group.color">group_work</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{group.name}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="dialog=true; colors=group.color; active=group" ripple>
              <v-list-tile-title>Change Color</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>color_lens</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile @click="add(group.id)" ripple>
              <v-list-tile-title>Add Item</v-list-tile-title>
                <v-list-tile-action>
                  <v-icon color="green">add</v-icon>
                </v-list-tile-action>
              </v-list-tile>                
              <v-list-group no-action sub-group>
                <v-list-tile slot="activator">
                  <v-list-tile-title>Items</v-list-tile-title>
                </v-list-tile>
                <draggable v-model="group.list">
                  <v-list-tile v-for="(object, index2) in group.list" :key="object.id">
                    <v-list-tile-title v-text="object.value"></v-list-tile-title>
                    <v-list-tile-action>
                      <v-icon @click="removeItemFromGroup(index, index2)">remove</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </draggable>
              </v-list-group>
              <v-list-tile @click="removeGroup(group.id)" ripple>
                <v-list-tile-title>Delete Group</v-list-tile-title>
                <v-list-tile-action>
                  <v-icon color="red">remove_circle_outline</v-icon>
                </v-list-tile-action>
              </v-list-tile>
          </v-list-group>
        </draggable>
        <v-list-tile @click="addGroup()" ripple>
          <v-list-tile-title>Add Group</v-list-tile-title>
          <v-list-tile-action>
            <v-icon color="green">add_circle_outline</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-dialog v-model="dialog" max-width="500px">
      <v-card dark>
        <v-card-title>
          Color Picker
        </v-card-title>
        <v-card-text>
          <color-picker v-model="colors" style="width: 100%"  @input='updateGroup'></color-picker>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click="dialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left height="56">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <a href="#" class="d-flex">
        <img :src="require('@/assets/Stackables(Gradiant Cleaned).svg')" width="50px" height="50px"/>
      </a>
      <v-toolbar-title class="hidden-xs-only">Stackables</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn icon slot="activator">
          <v-icon>import_export</v-icon>
        </v-btn>
        <span>Import/Export</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn icon slot="activator">
          <v-icon>settings</v-icon>
        </v-btn>
        <span>Settings</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn icon slot="activator">
          <v-icon>info</v-icon>
        </v-btn>
        <span>About</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn icon slot="activator" href="https://github.com/XMoose25X/Stackables" target="_blank">
          <v-icon>code</v-icon>
        </v-btn>
        <span>Source</span>
      </v-tooltip>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <div class="object-container" id="print" :style="cssProps" ref="canvas">
          <div v-for="(row) in this.lists" :key="row.length" style="white-space: nowrap">
            <transition-group name="list-complete" tag="div" :key="'t'+row.length">
              <span v-for="(item) in row" :key="item.id" class="list-complete-item" :style="getStyle(item.id)">{{ item.value }}</span>
            </transition-group>
          </div>
        </div>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>Mathew Moose &copy; 2018</span>
    </v-footer>
    <v-btn absolute dark fab bottom right color="pink" :style="moveForBottomNavStyle" @click="printStackables()">
      <v-icon>print</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
export default {
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    if (localStorage.items) {
      this.items = JSON.parse(localStorage.items)
    } else {
      this.items = [ new Group(1, false, 'Cool Blues', '#82b1ff', [new Object(1.1, 'S'), new Object(1.2, 'T'), new Object(1.3, 'A')]),
        new Group(2, false, 'Hot Reds', '#ff80ab', [new Object(2.1, 'C'), new Object(2.2, 'K'), new Object(2.3, 'A')]),
        new Group(3, false, 'Leafy Greens', '#b9f6ca', [new Object(3.1, 'B'), new Object(3.2, 'L'), new Object(3.3, 'E'), new Object(3.4, 'S')]) ]
    }
  },
  data: () => ({
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
  }),
  props: {
    source: String
  },
  watch: {
    items: {
      handler () {
        localStorage.items = JSON.stringify(this.items)
      },
      deep: true
    }
  },
  computed: {
    moveForBottomNavStyle () {
        return "bottom: 38px"
    },
    styles: function (i) {
      return {
        'color': this.VBColorToHEX(i)
      }
    },
    totalItems: function () {
      var total = 0
      this.items.forEach(function (group) {
        total += group.list.length
      })
      return total
    },
    triangularNumber: function () {
      return Math.ceil((Math.sqrt(8 * (this.totalItems) + 1) - 1) / 2)
    },
    totalSize: function () {
      return (this.triangularNumber * (this.triangularNumber + 1) / 2)
    },
    lists: function () {
      var results = []
      /* Add in Empty Objects when the number is not entirely triangular */
      for (var i = 0; i < this.totalSize - this.totalItems; i++) {
        /* Make the id a negative number to be able to identify later */
        results.push(new Object(-(i + 1), ''))
      }
      this.items.forEach(function (group) {
        group.list.forEach(function (item) {
          results.push(item)
        })
      })
      var correct = [[]]
      for (var j = 1; j <= this.triangularNumber; j++) {
        correct[j - 1] = results.splice(0, j)
      }
      return correct
    },
    size: function () {
      return (Math.min(this.fullHeight, this.fullWidth) / this.triangularNumber) + 'px'
    },
    cssProps: function () {
      return {
        'height': '100%',
        'width': '100%',
        '--object-size': this.size
      }
    }
  },
  methods: {
    printStackables: function () {
      window.print()
    },
    handleResize (event) {
      var area = this.$refs.canvas
      this.fullHeight = area.clientHeight
      this.fullWidth = area.clientWidth
    },
    updateGroup: function (color) {
      this.active.color = color.hex
    },
    randomInt: function (max) {
      return Math.floor(Math.random() * (max + 1))
    },
    add: function (id) {
      this.items[this.getIndexOfGroup(id)].list.push(new Object(this.generateItemId(id), 'new'))
    },
    generateItemId: function (id) {
      var index = this.getIndexOfGroup(id)
      for (var i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
        if (this.items[index].list.filter(element => element.id === parseFloat(id.toString() + '.' + i)).length === 0) {
          return parseFloat(id.toString() + '.' + i)
        }
      }
    },
    generateGroupId: function () {
      for (var i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
        if (this.getIndexOfGroup(i) === -1) {
          return i
        }
      }
    },
    removeGroup: function (id) {
      var index = this.getIndexOfGroup(id)
      this.items[index].list.splice(0)
      this.items.splice(index, 1)
    },
    removeItemFromGroup: function (groupId, objectId){
      this.items[groupId].list.splice(objectId, 1)
    },
    addGroup: function () {
      this.items.push(new Group(this.generateGroupId(), false, this.names[this.randomInt(this.names.length)], this.random_rgba(), []))
    },
    shuffle: function (id) {
      var index = this.getIndexOfGroup(id)
      for (let i = this.items[index].list.length - 1; i > 0; i--) {
        let randomIndex = this.randomInt(this.items[index].list.length - 1)

        let temp = this.items[index].list[i]
        this.$set(this.items[index].list, i, this.items[index].list[randomIndex])
        this.$set(this.items[index].list, randomIndex, temp)
      }
    },
    getIndexOfGroup: function (id) {
      return this.items.findIndex(group => group.id == id)
    },
    getGroupIdFromItemId: function (itemId) {
      return parseInt((itemId.toString()).substring(0, (itemId.toString()).indexOf('.')))
    },
    getStyle: function (id) {
      if (id < '0') {
        return {
          backgroundColor: 'transparent',
          border: '1px dotted gray'
        }
      } else {
        var yes = this.items[this.getIndexOfGroup(this.getGroupIdFromItemId(id))].color
        return {
          color: '#4a4a4a',
          backgroundColor: yes,
          border: '1px solid #4a4a4a'
        }
      }
    },
    random_rgba: function () {
      var o = Math.round, r = Math.random, s = 255
      return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')'
    },
    getHeight: function () {
      return 'max-height:' + (100 / this.triangularNumber) + '%'
    }
  }
}
class Group {
  constructor (id, active, name, color, list) {
    this.id = id
    this.active = active
    this.name = name
    this.color = color
    this.list = list
    this.editing = false
  }
  remove (index) {
    this.list.splice(index, 1)
  }
}
class Object {
  constructor (id, value) {
    this.id = id
    this.value = value
  }
}
</script>
<style scoped>
.object-container{
  text-align: center;
}
.list-complete-item {
  transition: all 1s, width 0s, height 0s;
  display: inline-flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  width: var(--object-size);
  height: var(--object-size);
  border-radius: 50%;
  overflow: hidden;
  text-align: center;
  -webkit-print-color-adjust: exact !important;
}
.list-complete-item:empty:before {
  /* When Text is Not Present, Add An Empty Character in Order to Preserve Spacing */
  content: "\0000a0";
}
.list-complete-enter {
  opacity: 0;
  transform: translate(30px);
}
.list-complete-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.list-complete-leave-active {
  position: absolute;
}
.list-complete-move {
  margin: auto;
}
/* @media print {
  * {
    visibility: hidden;
  }
  #print, #print * {
    visibility: visible;
  }
} */
</style>
