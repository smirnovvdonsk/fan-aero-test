<template>
  <span>
    {{correctedValue}}&nbsp;<slot></slot>
  </span>
</template>

<script>
function prepareNumber(value) {
  let cache = value;
  switch (typeof cache) {
    case 'string':
      cache = +(+cache.replace(',', '.')); // Число
      if (Number.isNaN(cache)) cache = 0;
      break;
    case 'number':
      break;
    default:
      cache = 0;
  }
  // Имеем число в любом случае
  return cache;
}

export default {
  props: {
    value: [Number, String],
    tofixed: {
      type: [Number, String],
      default: 2,
    },
  },
  methods: {
    toString(value) {
      return prepareNumber(value).toFixed(this.tofixed).toString().replace('.', ',');
    },
  },
  computed: {
    correctedValue() {
      return this.toString(this.value);
    },
  },
};
</script>

<style scoped lang="scss">
</style>
