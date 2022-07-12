WatchParty

- App for users to search their favorite movies, add them to a watchlist, and create organized movie nights
- Add snacks to a db and also add to a watch party
- Searchable via the IMDb API
- Models: User, WatchParty, Snack, Movie(?)

Packages/Modules to be Used:
- mongoose
- connect-mongo
- dotenv
- express
- express-sesson
- liquidjs
- liquid-express-views
- method-override
- bcryptjs
- node-fetch
- morgan

Other Technologies/Frameworks: Bootstrap

User Stories:
- Create an account and log in
- View an index of upcoming watch parties
- Create a new watch party with name and date
- Have visual indicator if watch date has passed
- Search IMDb database for movies
- Browse search results
- Add movies from search results to a watch party
- View the watch party and list of movies
- Edit an existing watch party
- Delete a watch party
- Add a snack to a watch party
- Delete a snack from a watch party
- Mark a watch party as complete
- View a read-only archive of completed watch parties

WatchParty
| RESTful routes | Route | Path | HTTP Verb |
|----------------|----|--------|----------|
| Create WatchParty Form | New | /party/new | GET |
| Create WatchParty | Create | /party | POST |
| View all WatchParties | Index | /party | GET |
| View single WatchParty | Show | /party/:id | GET |
| Edit WatchParty form | Edit | /party/:id/edit | GET |
| Update WatchParty | Update | /party/:id | PUT |
| Delete WatchParty | Delete | /party/:id | DELETE |

User
| RESTful routes | Route | Path | HTTP Verb |
|----------------|----|--------|----------|
| Create User Form | New | /user/register | GET |
| Create User| Create | /user | POST |

MongoDB Collections
- users
- watchparties
- snacks
- archive

Challenges
- How to associate a search with a specific watch party
- Managing fetch requests (100 per day)
- Parsing and limiting search terms
- Movies and snacks don't feel like good models or even that they need schemas

Stretch Goals:
- Add search results to Favorites
- View Favorites on a custom ‘show’ page
- Click on favorites for more details
- Add a Favorite to a Watch Party
- Mark a favorite as watched
- Sort favorites by watched/unwatched