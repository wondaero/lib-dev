<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import commonJS from '../assets/common';
  import axios from 'axios';

  import Pagination from '../components/Pagination.vue'

  const state = reactive({
    board: '',
    editable: false
  });

  const getNoticeList = () => {
    return;
    axios.post("http://localhost:3000/getNoticeList", state.searchOpt).then((res) => {
      state.bookList = res.data.data;

      let elem;
      let orgRtnDt;
      let sts;
      let stsClass;

      state.bookList.forEach((el, idx) => {
        elem = state.bookList[idx];

        orgRtnDt = commonJS.setYYYYMMDD(el.org_return_dt);

        elem.org_return_dt = orgRtnDt;
        elem.reg_dt = commonJS.setYYYYMMDD(el.reg_dt);

        if(commonJS.setYYYYMMDD(new Date()) <= orgRtnDt) {
          sts = '대여중';
          stsClass = 'ing';
        }else{
          sts = '연체중';
          stsClass = 'overing';
        }

        elem.sts = sts;
        elem.stsClass = stsClass;
      })

      state.totalCnt = res.data.total;
    });
  }

  getNoticeList();

  const getNoticeListByPage = (page) => {
    state.searchOpt.page = page;
    getNoticeList();
  }
  const textEditor = ref(null);

  onMounted(() => {
    state.board = new commonJS.TextArea2({
      target: textEditor._value,
      editable: true
    });
  })


  const regBoard = () => {

    const fData = state.board.setFormData();
    fData.append('title', 'test');


    axios.post("http://localhost:3000/regBoard", fData).then((res) => {
      alert('게시물이 등록되었습니다.');
      state.board.files = [];
      state.board.setContent(res.data.content);
      state.board.setEditable();

      state.editable = false;
    });
  }

  const setEditMode = () => {

    state.editable = true;
    state.board.setEditable();
    state.board.createHeader();
  }

  const delBoard = () => {
    if(!confirm('게시물을 삭제하시겠습니까?')) return;

    axios.post("http://localhost:3000/delBoard", {
      boardId: '???'
    }).then((res) => {
      alert('게시물이 삭제되었습니다.');

      //목차쪽 라우터로
    });

  }



</script>
<template>
  <article class="notice1-page">
    <header>
      <h1>공지사항</h1>
    </header>
    <div class="header-line"></div>
    <div ref="textEditor"></div>
    <div class="btns">
      <RouterLink to="/noticeList" class="btn-form btn-navy">목록</RouterLink>
      <div v-if="state.board.editable && !state.editable">
        <button class="btn-form btn-green" @click="regBoard()">추가</button>
      </div>
      <div v-else>
        <div>
          <button class="btn-form btn-orange" v-if="!state.editable" @click="setEditMode()">수정</button>
          <button class="btn-form btn-green" v-else @click="regBoard()">수정</button>
        </div>
        <button class="btn-form btn-red" @click="delBoard()">삭제</button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>


.notice1-page{
  width: 100%;
  height: 100%;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  
  header{
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    
    h1{font-size: 20px; margin: 0;}
  }
  .header-line{
    height: 8px;
    background: linear-gradient(to right, var(--color-green), transparent);
    margin-bottom: 20px;
  }

  .btn-green{ background: var(--color-green); color: #fff;}
  .btn-red{ background: var(--color-red); color: #fff; margin-left: 5px;}
  .btn-orange{ background: var(--color-orange); color: #fff;}
  .btn-navy{ background: var(--color-navy); color: #fff; margin-right: 5px;}

  .btns{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;

    & > div{
      display: flex;
      align-items: center;
    }
  }

}



  

</style>
