"use strict";

class TableTemplate{
    static fillIn(id, dict, columnName){
        const table = document.getElementById(id);
        if (!table){
            console.error("Table not found.");
            return;
        }

        let columnIndex = -1;
        const headerRow = table.rows[0];
        const headers = headerRow.cells;
        for(let i = 0; i < headers.length; i++){
            const processor = new Cs142TemplateProcessor(headers[i].innerHTML);
            headers[i].innerHTML = processor.fillIn(dict);
            if (headers[i].textContent === columnName){
                columnIndex = i;
            }
        }

        if (columnName !== undefined && columnIndex === -1){
            return;
        }

        for(let row of table.rows){
            const cells = row.cells;
            if (columnName && columnIndex !== -1){
                if (cells[columnIndex]){
                    const processor = new Cs142TemplateProcessor(cells[columnIndex].innerHTML);
                    cells[columnIndex].innerHTML = processor.fillIn(dict);
                }
            }else{
                for(let cell of cells){
                    const processor = new Cs142TemplateProcessor(cell.innerHTML);
                    cell.innerHTML = processor.fillIn(dict);
                }
            }

        }
    }
}