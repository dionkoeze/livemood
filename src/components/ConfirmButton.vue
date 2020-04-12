<template>
  <div class="delete">
    <button class="btn warn" v-if="!clicked" v-on:click="firstClick">
      <slot></slot>
    </button>
    <button class="btn serious sure" v-else v-on:click="secondClick">sure?</button>
  </div>
</template>

<script>
export default {
  name: 'delete',
  data() {
    return {
      clicked: false,
    };
  },
  methods: {
    firstClick() {
      this.clicked = true;
      setTimeout(() => {
        this.clicked = false;
      }, 2000);
    },
    secondClick() {
      this.$emit('clicked');
      this.clicked = false;
    },
  },
};
</script>

<style scoped>
.warn {
  background-color: #EE964B;
}

.serious {
  background-color: #F95738;
}

</style>
