<template>
  <div class="pagination-container">
    <div class="pagination-controls">
      <label for="itemsPerPage">Элементов на странице:</label>
      <select v-model="localItemsPerPage" @change="updateItemsPerPage">
        <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <ul class="pagination">
      <li :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)"><a href="#">Предыдущая</a></li>
      <li v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }" @click="changePage(page)"><a href="#">{{ page }}</a></li>
      <li :class="{ disabled: currentPage === totalPages }" @click="changePage(currentPage + 1)"><a href="#">Следующая</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1,
      localItemsPerPage: this.itemsPerPage,
      perPageOptions: [4, 8, 12, 16]
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.localItemsPerPage);
    }
  },
  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.$emit('page-changed', page);
      }
    },
    updateItemsPerPage() {
      this.$emit('items-per-page-changed', this.localItemsPerPage);
      this.changePage(1);
    }
  }
}
</script>

<style>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-controls {
  display: flex;
  align-items: center;
}
.pagination-controls label {
  min-width: 180px;
  margin-right: 10px;
}
.pagination {
  list-style: none;
  display: flex;
  gap: 5px;
}
.pagination li {
  padding: 5px 10px;
  cursor: pointer;
}
.pagination li.disabled {
  pointer-events: none;
  color: #ccc;
}
.pagination li.active {
  font-weight: bold;
}
</style>
