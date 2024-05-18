const methods = {
  calcPage(option) {
    const TOTAL_CNT = option.totalListCnt;
    const VIEW_PAGE = option.viewPageCnt ? option.viewPageCnt : 10;
    const VIEW_LIST = option.viewListPage ? option.viewListPage : 10;
    const CALC = (total, view) => parseInt(total / view) + (total % view > 0 ? 1 : 0);
    const PAGE_CNT = CALC(TOTAL_CNT, VIEW_LIST);
    
    return {
      pagePosition: 1,
      pageGroupPosition: 1,
      pageCnt: PAGE_CNT,
      pageGroupCnt: CALC(PAGE_CNT, VIEW_PAGE),
      viewListCnt: VIEW_LIST,
      viewPageCnt: VIEW_PAGE
    }
  },

  setGroupByNum(num, groupCnt){ //90부터

    let tmpArr = [];
    for(let i = 0; i < groupCnt; i++){
      tmpArr.push(i + ((num - 1) * groupCnt));
    }

    // arr.forEach((el, idx) => {
    //   if((listCnt * (position - 1)) <= idx && idx < listCnt * (position)) tmpArr.push(el);
    // })
    return tmpArr;
  },

  getLimitParam(offset, cnt){
    return (offset - 1) * cnt;
  },

  initPageControl(totalCnt, limitCnt, limitPage, pageOffset = 1){
    const CALC1 = (a, b) => parseInt(a / b) + (a % b > 0 ? 1 : 0);
    const PAGE_GROUP_OFFSET = Math.ceil(pageOffset / limitPage);
    const PAGE_CNT = CALC1(totalCnt, limitCnt);
    const GROUP_CNT = CALC1(PAGE_CNT, limitPage);
    
    return {
      pagePosition: pageOffset,
      pageGroupPosition: PAGE_GROUP_OFFSET,
      pageCnt: PAGE_CNT,
      pageGroupCnt: GROUP_CNT,
      viewListCnt: limitCnt,
      viewPageCnt: limitPage
    }
  },

  xmlToObjArr(option) {
    let arr = [];
    // console.log(option);
    const tagArr = option.xml.getElementsByTagName(option.tagName);
    for (let i = 0; i < tagArr.length; i++) {
        let tmpObj = {};
        for (let j = 0; j < tagArr[i].children.length; j++) {
            tmpObj[tagArr[i].children[j].nodeName] = tagArr[i].children[j].textContent;
        }
        arr.push(tmpObj);
    }
    return arr;
  },

  getClassifiedBookInfo(bookInfo){
    //텍스트 커스터마이징
    
    //isbn
    let isbn = bookInfo.ISBN.split('(')[0].trim();	//1차

    //총서명
    let seriesTitle = '';
    if(bookInfo.SERIES_INFO){
      seriesTitle = bookInfo.SERIES_INFO.split(';')[0]	//1차
      seriesTitle = seriesTitle.split(',')[1].trim();	//2차
    }
    
    //서명권차(보류)
    // let seriesNo = bookInfo[0].TITLE_INFO.split('/')[0].trim();	//1차
    // if(seriesNo.indexOf('.,') != -1){
      // seriesNo = seriesNo.split('.,')[1].trim(); //2차
    // }else{
      // seriesNo = '';
    // }
    
    //분류기호
    let classNo = bookInfo.CLASSFY_INFO.split(',')[0];
    classNo = classNo.split('->')[1].trim();
    classNo = classNo.split('/')[0].trim(); //뒤에 더 길때 자름
    
    //청구권차
    let startVol = '';
    let seriesInfoArr = bookInfo.SERIES_INFO.split(',');
    if(seriesInfoArr.length > 3){
      startVol = seriesInfoArr[seriesInfoArr.length - 2].trim();
    }
    startVol = startVol.replace(/v. /gi, '').trim();
    
    //딸림자료
    let withThings;
    if(bookInfo.FORM_INFO.indexOf('+,') != -1){
      withThings = bookInfo.FORM_INFO.split('+,')[1].trim(); //2차
    }
    
    //object에 담기
    let tmpObj = {};
    
    tmpObj.isbn = isbn;
    tmpObj.seriesTitle = seriesTitle;
    // tmpObj.seriesNo = seriesNo;
    tmpObj.classNo = classNo;
    tmpObj.startVol = startVol;
    tmpObj.withThings = withThings;
    tmpObj.classCde = '';

    return tmpObj;
  },

  getClassCde: function (title, sTitle, auth) {
    let authorCde = "";
    let seriesTitle = sTitle.replace(/ /gi, "");
    let author = auth.replace(/ /gi, "");

    let s_closePrnthIdx = seriesTitle.indexOf(")");
    let a_closePrnthIdx = author.indexOf(")");

    if (s_closePrnthIdx != -1 && s_closePrnthIdx + 2 < seriesTitle.length) {
      seriesTitle = seriesTitle.split(")")[1].trim();
    }
    if (a_closePrnthIdx != -1 && a_closePrnthIdx + 2 < author.length) {
      author = author.split(")")[1].trim();
    }

    if (!title) {
      alert("서명을 확인해주세요.");
      return;
    }

    const seriesOrAuth = seriesTitle || author;
    const seriesOrAuthTxt = seriesTitle ? "'총서명'이" : "'저자'가";


    switch (methods.langageIs(seriesOrAuth.substr(0, 2))) {
      case "kor":
        authorCde = methods.getLJC_v5(seriesOrAuth);
        break;
      default:
        const alterTxt = prompt(seriesOrAuthTxt + " 한글이 아닙니다.\n앞에 '두 글자'를 '한글'로 입력해주세요.");
        if(methods.langageIs(alterTxt) !== 'kor'){
          alert('두 글자 한글을 입력해주세요.');
          return;
        }
        authorCde = methods.getLJC_v5(alterTxt);
    }

    if(authorCde.indexOf('undefined') > -1){
      alert('올바른 두 글자 한글을 입력해주세요.');
      return;
    }
    if(!seriesTitle) authorCde += methods.getConstantVowel(title).f || title[0];
    return authorCde;
  },

  langageIs: function (str) {
    const pattern_num = /[0-9]/;	// 숫자 
    const pattern_eng = /[a-zA-Z]/;	// 문자 
    const pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    const pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

    // if( (pattern_num.test(str)) && !(pattern_eng.test(str)) && !(pattern_spc.test(str)) && !(pattern_kor.test(str)) ){
    // return true;
    // }else{
    // alert("숫자만 입력 가능합니다.")
    // return false;
    // }
    if (pattern_num.test(str)) return 'num';
    if (pattern_eng.test(str)) return 'eng';
    if (pattern_spc.test(str)) return 'spc';
    if (pattern_kor.test(str)) return 'kor';
  },


  getLJC_v5: function (str) {	//이재철5표 ex)황순원 -> 황56
    if (!methods.is_hangul_char(str)) return;
    const rtnVal = str[0];
    const separatedStr = this.getConstantVowel(str[1]);

    const LJC_v5_cde = {	//초성이 ㅊ이면 +2
        'ㄱ': 1, 'ㄲ': 1, 'ㄴ': 19, 'ㄷ': 2, 'ㄸ': 2, 'ㄹ': 29, 'ㅁ': 3, 'ㅂ': 4, 'ㅃ': 4,
        'ㅅ': 5, 'ㅆ': 5, 'ㅇ': 6, 'ㅈ': 7, 'ㅉ': 7, 'ㅊ': 8, 'ㅋ': 87, 'ㅌ': 88, 'ㅍ': 89, 'ㅎ': 9,
        'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 3, 'ㅓ': 4, 'ㅔ': 4, 'ㅕ': 4, 'ㅖ': 4,
        'ㅗ': 5, 'ㅘ': 5, 'ㅙ': 5, 'ㅚ': 5, 'ㅛ': 5, 'ㅜ': 6, 'ㅝ': 6, 'ㅞ': 6, 'ㅟ': 6, 'ㅠ': 6,
        'ㅡ': 7, 'ㅢ': 7, 'ㅣ': 8,
        'ㅏ2': 2, 'ㅐ2': 2, 'ㅑ2': 2, 'ㅒ2': 2, 'ㅓ2': 3, 'ㅔ2': 3, 'ㅕ2': 3, 'ㅖ2': 3,
        'ㅗ2': 4, 'ㅘ2': 4, 'ㅙ2': 4, 'ㅚ2': 4, 'ㅛ2': 4, 'ㅜ2': 5, 'ㅝ2': 5, 'ㅞ2': 5, 'ㅟ2': 5, 'ㅠ2': 5,
        'ㅡ2': 5, 'ㅢ2': 5, 'ㅣ2': 6
    }

    let secondCde = String(LJC_v5_cde[separatedStr.f]);
    secondCde += secondCde === 8 ? LJC_v5_cde[separatedStr.s + 2] : LJC_v5_cde[separatedStr.s];

    return rtnVal + secondCde;
  },

  getConstantVowel: function (kor) {	//한글 분리
    const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
        'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
        'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
        'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
        'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
        'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
        'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
        'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const ga = 44032;
    let uni = kor.charCodeAt(0);

    uni = uni - ga;

    let fn = parseInt(uni / 588);
    let sn = parseInt((uni - (fn * 588)) / 28);
    let tn = parseInt(uni % 28);

    return {
        f: f[fn],
        s: s[sn],
        t: t[tn]
    };
  },

  is_hangul_char: function (ch) {	//한글인지 아닌지
    if (!ch) return false;
    const c = ch.charCodeAt(0);
    if (0x1100 <= c && c <= 0x11FF) return true;
    if (0x3130 <= c && c <= 0x318F) return true;
    if (0xAC00 <= c && c <= 0xD7A3) return true;
    return false;
  },

  objToURLParam: (obj) => {
    if(obj === undefined) return '';

    const param = '';
    const tmpArr = [];

    for(let key in obj){
      if(!obj[key]) continue;
      tmpArr.push(`${key}=${obj[key]}`);
    }

    return tmpArr.join('&');
  },

  setYYYYMMDD: d => {
    if(!d) return;
    return new Date(d).toLocaleDateString().split(' ').map(dd => parseInt(dd) < 10 ? '0' + parseInt(dd) : parseInt(dd)).join('-');
  }
}

class UtilFnc{
  constructor(param){
      this.char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  getRandomNum(mn, mx){
      return Math.floor(Math.random() * (mx - mn + 1)) + mn;
  }

  getRdmTxt(len){
      let rdmTxt = '';
      for(let i = 0; i < len; i++){
          rdmTxt += this.char[this.getRandomNum(0, this.char.length - 1)];
      }

      return rdmTxt;
  }
}

class TextArea2 extends UtilFnc{
  constructor(param){
      super();
      this.target = param.target;
      console.log(this.target);
      this.target.classList.add('custom-textarea');
      this.files = [];
      this.editable = param.editable !== undefined ? param.editable : true;


      if(this.editable) this.createHeader();
      this.createBody();


      if(param.option){

      }

  }
  createHeader(){
      const header = document.createElement('header');
      const ul = document.createElement('ul');

      let li;
      for(let i = 0; i < 1; i++){
          li = document.createElement('li');
          li.textContent = '이미지';
          li.addEventListener('click', () => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.click();

              fileInput.addEventListener('change', (e) => {

                  const fileId = super.getRdmTxt(12);

                  e.target.files[0].fileId = fileId;

                  this.files.push(e.target.files[0]);

                  console.log(this.files);

                  this.previewImg(e.target.files[0]);


              })
          })
          ul.appendChild(li);
      }
      // const imgBtn = document.createElement('button');
      // imgBtn.textConent = '이미지';

      header.appendChild(ul);
      this.target.appendChild(header);
  }

  createBody(){
      this.body = document.createElement('div');
      this.body.classList.add('textarea2');
      this.body.contentEditable = this.editable;

      this.target.append(this.body);
  }

  previewImg(file){
      const t = this;
      if(file){
          const reader = new FileReader();

          reader.onload = function (e) {

              const addedBr = document.createElement('br');
              const img = document.createElement('img');
              img.src = e.target.result;
              img.dataset.id = file.fileId;
              t.body.appendChild(img);
              t.body.appendChild(addedBr);
          }
             
          reader.readAsDataURL(file);
      }
  }

  text2obj(){
      const t = this;
      const validFiles = [];
      const tmpTag = document.createElement('div');
      tmpTag.innerHTML = this.body.innerHTML;

      let validFile;
      tmpTag.querySelectorAll('img').forEach((img, idx) => {
          validFile = t.files.filter(f => f.fileId === img.dataset.id)[0];

          if(validFile) validFiles.push(validFile);

          if(img.src.indexOf('data:image') === 0) img.src = '';
      })

      return {
          files: validFiles,
          content: tmpTag.innerHTML
      }
  }

  getContent(c){
      this.body.innerHTML = c;
  }

  setEditable(){
      this.editable = !this.editable;
  }
}


export default {
  xmlToObjArr: methods.xmlToObjArr,
  getClassifiedBookInfo: methods.getClassifiedBookInfo,
  getClassCde: methods.getClassCde,
  objToURLParam: methods.objToURLParam,
  setYYYYMMDD: methods.setYYYYMMDD,
  TextArea2: TextArea2
}