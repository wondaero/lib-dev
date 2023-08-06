<template>
  <div class="main-wrapper">
    <main>
      <aside>
        <h1 class="logo"><img alt="logo" src="@/assets/lib-logo.svg" height="40" /></h1>
        <div class="thumbnail"></div>
        <nav>
          <ul>
            <li>
              <strong>도서</strong>
              <ul>
                <li>도서 목록</li>
                <li>도서 등록</li>
              </ul>
            </li>
            <li>
              <strong>회원</strong>
              <ul>
                <li>회원 목록</li>
                <li>회원 등록</li>
              </ul>
            </li>
            <li>
              <strong>대여/반납</strong>
              <ul>
                <li>대여 목록</li>
                <li>대여</li>
                <li>반납</li>
              </ul>
            </li>
            <li>
              <strong>청구번호관리</strong>
            </li>
          </ul>
        </nav>
      </aside>
      <section>
        <header></header>
        <article class="book-list-page">
          <h1>도서목록</h1>
          <div class="white-box">
            <div class="grid search-case">
              <div class="row">
                <label class="col">
                  <span>검색어</span>
                  <input type="text" class=""/>
                </label>
              </div>
              <div class="row">
                <div class="title col">도서상태</div>
                <label class="col">
                  <input type="radio" name="bookStatus" checked/>
                  <span>전체</span>
                </label>
                <label class="col">
                  <input type="radio" name="bookStatus" />
                  <span>대여중</span>
                </label>
                <label class="col">
                  <input type="radio" name="bookStatus" />
                  <span>보류</span>
                </label>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .main-wrapper{
    // padding: 10px;
    height: 100vh;
    
    main{
      display: flex;
      height: 100%;
      // border-radius: 30px;
      overflow: hidden;
      box-shadow: 0 0 5px rgba(0, 0, 0, .5);
  
      aside{
        width: 160px;
        // background: url(../assets/stumps2.jpg) no-repeat;
        background: var(--color-green);
        background: rgba(94, 207, 94, .2);
        background-size: cover;
        display: flex;
        flex-direction: column;

        .logo{
          text-align: center;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-backdrop-filter: blur(50px);
          backdrop-filter: blur(50px);
        }

        .thumbnail{
          height: 120px;
          background: url(../assets/stumps2.jpg) no-repeat center;
          background: var(--color-green);
          background-size: cover;
        }

        nav{
          flex: 1;
          -webkit-backdrop-filter: blur(50px);
          backdrop-filter: blur(50px);
        }

        ul{
          list-style: none;
          padding: 0;
          

          color: #333;

          li{
            strong{
              display: flex;
              height: 40px;
              align-items: center;
              font-size: 16px;
              
              padding-left: 20px;
              cursor: pointer;

              &:hover{
                color: #fff;
                transform: scale(1.05);
                transition: transform .1s;
                background: rgba(255, 255, 255, .2);
              }
            }

            ul{
              padding: 0;

              -webkit-backdrop-filter: blur(50px);
              backdrop-filter: blur(50px);
              background: rgba(255, 255, 255, .5);

              li{
                height: 40px;
                padding-left: 45px;
                display: flex;
                align-items: center;

                &:hover{
                  color: #fff;
                  transform: scale(1.05);
                  transition: transform .1s;
                  background: rgba(255, 255, 255, .2);
                }
              }
            }
          }
          
        }
      }
  
      
  
      section{
        display: flex;
        flex-direction: column;
        flex: 1;
  
        header{
          height: 50px;
          width: 100%;
          // background: linear-gradient(to bottom, #eee, #fff);
          background: #fff;
          // border-bottom: 1px solid rgba(0, 0, 0, .2);
        }
  
        article{
          flex: 1;
          background: #faf8fb;
          padding: 10px;
          // background: green;
        }
      }
  
    }
  }

</style>
