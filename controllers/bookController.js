const sqlite3 = require('sqlite3').verbose();
const DB_NOTE = '/Users/max/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite';
const DB_BOOK = '/Users/max/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite';
const db = new sqlite3.Database(DB_NOTE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

// db.serialize(() => {
//   db.each(`SELECT ZFUTUREPROOFING5 as chapter, ZANNOTATIONSELECTEDTEXT as note FROM "ZAEANNOTATION" WHERE "ZANNOTATIONSELECTEDTEXT" != '' ORDER BY "ZFUTUREPROOFING5" COLLATE NOCASE DESC LIMIT 0,100;`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row);
//   });
// });


db.serialize(() => {
  db.each(`SELECT ZFUTUREPROOFING5 as chapter FROM "ZAEANNOTATION" WHERE "ZANNOTATIONSELECTEDTEXT" != '' GROUP BY "ZFUTUREPROOFING5" ORDER BY "ZFUTUREPROOFING5" COLLATE NOCASE DESC LIMIT 0,100;`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row);
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});