<script setup>
  import { reactive, onMounted } from 'vue';
  import axios from 'axios';

  const state = reactive({
    bookWithNoClassCde: 0,
  });

  const getBooksWithNoClassCdeCnt = () => {
    axios.get("http://localhost:3000/getBooksWithNoClassCdeCnt").then((res) => {
      state.bookWithNoClassCde = res.data[0].CNT;
    });
  }

  onMounted(() => {
    getBooksWithNoClassCdeCnt();
  })

</script>
<template>
  <div class="main-wrapper">
    <main>
      <aside>
        <h1 class="logo"><img alt="logo" src="@/assets/lib-logo.svg" height="40" /></h1>
        <div class="thumbnail"></div>
        <nav>
          <ul>
            <li>
              <strong><RouterLink to="/admin/booklist">도서</RouterLink></strong>
              <ul>
                <li><RouterLink to="/admin/booklist">도서 목록</RouterLink></li>
                <li><RouterLink to="/admin/book1">도서 등록</RouterLink></li>
              </ul>
            </li>
            <li>
              <strong><RouterLink to="/admin/userlist">회원</RouterLink></strong>
              <ul>
                <li><RouterLink to="/admin/userlist">회원 목록</RouterLink></li>
                <li><RouterLink to="/admin/user1">회원 등록</RouterLink></li>
              </ul>
            </li>
            <li>
              <strong><RouterLink to="/admin/borrowedBookList">대여/반납</RouterLink></strong>
              <ul>
                <li><RouterLink to="/admin/borrowedBookList">대여 목록</RouterLink></li>
                <li><RouterLink to="/admin/borrow">대여</RouterLink></li>
                <li>반납</li>
              </ul>
            </li>
            <li>
              <strong><RouterLink to="/admin/bookListWithNoClassCde">프린터</RouterLink></strong>
              <ul>
                <li>
                  <RouterLink to="/admin/bookListWithNoClassCde">
                    청구번호 관리
                    <span v-if="state.bookWithNoClassCde > 0">{{ state.bookWithNoClassCde }}</span>
                  </RouterLink>
                </li>
                <li>바코드 출력</li>
              </ul>
            </li>
            <!-- <li>
              <strong>
                <RouterLink to="/admin/bookListWithNoClassCde">
                  청구번호 관리
                  <span v-if="state.bookWithNoClassCde > 0">{{ state.bookWithNoClassCde }}</span>
                </RouterLink>
              </strong>
            </li> -->
          </ul>
        </nav>
      </aside>
      <section>
        <header></header>
        <RouterView @childToParent="getBooksWithNoClassCdeCnt"/>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .main-wrapper{
    // padding: 10px;
    height: 100vh;
    min-width: 1080px;
    
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

            cursor: pointer;

            a{
              text-decoration: none;
              color: #000;

              span{
                  min-width: 20px;
                  padding: 0 5px;
                  background: red;
                  display: inline-block;
                  vertical-align: top;
                  color: #fff;
                  border-radius: 20px;
                  text-align: center;
                  font-weight: bold;
                  font-size: 12px;
                }
            }

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
                padding-left: 30px;
                display: flex;
                align-items: center;

                &:hover{
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
        flex: 1 0 auto;
  
        header{
          height: 50px;
          min-height: 50px;
          width: 100%;
          // background: linear-gradient(to bottom, #eee, #fff);
          background: #fff;
          // border-bottom: 1px solid rgba(0, 0, 0, .2);
        }
  
        article{
          flex: 1;
          background: #faf8fb;
          padding: 20px;
        }
      }
  
    }
  }

</style>
