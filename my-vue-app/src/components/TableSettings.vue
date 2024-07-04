<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>Настройки таблицы</h2>
      <form>
        <div v-for="(label, key) in columns" :key="key" class="form-group">
          <label>
            <input type="checkbox" v-model="selectedColumns" :value="key">
            {{ label }}
          </label>
        </div>
      </form>
      <button @click="applySettings">Применить</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    columns: Object,
    selected: Array
  },
  data() {
    return {
      selectedColumns: []
    };
  },
  mounted() {
    this.selectedColumns = [...this.selected];
  },
  methods: {
    close() {
      this.$emit('close');
    },
    applySettings() {
      this.$emit('apply', this.selectedColumns);
      this.close();
    }
  }
}
</script>

<style>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
