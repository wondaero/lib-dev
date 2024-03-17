<script setup>
  import { reactive, ref, nextTick } from 'vue';
  import axios from 'axios';
  import commonJS from '../../assets/common';
  import { useRouter } from 'vue-router';

  const nameInput = ref(null);
  const telInput = ref(null);
  const addrInput = ref(null);
  const genderInput = ref(null);
  const birthInput = ref(null);

  const state = reactive({
    userDetail: {
      gender: '남자',
      borrowingLimit: 5,
      duePeriod: 14
    }
  });

  const router = useRouter();
  const curUserCde = router.currentRoute.value.params.user_cde;

  if(curUserCde){ //상세 데이터 가져오기
    axios.get(`http://localhost:3000/getUserDetailByUserCde?userCde=${curUserCde}`).then((res) => {
      const { data } = res;

      state.userDetail = {
        seq: data[0].seq,
        userCde: data[0].user_cde,
        name: data[0].name,
        tel: data[0].tel,
        email: data[0].email,
        gender: data[0].gender,
        birth: data[0].birth ? commonJS.setYYYYMMDD(data[0].birth) : '',
        addr: data[0].address,
        borrowingLimit: data[0].borrowing_limit,
        duePeriod: data[0].due_period,

        regDt: commonJS.setYYYYMMDD(data[0].reg_dt)
      }
    });
  }

  
  const regUser = () => {
    if(!chkRequired()){
      alert('필수 값을 입력해주세요.');
      return;
    }

    state.userDetail.userCde = getRdmTxt(10) + new Date().getTime();

    axios.post("http://localhost:3000/regUser", state.userDetail)
    .then((res) => {
      console.log(res);
      if(res.data.length === 2 && res.data[0].affectedRows === 1){
        alert('등록되었습니다.');
        state.userDetail = {
          gender: '남자',
          borrowingLimit: 5,
          duePeriod: 14
        };
      }else{
        console.error(res);
        alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
    });
  }

  const getRdmTxt = (len = 10) => {
    const txt = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rtnTxt = '';

    const getRdmNum = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1)) + mn;

    for(let i = 0; i < len; i++) rtnTxt += txt[getRdmNum(0, txt.length - 1)];

    return rtnTxt;
  }

  const updateUser = () => {
    if(!confirm('수정하시겠습니까?')) return;

    if(!chkRequired()){
      alert('필수 값을 입력해주세요.');
      return;
    }

    axios.post("http://localhost:3000/updateUser", state.userDetail)
    .then((res) => {
      if(res.data.length === 2 && res.data[0].affectedRows === 1){
        alert('수정되었습니다.');

      }else{
        console.error(res);
        alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
    });
  }
  const delUser = () => {
    if(!confirm('정말로 삭제하시겠습니까?')) return;


    axios.post("http://localhost:3000/delUser", state.userDetail)
    .then((res) => {
      if(res.data.length === 2 && res.data[0].affectedRows === 1){

        alert('삭제되었습니다.');
        router.replace({name: 'userlist'});
      }else{
        console.error(res);
        alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('처리에 실패했습니다.\n관리자에게 문의해주세요.');
    });
  }

  const chkRequired = () => {
    const chkedInputs = [nameInput, telInput];

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

</script>
<template>
  <article class="user1-page">
    <h1>유저 {{ curUserCde ? '상세' : '등록' }}</h1>
    <div class="white-box user-info">
      <div class="grid">
        <div class="row">
          <label class="col">
            <span class="title ast">이름</span>
            <input type="text" v-model="state.userDetail.name" ref="nameInput"/>
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">생년월일</span>
            <input ref="birthInput" type="date" v-model="state.userDetail.birth" />
          </label>
        </div>
        <div class="row gender-row">
          <div class="col">
            <span class="title">성별</span>
            <div>
              <label>
                <input type="radio" name="gender" value="남자" v-model="state.userDetail.gender" />
                <strong>남자</strong>
              </label>
              <label>
                <input type="radio" name="gender" value="여자" v-model="state.userDetail.gender" />
                <strong>여자</strong>
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <label class="col">
            <span class="title ast">전화번호</span>
            <input type="text" ref="telInput" v-model="state.userDetail.tel" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title">주소</span>
            <input type="text" ref="addrInput" v-model="state.userDetail.addr" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title ast">최대 대여 권수</span>
            <input type="number" ref="addrInput" v-model="state.userDetail.borrowingLimit" />
          </label>
        </div>
        <div class="row">
          <label class="col">
            <span class="title ast">대여기간</span>
            <input type="number" ref="addrInput" v-model="state.userDetail.duePeriod" />
          </label>
        </div>
        <div class="row" v-if="state.userDetail.regDt">
          <label class="col">
            <span class="title">등록일</span>
            <input type="text" ref="bookCdeInput" readonly v-model="state.userDetail.regDt" />
          </label>
        </div>
        <div class="row btns">
          <button class="btn-form btn-search" v-if="!state.userDetail.regDt" @click="regUser">회원 등록</button>
          <button class="btn-form btn-del" v-if="state.userDetail.regDt" @click="delUser">회원 삭제</button>
          <button class="btn-form btn-update" v-if="state.userDetail.regDt" @click="updateUser">회원 수정</button>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.user1-page{
  display: flex;
  flex-direction: column;

  .ast:before{
    content: '*';
    margin-right: 10px;
    font-size: 20px;
    font-weight: bolder;
    color: var(--color-red);
  }
  .user-info{

    .grid{
      .row{
        margin-bottom: 10px;
        
        &:last-child{margin-bottom: 0;}

        &.gender-row{
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
                cursor: pointer;

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
            width: 130px;
            text-align: right;
            padding-right: 10px;
            box-sizing: border-box;
          }
          input[type="text"], input[type="number"]{
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

          input[type="date"]{
            width: 300px;
            height: 32px;
            padding: 5px 10px;
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

  }
  .user-info button.btn-del{background: var(--color-red); color: #fff; margin-right: 5px;}
  .user-info button.btn-update{background: var(--color-orange); color: #fff;}

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
