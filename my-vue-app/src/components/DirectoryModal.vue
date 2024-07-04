<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h2>Паспорт справочника</h2>
      <form>
        <div class="form-group">
          <label for="name">Наименование</label>
          <input type="text" id="name" v-model="localDirectory.name" disabled />
        </div>
        <div class="form-group">
          <label for="type">Тип</label>
          <input type="text" id="type" v-model="localDirectory.type" disabled />
        </div>
        <div class="form-group">
          <label for="code">Код</label>
          <input type="text" id="code" v-model="localDirectory.code" disabled />
        </div>
        <div class="form-group">
          <label for="startDate">Дата начала действия</label>
          <input type="text" id="startDate" v-model="formattedStartDate" disabled />
        </div>
        <div class="form-group">
          <label for="endDate">Дата окончания действия</label>
          <input type="text" id="endDate" v-model="formattedEndDate" disabled />
        </div>
      </form>
      <button @click="closeModal">Закрыть</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    directory: Object
  },
  data() {
    return {
      localDirectory: {},
      formattedStartDate: '',
      formattedEndDate: ''
    };
  },
  watch: {
    directory: {
      immediate: true,
      handler(newVal) {
        this.localDirectory = { ...newVal };
        this.formattedStartDate = newVal.startDate ? this.formatDate(newVal.startDate) : '';
        this.formattedEndDate = newVal.endDate ? this.formatDate(newVal.endDate) : '';
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
}
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
.form-group {
  margin-bottom: 10px;
}
label {
  display: block;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}
button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background: #34495e;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #2c3e50;
}
</style>
