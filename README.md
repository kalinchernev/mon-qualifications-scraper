# MON qualifications scraper

Hit search button on [this page](http://iropk.mon.bg/public/search) and see all qualifications.

## Prerequisites

- Node.js (8.10.x recommended)

[Node Version Manager](https://github.com/creationix/nvm) could be handy.

## Setup

1.  Clone the repository (`git clone`)

2.  Install dependencies (`npm install`)

3.  Change contents of HTML file of table with id `tab_logic` if necessary

## Run scraper

```sh
$ node extractor.js
```

## Notes

```sh
$ node --max_old_space_size=n extractor.js
```

Where `n` is higher amount of memory allocation, it will most probably be needed as default is 512MB and is not enough.

Possible solution in case of refactoring: [big-json library](https://www.npmjs.com/package/big-json) for streaming the results.
