<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer v-model="drawer" clipped temporary app :stateless="dialog">
      <v-list dense>
        <!-- <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile> -->
        <v-list-group v-for="(group, index) in items" v-bind:key="index" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-action>
              <v-icon :color="group.color">group_work</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Group {{index + 1}}</v-list-tile-title>
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
            <v-list-tile v-for="(object) in group.list" :key="object.id">
              <v-list-tile-title v-text="object.value"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon @click="group.remove(object.id)">remove</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-list-tile @click="removeGroup(group.id)" ripple>
            <v-list-tile-title>Delete Group</v-list-tile-title>
            <v-list-tile-action>
              <v-icon color="red">remove_circle_outline</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <!-- <li style="text-align:left">
            <span :style="{color: group.color}">
              <font-awesome-icon :icon="['far', 'minus-square']" @click="removeGroup(group.id)" style="color:red"/>
              Group {{index + 1}}:
              <font-awesome-icon :icon="['far', 'random']" @click="shuffle(group.id)"/>
              <font-awesome-icon :icon="['far', 'pencil']" @click="group.editing = !group.editing"/>
              <input type="color" v-model="group.color"/>
            </span>
            <ul style="text-align:left;">
              <li v-for="(object, index2) in group.list" :key="object.id">
                  <span>
                    <font-awesome-icon :icon="['fas', 'minus']"  @click="group.remove(index2)" style="color:red"/>
                    <input v-if="group.editing" v-model="object.value"/>
                    <span v-else>{{object.value}}</span>
                  </span>
              </li>
            </ul>
          </li> -->
        </v-list-group>
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
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Stackables</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <!-- <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex shrink>
            <v-tooltip right>
              <v-btn
                slot="activator"
                :href="source"
                icon
                large
                target="_blank"
              >
              <v-icon large>code</v-icon>
              </v-btn>
              <span>Source</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn slot="activator" icon large href="https://codepen.io/johnjleider/pen/qxQWda" target="_blank">
                <v-icon large>mdi-codepen</v-icon>
              </v-btn>
              <span>Codepen</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-container> -->
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <div class="object-container">
            <div v-for="(row, index) in this.lists" :key="row.length">
              <transition-group name="list-complete" tag="div" :key="'t'+row.length">
                <span v-for="(item, index2) in row" :key="item.id" class="list-complete-item" :style="getStyle(item.id)">{{ item.value }}</span>
              </transition-group>
            </div>
          </div>
          <div>Total: {{totalItems}}</div>
          <div>Rows: {{triangularNumber}}</div>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>Mathew Moose &copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    dialog: false,
    items: [ new Group(1, '#82b1ff', [new Object(1.1, 'A'), new Object(1.2, 'B'), new Object(1.3, 'C')]),
      new Group(2, '#ff80ab', [new Object(2.1, 'D'), new Object(2.2, 'E'), new Object(2.3, 'F')]),
      new Group(3, '#b9f6ca', [new Object(3.1, 'G'), new Object(3.2, 'H'), new Object(3.3, 'I'), new Object(3.4, 'J'), new Object(3.5, 'K')]) ],
    options: {
      borderRadius: 100
    },
    active: null,
    colors: 'black'
  }),
  props: {
    source: String
  },
  computed: {
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
    }
  },
  methods: {
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
    addGroup: function () {
      this.items.push(new Group(this.generateGroupId(), 'gray', []))
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
    }
  }
}
class Group {
  constructor (id, color, list) {
    this.id = id
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
  transition: all 1s;
  display: inline-flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  width: 4em;
  height: 4em;
  border-radius: 50%;
  overflow: hidden;
  text-align: center;
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
</style>
