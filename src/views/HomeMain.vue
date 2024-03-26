<template>
  <section>
        <article class="main1">
          <div>
            <h1>
              <span>다음 세대</span>와 <br>
              <span>지역 사회</span>를 품는 <span>비전</span>을 가진 <br>
              <strong>그루터기 작은 도서관</strong>
            </h1>
            <div class="input-form">
              <input type="text" />
              <span class="search-icon"></span>
              <img src="@/assets/main1-search-deco.svg"/>
            </div>
            <h2>
              <strong>L</strong>ibrary with a vision that
              <strong>E</strong>mbraces the
              <strong>N</strong>ext genaration and
              <strong>T</strong>own
            </h2>
          </div>
        </article>
        <article class="main2">
          <div class="info">
            <h3>
              <span>우리 도서관은 <br /> 약 <strong>8,000</strong>권의</span><br /> <span>도서를 보유하고 있습니다.</span>
            </h3>
            <img src="@/assets/main2-deco.svg"/>
          </div>
          <header>
            <h2>최근 등록 도서</h2>
            <button>더보기</button>
          </header>
          <ul>
            <li>
              <div class="book class100"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class200"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class300"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class400"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class500"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class600"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class700"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class800"></div>
              <p class="txt-overflow1">책이름름름름</p>
            </li>
            <li>
              <div class="book class900"></div>
              <p>책이름름름름</p>
            </li>
          </ul>
        </article>
        <article class="main3">
          <div class="info">
            <img src="@/assets/main3-deco.svg"/>
            <h3>
              <!-- <span>우리 도서관은 <br /> 약 <strong>8,000</strong>권의</span><br /> <span>도서를 보유하고 있습니다.</span> -->
              <span>우리 도서관은 <br class="br360"/> <strong>다양한 활동</strong>을 통해 <br /> 지역 주민들과 <strong>소통</strong>합니다.</span>
            </h3>
          </div>
          <header>
            <h2>진행중인 행사</h2>
            <button>더보기</button>
          </header>
          <ul>
            <li>
              <div class="activity-cover">
                <img src="@/assets/activity.svg" />
              </div>
              <div class="activity-txt">
                <h4 class="txt-overflow1">어린이 발레</h4>
                <!-- <p class="txt-overflow1">
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                  발레합니다 발레합니다
                </p> -->
              </div>
            </li>
          </ul>
        </article>
      </section>
</template>

<style lang="scss" scoped>

  .main{
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  main{
    position: relative;
    flex: 1;
    overflow-y: auto;

    padding: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .2);
    border-radius: 20px 20px 0 0;
    background: #fcfcfc;

    &::-webkit-scrollbar {
        width: 10px; /*스크롤바의 너비*/
    }

    &::-webkit-scrollbar-thumb {
        // background-color: rgba(94, 207, 94, 0.3); /*스크롤바의 색상*/
        background-color: rgba(94, 207, 94, 1); /*스크롤바의 색상*/
        background-clip: padding-box;
        border: 2px solid transparent;
        border-top-right-radius: 50px;
        border-bottom-left-radius: 50px;
    }

    &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, .2); /*스크롤바 트랙 색상*/
        background-clip: padding-box;
        border: 2px solid transparent;
        border-top-right-radius: 50px;
        border-bottom-left-radius: 50px;
    }
 
    
    section{
      height: 100%;
      // display: flex;
      // flex-direction: column;
      // align-items: center;

      & > article{
        max-width: 1080px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      }
      .main1{
        padding-bottom: 50px;
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        margin-bottom: 50px;

        h1{
          font-size: 12px;
          font-size: 18px;
          margin-bottom: 20px;
          span{
            color: var(--color-green);
            font-size: 24px;
          }

          strong{
            display: inline-block;
            margin-top: 10px;
            font-size: 32px;
          }

          br{display: none;}
        }

        .input-form{
          position: relative;
          width: 100%;
          margin-bottom: 50px;
          // max-width: 500px;

          input{
            width: calc(100% - 60px);
            height: 40px;
            border-radius: 20px;
            border: 1px solid #eee;
            background: #fff;
            padding: 10px 20px;
            padding-left: 50px;
            position: relative;
            z-index: 1;
          }

          .search-icon{
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid var(--color-green);
            display: block;
            top: 5px;
            left: 15px;
            z-index: 1;

            &:after{
              content: '';
              display: block;
              width: 3px;
              height: 10px;
              transform: rotate(-45deg);
              background: var(--color-green);
              position: absolute;
              bottom: -8px;
              right: -4px;
              
            }
          }
          
          img{
            width: 150px;
            position: absolute;
            right: 0;
            bottom: 20px;
          }

        }

        h2{
          text-align: center;
          strong{
            color: var(--color-green);
            font-size: 24px;
          }
        }
      }

      .main2{
        padding-bottom: 50px;
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        margin-bottom: 50px;

        .info{
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          padding-bottom: 50px;
          border-bottom: 1px dashed rgba(0, 0, 0, .05);
          margin-bottom: 50px;

          img{
            height: 300px;
          }

          br{display: none;}

          h3{
            font-weight: bold;
            font-size: 20px;
            letter-spacing: -.5px;

            strong{
              padding: 0 5px;
              border-radius: 5px;
              background: var(--color-green);
              color: #fff;
              font-size: 30px;
              letter-spacing: 3px;
              font-weight: bold;
              margin: 0 5px;
            }
          }
        }


        header{
          display: flex;
          align-items: center;
          // justify-content: space-between;
          margin-bottom: 10px;

          h2{

          }

          button{
            background: #fff;
            border: 0;
            outline: 0;
            padding: 10px;
            border: 1px solid #eee;
            background: linear-gradient(to top, var(--color-green) 50%, rgba(94, 207, 94, 0.9) 0);
            color: #fff;
            border-radius: 5px;
            font-weight: bold;
            margin-left: 10px;
          }
        }

        ul{
          list-style: none;
          margin: 0;
          padding: 0;
          overflow-x: auto;
          display: flex;
          margin-right: -20px;
          

          li{
            margin-right: 15px;
            width: 100px;
            .book{
              width: 100px;
              height: 150px;
              border-radius: 0 15px 0 0;
              // border: 1px solid var(--color-green);
              position: relative;
              background: #fff;
              box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
              padding-top: 10px;
              margin-bottom: 10px;

              &.class100{background: #faaace;}
              &.class200{background: #dfbebc;}
              &.class300{background: #febfbf;}
              &.class400{background: #caadda;}
              &.class500{background: #febeee;}
              &.class600{background: #bcedcc;}
              &.class700{background: #ccebce;}
              &.class800{background: #ededbe;}
              &.class900{background: #aabdef;}
              
              &:after{
                content: '';
                display: block;
                width: 80%;
                height: 30px;
                border-radius: 5px;
                margin: 10px auto;
                background: #fff;
              }

            }

            p{
              width: 100px;
            }

            &:last-child{margin-right: 20px;}
          }
        }
      }
      
      .main3{
        padding-bottom: 50px;
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        margin-bottom: 50px;

        .info{
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          padding-bottom: 50px;
          border-bottom: 1px dashed rgba(0, 0, 0, .05);
          margin-bottom: 50px;

          img{
            max-width: 100%;
            width: 400px;
          }

          br{display: none;}
          
          h3{
            font-weight: bold;
            font-size: 20px;
            
            strong{
              font-size: 24px;
              padding: 0 5px;
              margin: 0 5px;
              background: linear-gradient(to top, var(--color-green) 12px, transparent 0);
            }
          }
        }
        
        header{
          display: flex;
          align-items: center;
          // justify-content: space-between;
          margin-bottom: 10px;
          
          h2{
            
          }
          
          button{
            background: #fff;
            border: 0;
            outline: 0;
            padding: 10px;
            border: 1px solid #eee;
            background: linear-gradient(to top, var(--color-green) 50%, rgba(94, 207, 94, 0.9) 0);
            color: #fff;
            border-radius: 5px;
            font-weight: bold;
            margin-left: 10px;
          }
        }
        ul{
          list-style: none;
          margin: 0;
          padding: 0;
          // overflow-x: auto;
          // display: flex;
          margin-right: -20px;
  
          li{
            margin-bottom: 10px;
            width: 100%;
            box-shadow: 0 3px 5px rgba(0, 0, 0, .05);
            padding: 10px;
            border-radius: 10px;
            border: 1px solid #eee;
            display: flex;

            .activity-cover{
              width: 300px;
              height: 180px;
              border-radius: 10px;
              padding: 10px;
              border: 1px solid #eee;
              margin-right: 10px;

              img{
                // width: 100%;
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
            }
            .activity-txt{
              flex: 1;
              overflow: hidden;
              h4{

                font-size: 16px;
                font-weight: bold;
                
              }
              p{
              }

            }
  
  
            &:last-child{margin-bottom: 0;}
          }
        }
      }
     }
  }

  @media (max-width: 1080px){

    main section .main3{
      .info{
        h3{
          
          br{display: block;}
          .br360{display: none;}
        }
      }
    }

  }
  @media (max-width: 1000px){
    main{
      position: relative;
      // transition: transform .5s;
      // transform: translateY(50px);
    
    &.show-menu{
      transform: translateY(170px);
    }
    // margin: 0 5px;
    
    section{
        .main2{

          .info{
            img{
              height: 300px;
            }

            h3{
              br{display: block;}
            }
          }


          // header{
          //   display: flex;
          //   align-items: center;
          //   justify-content: space-between;
          // }
        }

        
     }
  }
  }
  @media (max-width: 900px){
    main{
    
    section{

       .main1{

        h1{
          font-size: 12px;

          span{
            font-size: 16px;
          }

          strong{
            font-size: 20px;
          }

          br{display: block;}
        }

       }
     }
  }
  }
  @media (max-width: 800px){
    main section .main3{
      .info{
        display: block;
        text-align: center;

        h3{
          margin-top: 50px;
          letter-spacing: -3px;
          br{display: block;}
        }
      }
    }
  }
  @media (max-width: 761px){

    main section .main2 .info{
      display: block;
      text-align: center;

      img{margin-top: 50px; max-width: 100%;}
    }
  }
  @media (max-width: 360px){

    main{
      section{
        .main1{
          .input-form{
            margin-top: 100px;

            input{width: 100%;}
          }
        }

        .main3{
          .info{
            h3{
              letter-spacing: -3px;
              .br360{display: block;}
            }
          }
        }
      }
    }
  }
</style>
