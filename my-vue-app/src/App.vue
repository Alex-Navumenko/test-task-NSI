<template>
  <div id="app">
    <header class="header">
      <h1>Реестр НСИ</h1>
    </header>
    <main>
      <DirectoryForm @search="fetchDirectories" @clear="clearForm" />
      <div class="table-container">
        <button @click="toggleSettings" class="action-button setting-table-btn">Настройки таблицы</button>
        <DirectoryTable
          :directories="paginatedDirectories"
          :columns="displayColumns"
          @selected-directories="updateSelectedDirectories"
          @view-directory="viewDirectory"
          @edit-directory="editDirectory"
        />
      </div>
      <DirectoryPagination
        :totalItems="directories.length"
        :itemsPerPage="itemsPerPage"
        @page-changed="changePage"
        @items-per-page-changed="updateItemsPerPage"
      />
      <TableSettings 
        :show="showSettings" 
        :columns="columnLabels" 
        :selected="selectedColumns"
        @close="toggleSettings"
        @apply="applySettings"
      />
      <DirectoryModal :show="showModal" :directory="selectedDirectory" @close="closeModal" />
      <DirectoryEditModal :show="showEditModal" :directory="selectedDirectory" @close="closeEditModal" @save="saveDirectory" />
    </main>
  </div>
</template>

<script>
import DirectoryForm from './components/DirectoryForm.vue';
import DirectoryTable from './components/DirectoryTable.vue';
import TableSettings from './components/TableSettings.vue';
import DirectoryPagination from './components/DirectoryPagination.vue';
import DirectoryModal from './components/DirectoryModal.vue';
import DirectoryEditModal from './components/DirectoryEditModal.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    DirectoryForm,
    DirectoryTable,
    TableSettings,
    DirectoryPagination,
    DirectoryModal,
    DirectoryEditModal,
  },
  data() {
    return {
      directories: [],
      showSettings: false,
      selectedColumns: ['code', 'type', 'name', 'startDate', 'endDate'],
      columnLabels: {
        code: 'Код справочника',
        type: 'Тип справочника',
        name: 'Наименование справочника',
        startDate: 'Дата начала действия',
        endDate: 'Дата окончания действия'
      },
      currentPage: 1,
      itemsPerPage: 4,
      sortAsc: true,
      selectedDirectories: [],
      showModal: false,
      showEditModal: false,
      selectedDirectory: {}
    };
  },
  computed: {
    displayColumns() {
      return this.selectedColumns;
    },
    paginatedDirectories() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.directories.slice(start, end);
    }
  },
  methods: {
    async fetchDirectories(filters) {
      try {
        const response = await axios.get('http://localhost:3000/api/directories', { params: filters });
        this.directories = response.data;
        this.changePage(1); // Reset to first page on new search
      } catch (error) {
        console.error('Error fetching directories:', error);
      }
    },
    clearForm() {
      this.directories = [];
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    applySettings(columns) {
      this.selectedColumns = columns;
    },
    changePage(page) {
      this.currentPage = page;
    },
    updateItemsPerPage(newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.changePage(1);
    },
    updateSelectedDirectories(selectedDirectories) {
      this.selectedDirectories = selectedDirectories;
    },
    viewDirectory(directory) {
      this.selectedDirectory = directory;
      this.showModal = true;
    },
    editDirectory(directory) {
      this.selectedDirectory = directory;
      this.showEditModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedDirectory = {};
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedDirectory = {};
    },
    async saveDirectory(updatedDirectory) {
      try {
        await axios.put(`http://localhost:3000/api/directories/${updatedDirectory._id}`, updatedDirectory);
        this.fetchDirectories();
      } catch (error) {
        console.error('Error saving directory:', error);
      }
    },
  }
}
</script>

<style>
.header {
  background-color: #2c3e50;
  padding: 20px;
  color: white;
  text-align: center;
}
main {
  padding: 20px;
}
.action-button {
  background-color: #34495e;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
}
.action-button:hover {
  background-color: #2c3e50;
}

.setting-table-btn {
  position: absolute;
  top: 0;
  right:0;
}
</style>
