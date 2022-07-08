function placeTie({p1, p2}) {
    p1.performAction();
    p1.canPlace = false;
    p2.canPlace = true;
}

function changeHTML({text}) {
    document.querySelector('#displayResultText').innerHTML = text;
    document.querySelector('#displayResultText').style.display = 'flex';
}