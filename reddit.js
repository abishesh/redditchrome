var selected = document.getElementById("selected");
document.getElementById("top").addEventListener("click", function()
{
    selected.innerHTML = "TOP";
    reddit('https://www.reddit.com/top');
}, false);

document.getElementById("new").addEventListener("click", function()
{
    selected.innerHTML = "NEW";
    reddit('https://www.reddit.com/new.json');
}, false);

// hljs.initHighlightingOnLoad();

function reddit(url) {

  function expand(replies) {
    if (!replies) { return; }
    return replies.data.children.map(function (reply) {
       return {
         body: reply.data.body,
         replies: expand(reply.data.replies)
       };
    })
  }

  function processUrl(url) {
    return url && 
      (url.trim() + '.json')
        .replace('\/.', '.')
        .replace('.json.json', '.json');
  }

  fetch(processUrl(url))
    .then(function (res) { return res.json() })
    .then(function (json) {
      var arr = typeof json.length === 'undefined' ? [json] : json;
      var results = arr.map(function (item) {
        return item.data.children.map(function (child) {
          if (child.data.title) {
            return {
              title: child.data.title,
              thumbnail: child.data.thumbnail,
              url: child.data.url,
              permalink: 'https://www.reddit.com' + child.data.permalink
            }
          }
          return {
            body: child.data.body,
            replies: expand(child.data.replies)
          }
        });
      });
      //console.log();
      var res = JSON.stringify(results, null, 2);
      var content = document.getElementById("content");
      content.innerHTML = res;
      hljs.highlightBlock(content);
    })
    .catch(function (err) {
      console.log('ERROR: ', err);
    });
  
}