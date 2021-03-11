<template>
  <div id="app">
    <VuetifyLayout/>
  </div>
</template>

<script>
  import VuetifyLayout from './components/VuetifyLayout.vue';

  export default {
    name: 'App',

    components: {VuetifyLayout}
  }
</script>

<style>
  html {
    overflow: auto !important;
  }
  * {
    padding: 0;
    margin: 0;
    border: 0;
  }
  ul li {
    list-style: none;
  }
</style>
