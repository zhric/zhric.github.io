const keywords = new Set();
const choiceKeyword = function (k) {
    let ak = utils.$(`a[data-label='${k}']`)[0];
    if (keywords.has(k)) {
        keywords.delete(k);
        ak.className = "";
        if (!keywords.size) {
            utils.$('#index_panel li').forEach((li) => {
                li.className = "";
            });
            return;
        }
    } else {
        keywords.add(k);
        ak.className = "choiced";
    }
    utils.$('#index_panel li').forEach(li => {
        li.className = "hide";
    });
    keywords.forEach((k) => {
        utils.$(`#index_panel li[data-labels*=",${k},"]`).forEach(li => {
            li.className = "";
        });
    });
};

window.addEventListener("load", () => {
    // 初始化 文件列表
    utils.getAjax("/md/data/info.json", json => {
        let labelPanel = utils.$("#label_panel")[0];
        let indexPanel = utils.$("#index_panel")[0];
        let pacs = JSON.parse(json);
        let kws = new Set();
        Object.values(pacs).forEach(pac => {
            let olhtml = '';
            pac.lis.forEach(li => {
                let _s = pac.search ? `?${pac.search}=${li[pac.search]}` : "";
                let _c = li.private ? "return prompt('code?')==='private'" : "return true";
                olhtml += `<li data-labels=",${li.keywords},"><small>${li.modifydate}&nbsp;&nbsp;</small><a href="${pac.page}${li.page || ""}${_s}" onclick="${_c}">${li.title}</a><div>${li.description}</div></li>`;
                li.keywords && (li.keywords.split(/\s*,\s*/).forEach(k => {
                    kws.add(k)
                }))
            });
            indexPanel.appendChild(utils.createNode("h3", "", pac.ol_name));
            indexPanel.appendChild(utils.createNode("ol", "", olhtml));
        });
        // 标签列表
        kws.forEach(k => {
            labelPanel.appendChild(utils.createNode('span', '', `<a data-label="${k}" onclick="choiceKeyword('${k}')">${k}</a>`))
        });
        hideLoadingBoard();
    });
});
