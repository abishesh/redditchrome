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
  
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
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
     // console.log(linkify(res));
      content.innerHTML = linkify(res);
      hljs.highlightBlock(content);
    })
    .catch(function (err) {
      console.log('ERROR: ', err);
    });
  
}