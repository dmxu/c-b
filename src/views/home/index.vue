<template>
  <div class="home">{{msg}}</div>
</template>
<style lang="scss" scoped>
.home {
  color: $cg;
}
</style>
<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
declare  var $: any;
@Component({})
export default class Home extends Vue {
    @Provide() private msg: any = 'hello';
    public mounted(): void {
        alert($);
    }
}
</script>


