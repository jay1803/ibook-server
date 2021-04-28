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
    console.log('Open the database connection.');
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
    console.log('Open the database connection.');
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
    console.log('Open the database connection.');
  });
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('chapters: ', rows);
    res.send(rows);
  });
  db.close();
};

exports.getNotesByChapterId = async (req, res) => {
  const bookId = req.params.bookId;
  const chapterId = req.params.chapterId;
  const sql = `SELECT ZANNOTATIONUUID as id, ZFUTUREPROOFING6 as createdDate, ZANNOTATIONREPRESENTATIVETEXT as presentText, ZANNOTATIONSELECTEDTEXT as selectedText, ZANNOTATIONSTYLE as style, ZANNOTATIONNOTE as comment, ZANNOTATIONLOCATION as location FROM "ZAEANNOTATION" WHERE "ZANNOTATIONASSETID" == "${bookId}" AND "ZPLLOCATIONRANGESTART" == "${chapterId}" ORDER BY "ZFUTUREPROOFING11" COLLATE NOCASE ASC;`;
  const db = new sqlite3.Database(DB_NOTE, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('Open the database connection.');
  });
  db.all(sql, [], (err, annotations) => {
    if (err) {
      return console.error(err.message);
    }
    annotations.forEach(annotation => {
      let location = [];
      try {
        location = annotation.location.split('!')[1].split(',')[0].split('/');
      } catch (error) {
        console.log(annotation);
      }
      // console.log(location);
      for (let i = 0; i < 5; i++) {
        if (_.isUndefined(location[i])) {
          location[i] = 0;
        }
      }
      annotation.sorting = parseInt(location[1]) * 1000000000000 + parseInt(location[2]) * 1000000 + parseInt(location[3]) * 1000 + parseInt(location[4]);
    });
    annotations.sort((a, b) => {
      return a.sorting - b.sorting;
    });
    res.send(annotations);
  });
  db.close();
};
