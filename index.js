let video=document.querySelector("video");
let recorderCont=document.querySelector(".recorder-cont");
let recorderBtn=document.querySelector(".recorder-btn");
let captureCont=document.querySelector(".capture-cont");
let captureBtn=document.querySelector(".capture-btn");
let transparentColor="transparent";

let recorder;// stores undefined

let recorderFlag=false;

let chunks=[]; // media data is stored in chunks

let constraints={
    audio:false,
    video:true
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject=stream;

    recorder=new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);

    })
    recorder.addEventListener("stop",(e)=>{
        let blob=new Blob(chunks,{type:"video/mp4"});//convert media chunks into video
        let videoUrl=URL.createObjectURL(blob);
        let a=document.createElement("a");
        a.href=videoUrl;
        a.download="stream.mp4";
        a.click();
        
    })
    recorderCont.addEventListener("click",(e)=>{
        if(!recorder) return;

        recorderFlag=!recorderFlag;

        if(recorderFlag){//start
            recorder.start();
            recorderBtn.classList.add("scale-record");
            startTimer()
        }else{//stop
            recorder.stop()
            recorderBtn.classList.remove("scale-record");
            stopTimer()
        }
    })
});
//capture Logic

captureCont.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
   

    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    let imageURL=canvas.toDataURL("image/jpeg");
    //filtering
    tool.fillStyle=transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let a=document.createElement("a");
        a.href=imageURL;
        a.download="image.jpeg";
        a.click();

    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500)

})



let timer=document.querySelector(".timer");
let timerID;
let counter=0;
function startTimer(){
    timer.style.display="block";
    function displayTime(){
        let totalSeconds=counter;
        let hours=Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600;
        let mins=Number.parseInt(totalSeconds/60);
        totalSeconds=totalSeconds%60;
        let seconds=totalSeconds
        hours=(hours<10)? `0${hours}`:hours;
        mins=(mins<10)?`0${mins}`:mins;
        seconds=(seconds<10)?`0${seconds}`:seconds;
        timer.innerText=`${hours}:${mins}:${seconds}`;
        counter++
    }
    timerID=setInterval(displayTime,1000)
}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText="00:00:00";
    timer.style.display="none";

}

let filterLayer=document.querySelector(".filter-layer");

let allFilters=document.querySelectorAll(".filter");

allFilters.forEach((filterElm)=>{
    filterElm.addEventListener("click",(e)=>{
        transparentColor=getComputedStyle(filterElm).getPropertyValue("background-color");
        filterLayer.style.backgroundColor=transparentColor;
    })
})