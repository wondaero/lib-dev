<script setup>
  import { reactive } from 'vue';
  import commonJS from '../../assets/common';
  import axios from 'axios';

  import Pagination from '../../components/Pagination.vue'

  const state = reactive({
    bookList: [],
    totalCnt: 0,
    searchOpt: {
      keyword: '',
      bookSts: '',
      page: 1,
      listPerPage: 10
    },
  });

  const return1 = (seq, bookCde, userCde) => {
    if(!confirm('해당도서를 반납하시겠습니까?')) return;

    if(seq === undefined ||  bookCde === undefined || userCde === undefined){ //필터
      alert('[bl001] 반납을 진행할 수 없습니다.\n관리자에게 문의해주세요.');
      return;
    }
    
    axios.post(`http://localhost:3000/return1`, {
      books: [{
        seq,
        book_cde: bookCde,
        user_cde: userCde
      }]
    }).then((res) => {
      alert('반납되었습니다.');
      getBookList();
    }).catch((err) => {
      console.log(err);
      alert('[bl002] 관리자에게 문의해주세요.');
    });
  }

  const changeRtnDt = (seq) => {
    if(!confirm('반납기간을 변경하시겠습니까?')) return;

    const book = state.bookList.filter(x => x.seq === seq)[0];

    axios.post(`http://localhost:3000/changeRtnDt`, {
        seq,
        rtnDt: book.org_return_dt
      }).then((res) => {
        alert('반납기간이 변경되었습니다.');
        getBookList();
      }).catch((err) => {
        console.log(err);
        alert('[bl003] 관리자에게 문의해주세요.');
      });
  }


  const getBookList = () => {
    axios.post("http://localhost:3000/getBookList", state.searchOpt).then((res) => {
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

  getBookList();

  const getBookListByPage = (page) => {
    state.searchOpt.page = page;
    getBookList();
  }

</script>
<template>
  <article class="book-list-page">
    <h1>도서 목록</h1>
    <div class="white-box search-case">
      <div class="grid">
        <div class="row">
          <label class="col">
            <span class="title">검색어</span>
            <input type="text" placeholder="도서명, 저자, 출판사, 도서코드" v-model="state.searchOpt.keyword" @keyup.enter="getBookList"/>
          </label>
        </div>
        <div class="row">
          <div class="title col">도서상태</div>
          <div class="col">
            <label class="radio-custom">
              <input type="radio" name="bookSts" value="" v-model="state.searchOpt.bookSts" checked/>
              <strong>전체</strong>
            </label>
            <label class="radio-custom">
              <input type="radio" name="bookSts" value="2" v-model="state.searchOpt.bookSts" />
              <strong>대여중</strong>
            </label>
            <label class="radio-custom">
              <input type="radio" name="bookSts" value="4" v-model="state.searchOpt.bookSts" />
              <strong>보류</strong>
            </label>
          </div>
        </div>
        <div class="row btns">
          <button class="btn-form btn-search" @click="getBookList">검색</button>
        </div>
      </div>
    </div>
    <div class="white-box list-wrapper">
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
      <Pagination :fnc="getBookListByPage" :totalCnt="state.totalCnt"></Pagination>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.book-list-page{
  display: flex;
  flex-direction: column;

  .btn-extend{ background: var(--color-orange); color: #fff;}
  .btn-search{ background: var(--color-green); color: #fff;}
  .btn-return{ background: var(--color-red); color: #fff;}

  h1{font-size: 20px; margin-bottom: 10px;}
  .search-case{
    margin-bottom: 10px;
    .row{
      margin-bottom: 10px;

      &:last-child{margin-bottom: 0;}
      &.btns{justify-content: flex-end;}

      .title{width: 100px;}


      .col{align-items: center;}
      input[type="text"]{width: 200px; height: 32px;}

      .radio-custom{
        display: flex;
        align-items: center;
        margin-right: 10px;
        input{width: 20px; height: 20px; margin-right: 5px;}

        &:last-child{margin-right: 0;}
      }
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
