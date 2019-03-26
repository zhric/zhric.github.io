let addJs = (src, async, cb) => {
  let j = document.createElement("script");
  j.src = src;
  j.async = async ? true : false;
  j.onload = j.onreadystatechange = () => {
    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
      console.log(`load: ${src}`);
      cb && cb();
      j.onload = j.onreadystatechange = null;
    }
  };
  document.getElementsByTagName("head")[0].appendChild(j);
};
let addCss = (src) => {
  let j = document.createElement("link");
  j.href = src;
  j.type = "text/css";
  j.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(j);
};
let addNode = (tag, css, html) => {
  let nod = document.createElement(tag);
  nod.style = css;
  nod.innerHTML = html;
  document.body.appendChild(nod);
  return nod;
};

document.write(unescape("%3Cspan id='cnzz_stat_icon_1276688436'%3E%3C/span%3E%3Cscript src='https://s23.cnzz.com/z_stat.php%3Fid%3D1276688436%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));
document.write(`<small>(发布于 ${(document.head.querySelector('[name=modifydate]')|{}).content})</small>　<p>转载请注明原文地址： <a href='${location.href}'>${location.href}</a></p>`);

window.addEventListener("load", () => {
  addCss("/style.css");
  let head = addNode('nav', "top: 0;left: 0;width: 100%;height: 40px;padding: 0 20px;line-height: 40px;font-size:18px;white-space: nowrap;text-overflow: hidden;text-overflow: ellipsis;overflow: hidden;", `<a href='/index.html'>翻阅其它日志</a>　<div class='text-loop' style='display: inline-block;'>${document.title}</div>`);
  head.setAttribute("title", document.title);

  addNode('div', "margin-right: 80px;", `<h2>留言</h2><div id="lv-container" data-id="city" data-uid="MTAyMC80MzM4Ny8xOTkyOA==">`);
  addJs("https://cdn-city.livere.com/js/embed.dist.js", true);
  addCss("https://cdn.bootcss.com/github-markdown-css/3.0.1/github-markdown.min.css");
//   addCss("https://cdn.bootcss.com/highlight.js/8.7/styles/monokai_sublime.min.css");
//   addJs("https://cdn.bootcss.com/highlight.js/8.7/highlight.min.js", true, () => {
    addJs("https://cdn.jsdelivr.net/npm/marked/marked.min.js", false, () => {
        let md = document.getElementById('md');
        //md.className = "markdown-body";
        md.innerHTML = marked(md.innerHTML);
        addJs("/nav.js", true);
    });
//   });
});