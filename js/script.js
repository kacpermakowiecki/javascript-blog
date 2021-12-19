'use strict';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log(`clickedElement: ${clickedElement}`);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post');

  for (let activeArticle of activeArticles) {
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
  optArticleAuthorSelector ='.post-author',
  optTagsListSelector = '.tags.list';

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  console.log(titleList);

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(articles);

  let html = '';
  for (let article of articles) {
    console.log(article);

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element, get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
    console.log(`linkHTML ${linkHTML}`);

    /* insert link into titleList */
    html += linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  console.log(allTags);

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles) {
    console.log(article);

    /* find tags wrapper */
    const tagsWraper = article.querySelector(optArticleTagsSelector);
    console.log(tagsWraper);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {

      /* generate HTML of the link */
      const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
      console.log(linkHTML);

      /* add generated code to html variable */
      html += linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWraper.innerHTML = html;

    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  let allTagsHTML='';
  /* [NEW] start loop for each tag in allTags */
  for(let tag in allTags){
    /* [NEW] generate code of link and add it to AllTagsHTML */
    allTagsHTML += tag + '(' + allTags[tag] + ')';
  }
  /* [NEW] add HTML from allTahsHTML to taglist */
  tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event) {

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {


    /* remove class active */
    activeTag.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const hreflinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each found tag link */
  for (let hreflink of hreflinks) {

    /* add class active */
    hreflink.classList.add('active');

    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks(`[data-tags~="${tag}"]`);

}

function addClickListenersToTags() {
  /* find all links to tags */
  const taglinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let taglink of taglinks) {

    /* add tagClickHandler as event listener for that link */
    taglink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles) {
    console.log(article);

    /* find Autors */
    const authorList = article.querySelector(optArticleAuthorSelector);
    console.log(authorList);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const autorTag = article.getAttribute('data-author');
    console.log(autorTag);

    /* generate HTML of the link */
    const autorlinkHTML = `<li><a href="#author-${autorTag}">${autorTag}</a></li>`;
    console.log(autorlinkHTML);

    /* add generated code to html variable */
    html += autorlinkHTML;

    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    authorList.innerHTML = html;

    /* END LOOP: for every article: */
  }
}
generateAuthors();

function addClickListenersToAuthors() {
  /* find all links to autors */
  const linksAutors = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for (let link of linksAutors) {

    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}
addClickListenersToAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#author-', '');

  /* find all tag links with class active */
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active tag link */
  for (let authorLink of authorLinks) {

    /* remove class active */
    authorLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const linkHrefs = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let linkHref of linkHrefs) {

    /* add class active */
    linkHref.classList.add('active');

    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks(`[data-author="${tag}"]`);
}
