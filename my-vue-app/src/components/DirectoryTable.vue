<template>
  <div>
    <div class="selector">
      <button @click="toggleActionsMenu" class="action-button">Выбор Действий</button>
      <ul v-if="actionsMenuOpen" class="actions-menu">
        <li @click="viewDirectory" :class="{ disabled: selectedDirectories.length !== 1 }">Просмотреть справочник</li>
        <li @click="editDirectory" :class="{ disabled: selectedDirectories.length !== 1 }">Наполнение справочника</li>
      </ul>
    </div>
    <table>
      <thead>
        <tr>
          <th><input type="checkbox" @change="toggleAll($event)" /></th>
          <th v-for="column in columns" :key="column">{{ columnLabels[column] }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="directory in directories" :key="directory._id">
          <td><input type="checkbox" v-model="selectedDirectories" :value="directory._id" /></td>
          <td v-for="column in columns" :key="column">{{ formatValue(directory[column]) }}</td>
        </tr>
        <tr v-if="directories.length === 0">
          <td colspan="5">Нет доступных данных</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    directories: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      columnLabels: {
        code: 'Код справочника',
        type: 'Тип справочника',
        name: 'Наименование справочника',
        startDate: 'Дата начала действия',
        endDate: 'Дата окончания действия'
      },
      selectedDirectories: [],
      actionsMenuOpen: false
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (this.$el && !this.$el.contains(event.target)) {
        this.actionsMenuOpen = false;
      }
    },
    formatValue(value) {
      if (typeof value === 'string' && value.includes('T')) {
        return value.split('T')[0];
      }
      return value;
    },
    toggleAll(event) {
      if (event.target.checked) {
        this.selectedDirectories = this.directories.map(directory => directory._id);
      } else {
        this.selectedDirectories = [];
      }
    },
    toggleActionsMenu() {
      this.actionsMenuOpen = !this.actionsMenuOpen;
    },
    viewDirectory() {
      if (this.selectedDirectories.length === 1) {
        const selectedDirectory = this.directories.find(directory => directory._id === this.selectedDirectories[0]);
        this.$emit('view-directory', selectedDirectory);
        this.actionsMenuOpen = false;
      }
    },
    editDirectory() {
      if (this.selectedDirectories.length === 1) {
        const selectedDirectory = this.directories.find(directory => directory._id === this.selectedDirectories[0]);
        this.$emit('edit-directory', selectedDirectory);
        this.actionsMenuOpen = false;
      }
    }
  }
}
</script>

<style>
.table-container {
  margin-top: 20px;
  position: relative;
}
.actions-container {
  margin-bottom: 10px;
  position: relative;
}
.action-button {
  background-color: #34495e;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}
.action-button:hover {
  background-color: #2c3e50;
}
.actions-menu {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0;
  background-color: #ecf0f1;
  border: 1px solid #ddd;
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.actions-menu li {
  padding: 10px;
  cursor: pointer;
}
.actions-menu li.disabled {
  color: #ccc;
  pointer-events: none;
}
.actions-menu li:hover:not(.disabled) {
  background-color: #bdc3c7;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
th {
  background-color: #34495e;
  color: white;
}

.selector {
  position: relative;
  display: inline-block;
}
</style>
