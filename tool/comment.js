addCss("/3rd-lib/gitalk/gitalk.css");

let pageKey;
function initComment(pageid) {
    document.getElementById("vcomments").innerHTML = "";
    pageKey = pageid;
    if (pageKey.length > 50) {
        pageKey = pageKey.substr(pageKey.length - 50)
    }
    addJs("/3rd-lib/gitalk/gitalk.js", false, () => {
        new Gitalk({
            clientID: '7b9679434b225da457ea',
            clientSecret: 'd0367170ba5aca675670eb66f6e25689e905bd07',
            repo: 'zhric.github.io',
            owner: 'zhric',
            admin: ['zhric'],
            id: pageKey,
            distractionFreeMode: true
        }).render('vcomments')
    })
}
