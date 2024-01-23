<script setup>
  import { reactive, ref, nextTick } from 'vue';
  import axios from 'axios';
  import commonJS from '../../assets/common';
  import { useRouter } from 'vue-router';

  const userInput = ref(null);
  const bookCdeInput = ref(null);
  const userPop = ref(null);
  const userList = ref(null);
  const bookList = ref(null);
  // const allChkInput = ref(null);

  const state = reactive({
    showedPopup: false,
    userList: [],
    selectedUser: '',   //유저 선택시 object로 바꾸기{}
    userKeyword: '',
    bookCde: '',
    bookList: [],
    checkedBook: [],
    allChked: true
  });

  const router = useRouter();
  const curUserCde = router.currentRoute.value.params.user_cde;

  const getUserList = () => {
    state.selectedUser = '';
    let param = '';

    axios.post(`http://localhost:3000/getUserListFromBorrow`, {
      userKeyword: state.userKeyword
    }).then((res) => {
      const { data } = res;

      if(!data.length){
        alert('해당 유저가 존재하지않습니다.');
        return;
      }else if(data.length === 1){
        state.selectedUser = data[0];
      }else{
        state.showedPopup = true;
        state.userList = data;

        nextTick(() => {
          setTimeout(() => {
            userPop._value.classList.add('effect');
          });
        });
      }
    });
  }

  const togglePopup = (bool) => {
    if(bool === undefined) state.showedPopup = !state.showedPopup;
    else if(typeof bool === 'boolean') state.showedPopup = bool;
  }

  const setUser = () => {
    state.selectedUser = state.userList[userList._value.querySelector('input:checked').value];

    console.log(state.selectedUser);
    togglePopup();
  }

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
    nextTick(() => {
      const book = state.bookList.filter(x => x.book_cde === cde)[0];
      
      axios.post(`http://localhost:3000/borrow1`, {
        books: [{
          bookCde: book.book_cde,
          userCde: state.selectedUser.user_cde,
          rtnDate: book.due,
        }]
      }).then((res) => {
        state.bookList = state.bookList.filter(x => x.book_cde !== cde);
      });
    })
    
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
    console.log(data);
    axios.post(`http://localhost:3000/borrow1`, {
      books: data
    }).then((res) => {
      state.bookList = state.bookList.filter(x => x.chked === false);
    });
  }

</script>
<template>
  <article class="borrow-page">
    <h1>도서 대여</h1>
    <div class="white-box step1">
      <div class="grid">
        <div class="row">
          <label class="col with-btn">
            <span class="title ast">회원</span>
            <input ref="userInput" type="text" placeholder="회원명, 연락처" @keyup.enter="getUserList" v-model="state.userKeyword" />
            <button class="btn-form btn-search" @click="getUserList">검색</button>
          </label>
        </div>
      </div>
      <div class="user-info whte-box" v-if="typeof state.selectedUser === 'object'">
        <div class="top">
          <strong class="txt-overflow1">{{ state.selectedUser.name }} [{{ state.selectedUser.user_cde }}]</strong>
          <strong>대여현황 0 / 5</strong>
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
    <aside class="layer" v-if="state.showedPopup">
      <div class="popup-user" ref="userPop">
        <header>
          <h1>유저정보</h1>
          <span class="btn-close" @click="togglePopup();">
            <span></span>
            <span></span>
          </span>
        </header>
        <div class="btns">
          <button class="btn-form" @click="setUser">선택</button>
        </div>
        <ul ref="userList">
          <li v-for="(user, idx) in state.userList" :key="idx">
            <label>
              <input type="radio" name="user" :checked="idx === 0" :value="idx" />
              <div class="white-box">
                <div class="top">
                    <strong class="txt-overflow1">{{ user.name }} [{{ user.user_cde }}]</strong>
                    <span>대여현황 0 / 5</span>
                </div>
                <div class="bottom">{{ user.tel }}</div>
              </div>
            </label>
          </li>
        </ul>
      </div>
    </aside>
  </article>
  
</template>

<style lang="scss" scoped>
.borrow-page{
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

  .layer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    
    display: flex;
    align-items: center;
    justify-content: center;

    .popup-user{
      max-width: 800px;
      width: 100%;
      background: #fff;
      border-radius: 10px;
      padding: 10px;

      transform: scale(0);
      transition: transform 0.3s cubic-bezier(0.29, 0.42, 0.27, 1.55);

      &.effect{transform: scale(1);}

      header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
        margin-bottom: 5px;

        h1{margin: 0;}
        .btn-close{
          width: 20px;
          height: 20px;
          position: relative;

          transform: rotate(45deg);
          cursor: pointer;

          span{
            display: inline-block;
            vertical-align: top;

            background: var(--color-red);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 5px var(--color-red);
          }
          span:first-of-type{
            width: 20px;
            height: 5px;
          }
          span:last-of-type{
            width: 5px;
            height: 20px;
          }
        }
      }

      .btns{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 5px;

        button{
          background: var(--color-green);
          color: #fff;
        }
      }

      ul{
        margin: 0;
        padding: 10px;
        max-height: 280px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        overflow-y: auto;
        li{
          margin-bottom: 5px;

          &:last-of-type{
            margin-bottom: 0;
          }
          .white-box{
            padding: 5px 10px;
          }
          label{
            display: block;

            input{display: none;}

            input:checked + div{
              background: var(--color-green);
              color: #fff;
            }

            .top{
              display: flex;
              align-items: center;
              justify-content: space-between;

              strong{flex: 1;}
            }
            .bottom{
              display: flex;
              align-items: center;
              justify-content: space-between;

              .author-pub{
                flex: 1;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
}
  

</style>
