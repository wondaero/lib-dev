<script setup>
  import { reactive } from 'vue';
  import commonJS from '../assets/common';
  import axios from 'axios';

  import Pagination from '../components/Pagination.vue'

  const state = reactive({
    noticeList: [],
    totalCnt: 0,
    searchOpt: {
      keyword: '',
      bookSts: '',
      page: 1,
      listPerPage: 10
    },
  });

  const getNoticeList = () => {
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

</script>
<template>
  <article class="notice-list-page">
    <header>
      <h1>공지사항</h1>
      <RouterLink to="/notice1" class="btn-form btn-green">글쓰기</RouterLink>
    </header>
    <div class="header-line"></div>
    <div class="white-box search-case">
      <div class="grid">
        <div class="row">
          <label class="col mg-r10">
            <span class="title">검색어</span>
            <input type="text" placeholder="제목, 내용" v-model="state.searchOpt.keyword" @keyup.enter="getBookList"/>
          </label>
          <button class="btn-form btn-green" @click="getBookList">검색</button>
        </div>
      </div>
    </div>
    <div class="list-wrapper">
      <header>
        <div class="btns"></div>
        <div>총 <strong>{{ state.totalCnt }}</strong>건</div>

      </header>
      <ul class="list">
        <li v-for="(book, idx) in state.bookList" :key="idx" :class="{hold: book.book_sts === '4'}">
          <RouterLink :to="`/admin/book1/${book.book_cde}`">
            <div class="top">
              <div class="left">
                <strong class="book-cde">[{{ book.book_cde }}]</strong>
                <span class="book-title txt-overflow1">{{ book.title }}</span>
              </div>
              <div class="right" v-if="book.book_sts === '2'">
                <strong :class="book.stsClass">{{ book.sts }}</strong> <strong>({{ book.name }})</strong>
              </div>
            </div>
            <div class="bottom">
              <div class="left txt-overflow1">
                <span>{{ book.author }}</span> {{book.author && book.pub ? '|' : ''}} <span>{{ book.pub }}</span>
              </div>
              <div class="right" v-if="book.book_sts === '2'">
                <strong>{{ book.reg_dt }} ~</strong>
              </div>
              <div class="right" v-else>
                <strong class="class-no">[{{ book.class_no }}]</strong> <strong>{{ book.class_cde }}</strong>
              </div>
            </div>
          </RouterLink>
          <div class="option" v-if="book.book_sts === '2'">
            <input type="date" v-model="book.org_return_dt" />
            <button class="btn-form btn-extend" @click="changeRtnDt(book.seq)">기간 변경</button>
            <button class="btn-form btn-return" @click="return1(book.seq, book.book_cde, book.user_cde)">반납</button>
            
          </div>
        </li>
      </ul>
      <Pagination :fnc="getNoticeListByPage" :totalCnt="state.totalCnt"></Pagination>
    </div>
  </article>
</template>

<style lang="scss" scoped>


.notice-list-page{
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

  .btn-green{ background: var(--color-green); color: #fff; margin-left: 5px;}
  .btn-red{ background: var(--color-red); color: #fff; margin-left: 5px;}
  .btn-orange{ background: var(--color-orange); color: #fff; margin-left: 5px;}

  .search-case{
    margin-bottom: 10px;

    .row{
      margin-bottom: 10px;

      &:last-child{margin-bottom: 0;}

      .title{width: 100px;}

      .col{align-items: center;}
      input[type="text"]{width: 200px; height: 32px;}
    }
  }

  .list-wrapper{
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    height: 10px;

    header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .list{
      flex: 1 0 auto;
      height: 10px; //임시
      overflow-y: auto;

      list-style: none;
      margin: 0;
      padding: 10px;

      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;

      margin-bottom: 10px;

      li{
        background: #fafbfc;
        border-radius: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        margin-bottom: 10px;
        transition: color .5s;
        box-shadow: 0 3px 5px rgba(0, 0, 0, .2);

        &.hold{background: #ddd;}

        &:last-child{
          margin-bottom: 0;
        }

        &:hover{
          background: var(--color-green);
          a{
            color: #fff;
            background: 0;

            .bottom{
              .class-no{
                color: darkviolet;
              }
            }
          }
        }

        a{
          display: block;
          text-decoration: none;
          color: #000;
          
          .top{
            display: flex;
            align-items: center;
            justify-content: space-between;
  
            .left{
              flex: 1;
              display: flex;
              width: 10px;
              white-space: nowrap;
              overflow: hidden;
              .book-cde{margin-right: 5px;}
              .book-title{flex: 1;}
            }

            .right{
              margin-left: 5px;

              .ing{
                color: #dad;
                background: #fff;
              }
              .overing{
                color: var(--color-red);
                background: #fff;
              }
            }
          }
  
          .bottom{
            display: flex;
            align-items: center;
            justify-content: space-between;
  
            .left{
              flex: 1;
              margin-right: 5px;
              width: 10px;
            }
            .class-no{
              color: #42c7d5;
            }
          }
  
        }
        .option{
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #eee;

          *{margin-right: 5px;}
          & *:last-child{margin-right: 0;}
        }
      }
    }

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
      }
    }

  }
}


  

</style>
