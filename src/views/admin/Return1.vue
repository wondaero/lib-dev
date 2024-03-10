<script setup>
  import { reactive, ref, nextTick } from 'vue';
  import axios from 'axios';
  import commonJS from '../../assets/common';

  const userInput = ref(null);
  const bookCdeInput = ref(null);
  const userPop = ref(null);
  const userList = ref(null);
  const bookList = ref(null);
  // const allChkInput = ref(null);

  const state2 = reactive({
    showedPopup: false,
    userList: [],
    selectedUser: '',   //유저 선택시 object로 바꾸기{}
    userKeyword: '',
    bookCde: '',
    bookList: [],
    checkedBook: [],
    allChked: true
  });
  const state = reactive({
    bookCde: '',
    borrowedBooks: [],
  });

  const getBeingBorrowedBook = () => {
    axios.post(`http://localhost:3000/getBeingBorrowedBook`, {
      bookCde: state.bookCde
    }).then(res => {
      if(!res.data.length){
        alert('도서코드를 확인해주세요.\n(이미 반납되었거나 빌린적이 없는 책일 수도 있습니다.)');
        return;
      }
      // state.checkedBook.push(res.data[0].book_cde);
      // state.bookList.push(res.data[0]);

      const bookObj = res.data[0];
      bookObj.chked = true;
      
      var today = new Date();
      today.setDate(today.getDate() + 14);
      bookObj.due = setYYYYMMDD(today);

      state.bookList.push(bookObj);

      console.log(state.bookList);

      chkEach();
    }).catch(e => {
      console.error(e);
    })

  }


  
  ////


  const getBookInfo = () => {
    if(state.bookList.filter(x => x.book_cde === state.bookCde).length){
      alert('이미 목록에 있습니다.');
      return;
    }

    axios.post(`http://localhost:3000/getBookFromBorrow`, {
      bookCde: state.bookCde
    }).then(res => {
      if(!res.data.length){
        alert('이미 대여중인 도서이거나\n존재하지 않는 도서입니다.');
        return;
      }
      // state.checkedBook.push(res.data[0].book_cde);
      // state.bookList.push(res.data[0]);

      const bookObj = res.data[0];
      bookObj.chked = true;
      
      var today = new Date();
      today.setDate(today.getDate() + 14);
      bookObj.due = setYYYYMMDD(today);

      state.bookList.push(bookObj);

      console.log(state.bookList);

      chkEach();
    }).catch(e => {
      console.error(e);
    })
  }

  const borrow = () => {
    
  }

  const del = (idx) => {
    if(window.confirm('위 도서를 목록에서 제거하시겠습니까?')){
      state.bookList.splice(idx, 1);
    }

    chkEach();
  }
  const del2 = () => {
    // if(!state.checkedBook.length){
    if(!state.bookList.filter(x => x.chked).length){
      alert('선택된 도서가 없습니다.');
      return;
    }
    if(window.confirm('선택된 도서를 목록에서 제거하시겠습니까?')){
      state.bookList = state.bookList.filter(x => x.chked !== true);
    }

    chkEach(false);
  }

  const chkedBookCtrl = (trg, cde) => {
    let book;
    for(let i = 0; i < state.bookList.length; i++){
      book = state.bookList[i];
      if(book.book_cde == cde){
        book.chked = trg.target.checked;
        break;
      }
    }

    chkEach();
  }

  const setYYYYMMDD = d => new Date(d).toLocaleDateString().split(' ').map(dd => parseInt(dd) < 10 ? '0' + parseInt(dd) : parseInt(dd)).join('-');


  const chkAll = () => {
    state.bookList.map(x => x.chked = state.allChked);
  }

  const chkEach = (bool) => {
    if(typeof bool === 'boolean'){
      state.allChked = bool;
      return;
    }

    state.allChked = !state.bookList.filter(x => x.chked === false).length;
  }

  const borrow1 = (cde) => {
    // nextTick(() => {
      console.log('single');
      const book = state.bookList.filter(x => x.book_cde === cde)[0];

      if(state.selectedUser.cur_borrowing_cnt + 1 > state.selectedUser.borrowing_limit){ //필터
        alert('최대 대여수를 넘길 수 없습니다.');
        return;
      }
      
      axios.post(`http://localhost:3000/borrow1`, {
        books: [{
          bookCde: book.book_cde,
          userCde: state.selectedUser.user_cde,
          rtnDate: book.due,
        }]
      }).then((res) => {
        alert('대여되었습니다.');
        state.bookList = state.bookList.filter(x => x.book_cde !== cde);
        state.selectedUser.cur_borrowing_cnt += 1;
      }).catch((err) => {
        console.log(err);
        alert('관리자에게 문의해주세요.');
      });
    // })
    
  }

  const borrow2 = () => {
    const books = state.bookList.filter(x => x.chked === true);

    const data = [];
    for(let i = 0; i < books.length; i++){
      data.push({
        bookCde: books[i].book_cde,
        userCde: state.selectedUser.user_cde,
        rtnDate: books[i].due,
      });
    }

    if(data.length +  state.selectedUser.cur_borrowing_cnt > state.selectedUser.borrowing_limit){ //필터
      alert('최대 대여수를 넘길 수 없습니다.');
      return;
    }

    axios.post(`http://localhost:3000/borrow1`, {
      books: data
    }).then((res) => {
      alert('대여되었습니다.');
      state.bookList = state.bookList.filter(x => x.chked === false);
      state.selectedUser.cur_borrowing_cnt += data.length;
    });
  }

</script>
<template>
  <article class="return-page">
    <h1>도서 반납</h1>
    <div class="white-box step1">
      <div class="grid">
        <div class="row">
          <label class="col with-btn">
            <span class="title ast">도서</span>
            <input ref="userInput" type="text" placeholder="도서코드" @keyup.enter="getBeingBorrowedBook" v-model="state.bookCde" />
            <button class="btn-form btn-search" @click="getBeingBorrowedBook">검색</button>
          </label>
        </div>
      </div>
      <div class="user-info whte-box" v-if="state.borrowedBooks.length">
        <div class="top">
          <strong class="txt-overflow1">{{ state.selectedUser.name }} [{{ state.selectedUser.user_cde }}]</strong>
          <strong :class="{over: (state.selectedUser.cur_borrowing_cnt >= state.selectedUser.borrowing_limit)}">
            대여현황 {{ state.selectedUser.cur_borrowing_cnt }} / {{ state.selectedUser.borrowing_limit }}
          </strong>
        </div>
        <div class="bottom">{{ state.selectedUser.tel }}</div>
      </div>
    </div>
    <div class="white-box step2" v-if="typeof state.selectedUser === 'object'">
      <div class="grid">
        <div class="row">
          <label class="col with-btn">
            <span class="title ast">도서</span>
            <input type="text" ref="bookCdeInput" placeholder="도서코드" @keyup.enter="getBookInfo" v-model="state.bookCde" />
            <button class="btn-form btn-search" @click="getBookInfo">검색</button>
          </label>
        </div>
      </div>
      <div class="white-box list-wrapper"  v-if="state.bookList.length > 0">
        <div class="list-top">
          <div class="left">
            <input type="checkbox" @change="chkAll()" v-model="state.allChked">
            <div>{{ state.bookList.filter(x => x.chked).length }} / {{ state.bookList.length }}</div>
          </div>
          <div class="right">
            <button class="btn-form del" @click="del2">선택제거</button>
            <button class="btn-form" @click="borrow2()">선택대여</button>
          </div>
        </div>
        <ul class="list" ref="bookList">
          <li v-for="(book, idx) in state.bookList" :key="idx">
            <label>
              <input type="checkbox" @change="chkedBookCtrl($event, book.book_cde)" v-model="book.chked">
              <div>
                <div class="top">
                  <div class="left">
                    <strong class="book-cde">[{{ book.book_cde }}]</strong>
                    <span class="book-title txt-overflow1">{{ book.title }}</span>
                  </div>
                  <div class="right">
                    <strong class="class-no">[{{ book.class_no }}]</strong> <strong>{{ book.class_cde }}</strong>
                  </div>
                </div>
                <div class="bottom">
                  <div class="left">
                    <span>{{ book.author }}</span> {{book.author && book.pub ? '|' : ''}} <span>{{ book.pub }}</span>
                  </div>
                </div>
                <div class="option">
                  <input type="date" v-model="book.due"/>
                  <button class="btn-form" @click="borrow1(book.book_cde)">대여</button>
                  <button class="btn-form del" @click="del(idx)">제거</button>
                </div>
              </div>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </article>
  
</template>

<style lang="scss" scoped>
.return-page{
  display: flex;
  flex-direction: column;

  .ast:before{
    content: '*';
    margin-right: 10px;
    font-size: 20px;
    font-weight: bolder;
    color: var(--color-red);
  }
  .step1{

    .grid{
      .row{
        .col{
          align-items: center;
          margin-right: 10px;
          &:last-child{margin-right: 0;}
          .title{
            text-align: right;
            padding-right: 10px;
            box-sizing: border-box;
          }

          input[type="text"]{
            width: 300px;
            height: 32px;
            padding: 5px 10px;
          }

          &.with-btn{
            input{margin-right: 5px;}
          }
        }

        &.btns{justify-content: flex-end;}
      }
    }

    button{
      background: var(--color-green);
      color: #fff;
    }

    .btns{
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px dashed rgba(0, 0, 0, .5);
    }

    &:after{
      content: 'STEP 1.';
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      background: #ace;
      transform: translateY(-50%);
      font-weight: bold;
    }

    .user-info{
      border-top: 1px solid #eee;
      margin-top: 10px;
      padding: 10px 0 0;

      .top{
        display: flex;
        align-items: center;
        justify-content: space-between;

        .over{
          color: #f00;
        }
      }
    }
  }

  .step2{
    margin-top: 20px;

    .grid{
      .row{

        .col{
          align-items: center;
          margin-right: 10px;
          &:last-child{margin-right: 0;}
          .title{
            text-align: right;
            padding-right: 10px;
            box-sizing: border-box;
          }
          
          input[type="text"]{
            width: 300px;
            height: 32px;
            padding: 5px 10px;
          }

          &.with-btn{
            input{margin-right: 5px;}
          }
        }

        &.btns{justify-content: flex-end;}
      }

      button{
        background: var(--color-green);
        color: #fff;
      }

      .btns{
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px dashed rgba(0, 0, 0, .5);
      }
    }

    &:after{
      content: 'STEP 2.';
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      background: #ace;
      transform: translateY(-50%);
      font-weight: bold;
    }

    .list-wrapper{
      
      margin-top: 10px;

      .list-top{
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left{
          display: flex;
          align-items: center;
          
          input[type="checkbox"]{
            width: 20px;
            height: 20px;
            margin-right: 10px; 
          }
        }


        .del{
          margin-right: 5px;
          background: var(--color-red);
          color: #fff;
        }
      }

      .list{
        // max-height: 200px; //임시
        overflow-y: auto;
  
        list-style: none;
        margin: 0;
        margin-top: 10px;
        padding: 10px;
  
        border-top: 1px solid #ccc;
  
        margin-bottom: 10px;
  
        li{

          margin-bottom: 10px;

          &:last-child{
            margin-bottom: 0;
          }

          label{
            display: block;
            background: #fafbfc;
            border-radius: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            
            transition: color .5s;
            box-shadow: 0 3px 5px rgba(0, 0, 0, .2);

            input[type="checkbox"]{
              width: 20px;
              height: 20px;
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
                .class-no{
                  color: #42c7d5;
                }
              }
      
            .option{
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px dashed #eee;

              .del{
                background: var(--color-red);
                color: #fff;
              }
    
              *{margin-right: 5px;}
              & *:last-child{margin-right: 0;}
            }
          }
        }
      }
    }
  }

  h1{font-size: 20px; margin-bottom: 10px;}

}
  

</style>
