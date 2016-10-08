# Finance Autocomplete
Search box for banks, investment firms, and mortgage lenders.

## General Info
Bundled with Webpack, and created with Bootstrap/Marionette. Main view is SearchView.js. Results are searched by name, and organized by type. Max 15 results are displayed at a time.

## Further Development
* Search could be tokenized to make less accurate searches still return results.
* Search could prioritize certain types if that type appears in search string (in whole or part)
* Hold previous search queries

## Viewing
Everything is already compiled with webpack, so it should be runnable in a regular server or just via the filesystem.

### Use webpack-dev-server (probably overkill just to view, but it was used for development)
```shell
npm install
npm install webpack -g
npm install webpack-dev-server -g
webpack-dev-server --inline
```