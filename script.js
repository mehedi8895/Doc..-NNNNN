"use strict";
const SUPABASE_URL="https://mrqaqppvqvytcromdigt.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_64Z97Zq7g8mVGIF3szoC9A_UTwQnFI3";
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const menuButton=document.querySelector(".menu-toggle"),navLinks=document.querySelector("#nav-links");
function closeMenu(){if(!menuButton||!navLinks)return;menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","মেনু খুলুন");navLinks.classList.remove("is-open");}
if(menuButton&&navLinks){menuButton.addEventListener("click",()=>{const open=menuButton.getAttribute("aria-expanded")==="true";menuButton.setAttribute("aria-expanded",String(!open));navLinks.classList.toggle("is-open",!open);});navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenu();menuButton.focus();}});window.addEventListener("resize",()=>{if(matchMedia("(min-width: 781px)").matches)closeMenu();});}
const appointmentForm=document.querySelector("#appointment-form"),formMessage=document.querySelector("#form-message");
if(appointmentForm&&formMessage)appointmentForm.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(appointmentForm);const reasonMap={"সাধারণ যোগাযোগ":"general","চেম্বার সম্পর্কে":"chamber","অনলাইন পরামর্শ":"online"};const payload={patient_name:String(fd.get("name")||"").trim(),phone:String(fd.get("phone")||"").trim(),preferred_date:fd.get("date")||null,reason:reasonMap[fd.get("reason")]||"general",message:String(fd.get("message")||"").trim(),status:"pending"};const {error}=await supabaseClient.from("doctor_appointments").insert(payload);if(error){formMessage.textContent="আবেদন জমা হয়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।";return;}formMessage.textContent="আপনার আবেদন সফলভাবে জমা হয়েছে। ধন্যবাদ।";formMessage.classList.add("is-confirmed");appointmentForm.reset();});
const ratingForm=document.querySelector("#rating-form"),ratingMessage=document.querySelector("#rating-message"),ratingValue=document.querySelector("#rating-value"),starButtons=Array.from(document.querySelectorAll("[data-rating]"));
function setStars(n){if(ratingValue)ratingValue.value=String(n);starButtons.forEach(btn=>btn.textContent=Number(btn.dataset.rating)<=n?"★":"☆");}
starButtons.forEach(btn=>btn.addEventListener("click",()=>setStars(Number(btn.dataset.rating))));setStars(5);
async function loadRatings(){const {data,error}=await supabaseClient.from("doctor_ratings").select("rating,display_name,comment,created_at").eq("status","published").order("created_at",{ascending:false}).limit(20);if(error)return;const avg=document.querySelector("#rating-average"),stars=document.querySelector("#rating-average-stars"),count=document.querySelector("#rating-count"),list=document.querySelector("#rating-list");if(!data.length)return;const mean=data.reduce((s,x)=>s+x.rating,0)/data.length;avg.textContent=mean.toFixed(1)+" / 5";stars.textContent="★".repeat(Math.round(mean))+"☆".repeat(5-Math.round(mean));count.textContent=data.length+"টি প্রকাশিত রেটিং";list.replaceChildren(...data.map(x=>{const card=document.createElement("article");card.className="rating-card";const top=document.createElement("div");top.className="rating-card-top";const name=document.createElement("strong");name.textContent=x.display_name;const score=document.createElement("span");score.className="rating-card-stars";score.textContent="★".repeat(x.rating)+"☆".repeat(5-x.rating);top.append(name,score);card.append(top);if(x.comment){const p=document.createElement("p");p.textContent=x.comment;card.append(p);}return card;}));}
if(ratingForm)ratingForm.addEventListener("submit",async e=>{e.preventDefault();const {error}=await supabaseClient.from("doctor_ratings").insert({rating:Number(ratingValue.value),display_name:document.querySelector("#rating-name").value.trim()||"রোগী",comment:document.querySelector("#rating-comment").value.trim(),status:"pending"});if(error){ratingMessage.textContent="রেটিং জমা হয়নি। আবার চেষ্টা করুন।";return;}ratingMessage.textContent="ধন্যবাদ! যাচাইয়ের পর রেটিং প্রকাশ করা হবে।";ratingForm.reset();setStars(5);});
loadRatings();
const year=document.querySelector("#year");if(year)year.textContent=String(new Date().getFullYear());
/* Bengali / English language switch */
const languageButton=document.querySelector("#language-toggle");
const translations=[
["হোম","Home"],["পরিচিতি","About"],["সেবাসমূহ","Services"],["রেটিং","Ratings"],["অ্যাপয়েন্টমেন্ট","Appointment"],["যোগাযোগ","Contact"],["যোগাযোগ করুন","Contact Us"],["যত্ন, মনোযোগ ও আস্থার সঙ্গে","Care, attention and trust"],["আপনার সুস্থতার যত্নে,","Your health, our care,"],["আস্থার সঙ্গে","With confidence"],["স্বাস্থ্য সম্পর্কে জানুন, আপনার কথা বলুন এবং যত্নের পরবর্তী ধাপটি বুঝে নিন—সহজ ভাষায়, আন্তরিকতার সঙ্গে।","Learn about your health, share your concerns, and understand the next step in care—in simple, reassuring language."],["অ্যাপয়েন্টমেন্টের জন্য যোগাযোগ করুন","Contact for an appointment"],["সেবাসমূহ দেখুন","Explore services"],["রোগীর কথা আগে","Patients first"],["মনোযোগী ও মানবিক যত্ন","Attentive, compassionate care"],["বিশেষত্ব","Specialty"],["মেডিসিন ও ডায়াবেটিস","Medicine & Diabetes"],["চেম্বারের সময়","Chamber hours"],["চেম্বারের ঠিকানা","Chamber address"],["পরিচিতি","About"],["স্বাস্থ্যসেবায়","In healthcare"],["সহজ কথা,","Clear communication,"],["মনোযোগী যত্ন","Attentive care"],["রোগীর মতামত","Patient reviews"],["আপনার অভিজ্ঞতা জানান","Share your experience"],["আপনার রেটিং দিন","Rate your experience"],["রেটিং জমা দিন","Submit rating"],["কথা বলতে চান?","Would you like to talk?"],["যোগাযোগের ফর্ম","Contact form"],["আপনার নাম","Your name"],["ফোন নম্বর","Phone number"],["পছন্দের তারিখ","Preferred date"],["যোগাযোগের ধরন","Reason for contact"],["বার্তা","Message"],["ফর্ম জমা দিন","Submit form"]
];
const originalTexts=[];
function setLanguage(lang){
 document.documentElement.lang=lang==="en"?"en":"bn";
 document.querySelectorAll("body *").forEach(el=>{
  if(el.children.length===0 && el.textContent.trim()){
   if(!el.dataset.originalText)el.dataset.originalText=el.textContent;
   let value=el.dataset.originalText;
   if(lang==="en") for(const [bn,en] of translations)value=value.split(bn).join(en);
   el.textContent=value;
  }
 });
 document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(el=>{
  if(!el.dataset.originalPlaceholder)el.dataset.originalPlaceholder=el.placeholder;
  let v=el.dataset.originalPlaceholder;
  if(lang==="en")for(const [bn,en] of translations)v=v.split(bn).join(en);
  el.placeholder=v;
 });
 if(languageButton){languageButton.textContent=lang==="en"?"বাংলা":"EN";languageButton.setAttribute("aria-label",lang==="en"?"বাংলায় পরিবর্তন করুন":"Switch to English");}
 sessionStorage.setItem("doctor-site-language",lang);
}
if(languageButton){languageButton.addEventListener("click",()=>setLanguage(document.documentElement.lang==="bn"?"en":"bn"));}
