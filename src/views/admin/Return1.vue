<script setup>
  import { reactive } from 'vue';
  import axios from 'axios';

  const state = reactive({
    bookCde: '',
    borrowedBooks: [],
    allChked: true,
  });

  const getBeingBorrowedBook = () => {
    if(state.borrowedBooks.filter(x => x.book_cde === state.bookCde).length){
      alert('이미 목록에 있습니다.');
      return;
    }

    axios.post(`http://localhost:3000/getBeingBorrowedBook`, {
      bookCde: state.bookCde
    }).then(res => {
      if(!res.data[0].length){
        alert('도서코드를 확인해주세요.\n(이미 반납되었거나 빌린적이 없는 책일 수도 있습니다.)');
        return;
      }

      const bookObj = res.data[0][0];
      bookObj.chked = true;
      bookObj.org_return_dt = setYYYYMMDD(bookObj.org_return_dt);
      bookObj.reg_dt = setYYYYMMDD(bookObj.reg_dt);

      state.borrowedBooks.push(bookObj);

      chkEach();
    }).catch(e => {
      console.error(e);
    })
  }

  const del = (seq) => {
    if(window.confirm('위 도서를 목록에서 제거하시겠습니까?')){
      state.borrowedBooks = state.borrowedBooks.filter(x => x.seq != seq);
    }

    chkEach();
  }
  const del2 = () => {
    if(!state.borrowedBooks.filter(x => x.chked).length){
      alert('선택된 도서가 없습니다.');
      return;
    }
    if(window.confirm('선택된 도서를 목록에서 제거하시겠습니까?')){
      state.borrowedBooks = state.borrowedBooks.filter(x => x.chked !== true);
    }

    chkEach(false);
  }

  const chkedBookCtrl = (trg, cde) => {
    let book;
    for(let i = 0; i < state.borrowedBooks.length; i++){
      book = state.borrowedBooks[i];
      if(book.book_cde == cde){
        book.chked = trg.target.checked;
        break;
      }
    }

    chkEach();
  }

  const setYYYYMMDD = d => new Date(d).toLocaleDateString().split(' ').map(dd => parseInt(dd) < 10 ? '0' + parseInt(dd) : parseInt(dd)).join('-');

  const isOver = rtnDt => (new Date(rtnDt) - new Date()) < 0;

  const chkAll = () => {
    state.borrowedBooks.map(x => x.chked = state.allChked);
  }

  const chkEach = (bool) => {
    if(typeof bool === 'boolean'){
      state.allChked = bool;
      return;
    }

    state.allChked = !state.borrowedBooks.filter(x => x.chked === false).length;
  }

  const return1 = (seq) => {
      const book = state.borrowedBooks.filter(x => x.seq === seq);

      if(!book.length){ //필터
        alert('[rtn001] 반납을 진행할 수 없습니다.\n관리자에게 문의해주세요.');
        return;
      }
      
      axios.post(`http://localhost:3000/return1`, {
        books: book
      }).then((res) => {
        alert('반납되었습니다.');
        state.borrowedBooks = state.borrowedBooks.filter(x => x.seq !== seq);
      }).catch((err) => {
        console.log(err);
        alert('[rtn002] 관리자에게 문의해주세요.');
      });
  }

  const return2 = () => {
      const books = state.borrowedBooks.filter(x => x.chked === true);

      if(!books.length){ //필터
        alert('선택된 도서가 없습니다.');
        return;
      }

      if(!confirm(`선택된 도서(${books.length}권)를 반납하시겠습니까?`)) return;
      
      axios.post(`http://localhost:3000/return1`, {
        books: books
      }).then((res) => {
        alert('반납되었습니다.');
        state.borrowedBooks = state.borrowedBooks.filter(x => x.chked === false);
      }).catch((err) => {
        console.log(err);
        alert('[rtn002] 관리자에게 문의해주세요.');
      });
  }

  const extend = () => {
    alert('아직 사용할 수 없습니다.');
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
            <input type="text" placeholder="도서코드" @keyup.enter="getBeingBorrowedBook" v-model="state.bookCde" />
            <button class="btn-form btn-search" @click="getBeingBorrowedBook">검색</button>
          </label>
        </div>
      </div>
    </div>
    <div class="white-box step2" v-if="state.borrowedBooks.length > 0">
      <div class="list-wrapper">
        <div class="list-top">
          <div class="left">
            <input type="checkbox" @change="chkAll()" v-model="state.allChked">
            <div>{{ state.borrowedBooks.filter(x => x.chked).length }} / {{ state.borrowedBooks.length }}</div>
          </div>
          <div class="right">
            <button class="btn-form btn-del" @click="del2">선택제거</button>
            <button class="btn-form btn-return" @click="return2()">선택반납</button>
          </div>
        </div>
        <ul class="list">
          <li v-for="(book, idx) in state.borrowedBooks" :key="idx">
            <label>
              <input type="checkbox" @change="chkedBookCtrl($event, book.book_cde)" v-model="book.chked">
              <div>
                <div class="top">
                  <div class="left">
                    <strong class="book-cde">[{{ book.book_cde }}]</strong>
                    <span class="book-title txt-overflow1">{{ book.title }}</span>
                  </div>
                  <div class="right" :class="{over: isOver(book.org_return_dt)}">
                    <strong class="class-no">{{ isOver(book.org_return_dt) ? '연체중' : '대여중' }}</strong><strong>({{ book.name }})</strong>
                  </div>
                </div>
                <div class="bottom">
                  <div class="left">
                    <span>{{ book.author }}</span> {{book.author && book.pub ? '|' : ''}} <span>{{ book.pub }}</span>
                  </div>
                  <div class="right">
                    <strong class="class-no">[{{ book.class_no }}]</strong> <strong>{{ book.class_cde }}</strong>
                  </div>
                </div>
                <div class="option">
                  <div class="left">
                    <strong>{{ book.reg_dt }} ~</strong>
                  </div>
                  <div class="right">
                    <input type="date" v-model="book.org_return_dt" />
                    <button class="btn-form btn-return" @click="return1(book.seq)">반납</button>
                    <button class="btn-form btn-extend" disabled @click="extend(book.seq)">기간연장</button>
                    <button class="btn-form btn-del" @click="del(book.seq)">제거</button>
                  </div>
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
        }

        .btn-form[disabled]{
          background: #ccc;
          color: #999;
          cursor: not-allowed;
        }
        .btn-return{
          background: var(--color-green);
          color: #fff;
        }
        .btn-extend{
          background: var(--color-orange);
          color: #fff;
        }

        .btn-del{
          margin-right: 5px;
          background: var(--color-red);
          color: #fff;
        }

        .list{
          // max-height: 200px; //임시
          overflow-y: auto;
    
          list-style: none;
          margin: 0;
          margin-top: 10px;
          padding: 10px;
          border-top: 1px solid #ccc;
    
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

                .bottom .class-no{
                  color: darkviolet;
                }

                .btn-form{
                  border: 1px solid rgba(255, 255, 255, .8);
                  box-shadow: 0 0 5px rgba(255, 255, 255, .8);
                }
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
                .right.over{
                  animation: blink .5s infinite linear alternate;
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
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px dashed #eee;
                
                .right{
                  display: flex;
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

  @keyframes blink{
    0%{color: transparent;}
    100%{color: var(--color-red);}
  }
</style>
