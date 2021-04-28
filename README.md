# About ibook-server

If you like me, love reading books with Apple Books (former iBooks), you may also want to easy access your annotations. Fortunately, all the annotations are stored in your local database, with this nodejs project, you can turn your annotations into a REST API. I'm using this with my another project ibook-web which is a reactjs project, can list all your books and annotations in your browser.

# Endpoints

Update the `./controllers/bookController.js`, update the `DB_NOTE` and `DB_BOOK`, replace the `~` with your absolute User folder path.

## Get all books

This will return all your books in Apple Book.

`/v1/books`

```
[
  {
    "id": "881256329",
    "title": "The Swift Programming Language (Swift 5.2)",
    "author": "Apple Inc.",
    "coverURL": "https://is1-ssl.mzstatic.com/image/thumb/Publication113/v4/2c/25/05/2c25051d-2699-8c1c-04e1-988b02990141/cover.jpg/1400x2100w.jpg",
    "progress": 0,
    "path": "/Users/username/Library/Containers/com.apple.BKAgentService/Data/Documents/iBooks/Books/881256329.epub",
    "lastOpenDate": 558633681,
    "modificationDate": 558633738.01113,
    "finishedDate": null
  },
  {...}]
```

## Get a book by id

This will return a single book info.

`/v1/books/:bookId`

```
{
    "id": "881256329",
    "title": "The Swift Programming Language (Swift 5.2)",
    "author": "Apple Inc.",
    "coverURL": "https://is1-ssl.mzstatic.com/image/thumb/Publication113/v4/2c/25/05/2c25051d-2699-8c1c-04e1-988b02990141/cover.jpg/1400x2100w.jpg",
    "progress": 0,
    "path": "/Users/username/Library/Containers/com.apple.BKAgentService/Data/Documents/iBooks/Books/881256329.epub",
    "lastOpenDate": 558633681,
    "modificationDate": 558633738.01113,
    "finishedDate": null
  }
```

## Get annotations chapters by book id

`/v1/books/:bookId/chapters`

Will return the chapters which contains annotations

```
[
  {
    "id":10,
    "title":"Chapter One: The Alaska Interior"
  },
  {...}
]
```

## Get annotations by chapter id

Will return annotations of specific chapter

`/v1/books/:bookId/chapters/:chapterId/annotations`

```
[
  {
    "id": "46373B79-E2BA-40D7-B41D-C6C62884EA9A",
    "createdDate": "611492468.634970",
    "presentText": "A rifle protruded from the young man’s backpack, but he looked friendly enough; a hitchhiker with a Remington semiautomatic isn’t the sort of thing that gives motorists pause in the forty-ninth state.",
    "selectedText": "rifle",
    "style": 3,
    "comment": "My comments"
  },
  {...}
]
```