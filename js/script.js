'use strict';

const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    createTags: Handlebars.compile(document.querySelector('#template-tags').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    createAuthorList: Handlebars.compile(document.querySelector('#template-author-list').innerHTML)
};

function titleClickHandler(event){
    event.preventDefault();
    const clickedElement = this;

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

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector = '.authors.list';

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
        const linkHTMLData = {id: articleId, title: articleTitle};
        const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
        html += linkHTML;
      }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }
}

generateTitleLinks();

const links = document.querySelectorAll('.titles a');

for(let link of links){
    link.addEventListener('click', titleClickHandler);
}


function calculateTagsParams(tags) {
    const params = {
        min: 9999,
        max: 0
    };

    for(let tag in tags){

        if(tags[tag] > params.max){
            params.max = tags[tag];
        }

        if(tags[tag] < params.min){
            params.min = tags[tag];
        }
        console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
}


function calculateTagClass (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

    return optCloudClassPrefix + classNumber;
}

function generateTagsList(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

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
            const tagsData = {theTag: tag};
            const tagLink = templates.createTags(tagsData);

            /* add generated code to html variable */
            html += tagLink;

            /* [NEW] check if this link is NOT already in allTags */
            if (!allTags.hasOwnProperty(tag)) {

            /* [NEW] add generated code to allTags object */
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }

            /* END LOOP: for each tag */
        }
        /* insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;
        /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    /* [NEW] add html from allTags to tagList */

    const tagsParams = calculateTagsParams(allTags);

    /* [NEW] create variable for all links HTML code */
    const allTagsData = {tags: []};
    /* [NEW]START LOOP: for each tag in allTags */
    for (let tag in allTags) {
        /* [NEW] generate code of a link and add it to allTagsHTML */
        allTagsData.tags.push({
            tag: tag,
            count: allTags[tag],
            className: calculateTagClass(allTags[tag], tagsParams)
        });
    }
        /* [NEW] END LOOP: for each tag in allTags */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    }
    /* [NEW] add HTML from allTagsHTML to taglist */


generateTagsList();


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
    /* [NEW] create a new variable allAuthors with an empty object */
    let allAuthors = {};

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
        const authorLinkData = {byAuthor: author};
        const authorLink = templates.authorLink(authorLinkData);

        /* [NEW] check if this link is NOT already in allTags */
        if (!allAuthors.hasOwnProperty(author)) {
            /* [NEW] add generated code to allTags object */
            allAuthors[author] = 1;
        } else {
            allAuthors[author]++;
        }
        /* END LOOP: for every article: */
        authorWrapper.innerHTML = authorLink;
    }

    /* [NEW] find list of tags in right column */
    const authorList = document.querySelector(optAuthorsListSelector);

    /* [NEW] add html from allTags to tagList */
    const authorsParams = calculateTagsParams(allAuthors);

    /* [NEW] create variable for all links HTML code */
    const allAuthorsData = {authors: []};

    /* [NEW]START LOOP: for each tag in allAuthors */

        /* [NEW] generate code of a link and add it to allTagsHTML */
        for(let author in allAuthors) {
            allAuthorsData.authors.push({
                author: author,
                count: allAuthors[author],
                className: calculateTagClass(allAuthors[author], authorsParams)
            });

        /* [NEW] END LOOP: for each tag in allTags */
    }

    /* [NEW] add HTML from allAuthors to authorList */
    authorList.innerHTML = templates.createAuthorList(allAuthorsData);

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
    const activeAuthorList = document.querySelectorAll('.authors.list a.active');
    /* NEW for List */
    for(let activeList of activeAuthorList){
        activeList.classList.remove('active');
    }

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

    const allAuthorList = document.querySelectorAll('.authors.list a');

    /* START LOOP: for each link */
    for (let eachAuthorList of allAuthorList) {
        /* add tagClickHandler as event listener for that link */
        eachAuthorList.addEventListener('click', authorClickHandler);
        /* END LOOP: for each link */
    }
}

addClickListenersToAuthors();

