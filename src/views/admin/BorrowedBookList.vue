<script setup>
  import { reactive } from 'vue';
  import axios from 'axios';
  import commonJS from '../../assets/common';
  import Pagination from '../../components/Pagination.vue'

  const state = reactive({
    bookList: [],
    totalCnt: 0,
    searchOpt: {
      keyword: '',
      lentSts: '',
      page: 1,
      listPerPage: 10
    },
  });

  const getBorrowedBookList = () => {

    axios.get(`http://localhost:3000/getBorrowedBookList?${commonJS.objToURLParam(state.searchOpt)}`).then((res) => {
      const { data } = res;
      state.bookList = data.list;
      state.totalCnt = data.listCnt;

      let elem;
      let rtnDt;
      let orgRtnDt;
      let sts;
      let stsClass;

      state.bookList.forEach((el, idx) => {
        elem = state.bookList[idx];

        rtnDt = commonJS.setYYYYMMDD(el.return_dt);
        orgRtnDt = commonJS.setYYYYMMDD(el.org_return_dt);

        elem.return_dt = rtnDt;
        elem.org_return_dt = orgRtnDt;
        elem.reg_dt = commonJS.setYYYYMMDD(el.reg_dt);

        if(el.return_dt){
          if(rtnDt <= orgRtnDt){
            sts = '반납';
            stsClass = 'ed';
          }else{
            sts = '연체반납';
            stsClass = 'overed';
          }
        }else{
          if(commonJS.setYYYYMMDD(new Date()) <= orgRtnDt) {
            sts = '대여중';
            stsClass = 'ing';
          }else{
            sts = '연체중';
            stsClass = 'overing';
          }
        }

        elem.sts = sts;
        elem.stsClass = stsClass;
      })
    });
  }

  getBorrowedBookList();

  const getBorrowedBookListByPage = (page) => {
    state.searchOpt.page = page;
    getBorrowedBookList();
  }

  const return1 = (seq, bookCde, userCde) => {
    if(!confirm('해당도서를 반납하시겠습니까?')) return;

    if(seq === undefined ||  bookCde === undefined || userCde === undefined){ //필터
      alert('[bbl001] 반납을 진행할 수 없습니다.\n관리자에게 문의해주세요.');
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
      getBorrowedBookList();
    }).catch((err) => {
      console.log(err);
      alert('[bbl002] 관리자에게 문의해주세요.');
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
        getBorrowedBookList();
      }).catch((err) => {
        console.log(err);
        alert('[rtn003] 관리자에게 문의해주세요.');
      });
  }
</script>
<template>
  <article class="lent-book-list-page">
    <h1>대여 목록</h1>
    <div class="white-box search-case">
      <div class="grid">
        <div class="row">
          <label class="col">
            <span class="title">검색어</span>
            <input type="text" class="" v-model="state.searchOpt.keyword" @keyup.enter="getBorrowedBookList" placeholder="도서명, 저자, 출판사, 도서코드" />
          </label>
        </div>
        <div class="row">
          <div class="title col">대여상태</div>
          <div class="col">
            <label class="radio-custom">
              <input type="radio" name="bookStatus" value="" v-model="state.searchOpt.lentSts" checked/>
              <strong>전체</strong>
            </label>
            <label class="radio-custom">
              <input type="radio" name="bookStatus" value="ing" v-model="state.searchOpt.lentSts" />
              <strong>대여중</strong>
            </label>
            <label class="radio-custom">
              <input type="radio" name="bookStatus" value="over" v-model="state.searchOpt.lentSts" />
              <strong>연체중</strong>
            </label>
          </div>
        </div>
        <!-- <div class="row">
          <label class="col">
            <span class="title">기간</span>
            <input type="date" class=""/>
            ~
            <input type="date" class=""/>
          </label>
        </div> -->
        <div class="row btns">
          <button class="btn-form btn-search" @click="getBorrowedBookList" >검색</button>
        </div>
      </div>
    </div>
    <div class="white-box list-wrapper">
      <header>
        <div>
          총 <strong>{{ state.totalCnt }}</strong>건
        </div>
        <div class="btns">
        </div>

      </header>
      <ul class="list">
        <li v-for="item in state.bookList" :key="item.seq">
          <div class="top">
            <div class="left">
              <strong class="book-cde">[{{ item.book_cde }}]</strong>
              <span class="book-title txt-overflow1">{{item.title}}</span>
            </div>
            <div class="right">
              <strong :class="item.stsClass">{{ item.sts }}</strong> <strong>({{ item.name }})</strong>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <span>{{ item.author }}</span> {{item.author && item.pub ? '|' : ''}} <span>{{ item.pub }}</span>
            </div>
            <div class="right">
              <strong>{{ item.reg_dt }} ~ {{ item.return_dt }}</strong>
            </div>
          </div>
          <div class="option" v-if="item.sts === '대여중' || item.sts === '연체중'">
              <input type="date" v-model="item.org_return_dt"/>
              <button class="btn-form btn-change" @click="changeRtnDt(item.seq)">기간 변경</button>
              <button class="btn-form btn-return" @click="return1(item.seq, item.book_cde, item.user_cde)">반납</button>
          </div>
        </li>
      </ul>
      <Pagination :fnc="getBorrowedBookListByPage" :totalCnt="state.totalCnt"></Pagination>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.lent-book-list-page{
  display: flex;
  flex-direction: column;

  .btn-change{ background: var(--color-orange); color: #fff;}
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
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
    }

    .list{
      flex: 1 0 auto;
      height: 10px; //임시
      overflow-y: auto;

      list-style: none;
      margin: 0;
      padding: 0;

      padding: 10px;

      border-bottom: 1px solid #ccc;

      margin-bottom: 10px;

      li{
        background: #fafbfc;
        border-radius: 10px;
        padding: 20px;
        border: 1px solid #ddd;
        margin-bottom: 10px;
        transition: color .5s;
        box-shadow: 0 3px 5px rgba(0, 0, 0, .2);

        &:last-child{
          margin-bottom: 0;
        }

        &:hover{
          background: var(--color-green);
          color: #fff;
        }


        .top{
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left{
            flex: 1;
            display: flex;
            margin-right: 5px;
            width: 10px;
            white-space: nowrap;
            overflow: hidden;
            .book-cde{margin-right: 5px;}
            .book-title{flex: 1;}
          }

          .right{
            .ing{
              color: #dad;
              background: #fff;
            }
            .overing{
              color: var(--color-red);
              background: #fff;
            }
            .ed{
              color: var(--color-green);
              background: #fff;
              
            }
            .overed{
              color: var(--color-orange);
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
