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
const languageBn=document.querySelector("#language-bn"),languageEn=document.querySelector("#language-en");
const translations=[
["হোম","Home"],["পরিচিতি","About"],["সেবাসমূহ","Services"],["রেটিং","Ratings"],["অ্যাপয়েন্টমেন্ট","Appointment"],["যোগাযোগ","Contact"],["যোগাযোগ করুন","Contact Us"],["যত্ন, মনোযোগ ও আস্থার সঙ্গে","Care, attention and trust"],["আপনার সুস্থতার যত্নে,","Your health, our care,"],["আস্থার সঙ্গে","With confidence"],["স্বাস্থ্য সম্পর্কে জানুন, আপনার কথা বলুন এবং যত্নের পরবর্তী ধাপটি বুঝে নিন—সহজ ভাষায়, আন্তরিকতার সঙ্গে।","Learn about your health, share your concerns, and understand the next step in care—in simple, reassuring language."],["অ্যাপয়েন্টমেন্টের জন্য যোগাযোগ করুন","Contact for an appointment"],["সেবাসমূহ দেখুন","Explore services"],["রোগীর কথা আগে","Patients first"],["মনোযোগী ও মানবিক যত্ন","Attentive, compassionate care"],["বিশেষত্ব","Specialty"],["মেডিসিন ও ডায়াবেটিস","Medicine & Diabetes"],["চেম্বারের সময়","Chamber hours"],["চেম্বারের ঠিকানা","Chamber address"],["পরিচিতি","About"],["স্বাস্থ্যসেবায়","In healthcare"],["সহজ কথা,","Clear communication,"],["মনোযোগী যত্ন","Attentive care"],["রোগীর মতামত","Patient reviews"],["আপনার অভিজ্ঞতা জানান","Share your experience"],["আপনার রেটিং দিন","Rate your experience"],["রেটিং জমা দিন","Submit rating"],["কথা বলতে চান?","Would you like to talk?"],["যোগাযোগের ফর্ম","Contact form"],["আপনার নাম","Your name"],["ফোন নম্বর","Phone number"],["পছন্দের তারিখ","Preferred date"],["যোগাযোগের ধরন","Reason for contact"],["বার্তা","Message"],["ফর্ম জমা দিন","Submit form"],
["শনি–বৃহস্পতি · বিকেল ৫টা–রাত ৮টা","Sat–Thu · 5 PM–8 PM"],["সিটি কেয়ার ক্লিনিক, ঢাকা","City Care Clinic, Dhaka"],["(কাল্পনিক)","(Fictional)"],["কাল্পনিক তথ্য","Fictional information"],["কাল্পনিক স্থান","Fictional location"],["কাল্পনিক","Fictional"],["যোগ্যতা · কাল্পনিক","Qualifications · Fictional"],["বিশেষত্ব · কাল্পনিক","Specialty · Fictional"],["এমবিবিএস, এমডি (মেডিসিন)","MBBS, MD (Medicine)"],["সাধারণ স্বাস্থ্য পরামর্শ","General health consultation"],["ডায়াবেটিস ব্যবস্থাপনা","Diabetes management"],["নিয়মিত স্বাস্থ্য পরীক্ষা","Routine health checkups"],["অনলাইন পরামর্শ","Online consultation"],["নিচের সেবাগুলো কেবল  ওয়েবসাইটের উদাহরণ।","The services below are examples for this website."],["সাধারণ স্বাস্থ্যসংক্রান্ত প্রশ্ন ও পরবর্তী পদক্ষেপ নিয়ে আলোচনা করার  সেবা।","A sample service for discussing general health questions and next steps."],["ডায়াবেটিস সম্পর্কে সচেতনতা ও নিয়মিত যত্নের বিষয়গুলো নিয়ে আলোচনার উদাহরণ।","An example service for discussing diabetes awareness and ongoing care."],["স্বাস্থ্য পরীক্ষা ও নিয়মিত ফলো-আপের গুরুত্ব সম্পর্কে সাধারণ তথ্য।","General information about health checks and regular follow-up."],["অনলাইনে যোগাযোগের সম্ভাব্য পদ্ধতি সম্পর্কে তথ্য দেওয়ার  সেবা।","Information about possible ways to contact online."],["রেটিং যাচাইয়ের পর প্রকাশ করা হবে。","Ratings will be published after review."],["রেটিং যাচাইয়ের পর প্রকাশ করা হবে।","Ratings will be published after review."],["এখনো কোনো প্রকাশিত রেটিং নেই","No published ratings yet"],["যাচাইয়ের পর প্রকাশ করা হবে।","Published after review."],["স্টার রেটিং","Star rating"],["মতামত (ঐচ্ছিক)","Review (optional)"],["ধন্যবাদ! যাচাইয়ের পর রেটিং প্রকাশ করা হবে।","Thank you! Your rating will be published after review."],["রেটিং জমা হয়নি। আবার চেষ্টা করুন।","Rating could not be submitted. Please try again."],["আবেদন জমা হয়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।","Your request could not be submitted. Please check your details and try again."],["আপনার আবেদন সফলভাবে জমা হয়েছে। ধন্যবাদ।","Your request was submitted successfully. Thank you."],["আপনার আবেদন জমা দিন।","Submit your request."],["সব তথ্য কাল্পনিক র জন্য","For fictional/sample information only"],["সাধারণ যোগাযোগ","General inquiry"],["চেম্বার সম্পর্কে","About the chamber"],["আপনার ফোন নম্বর","Your phone number"],["নাম লিখুন","Enter your name"],["সংক্ষিপ্ত বার্তা লিখুন","Write a short message"],["যোগাযোগের তথ্য দেখুন","View contact information"],["রোগীর কথা শোনা, তথ্য সহজভাবে বোঝানো এবং নিয়মিত যত্নের গুরুত্ব তুলে ধরা হয়েছে।","This profile highlights listening to patients, explaining information clearly, and the importance of regular care."],["ডা. নাওরিন ইসলাম সাধারণ স্বাস্থ্য সমস্যা, ডায়াবেটিস এবং দীর্ঘমেয়াদি রোগের যত্নে রোগীদের সহায়তা করেন। তিনি রোগীর কথা মনোযোগ দিয়ে শোনেন এবং সহজ ভাষায় স্বাস্থ্যবিষয়ক তথ্য ও পরামর্শ দেন।","Dr. Nawrin Islam helps patients with general health concerns, diabetes, and long-term care. She listens carefully and explains health information in simple language."],["আপনার অভিজ্ঞতা","Your experience"],["আপনার যত্নে,","Care for you,"],["চারটি সেবা","Four services"],["ফোন","Phone"],["ইমেইল","Email"],["চেম্বার","Chamber"],["সময়","Hours"],["পোর্টফোলিও","Portfolio"],["মেডিসিন ও ডায়াবেটিস · ","Medicine & Diabetes · "],["© ","© "],["লগইন করুন","Log in"],["রোগীর মতামত","Patient feedback"],["আপনার অভিজ্ঞতা জানান","Share your experience"],["আবেদন পাঠান।","Send your request."]
];
const originalTexts=[];
/* Keep the original Bengali strings and translate every visible text node, including labels and dynamically updated status text. */
const extraTranslations=[
["ডা. নাওরিন ইসলাম","Dr. Nawrin Islam"],["মেডিসিন ও ডায়াবেটিস বিশেষজ্ঞ","Medicine & Diabetes Specialist"],
["হোম","Home"],["মেনু খুলুন","Open menu"],["মেনু বন্ধ করুন","Close menu"],
["আপনার সুস্থতার যত্নে,","Your health, our care,"],["আস্থার সঙ্গে","With confidence"],
["স্বাস্থ্যসেবায়","In healthcare"],["স্বাস্থ্যসেবায় সহজ কথা,","Clear communication in healthcare,"],
["স্বাস্থ্যসেবা","Healthcare"],["আপনার যত্নে,","Care for you,"],["চারটি সেবা","Four services"],
["সাধারণ স্বাস্থ্য পরামর্শের জন্য যোগাযোগ","Contact for general health consultation"],
["ডায়াবেটিস ব্যবস্থাপনার জন্য যোগাযোগ","Contact for diabetes management"],["স্বাস্থ্য পরীক্ষার জন্য যোগাযোগ","Contact for health checkups"],
["অনলাইন পরামর্শের জন্য যোগাযোগ","Contact for online consultation"],
["আপনার অভিজ্ঞতা","Your experience"],["রেটিং যাচাইয়ের পর প্রকাশ করা হবে।","Ratings will be published after review."],
["যোগাযোগ করুন","Contact us"],["সেবাসমূহ দেখুন","View services"],["যোগাযোগের তথ্য দেখুন","View contact information"],
["স্টার রেটিং","Star rating"],["মতামত (ঐচ্ছিক)","Review (optional)"],["নাম (ঐচ্ছিক)","Name (optional)"],
["নাম লিখুন","Enter your name"],["আপনার ফোন নম্বর","Your phone number"],["সংক্ষিপ্ত বার্তা লিখুন","Write a short message"],
["ফর্ম জমা দিন","Submit form"],["রেটিং জমা দিন","Submit rating"],["রেটিং দিন","Rate us"],
["রেটিং","Ratings"],["এখনো কোনো প্রকাশিত রেটিং নেই","No published ratings yet"],
["শনি–বৃহস্পতি","Saturday–Thursday"],["বিকেল ৫টা","5 PM"],["রাত ৮টা","8 PM"],
["রোগীর কথা আগে","Patients first"],["মনোযোগী ও মানবিক যত্ন","Attentive, compassionate care"],
["সাধারণ স্বাস্থ্যসংক্রান্ত প্রশ্ন ও পরবর্তী পদক্ষেপ নিয়ে আলোচনা করার  সেবা।","A sample service for discussing general health questions and next steps."],
["নিচের সেবাগুলো কেবল  ওয়েবসাইটের উদাহরণ।","The services below are examples for this website."],
["চেম্বার · কাল্পনিক","Chamber · Fictional"],["সময় · কাল্পনিক","Hours · Fictional"],
["ফোন","Phone"],["ইমেইল","Email"],["পোর্টফোলিও","Portfolio"],["চেম্বার","Chamber"],["সময়","Hours"],
["রোগীর মতামত","Patient feedback"],["আপনার অভিজ্ঞতা জানান","Share your experience"],
["যোগাযোগের ফর্ম","Contact form"],["আপনার নাম","Your name"],["ফোন নম্বর","Phone number"],
["পছন্দের তারিখ","Preferred date"],["যোগাযোগের ধরন","Reason for contact"],["বার্তা","Message"],
["ফর্ম পূরণ করে অ্যাপয়েন্টমেন্টের আবেদন পাঠান।","Fill out the form to request an appointment."],
["কথা বলতে চান?","Would you like to talk?"],["যোগাযোগ করুন","Contact us"],
["সব তথ্য কাল্পনিক র জন্য","For fictional/sample information only"],
["সাধারণ যোগাযোগ","General inquiry"],["চেম্বার সম্পর্কে","About the chamber"],
["আপনার আবেদন জমা দিন।","Submit your request."],["রোগীর কথা শোনা, তথ্য সহজভাবে বোঝানো এবং নিয়মিত যত্নের গুরুত্ব তুলে ধরা হয়েছে।","This profile highlights listening to patients, explaining information clearly, and the importance of regular care."],
["ডাক্তারের প্রোফাইল ছবি","Doctor's profile photo"],["ডা. নাওরিন ইসলাম, হোম","Dr. Nawrin Islam, Home"]
];
function translateValue(value,lang){
 if(lang!=="en")return value;
 let result=value;
 for(const [bn,en] of [...translations,...extraTranslations].sort((a,b)=>b[0].length-a[0].length))result=result.split(bn).join(en);
 return result;
}
function setLanguage(lang){
 document.documentElement.lang=lang==="en"?"en":"bn";
 document.querySelectorAll("body *").forEach(el=>{
  if(el.children.length===0 && el.textContent.trim()){
   if(!el.dataset.originalText)el.dataset.originalText=el.textContent;
   el.textContent=translateValue(el.dataset.originalText,lang);
  }
  for(const attr of ["aria-label","title"]){
   if(el.hasAttribute(attr)){
    const key="original"+attr.split("-").map(x=>x[0].toUpperCase()+x.slice(1)).join("");
    if(!el.dataset[key])el.dataset[key]=el.getAttribute(attr);
    el.setAttribute(attr,translateValue(el.dataset[key],lang));
   }
  }
 });
 document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(el=>{
  if(!el.dataset.originalPlaceholder)el.dataset.originalPlaceholder=el.placeholder;
  el.placeholder=translateValue(el.dataset.originalPlaceholder,lang);
 });
 document.querySelectorAll("option").forEach(el=>{
  if(!el.dataset.originalText)el.dataset.originalText=el.textContent;
  el.textContent=translateValue(el.dataset.originalText,lang);
 });
 if(languageBn)languageBn.classList.toggle("is-active",lang==="bn");
 if(languageEn)languageEn.classList.toggle("is-active",lang==="en");
 try{sessionStorage.setItem("doctor-site-language",lang);}catch(e){}
}
/* Translate new content such as form confirmations and ratings after language selection. */
let translatingMutation=false;
const languageObserver=new MutationObserver(records=>{
 if(translatingMutation)return;
 const lang=document.documentElement.lang==="en"?"en":"bn";
 if(lang!=="en")return;
 translatingMutation=true;
 for(const record of records)for(const node of record.addedNodes){
  if(node.nodeType===Node.TEXT_NODE && node.textContent.trim())node.textContent=translateValue(node.textContent,"en");
  else if(node.nodeType===Node.ELEMENT_NODE){
   if(node.children.length===0 && node.textContent.trim()){if(!node.dataset.originalText)node.dataset.originalText=node.textContent;node.textContent=translateValue(node.dataset.originalText,"en");}
   node.querySelectorAll("*").forEach(el=>{if(el.children.length===0&&el.textContent.trim()){if(!el.dataset.originalText)el.dataset.originalText=el.textContent;el.textContent=translateValue(el.dataset.originalText,"en");}});
  }
 }
 translatingMutation=false;
});
languageObserver.observe(document.body,{childList:true,subtree:true});

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
 if(languageBn)languageBn.classList.toggle("is-active",lang==="bn");
 if(languageEn)languageEn.classList.toggle("is-active",lang==="en");
 sessionStorage.setItem("doctor-site-language",lang);
}
if(languageBn)languageBn.addEventListener("click",()=>setLanguage("bn"));
if(languageEn)languageEn.addEventListener("click",()=>setLanguage("en"));
setLanguage(sessionStorage.getItem("doctor-site-language")==="en"?"en":"bn");

/* Load the administrator-selected logo from Supabase. */
async function loadSiteBranding(){
 try{
  const {data,error}=await supabaseClient.from("doctor_site_settings").select("logo_url,doctor_photo_url").eq("id",1).maybeSingle();
  if(error||!data)return;
  if(data.logo_url){document.querySelectorAll(".site-logo").forEach(img=>{img.src=data.logo_url;});const favicon=document.querySelector("#site-favicon");if(favicon)favicon.href=data.logo_url;}
  if(data.doctor_photo_url){document.querySelectorAll(".doctor-photo").forEach(img=>{img.src=data.doctor_photo_url;img.alt="ডাক্তারের প্রোফাইল ছবি";});}
 }catch(e){console.warn("Branding settings unavailable",e);}
}
loadSiteBranding();

/* Remove the legacy demo-information banner if it exists in a cached/older page. */
document.querySelectorAll("body *").forEach(el=>{
 if(el.children.length===0 && el.textContent.includes("ওয়েবসাইট — এখানে দেখানো ডাক্তার ও চিকিৎসাসংক্রান্ত সব তথ্য কাল্পনিক।")){
  const panel=el.closest("[role='note'],.notice,.disclaimer,.info-banner,.alert")||el.parentElement;
  if(panel)panel.remove();
 }
});
