const categorySelect3 = document.getElementById('school-select-3');
const subcategorySelect3 = document.getElementById('grade-select-3');
const submitButton = document.getElementById('submitOverseas');

const categories = [
    '高校(High school student)',
    '高専(Technical college student)',
    '大学(University student)',
    '大学院(Graduate student)',
    'その他(Other)'
]

const subCategories = [
    {category:'高校(High school student)', name:'高校1年生(High school 1st grader)'},
    {category:'高校(High school student)', name:'高校2年生(High school 2nd grader)'},
    {category:'高校(High school student)', name:'高校3年生(High school 3rd grader)'},
    {category:'高専(Technical college student)', name:'高専1年生(Technical college 1st grader)'},
    {category:'高専(Technical college student)', name:'高専2年生(Technical college 2nd grader)'},
    {category:'高専(Technical college student)', name:'高専3年生(Technical college 3rd grader)'},
    {category:'高専(Technical college student)', name:'高専4年生(Technical college 4th grader)'},
    {category:'高専(Technical college student)', name:'高専5年生(Technical college 5th grader)'},
    {category:'大学(University student)', name:'大学1年生(University 1st grader)'},
    {category:'大学(University student)', name:'大学2年生(University 2nd grader)'},
    {category:'大学(University student)', name:'大学3年生(University 3rd grader)'},
    {category:'大学(University student)', name:'大学4年生(University 4th grader)'},
    {category:'大学院(Graduate student)', name:'大学院修士1年生(Master 1st grader)'},
    {category:'大学院(Graduate student)', name:'大学院修士2年生(Master 2nd grader)'},
    {category:'大学院(Graduate student)', name:'大学院博士1年生(Doctor 1st grader)'},
    {category:'大学院(Graduate student)', name:'大学院博士2年生(Doctor 2nd grader)'},
    {category:'大学院(Graduate student)', name:'大学院博士3年生(Doctor 3rd grader)'},
    {category:'その他(Other)', name:'中学校以下(Junior high school student or younger)'},
    {category:'その他(Other)', name:'社会人(Working adult)'},
    {category:'その他(Other)', name:'その他(Other)'}
]

const radio_selected = function() {
    const notallowed = document.getElementById('notAllowed');
    if (notallowed.classList.contains('showed')){
        // svgのcursorの変更のために表示・非表示を切り替える
        const allowed = document.getElementById('allowed');
        notallowed.classList.remove('showed');
        notallowed.classList.add('closed');
        allowed.classList.remove('closed');
        allowed.classList.add('showed');
    }
}

let activeIndex = null;//開いているアコーディオン
//アコーディオンコンテナ全てで実行
const accordions = document.querySelectorAll('.include-accordion');

const slideDownRecursive = function(el) {
    el.style.height = 'auto';
    const h = el.offsetHeight;
    el.animate({ height: [0, h + 'px'] }, { duration: 300 });
    el.style.height = 'auto';
    el.setAttribute('aria-hidden', 'false');
};

const slideUpRecursive = function(el) {
    const h = el.offsetHeight;
    el.style.height = h + 'px';
    el.animate({ height: [h + 'px', 0] }, { duration: 300 });
    el.style.height = 0;
    el.setAttribute('aria-hidden', 'true');

    el.querySelectorAll('ul').forEach((childUl) => {
        slideUpRecursive(childUl);
    });
};

accordions.forEach((accordion) => {
    const accordionBtns = accordion.querySelectorAll('.accordionBtn');
    accordionBtns.forEach((accordionBtn) => {
        accordionBtn.addEventListener('click', function () {
            const parentLi = accordionBtn.parentNode;
            const content = accordionBtn.nextElementSibling;
            const isActive = parentLi.classList.toggle('active');

            if (isActive) {
                slideDownRecursive(content);
                accordionBtn.setAttribute('aria-expanded', 'true');
            } else {
                content.querySelectorAll('.radio').forEach(function (radio) {
                    if(radio.checked){
                        const jpnObject = document.getElementById('notAllowed');
                        if(jpnObject.classList.contains('closed')){
                            const allowed = document.getElementById('allowed');
                            jpnObject.classList.remove('closed');
                            jpnObject.classList.add('showed');
                            allowed.classList.remove('showed');
                            allowed.classList.add('closed');
                        }
                        radio.checked = false;
                    }
                });
                slideUpRecursive(content);
                accordionBtn.setAttribute('aria-expanded', 'false');
            }

            const siblingLis = Array.from(parentLi.parentNode.children).filter((li) => li !== parentLi);
            siblingLis.forEach((siblingLi) => {
                siblingLi.classList.remove('active');
                const siblingContent = siblingLi.querySelector('ul');
                if (siblingContent) {
                    siblingContent.querySelectorAll('.radio').forEach(function (radio) {
                        if(radio.checked){
                            const jpnObject = document.getElementById('notAllowed');
                            if(jpnObject.classList.contains('closed')){
                                const allowed = document.getElementById('allowed');
                                jpnObject.classList.remove('closed');
                                jpnObject.classList.add('showed');
                                allowed.classList.remove('showed');
                                allowed.classList.add('closed');
                            }
                            radio.checked = false;
                        }
                    });
                    slideUpRecursive(siblingContent);
                }
            });

            

            siblingLis.forEach((siblingLi) => {
                const siblingBtn = siblingLi.querySelector('.accordionBtn');
                if (siblingBtn) {
                    siblingBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });
});

document.querySelectorAll('.radio').forEach(function (radio) {
    radio.addEventListener('change', (e) => {
        radio_selected();
    });
});

window.addEventListener("message", function (e) {
    const radios = document.querySelectorAll('.radio');
    let category = "";
    let selectedClass = "";
    let univ = "";
    radios.forEach(function (radio) {
        if(radio.checked){
            category = radio.parentNode.parentNode.getElementsByClassName('accordionBtn')[0].textContent;
            selectedClass = radio.parentNode.querySelector('[for="'+radio.id+'"]').innerText;
        }
        if (category == 'その他'){
            category = '';
        }
        if (category == '' || category == '他大学院' || category == '他大学' || category == '高専' || category == '高校'){
            univ = " ";
        } else {
            univ = "電通大";
        }
    });
    let text = "";
    if(text = prompt(e.data + "の" + category + ' ' + selectedClass + "で間違いないでしょうか？\n以下には学校名など、任意でご記入ください。", univ)){
        //csvに保存する処理が始まる!!
        //backに送る
        if (text === " "){
            text = "";
        }
        fetch('/append-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prefecture: e.data,
                classification: category + selectedClass,
                university: text
            })
        }).then((res) => {
            return res.text();
        }).then((text) => {
            if(text == 'Saved'){
                alert('データの保存が完了しました。');
                //初期化
                const accordions = document.querySelectorAll('.include-accordion');
                accordions.forEach(function (accordion) {
                    const accordionBtns = accordion.querySelectorAll('.accordionBtn');
                    accordionBtns.forEach( function(accordionBtn) {
                        accordionBtn.parentNode.classList.remove('active');
                        accordionBtn.setAttribute('aria-expanded', 'false'); //WAI-ARIA対応、開いた状態かどうかを示す
                        const openedContent = accordionBtn.nextElementSibling;
                        openedContent.querySelectorAll('.radio').forEach(function (radio) {
                            if(radio.checked){
                                const jpnObject = document.getElementById('notAllowed');
                                if(jpnObject.classList.contains('closed')){
                                    const allowed = document.getElementById('allowed');
                                    jpnObject.classList.remove('closed');
                                    jpnObject.classList.add('showed');
                                    allowed.classList.remove('showed');
                                    allowed.classList.add('closed');
                                }
                                radio.checked = false;
                            }
                        });
                        slideUpRecursive(openedContent); //現在開いている他のメニューを閉じる
                    });
                });
            }else{
                alert('データの保存に失敗しました。');
            }
        });
    }
});

// 最初にタブ1を表示
document.addEventListener("DOMContentLoaded", function () {
    showContent(0);
});

// タブの内容を切り替える関数
function showContent(index) {
    // 初期化
    const clickedTab = document.getElementById("content-" + index);
    if(clickedTab.classList.contains('active2')){
        return;
    }
    const accordions = document.querySelectorAll('.include-accordion');
    accordions.forEach(function (accordion) {
        const accordionBtns = accordion.querySelectorAll('.accordionBtn');
        accordionBtns.forEach( function(accordionBtn) {
            accordionBtn.parentNode.classList.remove('active');
            accordionBtn.setAttribute('aria-expanded', 'false'); //WAI-ARIA対応、開いた状態かどうかを示す
            const openedContent = accordionBtn.nextElementSibling;
            openedContent.querySelectorAll('.radio').forEach(function (radio) {
                if(radio.checked){
                    const jpnObject = document.getElementById('notAllowed');
                    if(jpnObject.classList.contains('closed')){
                        const allowed = document.getElementById('allowed');
                        jpnObject.classList.remove('closed');
                        jpnObject.classList.add('showed');
                        allowed.classList.remove('showed');
                        allowed.classList.add('closed');
                    }
                    radio.checked = false;
                }
            });
            slideUpRecursive(openedContent); //現在開いている他のメニューを閉じる
        });
    });

    categorySelect3.options[0].selected = true;
    optionClear('#grade-select-3 > option');
    subcategorySelect3.appendChild(firstOpion());
    subcategorySelect3.disabled = true;
    
    document.getElementsByClassName('textbox-2')[0].value = '';
    document.getElementsByClassName('textbox-2')[1].value = '';
    // すべてのタブとコンテンツを非表示にする
    var tabs = document.querySelectorAll('.tab');
    var contents = document.querySelectorAll('.content');

    tabs.forEach(function (tab) {
        tab.classList.remove('active2');
    });

    contents.forEach(function (content) {
        content.classList.remove('active2');
    });

    // クリックされたタブとそのコンテンツを表示
    tabs[index].classList.add('active2');
    contents[index].classList.add('active2');
}

function firstOpion(){
    const first = document.createElement('option');
    first.textContent = '選択してください(Please choose one)';
    return first;
}

function optionClear(node){
    const options = document.querySelectorAll(node);
    options.forEach(function(option){
        option.remove();
    });
}

categories.forEach(category => {
    const option = document.createElement('option');
    option.textContent = category;

    categorySelect3.appendChild(option);
});

categorySelect3.addEventListener('input', () => {
    optionClear('#grade-select-3 > option');
    subcategorySelect3.appendChild(firstOpion());
    subcategorySelect3.disabled = false;

    if(categorySelect3.value == '選択してください(Please choose one)'){
        subcategorySelect3.disabled = true;
        return;
    }
    
    subCategories.forEach(subCategory => {
        if(subCategory.category == categorySelect3.value){
            const option = document.createElement('option');
            option.textContent = subCategory.name;
            subcategorySelect3.appendChild(option);
        }
    });
});

submitButton.addEventListener('click', () => {
    if(categorySelect3.value == '選択してください(Please choose one)'){
        alert('学校区分を選択してください。(Please choose the school classification)');
        return;
    }else if(subcategorySelect3.value == '選択してください(Please choose one)'){
        alert('学年を選択してください。(Please choose your grade)');
        return;
    }else if(document.getElementsByClassName('textbox-2')[0].value == ''){
        alert('国名を入力してください。(Please input your country name)');
        return;
    }

    //subcategorySelect3.valueから学年の日本語名と英語名を取得
    let japaneseName = subcategorySelect3.value.split('(')[0];
    const englishName = subcategorySelect3.value.split('(')[1].slice(0, -1);
    if(confirm(document.getElementsByClassName('textbox-2')[0].value + "の" + japaneseName + "で間違いないでしょうか？\nAre you sure you are in " + englishName + " in " + document.getElementsByClassName('textbox-2')[0].value + "?")){
        //csvに保存する処理が始まる!!
        //backに送る
        if (japaneseName.slice(0,-3) == '大学' || japaneseName.slice(0,-5) == '大学院'){
            japaneseName = '他' + japaneseName;
        }
        fetch('/append-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prefecture: document.getElementsByClassName('textbox-2')[0].value,
                classification: japaneseName,
                university: document.getElementsByClassName('textbox-2')[1].value
            })
        }).then((res) => {
            return res.text();
        }).then((text) => {
            if(text == 'Saved'){
                alert('データの保存が完了しました。\nData has been saved.');
                //初期化
                showContent(0);
            }else{
                alert('データの保存に失敗しました。\nFailed to save data.');
            }
        });
    }
});