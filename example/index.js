const Crawler = require('..');

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

// engine.start();