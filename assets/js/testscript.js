function sendEmail() {
    var cname=document.getElementById("cname").value;
    var cemail=document.getElementById("cemail").value;
    var cnum=document.getElementById("cnum").value;
    var ctext=document.getElementById("ctext").value;
    var time=new Date();
    alert("Email sent successfully !");
  }

function validateName() {
    var x = document.getElementById("iname").value;
    var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if(!regName.test(x)){
        document.getElementById("pbook").innerHTML = "";
        document.getElementById("pname").innerHTML = "Invalid name";
        return false;
    }else{
        document.getElementById("pname").innerHTML = "";
        return true;
    }
}

function validateNum() {
    var x = document.getElementById("inum").value;
    if(x<1000000000 || x>9999999999){
        document.getElementById("pnum").innerHTML = "Invalid Number";
        return false;
    }else{
        document.getElementById("pnum").innerHTML = "";
        return true;
    }
}

function validateEmail() {
    var x = document.getElementById("iemail").value;
    var regName = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!regName.test(x)){
        document.getElementById("pbook").innerHTML = "";
        document.getElementById("pemail").innerHTML = "Invalid Email";
        return false;
    }else{
        document.getElementById("pemail").innerHTML = "";
        return true;
    }
}

function validateDate() {
    var x = document.getElementById("idate").value;
    var d1=new Date(x);
    var d2=new Date();
    //console.log(d1);
    if(d1.getTime()<d2.getTime()){
        document.getElementById("pbook").innerHTML = "";
        document.getElementById("pdate").innerHTML = "Old date selected !!!";
        return false;
    }
    else{
        document.getElementById("pdate").innerHTML = "";
        return true;
    }
}

function appointBook(){
    var w = document.getElementById("iname").value;
    var x = document.getElementById("inum").value;
    var y = document.getElementById("iemail").value;
    var d = document.getElementById("idept").value;
    var z = document.getElementById("idate").value;
    if(w=="" || x=="" || y=="" || z=="" || !validateName() || !validateNum() || !validateEmail() || !validateDate() || d=="Select"){
        document.getElementById("pbook").innerHTML ="One or more fields is missing or have error !!!";
        return;
    }
    else{
        document.getElementById("pbook").innerHTML = "";
        //alert("Appointment booked Successfully. A confirmation is sent on given mobile number and email address.");
    }
    /**************************************************************** */
      
      firebase.database().ref(w).set({
        name: w,
        mobile: x,
        email: y,
        dept: d,
        date: z
    });
}
/**************************************************************** */
function sendOTP(){
    var x=document.getElementById("inum").value;
    if(x=="" || !validateNum()){
        document.getElementById("psend").innerHTML ="One or more fields is missing or have error !!!";
    }
    else{
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                state=checkNum(this,x);
                if(!state){
                document.getElementById("psend").innerHTML ="Number not registered !!!";
                }
                else{
                document.getElementById("psend").innerHTML ="";
                $("#divotp").load("verifyotp.html");
                //send otp
                }
            }
        };
        xhttp.open("GET", "patients.xml", true);
        xhttp.send();
    }
    var w=document.getElementById("psend").textContent;
    if(w==""){
        return true;
    }
    else
    return false;
}

function checkNum(xml,num){
    var i;
    var xmlDoc = xml.responseXML;
    var x = xmlDoc.getElementsByTagName("PATIENT");
    for (i=0;i<x.length;i++) { 
        var temp=x[i].getElementsByTagName("MOBNO")[0].childNodes[0].nodeValue;
        if(num==temp)
        return true;
    }
    return false;
}

function submitOTP(){
    var x=document.getElementById("realotp").value;
    var y=document.getElementById("inum").value;
    document.getElementById("realotp").value='';
    if(x==123456){
        document.getElementById("submitotp").innerHTML ="";
        getRecordsxml(y);
    }
    else{
        document.getElementById("submitotp").innerHTML ="Invalid OTP !!!";
    }
}

function getRecordsxml(num) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        getRecords(this,num);
      }
    };
    xhttp.open("GET", "patients.xml", true);
    xhttp.send();
  }

  function getRecords(xml,num) {
    var i;
    var xmlDoc = xml.responseXML;
    var table="<table id=\"patients-data\"><tr><th>Patient Name</th><th>Department</th><th>Date (YYYY-MM-DD)</th><th>Cancel</th></tr>";
    var x = xmlDoc.getElementsByTagName("PATIENT");
    var curr=new Date();
    var curryear=curr.getFullYear();
    var currmonth=curr.getMonth()+1;
    var currday=curr.getDate();
    var currdate=currday+currmonth*100+curryear*10000;

    for (i = 0; i <x.length; i++) { 
      var temp=x[i].getElementsByTagName("MOBNO")[0].childNodes[0].nodeValue;
      if(temp==num){ 
          var tname=x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
          var tdept=x[i].getElementsByTagName("DEPT")[0].childNodes[0].nodeValue;
          var tdate=x[i].getElementsByTagName("DATE")[0].childNodes[0].nodeValue;
        table+="<tr><td>"+tname+"</td><td>"+tdept+"</td><td>"+tdate+"</td>";
        table+="<td><button class=\"btn btn-success btn-check-cancel\" ";
        tdate=tdate.replace('-','');
        tdate=tdate.replace('-','');
        if(parseInt(tdate)>currdate)
        table +="><b>Cancel</b></button></td></tr>";
        else
        table +="disabled><b>Cancel</b></button></td></tr>";
      }
    }
    table+="</table>";
    document.getElementById("updatedata").innerHTML = table;
  }