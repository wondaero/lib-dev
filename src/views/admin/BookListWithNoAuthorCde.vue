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
        <div>
          총 <strong>0</strong>건
        </div>
        <div class="btns">
        </div>

      </header>
      <ul class="list">
        <li v-for="n in 2">
          <div class="top">
            <div class="left">
              <strong class="book-cde">[EM00004375]</strong>
              <span class="book-title txt-overflow1">프리젠테이션 오!프리젠테이션</span>
            </div>
            <div class="right">
              <strong>연체중</strong>
              <strong>(원대로)</strong>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <span>한정선 지음</span>|<span>김영사</span>
            </div>
            <div class="right">
              <strong>[325.1]</strong>
              <strong>한74ㅍ</strong>
            </div>
          </div>
          <div class="option">
            <input type="date" />
            <button class="btn-form">연장</button>
            <button class="btn-form">반납</button>
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
