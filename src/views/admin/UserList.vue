<script setup>
  import {reactive} from 'vue';
  const toggleBookList = (bool, userCde) => {
    const target = event.currentTarget;
    users.forEach((user, idx) => {
      if(user.userCde === userCde) users[idx].showList = !users[idx].showList; 
    });
  }

  const users = reactive([
      {
        name: '원대로',
        tel: '010-8580-5167',
        userCde: 1,
        maxLentCnt: 5,
        lentCnt: 3,
        showList: false,
        books: [
          {
            title: '책1',
            bookCde: '[EM00004375]',
            authorCde: '한74ㄷ',
            classfied: 321.5,
            author: '한정선 지음',
            pub: '김영사',
          }
        ]
      },
      {
        name: '원대로',
        tel: '010-8580-5167',
        userCde: 2,
        maxLentCnt: 5,
        lentCnt: 3,
        showList: false,
        books: [
          {
            title: '책1',
            bookCde: '[EM00004375]',
            authorCde: '한74ㄷ',
            classfied: 321.5,
            author: '한정선 지음',
            pub: '김영사',
          }
        ]
      },
      {
        name: '원대로',
        tel: '010-8580-5167',
        userCde: 3,
        maxLentCnt: 5,
        lentCnt: 0,
        books: []
      },
      {
        name: '원대로',
        tel: '010-8580-5167',
        userCde: 4,
        maxLentCnt: 5,
        lentCnt: 4,
        showList: false,
        books: [
          {
            title: '책1',
            bookCde: '[EM00004375]',
            authorCde: '한74ㄷ',
            classfied: 321.5,
            author: '한정선 지음',
            pub: '김영사',
          }
        ]
      }
    ]
  );
</script>

<template>
  <article class="user-list-page">
    <h1>회원 목록</h1>
    <div class="white-box search-case">
      <div class="grid">
        <div class="row">
          <label class="col">
            <span class="title">검색어</span>
            <input type="text" placeholder="회원명, 연락처"/>
          </label>
        </div>
        <div class="row">
          <div class="title col">대여상태</div>
          <div class="col">
            <label class="radio-custom">
              <input type="radio" name="bookStatus" checked/>
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
        <div class="row btns">
          <button class="btn-form btn-search">검색</button>
        </div>
      </div>
    </div>
    <div class="white-box list-wrapper">
      <header>
        <div>
          총 <strong>0</strong>건
        </div>
        <div class="btns">
        </div>

      </header>
      <ul class="list">
        <li v-for="user in users" :key="user">
          <div class="top">
            <div class="left">
              <strong class="user-name">{{ user.name }}</strong>
              <span class="user-cde">[{{ user.userCde }}]</span>
            </div>
            <div class="right">
              대여현황: <strong>{{ user.lentCnt }}</strong> / <strong>{{ user.maxLentCnt }}</strong>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <strong>{{ user.tel }}</strong>
            </div>
            <div class="right" v-if="user.books && user.books.length">
              <strong class="option-control-btn" :class="user.showList ? 'close' : ''" @click="toggleBookList(undefined, user.userCde);">
                <span></span>
                <span></span>
              </strong>
            </div>
          </div>
          <div class="option" v-if="user.showList">
            <ul class="book-list">
              <li v-for="n in 3" :key="n">
                <div class="top">
                  <div class="left">
                    <strong class="book-cde">[EM00004375]</strong>
                    <span class="book-title txt-overflow1">프리젠테이션 오!프리젠테이션</span>
                  </div>
                  <div class="right">
                    <strong>[325.1]</strong>
                    <strong>한74ㅍ</strong>
                  </div>
                </div>
                <div class="bottom">
                  <div class="left">
                    <span>한정선 지음</span>|<span>김영사</span>
                  </div>
                  <div class="right">
                    <input type="date" />
                    <button class="btn-form btn-extend">연장</button>
                    <button class="btn-form btn-return">반납</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <ul class="pagination">
        <li>이전</li>
        <li v-for="n in 10">{{ n }}</li>
        <li>이후</li>
      </ul>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.user-list-page{
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

      // box-shadow: inset 0 -30px 0 rgba(225, 255, 225, .5);

      border-bottom: 1px solid #ccc;

      margin-bottom: 10px;

      & > li:hover{
        background: var(--color-green);
        color: #fff;
      }

      li{
        background: #fafbfc;
        border-radius: 10px;
        padding: 20px;
        border: 1px solid #ddd;
        margin-bottom: 10px;
        transition: color .5s;
        box-shadow: 0 3px 5px rgba(0, 0, 0, .2);


        &:last-child{border-bottom: 0;}

        .top{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;

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
        }

        .bottom{
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left{
            flex: 1;
            margin-right: 5px;
          }

          .right{
            .option-control-btn{
              background: red;
              display: inline-block;
              width: 30px;
              height: 30px;
              vertical-align: top;
              border-radius: 50%;
              position: relative;
              cursor: pointer;

              transition: transform .5s;

              &.close{
                transform: rotate(135deg);
              }

              span{
                width: 20px;
                height: 4px;
                border-radius: 4px;
                background: #fff;
                display: inline-block;
                vertical-align: top;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -10px;
                margin-top: -2px;

                &:last-child{transform: rotate(90deg);}
              }
            }
          }
        }

        .option{
          margin-top: 10px;
          padding-top: 10px;
          padding-left: 50px;
          border-top: 1px dashed #eee;


          .book-list{
            margin: 0;
            padding: 0;
            list-style: none;

            color: #000;

            li{

              &:last-child{margin-bottom: 0;}

              .bottom .right{
                display: flex;
                align-items: center;
  
                *{
                  margin-right: 5px;
                  &:last-child{margin-right: 0;}
                }
              }
            }

          }
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
