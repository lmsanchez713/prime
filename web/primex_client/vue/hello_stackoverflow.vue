<template>
  <p>Hello</p>

  <p>{{ message }}</p>
</template>

<script>
module.exports = {
  data: {
    message: "hello",
  },
};
</script>

<style>
p {
  font-size: 14px;
}
</style>