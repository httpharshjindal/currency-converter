import { countryToCurrency } from "./list.js";
let baseLink="https://api.coinconvert.net/convert/btc/inr?amount=1";
let currlink="https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/inr.json"
let imgurl="https://flagsapi.com/:country_code/:style/:size.png"
let cryptoImg="https://coinicons-api.vercel.app/api/icon/btc"

const dropdown=document.querySelectorAll(".innercontainer select")
const fromselectEl=document.getElementById("from-select")
const toselectEl=document.getElementById("to-select");
const convBtn=document.getElementById("convert-btn");
const excBtn=document.getElementById("exc-btn");
let fromInp=document.querySelector(".from input");
let toInp=document.getElementById("to-inp");



const updateFlag =(element) => {
    let currCode = element.value;   
    let countryCode = countryToCurrency[currCode];
    let newSrc

    if(countryToCurrency[currCode]==="amount"){
        newSrc= `https://coinicons-api.vercel.app/api/icon/${currCode.toLowerCase()}`
    }
    else{
        newSrc= `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`
    }
    if(element.id==="from-select"){
        fromselectEl.style.backgroundImage=`url(${newSrc})`;
    }
    else{
        toselectEl.style.backgroundImage=`url(${newSrc})`;
    }
    
}





const updateexchangerate= async ()=> {
    

    let fromAmt=fromInp.value
    function reset(){
    if(fromAmt==="" || fromAmt<0.0000000000000000000000000001){
        fromAmt=1;
        fromInp.value="1";
    }
    let toAmt=toInp.value
    if(toAmt==="" || toAmt<0.0000000000000000000000000001){
        toAmt=1
        toInp.value="1"
    }
}

    reset()
    const firstUrl=`https://api.coinconvert.net/convert/${fromselectEl.value.toLowerCase()}/${toselectEl.value.toLowerCase()}?amount=1`
    const SecondUrl=`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromselectEl.value.toLowerCase()}/${toselectEl.value.toLowerCase()}.json`
    let response
    let status
    let data
    let rate
    
    try{
        response=await fetch(firstUrl)
        status=response.status
        data=await response.json()
    }catch(error){
        status=response.status
    }


    if(status=="200"){
        rate= fromAmt * data[toselectEl.value]
        toInp.value=rate;
    }
    else{
        try{
            response=await fetch(SecondUrl)
            status=response.status
            data=await response.json()
        }catch{
            status=response.status
        }
        if(status=="200"){
            rate= fromAmt * data[toselectEl.value.toLowerCase()]
            toInp.value=rate;
        }else{
            console.log("there is an error at api side")
            rate="0"
        }
    }
    
    let finalrate
    try{
        finalrate=rate.toLocaleString('en-us',
        {
            style:'currency',
            currency:`${toselectEl.value}`,
            maximumFractionDigits: 10
        })
    }catch(error){
        finalrate=`${rate} ${toselectEl.value}`
    }
    
    let excText=document.getElementById("exc-text")
    excText.innerText=`${fromAmt} ${fromselectEl.value} = ${finalrate} `
};  


for(let select of dropdown){
    for (let i in countryToCurrency){
        let optEl=document.createElement("option")
        optEl.innerText=i
        optEl.value=i;
        if(select.name==="from" && i==="BTC"){
            optEl.selected="selected"
        }
        else if(select.name==="to" && i==="INR"){
            optEl.selected="selected"
        }
    select.append(optEl);
    
    }
    updateFlag(select)
    select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateexchangerate()
    });   
    
}
excBtn.addEventListener("click",() =>{
    console.log("button clicked")
    let temp=fromInp.value;
    fromInp.value=toInp.value;
    toInp.value=temp;
})

convBtn.addEventListener("click", (evt) =>{
    evt.preventDefault();
    updateexchangerate();
})

window.addEventListener("load", (evt)=>{
    evt.preventDefault;
    updateexchangerate();
})

