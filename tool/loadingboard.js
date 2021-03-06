document.write('<style type="text/css">');
document.write('#msg-panel {');
document.write('    opacity: 0.8;');
document.write('    width: 100% !important;');
document.write('    height: 100% !important;');
document.write('    position: fixed;');
document.write('    top: 0 !important;');
document.write('    left: 0 !important;');
document.write('    z-index: 10000;');
document.write('    background: white;');
document.write('    margin: 0 !important;');
document.write('    padding: 0 !important;');
document.write('}');
document.write('');
document.write('.spinner {');
document.write('    width: 30%;');
document.write('    height: 20%;');
document.write('    margin: 20% auto;');
document.write('    background-color: #c57e7e;');
document.write('    border-radius: 100%;');
document.write('    animation: scaleout 1.0s infinite ease-in-out;');
document.write('}');
document.write('');
document.write('@keyframes scaleout {');
document.write('    0% {');
document.write('        transform: scale(0.0);');
document.write('    }');
document.write('    100% {');
document.write('        transform: scale(1.0);');
document.write('        opacity: 0;');
document.write('    }');
document.write('}');
document.write('</style>');
document.write('<div id="msg-panel"><div class="spinner"></div></div>');

function hideLoadingBoard() {
    document.querySelector("#msg-panel").style.display = 'none';
}

let args = getCurrentJSParameters().args;
if (args.auto) {
    window.addEventListener("load", () => {
        window.setTimeout(hideLoadingBoard, args.delay | 500);
    })
}
