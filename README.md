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
    "id":"419944847",
    "title":"Into the Wild",
    "author":"Jon Krakauer"
  },
  {...}]
```

## Get a book by id

This will return a single book info.

`/v1/books/:bookId`

```
{
  "id":"419944847",
  "title":"Into the Wild",
  "author":"Jon Krakauer"
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
    "comment": "My comments"
  },
  {...}
]
```