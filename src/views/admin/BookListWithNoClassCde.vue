<script setup>
  import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
  import axios from 'axios';

  const chkAll = ref(null);


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

  let instance = null;
  
  onMounted(() => {
    instance = getCurrentInstance();
  })


  const afterPrint = () => {
    window.location.reload();
    // instance.emit('childToParent');
    // getBookListWithNoClassCde();
  }



  const getBookListWithNoClassCde = () => {
    axios.get("http://localhost:3000/getBooksWithNoClassCde").then((res) => {
      state.bookList = res.data;

      axios.get("http://localhost:3000/getBooksWithNoClassCdeCnt").then((res) => {
        state.totalCnt = res.data[0].CNT;
      });

    });
  }

  const dateFormat = (date) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자릿수로 포맷팅
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  }

  getBookListWithNoClassCde();

  const fnc_chkAll = (trg) => { //vue문법으로 나중에 바꿀 것
    const isChked = trg.target.checked;
    document.querySelectorAll('[data-id="bookChkBox"]').forEach((chkBox) => {
      chkBox.checked = isChked;
    })
  }
  const eachChk = (trg) => { //vue문법으로 나중에 바꿀 것
    const isChked = trg.target.checked;

    if(!isChked){
      chkAll._value.checked = false;
    }else{
      let isChkedAll = true;
      document.querySelectorAll('[data-id="bookChkBox"]').forEach((chkBox) => {
        if(!chkBox.checked) isChkedAll = false;
      })

      if(isChkedAll) chkAll._value.checked = true;
    }
  }

  const print = () => {
    const chkedItems = document.querySelectorAll('[data-id="bookChkBox"]:checked');
    
    if(!chkedItems.length){
      alert('선택된 아이템이 없습니다.');
      return;
    }

    const popup = window.open("/printPage_classCde.html", "_blank", "width=810, height=500, resizable=no");
  }

</script>
<template>
  <article class="book-list-page">
    <h1>청구번호 관리</h1>
    <div class="white-box search-case">
      <div class="grid">
        <div class="row">
          <label class="col">
            <span class="title">검색어</span>
            <input type="text" class=""/>
          </label>
        </div>
        <div class="row">
          <div class="title col">대여상태</div>
          <div class="col">
            <label class="radio-custom">
              <input type="radio" name="bookStatus" checked />
              <strong>전체</strong>
            </label>
            <label class="radio-custom">
              <input type="radio" name="bookStatus"/>
              <strong>대여중</strong>
            </label>
            <label class="radio-custom">
              <input type="radio" name="bookStatus"/>
              <strong>연체중</strong>
            </label>
          </div>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">기간</span>
            <input type="date" class=""/>
            ~
            <input type="date" class=""/>
          </label>
        </div>
        <div class="row btns">
          <button class="btn-form">검색</button>
        </div>
      </div>
    </div>
    <div class="white-box list-wrapper">
      <header>
        <div class="btns">
          <label class="checkbox-all-wrapper">
            <input type="checkbox" ref="chkAll" @change="fnc_chkAll" />
            <strong>전체</strong>
          </label>
          <button class="btn-form" @click="print">출력</button>
          <button class="hidden-btn" id="hiddenBtn" @click="afterPrint"></button>
        </div>
        <div>
          총 <strong> {{ state.totalCnt }}</strong>건
        </div>

      </header>
      <ul class="list">
        <li v-for="(book, idx) in state.bookList" :key="idx">
          <div class="checkbox-wrapper">
            <input
              type="checkbox"
              data-id="bookChkBox"
              @change="eachChk"
              :data-book-cde="book.book_cde"
              :data-class-no="book.class_no"
              :data-class-cde="book.class_cde"
              :data-start-vol="book.start_vol"
            />
          </div>
          <RouterLink :to="`/admin/book1/${book.book_cde}`" class="right">
            <div class="sticker">
              <strong>{{ book.class_no }}</strong>
              <strong>{{ book.class_cde }}</strong>
              <strong>{{ book.book_cde }}</strong>
            </div>
            <div class="book-info">
              <div class="top">
                <div>
                  <span>{{ book.series_title }}</span> {{book.series_title && book.title ? '|' : ''}} <span>{{ book.title }}</span>
                </div>
                <div>
                  <span>{{ book.author }}</span> {{book.author && book.pub ? '|' : ''}} <span>{{ book.pub }}</span>
                </div>
              </div>
              <div class="bottom">
                <span>{{ dateFormat(book.reg_dt) }}</span>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.book-list-page{
  display: flex;
  flex-direction: column;

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

      .btns{
        display: flex;
        align-items: center;
      }


      .checkbox-all-wrapper{
        display: flex;
        align-items: center;
        margin-right: 10px;

        input[type="checkbox"]{
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }

      button{
        background: var(--color-green);
        color: #fff;
      }

      .hidden-btn{
        display: none;
      }
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
        padding: 10px;
        border: 1px solid #ddd;
        margin-bottom: 10px;
        transition: color .5s;
        box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
        display: flex;
        align-items: center;

        &:last-child{
          margin-bottom: 0;
        }

        &:hover{
          background: var(--color-green);
          color: #fff;
        }

        .checkbox-wrapper{
          margin-right: 10px;

          input{
            width: 20px;
            height :20px;
            vertical-align: top;
          }
        }

        .right{
          flex: 1;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #333;
          .sticker{
            border: 1px solid #ccc;
            background: #fff;
            color: #333;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
  
            width: 120px;
            box-sizing: border-box;
            padding: 10px;

            margin-right: 10px;
          }

          .book-info{
            flex: 1;

            .top{
              margin-bottom: 5px;
            }

            .bottom{
              text-align: right;
            }
          }
        }



      }
    }

  }
}
  

</style>
