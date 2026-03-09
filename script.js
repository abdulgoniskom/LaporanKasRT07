const API="https://script.google.com/macros/s/AKfycbxvU-ZjPO5xYcU8G8LjiybW0_oj7A7nLhYfF19iIMU6dVbskyTl14gZ-Ehj7t_0H9E/exec";

let chart;
let sheetAktif="Kas_RT";

let role=localStorage.getItem("role");

if(role=="warga"){
document.getElementById("formInput").style.display="none";
}

function loadData(sheet){

sheetAktif=sheet;

fetch(API+"?sheet="+sheet)

.then(res=>res.json())

.then(data=>{

let tbody=document.getElementById("dataKas");

tbody.innerHTML="";

let saldo=0;
let masukTotal=0;
let keluarTotal=0;

data.forEach(d=>{

let masuk=Number(d.masuk||0);
let keluar=Number(d.keluar||0);

saldo+=masuk-keluar;

masukTotal+=masuk;
keluarTotal+=keluar;

let tgl=new Date(d.tanggal);

tgl=isNaN(tgl)?"-":tgl.toLocaleDateString("id-ID");

tbody.innerHTML+=`
<tr>
<td>${tgl}</td>
<td>${d.keterangan}</td>
<td>${masuk}</td>
<td>${keluar}</td>
<td>${saldo}</td>
</tr>
`;

});

document.getElementById("saldoTotal").innerText=saldo;

buatChart(masukTotal,keluarTotal);

});

}

function buatChart(masuk,keluar){

if(chart) chart.destroy();

chart=new Chart(document.getElementById("chart"),{

type:"bar",

data:{
labels:["Masuk","Keluar"],
datasets:[{
label:"Kas",
data:[masuk,keluar]
}]
}

});

}

function kirim(){

if(localStorage.getItem("role")!="admin"){
alert("Hanya admin yang boleh input");
return;
}

let data={

sheet:sheetAktif,
tanggal:document.getElementById("tanggal").value,
keterangan:document.getElementById("ket").value,
masuk:document.getElementById("masuk").value,
keluar:document.getElementById("keluar").value

};

fetch(API,{
method:"POST",
body:JSON.stringify(data)
})

.then(()=>{

alert("Data berhasil disimpan");

loadData(sheetAktif);

});

}

function logout(){

localStorage.clear();

window.location="login.html";

}

loadData("Kas_RT");
