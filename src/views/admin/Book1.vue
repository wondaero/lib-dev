<script setup>
  import { reactive, ref, nextTick } from 'vue';
  import axios from 'axios';
  import commonJS from '../../assets/common';
  
  const bookPop = ref(null);
  const bookList = ref(null);
  const isbnInput = ref(null);
  const titleInput = ref(null);
  const authorInput = ref(null);
  const classNoInput = ref(null);
  const classCdeInput = ref(null);
  const bookCdeInput = ref(null);


  const state = reactive({
    showedPopup: false,
    booksByIsbn: [],
    bookDetail: {}
  });

  const getBookInfo = () => {
    axios.post("http://localhost:3000/getBookInfoByIsbn", {isbn: isbnInput._value.value})
    .then(res => {
      const { data } = res;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      state.booksByIsbn = commonJS.xmlToObjArr({xml: xmlDoc, tagName: 'RECORD'});


      if(!state.booksByIsbn.length){
        alert('등록된 책이 없습니다.');
        return;
      }

      state.showedPopup = true;

      nextTick(() => {
        setTimeout(() => {
          bookPop._value.classList.add('effect');
          // bookList._value.querySelector('li input').checked = true;
          getBookDetail(state.booksByIsbn[0].REC_KEY, 0);
        });
      });
    })
  }

  const getBookDetail = (recKey, idx) => {
    axios.post("http://localhost:3000/getBookDetailInfoByIsbn", {recKey: recKey}).then((res) => {
      const { data } = res;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const book = commonJS.xmlToObjArr({xml: xmlDoc, tagName: 'BIBINFO'})[0];

      state.bookDetail = {...state.booksByIsbn[idx], ...commonJS.getClassifiedBookInfo(book)};
    });
  }

  const closePopup = () => {
    state.bookDetail = {};
    togglePopup(false);

  }

  const setBookInfo = () => {
    togglePopup(false);
  }

  const togglePopup = (bool) => {
    if(bool === undefined) state.showedPopup = !state.showedPopup;
    else if(typeof bool === 'boolean') state.showedPopup = bool;
  }

  const regBook = () => {
    if(!chkRequired()){
      alert('필수 값을 입력해주세요.');
    }
  }

  const chkRequired = () => {
    const chkedInputs = [titleInput, authorInput, classNoInput, classCdeInput, bookCdeInput];

    let allPass = true;
    chkedInputs.forEach(ref => {
      ref._value.classList.remove('required');
      if(!ref._value.value){
        allPass = false;
        ref._value.classList.add('required');
      }
    })

    return allPass;
  }


  const setClassCde = () => {
    if(!state.bookDetail.TITLE){
      alert('도서명을 입력해주세요.');
      return;
    }
    if(!state.bookDetail.seriesTitle && !state.bookDetail.AUTHOR){
      alert('저자 혹은 총서명 중 하나는 입력되어야 합니다.');
      return;
    }

    state.bookDetail.classCde = commonJS.getClassCde(state.bookDetail.TITLE, state.bookDetail.seriesTitle, state.bookDetail.AUTHOR);
  }

</script>
<template>
  <article class="book1-page">
    <h1>도서 등록</h1>
    <div class="white-box book-info">
      <div class="grid">
        <div class="row">
          <label class="col with-btn">
            <span class="title">ISBN</span>
            <input type="text" ref="isbnInput" @keyup.enter="getBookInfo" />
            <button class="btn-form" @click="getBookInfo">도서검색</button>
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">총서명</span>
            <input type="text" v-model="state.bookDetail.seriesTitle" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title ast">서명</span>
            <input ref="titleInput" type="text" v-model="state.bookDetail.TITLE" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title ast">저자</span>
            <input ref="authorInput" type="text" v-model="state.bookDetail.AUTHOR" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">출판사</span>
            <input type="text" v-model="state.bookDetail.PUBLISHER"/>
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">출판년도</span>
            <input type="text" v-model="state.bookDetail.PUBYEAR" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">도서상태</span>
            <input type="text" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title ast">분류기호</span>
            <input ref="classNoInput" type="text" v-model="state.bookDetail.classNo" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">청구권차</span>
            <input type="text" />
          </label>
        </div>
        <div class="row">
          <label class="col with-btn">
            <span class="title ast">저자기호</span>
            <input ref="classCdeInput" type="text" v-model="state.bookDetail.classCde" />
            <button class="btn-form" @click="setClassCde">생성</button>
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">복본</span>
            <input type="text" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title ast">등록번호</span>
            <input type="text" ref="bookCdeInput" v-model="state.bookDetail.bookCde" />
          </label>
        </div>
        <div class="row btns">
          <button class="btn-form btn-search" @click="regBook">도서 등록</button>
        </div>
      </div>
      <div class="bg">
        <img src="@/assets/reg-book-bg.svg" />
      </div>
    </div>

    <aside class="layer" v-if="state.showedPopup">
      <div class="popup-book" ref="bookPop">
        <header>
          <h1>도서정보</h1>
          <span class="btn-close" @click="closePopup">
            <span></span>
            <span></span>
          </span>
        </header>
        <div class="btns">
          <button class="btn-form" @click="setBookInfo">선택</button>
        </div>
        <ul ref="bookList">
          <li v-for="(book, idx) in state.booksByIsbn" :key="idx">
            <label>
              <input type="radio" name="book" :checked="idx === 0" @change="getBookDetail(book.REC_KEY, idx)" />
              <div class="white-box">
                <div class="top txt-overflow1">
                  <span>[{{ book.TYPE }}] </span>
                  <span>{{ book.TITLE }}</span>
                </div>
                <div class="bottom">
                  <span class="author-pub txt-overflow1">
                    <span>{{ book.AUTHOR }}</span> {{book.AUTHOR && book.PUBLISHER ? '|' : ''}} <span>{{ book.PUBLISHER }}</span>
                  </span>
                  <span class="pub-year">{{ book.PUBYEAR }}</span>
                </div>
              </div>
            </label>
          </li>
        </ul>
        <table>
          <colgroup>
            <col width="80">
            <col>
            <col width="80">
            <col>
        </colgroup>
        <tbody>
          <tr>
            <th>서명</th><td><input disabled /></td>
            <th>총서명</th><td><input disabled /></td>
          </tr>
          <tr>
            <th>저자</th><td><input disabled /></td>
            <th>출판사</th><td><input disabled /></td>
          </tr>
          <tr>
            <th>출판년도</th><td><input disabled /></td>
            <th>청구권차</th><td><input disabled /></td>
          </tr>
          <tr>
            <th>ISBN</th><td><input disabled /></td>
            <th>분류기호</th><td><input disabled /></td>
          </tr>
        </tbody>
        </table>
      </div>
    </aside>
  </article>
</template>

<style lang="scss" scoped>
.book1-page{
  display: flex;
  flex-direction: column;

  .ast:before{
    content: '*';
    margin-right: 10px;
    font-size: 20px;
    font-weight: bolder;
    color: var(--color-red);
  }
  .book-info{

    display: flex;
    align-items: center;

    .grid{
      width: 400px;

      .row{
        margin-bottom: 10px;
        
        &:last-child{margin-bottom: 0;}
  
        label{
          align-items: center;
          margin-right: 10px;
          &:last-child{margin-right: 0;}
          .title{
            width: 100px;
            text-align: right;
            padding-right: 10px;
            box-sizing: border-box;
          }
          input{
            width: 300px;
            height: 32px;

            &.required{
              border: 2px solid #f00;
              box-shadow: 0 0 5px #f00;
              transform: skew(3deg, -3deg);
            }
          }
  
          &.with-btn{
            input{flex: 1; width: 215px; margin-right: 5px;}
          }
        }

        &.btns{justify-content: flex-end;}
      }
    }

    .bg{
      margin-left: 50px;
      img{
        max-width: 100%;
        width: 300px;
        // width: 100%;
      }
    }
  }

  .btn-create{ background: var(--color-orange); color: #fff;}
  .btn-search{ background: var(--color-green); color: #fff;}
  .btn-add{ background: var(--color-red); color: #fff;}

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

    .popup-book{
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
      }

      ul{
        margin: 0;
        margin-bottom: 10px;
        padding: 10px;
        height: 280px;
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
              *{vertical-align: top;}
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

      table{
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;

        tr{
          border-top: 1px solid #eee;
          &:last-child{border-bottom: 1px solid #eee;}

          th{background: var(--color-green); color: #fff;}

          td{
            padding: 5px;
            input{
              border: 1px solid #eee;
              height: 32px;
              width: 100%;
            }
          }
        }


      }
    }
  }

}
  

</style>
