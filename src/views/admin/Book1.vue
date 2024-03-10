<script setup>
  import { reactive, ref, nextTick, getCurrentInstance, onMounted } from 'vue';
  import axios from 'axios';
  import commonJS from '../../assets/common';
  import { useRouter } from 'vue-router';
  
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

  const router = useRouter();
  const curBookCde = router.currentRoute.value.params.book_cde;

  if(curBookCde){ //상세 데이터 가져오기
    axios.get(`http://localhost:3000/getBookDetailByBookCde?bookCde=${curBookCde}`).then((res) => {
      const { data } = res;

      state.bookDetail = {
        AUTHOR: data[0].author,
        bookCde: data[0].book_cde,
        TITLE: data[0].title,
        seriesTitle: data[0].series_title,
        PUBLISHER: data[0].pub,
        PUBYEAR: data[0].pub_year,
        classNo: data[0].class_no,
        classCde: data[0].class_cde,
        isbn: data[0].isbn,
        startVol: data[0].start_vol,
        classCdeChk: data[0].class_cde_chk,
        regDt: new Date(data[0].reg_dt).toLocaleDateString(),
      }
    });
  }

  
  let instance = null;
  
  onMounted(() => {
    instance = getCurrentInstance();
  })

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

      state.bookDetail = {...state.booksByIsbn[idx], ...commonJS.getClassifiedBookInfo(book), sts: 1};
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
      return;
    }

    axios.post("http://localhost:3000/regBook", state.bookDetail)
    .then((res) => {
      if(res.data.length === 2 && res.data[0].affectedRows === 1){
        alert('등록되었습니다.');
        state.bookDetail = {};
        isbnInput._value.focus();

      }else{
        console.error(res);
        alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
      }

      sendMessageToParent();
    })
    .catch((err) => {
      console.error(err);
      alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
    });
  }
  const updateBook = () => {
    if(!confirm('수정하시겠습니까?')) return;

    if(!chkRequired()){
      alert('필수 값을 입력해주세요.');
      return;
    }
    
    axios.post("http://localhost:3000/updateBook", state.bookDetail)

    .then((res) => {
      if(res.data.length === 2 && res.data[0].affectedRows === 1){
        alert('수정되었습니다.');

      }else{
        console.error(res);
        alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
      }
      
      sendMessageToParent();
    })
    .catch((err) => {
      console.error(err);
      alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
    });
  }
  const delBook = () => {
    if(!confirm('정말로 삭제하시겠습니까?')) return;


    axios.post("http://localhost:3000/delBook", state.bookDetail)
    .then((res) => {
      if(res.data.length === 2 && res.data[0].affectedRows === 1){

        alert('삭제되었습니다.');
        router.replace({ name: 'booklist'});
      }else{
        console.error(res);
        alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
      }
      
      sendMessageToParent();
    })
    .catch((err) => {
      console.error(err);
      alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
    });
  }

  const sendMessageToParent = () => {
    // 이벤트를 발생시켜 데이터를 부모 컴포넌트로 전달합니다.
    instance.emit('childToParent');
  };

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
    <h1>도서 {{ curBookCde ? '상세' : '등록' }}</h1>
    <div class="white-box book-info">
      <div class="grid">
        <div class="row">
          <label class="col with-btn">
            <span class="title">ISBN</span>
            <input type="text" v-model="state.bookDetail.isbn" ref="isbnInput" @keyup.enter="getBookInfo" />
            <button class="btn-form" @click="getBookInfo" :disabled="state.bookDetail.regDt">도서검색</button>
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
            <select v-model="state.bookDetail.sts">
              <option value="1">대여가능</option>
              <option value="3">대여불가</option>
              <option value="4">보류</option>
            </select>
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
            <input type="text" v-model="state.bookDetail.startVol" />
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
            <span class="title ast">등록코드</span>
            <input type="text" ref="bookCdeInput" v-model="state.bookDetail.bookCde" :readonly="state.bookDetail.regDt" />
          </label>
        </div>
        <div class="row class-cde-chk-row" v-if="state.bookDetail.classCdeChk">
          <div class="col">
            <span class="title">청구번호 스티커</span>
            <div>
              <label>
                <input type="radio" name="class_cde_chk" value="y" v-model="state.bookDetail.classCdeChk" />
                <strong>있음</strong>
              </label>
              <label>
                <input type="radio" name="class_cde_chk" value="n" v-model="state.bookDetail.classCdeChk" />
                <strong>없음</strong>
              </label>
            </div>
          </div>
        </div>
        <div class="row" v-if="state.bookDetail.regDt">
          <label class="col">
            <span class="title">등록일</span>
            <input type="text" readonly v-model="state.bookDetail.regDt" />
          </label>
        </div>
        <div class="row btns">
          <button class="btn-form btn-search" v-if="!state.bookDetail.regDt" @click="regBook">도서 등록</button>
          <button class="btn-form btn-del" v-if="state.bookDetail.regDt" @click="delBook">도서 삭제</button>
          <button class="btn-form btn-update" v-if="state.bookDetail.regDt" @click="updateBook">도서 수정</button>
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
            <th>서명</th><td><input disabled v-model="state.bookDetail.TITLE" /></td>
            <th>총서명</th><td><input disabled v-model="state.bookDetail.seriesTitle" /></td>
          </tr>
          <tr>
            <th>저자</th><td><input disabled v-model="state.bookDetail.AUTHOR" /></td>
            <th>출판사</th><td><input disabled v-model="state.bookDetail.PUBLISHER" /></td>
          </tr>
          <tr>
            <th>출판년도</th><td><input disabled v-model="state.bookDetail.PUBYEAR" /></td>
            <th>청구권차</th><td><input disabled v-model="state.bookDetail.startVol" /></td>
          </tr>
          <tr>
            <th>ISBN</th><td><input disabled v-model="state.bookDetail.isbn" /></td>
            <th>분류기호</th><td><input disabled v-model="state.bookDetail.classNo" /></td>
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
      width: 420px;

      .row{
        margin-bottom: 10px;
        
        &:last-child{margin-bottom: 0;}

        &.class-cde-chk-row{
          .col{
            align-items: center;
            div{
              flex: 1;
              height: 32px;
              display: flex;
              align-items: center;


              label{
                display: flex;
                align-items: center;
                input{width: 20px; height: 20px; margin-right: 5px;}

                &:first-of-type{margin-right: 10px;}
              }

            }
          }
        }
  
        .col{
        // label{
          align-items: center;
          margin-right: 10px;
          &:last-child{margin-right: 0;}
          .title{
            width: 120px;
            text-align: right;
            padding-right: 10px;
            box-sizing: border-box;
          }
          input[type="text"]{
            width: 300px;
            height: 32px;
            padding: 5px 10px;

            &.required{
              border: 2px solid var(--color-red);
              box-shadow: 0 0 5px var(--color-red);
              transform: skew(3deg, -3deg);

              &:focus{
                transform: scaleY(1.3);
                transition: transform .5s linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%);
              }
            }

            &[readonly]{background: #eee; border: 0;}
          }
  
          &.with-btn{
            input{flex: 1; width: 215px; margin-right: 5px;}
          }
        }

        &.btns{justify-content: flex-end;}
      }
    }

    button{
      background: var(--color-green);
      color: #fff;

      &[disabled]{
        background: #ddd;
        color: #eee;
        cursor: not-allowed;
      }
    }

    .btns{
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px dashed rgba(0, 0, 0, .5);
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
  .book-info button.btn-del{background: var(--color-red); color: #fff; margin-right: 5px;}
  .book-info button.btn-update{background: var(--color-orange); color: #fff;}

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

        button{
          background: var(--color-green);
          color: #fff;
        }
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
