<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { ref } from 'vue'

  const header = ref(null);
  const hamburger = ref(null);
  const nav = ref(null);

  const setMenu = (bool) => {
    if(window.innerWidth < 761) return;
    const target = header._value;
    if(bool === undefined) target.classList.toggle('show-menu');
  }
  const setMenu_m = (bool) => {
    const target = hamburger._value;
    if(bool === undefined) target.classList.toggle('close');
    nav._value.classList[target.classList.contains('close') ? 'add' : 'remove']('show-menu');
  }
</script>
<template>
  <header ref="header" class="home-header">
      <div>
        <h1 class="logo"><img alt="logo" src="@/assets/lib-logo.svg" height="40" /></h1>
        <nav ref="nav">
          <ul @mouseenter="setMenu();" @mouseleave="setMenu();">
            <li>
              <strong>도서관정보</strong>
              <ul>
                <li>도서관소개</li>
                <li>이용안내</li>
                <li>오시는길</li>
              </ul>
            </li>
            <li>
              <strong>도서관련</strong>
              <ul>
                <li>도서검색</li>
                <li>도서신청</li>
                <li>신간도서</li>
              </ul>
            </li>
            <li>
              <strong>열린마당</strong>
              <ul>
                <li><RouterLink to="/notice">공지사항</RouterLink></li>
                <li>건의사항</li>
                <li><RouterLink to="/activity">도서관활동</RouterLink></li>
              </ul>
            </li>
            <li>
              <strong>나눔터</strong>
              <ul>
                <li>물품나눔</li>
                <li>재능나눔</li>
              </ul>
            </li>
            <li>
              <!-- <strong><RouterLink to="/admin">도서관관리</RouterLink></strong> -->
              <strong><RouterLink to="/admin">도서관관리</RouterLink></strong>
              <!-- <strong>도서관관리</strong> -->
            </li>
          </ul>
        </nav>
        <div ref="hamburger" class="hamburger" @click="setMenu_m();">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
