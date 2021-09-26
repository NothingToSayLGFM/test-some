<template>
  <div id="app" class="container">
    <input class="form-control" v-model="value" />
    <div v-if="users">
      <div
        class="d-flex justify-content-between"
        v-for="user in users"
        :key="user.id"
      >
        <p>{{ user.name }}</p>
        <button
          v-if="notSelected(user)"
          @click="selectHandler(user)"
          class="btn btn-primary"
        >
          Добавить
        </button>
        <button v-else @click="deleteHandler(user)" class="btn btn-danger">
          Удалить
        </button>
      </div>
    </div>
    <div v-if="failed"><p class="text-danger">Проверьте интернет</p></div>
    <Loader v-if="loading" />
    <button @click="toggle" class="btn btn-primary">
      {{ isSearch ? "Остановить поиск" : "Включить поиск" }}
    </button>
    <div v-if="selectedUsers.length">
      <p>Выбранные пользователи</p>
      <div class="mt-3">
        <p v-for="user in selectedUsers" :key="`s-${user.id}`">
          {{ user.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api";
import Loader from "./components/Loader.vue";

export default {
  name: "App",
  components: { Loader },
  data() {
    return {
      value: "",
      users: null,
      selectedUsers: [],
      isSearch: true,
      failed: false,
      loading: false,
    };
  },
  methods: {
    selectHandler(user) {
      if (this.selectedUsers.find((e) => e.name === user.name)) {
        return;
      }
      this.selectedUsers.push(this.users.find((e) => e.name === user.name));
    },
    deleteHandler(user) {
      this.selectedUsers = this.selectedUsers.filter(
        (el) => el.name !== user.name
      );
    },
    toggle() {
      this.isSearch = !this.isSearch;
    },
    notSelected(user) {
      if (this.selectedUsers.find((el) => el.name === user.name)) {
        return false;
      }
      return true;
    },
    async search() {
      this.loading = true;
      try {
        this.failed = false;
        this.users = [];
        const res = await api.getUser(this.value);
        this.users = [
          ...res.map((e, index) => {
            return {
              name: e.value,
              id: index,
            };
          }),
        ];
      } catch (e) {
        this.users = null;
        this.failed = true;
      }
      this.loading = false;
    },
  },
  watch: {
    async value() {
      if (this.value.length > 2 && this.isSearch) {
        await this.search();
      }
    },
    async isSearch() {
      if (this.isSearch) {
        await this.search();
      }
    },
  },
};
</script>

<style></style>
