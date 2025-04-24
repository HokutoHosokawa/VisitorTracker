const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
    console.log('Connected');
    
}

socket.onmessage = (e) => {
    if(e.data == 'Update'){
        getLogs();
    }
};

function getLogs(){
    console.log('getLogs');
    fetch('/logs',{method: 'POST'})
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('logsTable');
            table.innerHTML = '';
            const header = document.createElement('tr');
            const th1 = document.createElement('th');
            const th2 = document.createElement('th');
            const th3 = document.createElement('th');
            th1.textContent = '学校所在地';
            th2.textContent = '学校区分';
            th3.textContent = 'その他';
            header.appendChild(th1);
            header.appendChild(th2);
            header.appendChild(th3);
            table.appendChild(header);
            data.forEach((row) => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                td1.textContent = row['学校所在地'];
                td2.textContent = row['学校区分'];
                td3.textContent = row['その他'];
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                table.appendChild(tr);
            });
        });
}

window.onload = function(){
    getLogs();
}