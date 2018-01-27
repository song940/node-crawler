## node-crawler

> simple crawler

### Installation

```bash
$ npm install @song940/crawler --save
```

### Example

```js
const Crawler = require('@song940/crawler');

const engine = new Crawler({ 
    url: 'https://news.ycombinator.com'
});

engine.parse = async ($, commit) => {
    $('table.itemlist tr.athing').each((i, row) => {
        const title = $('td.title', row).text();
        commit({ title });
    });
};

engine.on('commit', posts => {
    console.log(posts);
});

for(var i=1;i<100;i++){
    engine.push(`${engine.url}/news?p=${i}`);
}

engine.on('end', () => {
    console.log('all job done');
});

engine.start();

```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### ISC

This work is licensed under the [ISC license](./LICENSE).

---