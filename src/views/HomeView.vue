<template>
  <DistanceCalculator />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import DistanceCalculator from '../components/DistanceCalculator.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    DistanceCalculator,
  },
});
</script>
