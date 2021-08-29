const sqlite3 = require('sqlite3').verbose();
const _ = require('lodash');
const DB_BOOK = '/Users/max/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite';
const DB_NOTE = '/Users/max/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite';


exports.getBooks = async (req, res) => {
  let sql = 'SELECT ZASSETID as id, ZTITLE as title, ZAUTHOR as author, ZCOVERURL as coverURL, ZBOOKHIGHWATERMARKPROGRESS as progress, ZPATH as path, ZMODIFICATIONDATE as modificationDate, ZDATEFINISHED as finishedDate, ZLASTENGAGEDDATE as lastEngagedDate, ZLASTOPENDATE as lastOpenDate, ZCREATIONDATE as creationDate FROM "ZBKLIBRARYASSET" WHERE "ZPATH" !="" ORDER BY creationDate DESC';
  if (req.query.orderBy === 'lastOpenDate') {
    sql = 'SELECT ZASSETID as id, ZTITLE as title, ZAUTHOR as author, ZCOVERURL as coverURL, ZBOOKHIGHWATERMARKPROGRESS as progress, ZPATH as path, ZMODIFICATIONDATE as modificationDate, ZDATEFINISHED as finishedDate, ZLASTENGAGEDDATE as lastEngagedDate, ZLASTOPENDATE as lastOpenDate, ZCREATIONDATE as creationDate FROM "ZBKLIBRARYASSET" WHERE "ZPATH" !="" ORDER BY lastOpenDate DESC';
  }
  const db = new sqlite3.Database(DB_BOOK, (err) => {
    if (err) {
      console.error(err);
    }
    // console.log('Open the database connection.');
  });
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
  db.close();
};

exports.getBookById = async (req, res) => {
  const bookId = req.params.bookId;
  const sql = `SELECT ZASSETID as id, ZTITLE as title, ZAUTHOR as author, ZCOVERURL as coverURL, ZBOOKHIGHWATERMARKPROGRESS as progress, ZPATH as path, ZLASTOPENDATE as lastOpenDate, ZMODIFICATIONDATE as modificationDate, ZDATEFINISHED as finishedDate  FROM "ZBKLIBRARYASSET" WHERE ZASSETID == "${bookId}" ORDER BY "ZCREATIONDATE" LIMIT 1`;
  const db = new sqlite3.Database(DB_BOOK, (err) => {
    if (err) {
      console.error(err);
    }
    // console.log('Open the database connection.');
  });
  db.each(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
  db.close();
};

exports.getChaptersByBookId = async (req, res) => {
  const id = req.params.bookId;
  const sql = `SELECT ZPLLOCATIONRANGESTART as id, ZFUTUREPROOFING5 as title FROM "ZAEANNOTATION" WHERE "ZANNOTATIONASSETID" == "${id}" GROUP BY "ZPLLOCATIONRANGESTART" ORDER BY "ZPLLOCATIONRANGESTART", "ZFUTUREPROOFING6" COLLATE NOCASE ASC;`;
  const db = new sqlite3.Database(DB_NOTE, (err) => {
    if (err) {
      console.error(err);
    }
    // console.log('Open the database connection.');
  });
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });
  db.close();
};

const sorting = (annotationLocation) => {
  let location;
  let chapters;
  let annotationsStart;
  let sortingScore = 0;
  if (_.isNull(annotationLocation)) {
    return;
  }
  location = annotationLocation.slice(8, -1);
  location = location.split('!')[1];

  chapters = location.split(',')[0].split('/').slice(1);

  for (let i = 0; i < chapters.length; i++) {
    if (_.isUndefined(chapters[i])) {
      chapters[i] = '0';
    }
    if (chapters[i].indexOf('[') != -1) {
      chapters[i] = chapters[i].split('[')[0];
    }
    if (typeof chapters[i] === 'string') {
      chapters[i] = parseInt(chapters[i]);
    }
  }

  annotationsStart = location.split(',')[1].split('/').slice(1,);
  for (let i = 0; i < 3; i++) {
    if (_.isUndefined(annotationsStart[i])) {
      annotationsStart[i] = '0';
    }
  }
  if (annotationsStart[1].indexOf(':') != -1) {
    annotationsStart[2] = annotationsStart[1].split(':')[1];
    annotationsStart[1] = annotationsStart[1].split(':')[0];
  }
  for (let i = 0; i < 3; i++) {
    if (typeof annotationsStart[i] === 'string') {
      annotationsStart[i] = parseInt(annotationsStart[i]);
    }
  }
  
  /**
  "epubcfi(/6/74[id51]!/4[TI1E0-753b6158870b4cb287491020505fe03c],/74/1:0,/76/42/1:15)"
  "epubcfi(/6/74[id51]!/4[TI1E0-753b6158870b4cb287491020505fe03c]/68/1,:0,:43)"
  2 different types of location, the "/74/1" part actually equals to "/68/1" in 2nd sample
  that's why need to concat 2 locations.
  */
  let sort = chapters.concat(annotationsStart);
  for (let i = 0; i < sort.length; i++) {
    sortingScore = sort[i] * Math.pow(10, (20-i*4)) + sortingScore;
  }
  return sortingScore;
};

exports.getNotesByChapterId = async (req, res) => {
  const bookId = req.params.bookId;
  const chapterId = req.params.chapterId;
  const sql = `SELECT ZANNOTATIONUUID as id, ZFUTUREPROOFING6 as createdDate, ZANNOTATIONREPRESENTATIVETEXT as presentText, ZANNOTATIONSELECTEDTEXT as selectedText, ZANNOTATIONSTYLE as style, ZANNOTATIONNOTE as comment, ZANNOTATIONLOCATION as location FROM "ZAEANNOTATION" WHERE "ZANNOTATIONASSETID" == "${bookId}" AND "ZPLLOCATIONRANGESTART" == "${chapterId}" ORDER BY "ZFUTUREPROOFING11" COLLATE NOCASE ASC;`;
  const db = new sqlite3.Database(DB_NOTE, (err) => {
    if (err) {
      console.error(err);
    }
    // console.log('Open the database connection.');
  });
  db.all(sql, [], (err, annotations) => {
    if (err) {
      return console.error(err.message);
    }
    annotations.forEach(annotation => {
      annotation.sorting = sorting(annotation.location);
    });
    annotations.sort((a, b) => {
      return a.sorting - b.sorting;
    });
    res.send(annotations);
  });
  db.close();
};
