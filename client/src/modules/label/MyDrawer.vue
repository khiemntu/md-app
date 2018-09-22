<template>
  <v-navigation-drawer
    id="m-drawer"
    v-model="drawer"
    fixed
    app
  >
    <v-toolbar color="indigo darken-2" flat dark>
      <v-flex class="text-lg-right">
        <v-btn v-if="!showInputFolder" flat @click.native="showInputFolder = true"><v-icon left>create_new_folder</v-icon>NEW FOLDER</v-btn>
        <v-text-field
          v-if="showInputFolder"
          v-model="newFolderName"
          class="m-text-field"
          label="Folder name..."
          append-icon="create_new_folder"
          append-outer-icon="visibility_off"
          single-line
          clearable
          color="blue lighten-2"
          @input="change()"
          @click:append-outer="() => { showInputFolder = false; newFolderName = '' }"
          @click:append="addFolderEvent"
        />
      </v-flex>
      <!-- <v-text-field
        v-model="searchText"
        label="Search folder..."
        append-icon="search"
        color="blue lighten-2"
        clearable
        single-line
      /> -->
    </v-toolbar>
    <vue-perfect-scrollbar :settings="scrollSettings" class="drawer-menu--scroll">
      <v-list subheader expand>
        <v-list-tile v-for="item in filteredItem" :key="item.name" :class="{'m-active': folderActive == item.name}" avatar
                     @click="selectFolder(item)">
          <v-list-tile-avatar size="35" class="m-avatar">
            <img v-if="item.avatar && item.name !='00Unknown'" :src="item.avatar">
            <img v-if="item.name =='00Unknown'" :src="require('assets/images/people.png')">
            <!-- <v-icon v-if="!item.avatar" class="m-folder-icon">folder</v-icon> -->
          </v-list-tile-avatar>
          <!-- <v-icon class="m-folder-icon">folder</v-icon> -->
          <v-list-tile-content>
            <v-list-tile-title class="m-name">{{item.name.toUpperCase()}}</v-list-tile-title>
            <!-- <v-list-tile-sub-title>{{ item.createdDate }}</v-list-tile-sub-title> -->
          </v-list-tile-content>
          <v-list-tile-action>
            <span class="grey--text m-total-file">{{item.totalFile.toLocaleString()}} Item{{parseInt(item.totalFile) > 1 ? 's' : ''}}</span>
          </v-list-tile-action>
          <v-btn flat icon><v-icon v-if="item.name != '00Unknown'" class="m-delete" dark @click.native="handleShowDialog()">delete_outline</v-icon></v-btn>
        </v-list-tile>
      </v-list>
    </vue-perfect-scrollbar>
    <yes-no :show="showDialog" :title="title" @clickEvent="handleClickDialog"/>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import YesNo from './YesNo';

export default {
  components: {
    VuePerfectScrollbar,
    YesNo
  },
  props: {
    enter: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deleteFolder: '',
      showInputFolder: false,
      newFolderName: '',
      title: 'folder',
      showDialog: false,
      drawer: false,
      searchText: '',
      folderActive: '',
      scrollSettings: {
        maxScrollbarLength: 160
      },
      page: 1,
      itemPerPage: 50
    };
  },
  computed: {
    ...mapGetters('label', ['folders']),
    filteredItem() {
      return this.folders.filter(
        item =>
          this.searchText
            ? item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >
              -1
            : this.folders
      );
    }
  },
  watch: {
    enter() {
      this.addFolderEvent();
    },
    show: {
      immediate: true,
      handler(value) {
        this.drawer = value;
      }
    }
  },
  created() {
    this.$parent.$on('enterPressedEvent', this.enterPressed);
    this.drawer = this.show;
    this.init();
  },
  methods: {
    ...mapActions('label', ['getFolderList', 'addFolder', 'removeFolder']),
    async addFolderEvent() {
      if (this.newFolderName) {
        try {
          await this.addFolder({ folder: this.newFolderName });
          this.$message.success('Your folder was created successful');
          this.newFolderName = '';
          await this.getFolderList();
          this.$emit('getFoldersEvent', this.folders);
        } catch (err) {
          this.$message.error('Folder is exists. Please select another name.');
        }
      }
    },
    async init() {
      await this.getFolderList();
      this.$emit('getFoldersEvent', this.folders);
      this.folderActive = this.folders[0].name;
      this.title = `${this.folderActive} folder`;
      this.$emit('selectFolderEvent', {
        // files: this.files,
        folder: this.folders[0].name,
        totalFile: this.folders[0].totalFile
      });
    },
    // delete folder
    async handleClickDialog(val) {
      this.showDialog = false;
      if (val) {
        try {
          await this.removeFolder({ folder: this.folderActive });
          this.$message.success('Folder was deleted successful');
          this.init();
        } catch (err) {
          this.$message.error('Opps!!! Something went wrong');
        }
      }
    },
    handleShowDialog() {
      this.showDialog = true;
    },
    async selectFolder(item) {
      this.folderActive = item.name;
      this.title = `${this.folderActive} folder`;
      this.$emit('selectFolderEvent', {
        // files: this.files,
        folder: item.name,
        totalFile: item.totalFile
      });
    },
    change() {
      this.newFolderName = this.newFolderName
        ? this.newFolderName.toUpperCase()
        : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.m-name {
  font-size: 15px;
}
.m-total-file {
  font-size: 13px;
}
.v-avatar {
  img {
    border-radius: 2px;
  }
}
.m-folder-icon {
  margin-right: 15px;
}
.m-delete {
  color: #757575 !important;
}
.m-active {
  background: #e0e0e0;
}
.drawer-menu--scroll {
  height: calc(100vh - 64px);
  overflow: auto;
}
</style>
