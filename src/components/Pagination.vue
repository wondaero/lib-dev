<script setup>
  import { reactive, computed } from 'vue'

  const props = defineProps(['totalCnt', 'fnc']);

  const totalCnt = computed(() => props.totalCnt);

  const state = reactive({
    pageGroup: 1,
    page: 1,
    pagePerGroup: 10,
    listPerPage: 10,
  });

  const getListByPage = (page) => {
    state.page = page;
    if(typeof props.fnc === 'function') props.fnc(page);
  }

  const movePageGroup = (num) => {
    state.pageGroup += num;
    getListByPage(((state.pageGroup - 1) * state.pagePerGroup) + 1);
  }

  const calcCurPage = num => num + ((state.pageGroup - 1) * state.pagePerGroup);

  const calcPagesInGroup = totalCnt => {
    const groupCnt = Math.ceil(Math.ceil(totalCnt / state.listPerPage) / state.pagePerGroup);

    if(state.pageGroup < groupCnt) return state.pagePerGroup;
    else return Math.ceil(totalCnt / state.listPerPage) % state.pagePerGroup || state.pagePerGroup;
  }

</script>
<template>
  <ul class="pagination">
    <li v-if="state.pageGroup > 1" @click="movePageGroup(-1)">이전</li>
    <li
      v-for="n in calcPagesInGroup(totalCnt)"
      :key="n"
      @click="getListByPage(calcCurPage(n))"
      :class="{active: (state.page == calcCurPage(n))}"
    >
      {{ calcCurPage(n) }}
    </li>
    <li v-if="state.pageGroup < Math.ceil(Math.ceil(totalCnt / state.listPerPage) / state.pagePerGroup)" @click="movePageGroup(1)">다음</li>
  </ul>
</template>

<style lang="scss" scoped>
  .pagination{
    list-style: none;
    margin: 0;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    
    li{
      border-radius: 5px;
      border: 1px solid #eee;
      padding: 5px;
      min-width: 30px;
      text-align: center;

      margin-right: 5px;

      cursor: pointer;

      &:last-child{margin-right: 0;}
      &.active, &:hover{
        background: var(--color-green);
        color: #fff;
        font-weight: bold;
      }

    }
  }
</style>
