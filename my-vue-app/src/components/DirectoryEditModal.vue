<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h2>Редактирование справочника</h2>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="name">Наименование</label>
          <input type="text" id="name" v-model="localDirectory.name" />
        </div>
        <div class="form-group">
          <label for="type">Тип</label>
          <select id="type" v-model="localDirectory.type">
            <option value="Пользовательский">Пользовательский</option>
            <option value="Технологический">Технологический</option>
            <option value="Защищенный">Защищенный</option>
          </select>
        </div>
        <div class="form-group">
          <label for="code">Код</label>
          <input type="text" id="code" v-model="localDirectory.code" />
        </div>
        <div class="form-group">
          <label for="startDate">Дата начала действия</label>
          <input type="date" id="startDate" v-model="localDirectory.startDateFormatted" />
        </div>
        <div class="form-group">
          <label for="endDate">Дата окончания действия</label>
          <input type="date" id="endDate" v-model="localDirectory.endDateFormatted" />
        </div>
        <button type="submit">Сохранить</button>
        <button type="button" @click="closeModal">Закрыть</button>
      </form>
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
      localDirectory: {}
    };
  },
  watch: {
    directory: {
      immediate: true,
      handler(newVal) {
        this.localDirectory = {
          ...newVal,
          startDateFormatted: newVal.startDate ? newVal.startDate.split('T')[0] : '',
          endDateFormatted: newVal.endDate ? newVal.endDate.split('T')[0] : ''
        };
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    save() {
      const updatedDirectory = {
        ...this.localDirectory,
        startDate: new Date(this.localDirectory.startDateFormatted).toISOString(),
        endDate: new Date(this.localDirectory.endDateFormatted).toISOString()
      };
      this.$emit('save', updatedDirectory);
      this.closeModal();
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
input, select {
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
