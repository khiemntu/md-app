<template>
  <div id="app">
    <v-app id="inspire">
      <my-drawer :show="drawer" :enter="enterPressed" @selectFolderEvent="handleSelectFolder" @getFoldersEvent="handleGetFolders"/>
      
      <v-toolbar fixed app flat dark color="indigo darken-3">
        <v-toolbar-side-icon dark @click="handleDrawer"/>
        <v-flex xs2>
          <v-autocomplete
            :loading="loading"
            :items="folders"
            v-model="select"
            item-text="text"
            item-value="value"
            class="m-autocomplete"
            flat
            hide-no-data
            hide-details
            label="Select folder..."
            solo-inverted
            clearable
            dark
            @change="autocompleteChange"
          />
        </v-flex>
        <v-flex xs9>
          <v-btn :disabled="!!!select || selectedArray.length == 0" flat dark large depressed class="m-btn-move" @click.native="move()"><v-icon left>input</v-icon> Move to&nbsp;<span>{{select}}</span>&nbsp;folder</v-btn>
          <v-btn :disabled="selectedArray.length == 0" flat dark large depressed @click.native="clearSelected()"><v-icon left>refresh</v-icon> Clear selection</v-btn>
          <v-btn :disabled="selectedArray.length == 0"  flat dark large depressed @click.native="handleShowDialog()"><v-icon left>delete_sweep</v-icon> Delete {{selectedArray.length ? selectedArray.length : ''}} item{{selectedArray.length > 1 ? 's' : ''}}</v-btn>
        </v-flex>      
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <v-layout row wrap>
            <drag-select-container selector="item" class="layout row wrap" @change="handleDragChange">
              <template slot-scope="{ selectedItems }">
                <v-flex v-for="(item, key) in fileArray" :key="key" :class="[{'m-active': item.selected},'m-flex']" xs1 mr-4 mb-4>
                  <v-card :class="['item', 'm-card']" :data-item="item.name.split('.')[0]" flat @click.native="selectedImage(item)">
                    <v-img :src="item.base64"
                           class="m-img"
                           aspect-ratio="1"
                    > 
                      <v-icon v-if="item.selected" class="m-check-icon" color="white">check_circle</v-icon> 
                    </v-img>

                    <v-card-title class="m-img-name">
                      <div>
                        <span>{{item.name}}</span>
                      </div>
                      <div class="m-time">
                        <span>{{item.stat.ctime}}</span>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </template>
            </drag-select-container>
          </v-layout>
        </v-container>
      </v-content>
      <v-footer app inset class="m-footer">
        <v-pagination
          v-model="page"
          :length="pageLength"
          :total-visible="7"
          circle
          @click.native="selectedPage"
        />
        <v-card-text class="text-lg-right">
          <span class="indigo--text">R&D Team &copy; 2018</span>
        </v-card-text>
      </v-footer>
      <yes-no :show="showDialog" @clickEvent="handleClickDialog"/>
    </v-app>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MyDrawer from './MyDrawer';
import DragSelectContainer from 'vue-drag-select/src/DragSelect.vue';
import YesNo from './YesNo';
import _ from 'lodash';
export default {
  components: {
    MyDrawer,
    YesNo,
    DragSelectContainer
  },
  data() {
    return {
      drawer: true,
      folder: '', //selected folder
      page: 1,
      fileArray: [], // list image display
      itemPerPage: 50,
      pageLength: 1,
      totalFile: 0, // total images display
      selectedArray: [], // selected items
      // for autocomplete
      loading: false,
      items: [],
      search: null,
      select: null,
      folders: [],
      // for dialog
      showDialog: false,
      enterPressed: 0,
      // drag items
      dragItems: []
    };
  },
  computed: {
    ...mapState('label', ['files'])
  },
  watch: {
    dragItems(newValue, oldValue) {
      if (newValue != oldValue) {
        this.selectedArray = [];
        for (let i = 0; i < this.fileArray.length; i++) {
          this.fileArray[i].selected = false;
        }
        for (let i = 0; i < this.dragItems.length; i++) {
          const item = this.dragItems[i];
          const idx = _.findIndex(
            this.fileArray,
            o => o.name.split('.')[0] == item
          );
          if (idx > -1) {
            this.fileArray[idx].selected = true;
            this.selectedArray.push(this.fileArray[idx]);
          }
        }
      }
    },
    files(val) {
      this.fileArray = val.map(item => ({
        name: item.name,
        base64: item.base64,
        stat: item.stat,
        selected: false
      }));
    }
  },
  created() {
    window.addEventListener('keyup', event => {
      if (event.keyCode == 13) {
        this.enterPressed = new Date().getTime();
      }
    });
  },
  methods: {
    ...mapActions('label', [
      'getFolderList',
      'getFilesInFolder',
      'removeFiles',
      'moveFiles'
    ]),
    resetViewData(deleteArray) {
      // update total file and page length
      this.totalFile -= deleteArray.length;
      this.pageLength =
        parseInt(this.totalFile / this.itemPerPage) +
        (this.totalFile % this.itemPerPage ? 1 : 0);
      this.getFilesInFolder({
        folder: this.folder,
        page: this.page <= this.pageLength ? this.page : this.page - 1,
        itemPerPage: this.itemPerPage
      });
      this.selectedArray = [];
    },
    handleDrawer() {
      this.drawer = !this.drawer;
    },
    handleDragChange(val) {
      const array = val.map(o => o.$el.dataset.item);
      if (
        _.difference(array, this.dragItems).length ||
        _.difference(this.dragItems, array).length
      ) {
        this.dragItems = array;
      }
    },
    // click accept remove Files
    async handleClickDialog(val) {
      this.showDialog = false;
      if (val) {
        const deleteArray = this.selectedArray.map(item => item.name);
        try {
          await this.removeFiles({ files: deleteArray, folder: this.folder });
          this.$message.success('These files was deleted successful');
          // update total file and page length
          this.resetViewData(deleteArray);
        } catch (err) {
          this.$message.error('Opps!!! Something went wrong');
        }
      }
    },
    // show dialog ask remove files
    handleShowDialog() {
      this.showDialog = true;
    },
    handleGetFolders(data) {
      this.folders = data.map(item => ({
        value: item.name,
        text: item.name.toUpperCase()
      }));
      this.select = ''; //this.folders[0].value;
      this.selectedArray = [];
      for (let i = 0; i < this.fileArray.length; i++) {
        this.fileArray[i].selected = false;
      }
    },
    handleSelectFolder(data) {
      this.page = 1;
      this.getFilesInFolder({
        folder: data.folder,
        page: this.page,
        itemPerPage: this.itemPerPage
      });
      this.folder = data.folder;
      this.totalFile = data.totalFile;
      this.pageLength =
        parseInt(this.totalFile / this.itemPerPage) +
        (this.totalFile % this.itemPerPage ? 1 : 0);

      this.select = ''; //data.folder;
      this.selectedArray = [];
    },
    selectedPage() {
      this.getFilesInFolder({
        folder: this.folder,
        page: this.page,
        itemPerPage: this.itemPerPage
      });
    },
    clearSelected() {
      for (let i = 0; i < this.selectedArray.length; i++) {
        this.selectedArray[i].selected = false;
      }
      this.selectedArray = [];
    },
    selectedImage(item) {
      item.selected = !item.selected;
      if (item.selected) {
        this.selectedArray.push(item);
      } else {
        const idx = _.findIndex(this.selectedArray, o => o.name == item.name);
        this.selectedArray.splice(idx, 1);
      }
    },
    autocompleteChange() {},
    async move() {
      try {
        const moveArray = this.selectedArray.map(item => item.name);
        await this.moveFiles({
          from: this.folder,
          to: this.select,
          files: moveArray
        });
        this.$message.success(
          `These files was moved from ${this.folder} to ${
            this.select
          } successful`
        );
        // update total file and page length
        this.resetViewData(moveArray);
        this.getFolderList();
      } catch (err) {
        this.$message.error('Opps!!! Something went wrong');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Open Sans';
  src: url('~@/assets/fonts/OpenSans/OpenSans-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Teko';
  src: url('~@/assets/fonts/Teko/Teko-SemiBold.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.m-check-icon {
  margin: 6px;
  color: #fff;
}
.m-flex {
  outline: 1px solid #eeeeee;
}
.m-flex:not(.m-active):hover {
  outline: 3px solid #e0e0e0;
  cursor: pointer;
}
.m-flex.m-active:hover {
  outline: 3px solid #000000;
  cursor: pointer;
}
.m-card {
  border-radius: 0;
  div {
    border-radius: 0;
  }
}
.m-active {
  // outline: 5px solid #90caf9;
  outline: 3px solid #223344;
}
.m-footer {
  height: 60px !important;
}
.m-img-name {
  padding: 10px;
  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.m-time {
  font-size: 11px;
  font-weight: bold;
  color: gray;
}
.v-btn--large {
  padding: 0 15px;
}
</style>
