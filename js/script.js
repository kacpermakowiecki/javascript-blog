'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.authors',
  cloudClassCountAuthor: '5',
  cloudClassPrefixAuthor: 'author-size-'
};

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

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  console.log(titleList);

  /* for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  console.log(articles);

  let html = '';
  for (let article of articles) {
    console.log(article);

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element, get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* create HTML of the link */
    //const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
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

function calculateTagsParams(tags) {
  /*CREATE nefw variable with object max value , min value */
  const params = { max: 0, min: 999999 };

  /*START LOOP: for each tag in tags*/
  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times ');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);
  return opts.cloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  console.log(allTags);

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles) {
    console.log(article);

    /* find tags wrapper */
    const tagsWraper = article.querySelector(opts.articleTagsSelector);
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
      const tagHTMLData = { id: tag, title: tag };
      const linkHTML = templates.tagLink(tagHTMLData); //`<li><a href="#tag-${tag}">${tag}</a></li> `;
      console.log(linkHTML);

      /* add generated code to html variable */
      html += linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {

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
  const tagList = document.querySelector(opts.tagsListSelector);

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  //let allTagsHTML = '';

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  const allTagsData = { tags: [] };

  /* [NEW] start loop for each tag in allTags */
  for (let tag in allTags) {

    /* [NEW] generate code of link and add it to AllTagsHTML */
    const tagLinkHTML = `<li><a class="${calculateTagClass(allTags[tag], tagsParams)}" href="#tag-${tag}">${tag}</a>(${allTags[tag]})</li>`;
    //const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a>(' + allTags[tag] + ')</li>';
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    console.log('tagLinkHTML:', tagLinkHTML);
    //allTagsHTML += tagLinkHTML;
  }
  /* [NEW] add HTML from allTahsHTML to taglist */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);//allTagsHTML;
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

function calculateAuthorParams(authors) {
  const authorParams = { max: 0, min: 999999 };
  for (let author in authors) {
    console.log(author + ' is used ' + authors[author] + ' times');
    if (authors[author] > authorParams.max) {
      authorParams.max = authors[author];
    }
    if (authors[author] < authorParams.min) {
      authorParams.min = authors[author];
    }
  }
  return authorParams;
}

function calculateAuthorClass(countAuthor, authorParams) {
  const normalizedCount = countAuthor - authorParams.min;
  const normalizedMax = authorParams.max - authorParams.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloudClassCountAuthor - 1) + 1);
  return opts.cloudClassPrefixAuthor + classNumber;
}

function generateAuthors() {
  /* [NEW] create a new variable allauthors with an empty array */
  let allAuthors = {};
  console.log('allAuthors:', allAuthors);

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  console.log('articles:', articles);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find Autors */
    const authorList = article.querySelector(opts.articleAuthorSelector);
    console.log(authorList);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const autorTag = article.getAttribute('data-author');
    console.log(autorTag);

    /* generate HTML of the link */
    //const autorlinkHTML = `<li><a href="#author-${autorTag}">${autorTag}</a></li>`;
    const authorLinkHTMLData = { id: autorTag, title: autorTag };
    const autorlinkHTML = templates.authorLink(authorLinkHTMLData);
    console.log(autorlinkHTML);

    /* add generated code to html variable */
    html += autorlinkHTML;

    //new
    if (!allAuthors[autorTag]) {
      allAuthors[autorTag] = 1;
    } else {
      allAuthors[autorTag]++;
    }
    authorList.innerHTML = html;
  }

  const authorsList = document.querySelector(opts.authorsListSelector);
 
  const authorParams = calculateAuthorParams(allAuthors);
  console.log('authorParams', authorParams);
  const allAuthorsData = { authors: [] };

  for (let author in allAuthors) {
    //const authorLinkHTML = `<li><a class="${calculateAuthorClass(allAuthors[author], authorParams)}" href="#author-${author}">${author}</a>(${allAuthors[author]})</li>`; 
    //const authorLinkHTML = '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] +') ' + '</a></li> ';
    //allAuthorsHTML += authorLinkHTML;
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      className:calculateAuthorClass(allAuthors[author], authorParams)
    });
  }
  /* insert HTML of all the links into the tags wrapper */
  authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
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