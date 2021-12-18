document.addEventListener('DOMContentLoaded', function () {
    const table = document.getElementById('table');

    let przeciaganyElement;
    let indeksElementu;
    let placeholder;
    let list;
    let przeciaganieRozp = false;
    let x = 0;
    let y = 0;
    const swap = function (zmA, zmB) {
        const parentA = zmA.parentNode;
        const siblingA = zmA.nextSibling === zmB ? zmA : zmA.nextSibling;
        zmB.parentNode.insertBefore(zmA, zmB);
        parentA.insertBefore(zmB, siblingA);
    };
    const isAbove = function (zmA, zmB) {
        const rectA = zmA.getBoundingClientRect();
        const rectB = zmB.getBoundingClientRect();
        return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    };
    const cloneTable = function () {
        const rect = table.getBoundingClientRect();
        const width = parseInt(window.getComputedStyle(table).width);
        list = document.createElement('div');
        list.classList.add('clone-list');
        list.style.position = 'absolute';
        list.style.left = `${rect.left}px`;
        list.style.top = `${rect.top}px`;
        table.parentNode.insertBefore(list, table);
        table.style.visibility = 'hidden';
        table.querySelectorAll('tr').forEach(function (row) {
            const item = document.createElement('div');
            item.classList.add('draggable');
            const newTable = document.createElement('table');
            newTable.setAttribute('class', 'clone-table');
            newTable.style.width = `${width}px`;
            const newRow = document.createElement('tr');
            const cells = [].slice.call(row.children);
            cells.forEach(function (cell) {
                const newCell = cell.cloneNode(true);
                newCell.style.width = `${parseInt(window.getComputedStyle(cell).width)}px`;
                newRow.appendChild(newCell);
            });
            newTable.appendChild(newRow);
            item.appendChild(newTable);
            list.appendChild(item);
        });
    };
    const mouseDownHandler = function (e) {
        const originalRow = e.target.parentNode;
        indeksElementu = [].slice.call(table.querySelectorAll('tr')).indexOf(originalRow);
        x = e.clientX;
        y = e.clientY;
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function (e) {
        if (!przeciaganieRozp) {
            przeciaganieRozp = true;
            cloneTable();
            przeciaganyElement = [].slice.call(list.children)[indeksElementu];
            przeciaganyElement.classList.add('dragging');
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            przeciaganyElement.parentNode.insertBefore(placeholder, przeciaganyElement.nextSibling);
            placeholder.style.height = `${przeciaganyElement.offsetHeight}px`;
        }
        przeciaganyElement.style.position = 'absolute';
        przeciaganyElement.style.top = `${przeciaganyElement.offsetTop + e.clientY - y}px`;
        przeciaganyElement.style.left = `${przeciaganyElement.offsetLeft + e.clientX - x}px`;
        x = e.clientX;
        y = e.clientY;
        const prevEle = przeciaganyElement.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;
        if (prevEle && prevEle.previousElementSibling && isAbove(przeciaganyElement, prevEle)) {
            swap(placeholder, przeciaganyElement);
            swap(placeholder, prevEle);
            return;
        }
        if (nextEle && isAbove(nextEle, przeciaganyElement)) {
            swap(nextEle, placeholder);
            swap(nextEle, przeciaganyElement);
        }
    };
    const mouseUpHandler = function () {
        placeholder && placeholder.parentNode.removeChild(placeholder);
        przeciaganyElement.classList.remove('dragging');
        przeciaganyElement.style.removeProperty('top');
        przeciaganyElement.style.removeProperty('left');
        przeciaganyElement.style.removeProperty('position');
        const endRowIndex = [].slice.call(list.children).indexOf(przeciaganyElement);
        przeciaganieRozp = false;
        list.parentNode.removeChild(list);
        let rows = [].slice.call(table.querySelectorAll('tr'));
        indeksElementu > endRowIndex
            ? rows[endRowIndex].parentNode.insertBefore(rows[indeksElementu], rows[endRowIndex])
            : rows[endRowIndex].parentNode.insertBefore(
                  rows[indeksElementu],
                  rows[endRowIndex].nextSibling
              );
        table.style.removeProperty('visibility');
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    table.querySelectorAll('tr').forEach(function (row, index) {
            if (index === 0) {
            return;
        }
        const firstCell = row.firstElementChild;
        firstCell.classList.add('draggable');
        firstCell.addEventListener('mousedown', mouseDownHandler);
    });
});
