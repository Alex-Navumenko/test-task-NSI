<template>
  <div class="form-container">
    <h2>Реестр справочников</h2>
    <form @submit.prevent="search">
      <div class="form-group">
        <label for="type">Тип справочника</label>
        <select id="type" v-model="filters.type">
          <option value="">Выберите тип</option>
          <option value="Пользовательский">Пользовательский</option>
          <option value="Технологический">Технологический</option>
          <option value="Защищенный">Защищенный</option>
        </select>
      </div>
      <div class="form-group">
        <label for="name">Наименование справочника</label>
        <input type="text" id="name" v-model="filters.name" @input="autoCompleteName">
        <ul v-if="suggestions.name.length" class="suggestions">
          <li v-for="suggestion in suggestions.name" :key="suggestion" @click="selectNameSuggestion(suggestion)">
            {{ suggestion }}
          </li>
        </ul>
      </div>
      <div class="form-group">
        <label for="code">Код справочника</label>
        <input type="text" id="code" v-model="filters.code" @input="autoCompleteCode">
        <ul v-if="suggestions.code.length" class="suggestions">
          <li v-for="suggestion in suggestions.code" :key="suggestion" @click="selectCodeSuggestion(suggestion)">
            {{ suggestion }}
          </li>
        </ul>
      </div>
      <div class="form-actions">
        <button type="submit">Поиск</button>
        <button type="button" @click="clear">Очистить форму</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      filters: {
        type: '',
        name: '',
        code: ''
      },
      suggestions: {
        name: [],
        code: []
      }
    };
  },
  methods: {
    search() {
      this.$emit('search', this.filters);
    },
    clear() {
      this.filters = { type: '', name: '', code: '' };
      this.suggestions = { name: [], code: [] };
      this.$emit('clear');
    },
    autoCompleteName() {
      if (this.filters.name.length > 1) {
        axios.get('http://localhost:3000/api/directories', { params: { name: this.filters.name } })
          .then(response => {
            this.suggestions.name = response.data.map(item => item.name);
          });
      } else {
        this.suggestions.name = [];
      }
    },
    autoCompleteCode() {
      if (this.filters.code.length > 1) {
        axios.get('http://localhost:3000/api/directories', { params: { code: this.filters.code } })
          .then(response => {
            this.suggestions.code = response.data.map(item => item.code);
          });
      } else {
        this.suggestions.code = [];
      }
    },
    selectNameSuggestion(suggestion) {
      this.filters.name = suggestion;
      this.suggestions.name = [];
    },
    selectCodeSuggestion(suggestion) {
      this.filters.code = suggestion;
      this.suggestions.code = [];
    }
  }
}
</script>

<style>
.form-container {
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 10px;
  position: relative;
}
.form-group ul.suggestions {
  list-style-type: none;
  padding: 0;
  margin: 0;
  background-color: white;
  border: 1px solid #ddd;
  position: absolute;
  width: 100%;
  z-index: 1000;
}
.form-group ul.suggestions li {
  padding: 5px;
  cursor: pointer;
}
.form-group ul.suggestions li:hover {
  background-color: #ddd;
}
.form-actions {
  display: flex;
  justify-content: space-between;
}
</style>
