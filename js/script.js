'use strict';

function titleClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    console.log (event);

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log(targetArticle);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';

function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
     const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
     const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* insert link into titleList */
        html = html + linkHTML;
        console.log(html);
    }

    titleList.innerHTML = html;
}

generateTitleLinks();

const links = document.querySelectorAll('.titles a');

for(let link of links){
    link.addEventListener('click', titleClickHandler);
}


function generateTags() {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
        /* find tags wrapper */
        const tagsWrapper = article.querySelector(optArticleTagsSelector);
        tagsWrapper.innerHTML = '';

        /* make html variable with empty string */
        let html = '';

        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');

        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');

        /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {

        /* generate HTML of the link */
    const tagLink = '<li><a href="#tag-' + tag + '"><span style="padding-left: 5px">' + tag + '</span></a></li>';

    /* add generated code to html variable */
    html = html + tagLink;
    /* END LOOP: for each tag */
}
        /* insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;
        /* END LOOP: for every article: */
    }
}
generateTags();


function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
    /* remove class active */
        activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let hrefTagLink of hrefTagLinks) {
        /* add class active */
        hrefTagLink.classList.add('active');
        /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
    /* find all links to tags */
    const allTagLinks = document.querySelectorAll('a[href^="#tag-"]');


    /* START LOOP: for each link */
    for (let eachTagLink of allTagLinks) {
        /* add tagClickHandler as event listener for that link */
        eachTagLink.addEventListener('click', tagClickHandler);
        /* END LOOP: for each link */
    }
}
addClickListenersToTags();


function generateAuthors() {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
        /* find author wrapper */
        const authorWrapper = article.querySelector(optArticleAuthorSelector);
        authorWrapper.innerHTML = '';

        /* get author from data-author attribute */
        const author = article.getAttribute('data-author');

        /* insert HTML of all the links into the author wrapper */
        authorWrapper.innerHTML = '<a href="#' + author + '">'+'by ' + author + '</a>';
    }
}
generateAuthors();

function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const author = href.replace('#', '');

    /* find all tag links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[data-author]');

    /* START LOOP: for each active tag link */
    for (let activeAuthorLink of activeAuthorLinks) {
        /* remove class active */
        activeAuthorLink.classList.remove('active');
        /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefAuthorLinks = document.querySelectorAll('a[href="#' + author + '"]');
    /* START LOOP: for each found tag link */
    for (let hrefAuthorLink of hrefAuthorLinks) {
        /* add class active */
        hrefAuthorLink.classList.add('active');
        /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author ="' + author + '"]');
}

function addClickListenersToAuthors(){
    /* find all links to authors */
    const allAuthorLinks = document.querySelectorAll('.post-author a');

    /* START LOOP: for each link */
    for (let eachAuthorLink of allAuthorLinks) {
        /* add tagClickHandler as event listener for that link */
        eachAuthorLink.addEventListener('click', authorClickHandler);
        /* END LOOP: for each link */
    }
}

addClickListenersToAuthors();

