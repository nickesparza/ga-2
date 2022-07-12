WatchParty

- App for users to search their favorite movies, add them to a watchlist, and create organized movie nights
- Add snacks to a db and also add to a watch party
- Searchable via the IMDb API
- Models: User, WatchParty, Snack, Movie(?)

RESTful routes
- Create WatchParty form (new)
- Create WatchParty (create)
- View all WatchParties (index)
- View single WatchParty (show)
- Edit WatchParty form (edit)
- Update WatchParty (update)
- Delete WatchParty (delete)

| RESTful routes | --- | Route | HTTP Verb |
|----------------|----|--------|----------|
| Create WatchParty Form | New | /party/new | GET |
| Create WatchParty | Create | /party | POST |
| View all WatchParties | Index | /party | GET |
| View single WatchParty | Show | /party/:id | GET |
| Edit WatchParty form | Edit | /party/:id/edit | GET |
| Update WatchParty | Update | /party/:id | PUT |
| Delete WatchParty | Delete | /party/:id | DELETE |

