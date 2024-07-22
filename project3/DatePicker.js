"use strict";

class DatePicker {
    constructor(divId, callback) {
        this.divId = divId;
        this.callback = callback;
        this.currentDate = new Date();
    }

    render(date) {
        this.currentDate = date;
        const container = document.getElementById(this.divId);
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const firstDayOfWeek = firstDay.getDay();
        let startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDayOfWeek);

        const lastDayOfWeek = new Date(lastDay);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + (6 - lastDayOfWeek.getDay()));

        const weeks = [];
        let currentWeek = [];
        weeks.push(currentWeek);

        let currentDate = new Date(startDate);
        while (currentDate <= lastDayOfWeek) {
            currentWeek.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate.getDay() === 0 && currentWeek.length === 7) {
                currentWeek = [];
                weeks.push(currentWeek);
            }
        }

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        let html = `
        <div class='header'>
            <button onclick='datePickers["${this.divId}"].render(new Date(${year}, ${month - 1}, 1))'>&lt;</button>
            ${monthNames[month]} ${year}
            <button onclick='datePickers["${this.divId}"].render(new Date(${year}, ${month + 1}, 1))'>&gt;</button>
        </div>
        <table>
            <tr>${dayNames.map(day => `<th>${day}</th>`).join("")}</tr>`;
        
        weeks.forEach(week => {
            html += `<tr>${week.map(day => {
                let classes = "day";
                if (day.getMonth() !== month) {
                    classes += " dim";
                }
                return `<td class='${classes}' onclick='datePickers["${this.divId}"].selectDay(${day.getDate()}, ${day.getMonth()}, ${day.getFullYear()})'>${day.getDate()}</td>`;
            }).join("")}</tr>`;
        });
        
        html += `</table>`;
        container.innerHTML = html;
    }

    selectDay(day, month, year) {
        if (month === this.currentDate.getMonth()) {
            this.callback(this.divId, { day: day, month: month + 1, year: year });
        }
    }
}
