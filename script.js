/* beauty.salon.Vivien — shop logic */

// === Webhook URL: change ONLY here when switching to production ===
const WEBHOOK_URL = "https://danit-n8n.duckdns.org/webhook-test/79ec41d4-9f5d-4f0a-84b1-823fb93fa370";

// === Demo products (replace image URLs as needed) ===
const PRODUCTS = [
  {id:1,name:"Восстанавливающий шампунь",category:"Шампуни",price:550,desc:"Мягко очищает и помогает вернуть волосам гладкость.",img:"https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80"},
  {id:2,name:"Увлажняющий шампунь",category:"Шампуни",price:490,desc:"Бережное очищение для сухих и тусклых волос.",img:"https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80"},
  {id:3,name:"Питательный кондиционер",category:"Кондиционеры",price:520,desc:"Облегчает расчёсывание и делает волосы мягкими.",img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"},
  {id:4,name:"Интенсивно восстанавливающая маска",category:"Маски",price:680,desc:"Насыщенная текстура для глубокого ухода раз в неделю.",img:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80"},
  {id:5,name:"Увлажняющая маска для волос",category:"Маски",price:620,desc:"Лёгкая маска для комфорта и мягкости волос.",img:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80"},
  {id:6,name:"Спрей-термозащита",category:"Термозащита",price:590,desc:"Защитный слой перед феном, утюжком и плойкой.",img:"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80"},
  {id:7,name:"Аргановое масло для волос",category:"Масла",price:720,desc:"Несколько капель добавляют блеск и ухоженный вид.",img:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80"},
  {id:8,name:"Разглаживающая сыворотка",category:"Сыворотки",price:650,desc:"Помогает уложить пушистые пряди и придать гладкость.",img:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"}
];
const CATEGORIES = ["Шампуни","Кондиционеры","Маски","Термозащита","Масла","Сыворотки"];
const FAQ = [
  ["Как подобрать средство для своего типа волос?","Ориентируйтесь на основную задачу: увлажнение, питание или гладкость. Если сомневаетесь — напишите нам, и мы подскажем."],
  ["Можно ли использовать несколько средств одновременно?","Да, средства линии дополняют друг друга: например, шампунь, кондиционер и несколько капель сыворотки или масла."],
  ["Как часто использовать маску?","Обычно достаточно 1–2 раз в неделю. Следуйте рекомендациям на упаковке конкретного продукта."],
  ["Нужна ли термозащита?","Если вы пользуетесь феном, утюжком или плойкой, термозащита помогает сделать укладку бережнее для волос."],
  ["Как осуществляется доставка?","Мы отправляем заказы Новой почтой, Укрпочтой или курьером. Детали подтвердим при звонке."],
  ["Можно ли изменить заказ после оформления?","Да, свяжитесь с нами как можно скорее — пока заказ не отправлен, мы внесём изменения."]
];

const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString("ru-RU") + " грн";
let cart = [];            // [{id, name, price, quantity}]
let activeCat = "Все";

/* ---------- Catalog & filters ---------- */
function renderFilters(){
  const el = $("#filters");
  if (el) {
    el.innerHTML = ["Все",...CATEGORIES].map(c =>
      `<button class="chip" data-cat="${c}" aria-pressed="${c===activeCat}">${c}</button>`).join("");
  }
}

function renderProducts(){
  const el = $("#grid");
  if (el) {
    const list = activeCat==="Все" ? PRODUCTS : PRODUCTS.filter(p=>p.category===activeCat);
    el.innerHTML = list.map(p=>`
      <article class="card">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="card__body">
          <span class="card__cat">${p.category}</span>
          <h3>${p.name}</h3><p>${p.desc}</p>
          <div class="card__foot"><span class="price">${fmt(p.price)}</span>
          <button class="add" data-add="${p.id}">В корзину</button></div>
        </div>
      </article>`).join("");
  }
}

function setCategory(c){ activeCat=c; renderFilters(); renderProducts(); }

/* ---------- Cart ---------- */
const total = () => cart.reduce((s,i)=>s+i.price*i.quantity,0);
function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  const ex = cart.find(i=>i.id===id);
  ex ? ex.quantity++ : cart.push({id:p.id,name:p.name,price:p.price,quantity:1});
  renderCart();
  const b=$("#cartCount"); if(b) b.animate([{transform:"scale(1.4)"},{transform:"scale(1)"}],{duration:250});
}
function changeQty(id,d){
  const i = cart.find(x=>x.id===id); if(!i) return;
  i.quantity += d;
  if(i.quantity<=0) cart = cart.filter(x=>x.id!==id);
  renderCart();
}
function removeItem(id){ cart = cart.filter(x=>x.id!==id); renderCart(); }
function renderCart(){
  const cartCount = $("#cartCount");
  if (cartCount) cartCount.textContent = cart.reduce((s,i)=>s+i.quantity,0);
  
  const cartBody = $("#cartBody");
  const cartFoot = $("#cartFoot");
  
  if(!cart.length){
    if (cartBody) cartBody.innerHTML = `<div class="empty"><p>Ваша корзина пока пуста</p><button class="btn btn--primary" data-tocatalog>Перейти к каталогу</button></div>`;
    if (cartFoot) cartFoot.innerHTML = ""; 
    return;
  }
  
  if (cartBody) {
    cartBody.innerHTML = cart.map(i=>`
      <div class="item">
        <b>${i.name}</b><b>${fmt(i.price*i.quantity)}</b>
        <div class="qty"><button data-dec="${i.id}" aria-label="Уменьшить количество">−</button>
          <span aria-label="Количество">${i.quantity}</span>
          <button data-inc="${i.id}" aria-label="Увеличить количество">+</button>
          <small>${fmt(i.price)} / шт.</small></div>
        <button class="link" data-rm="${i.id}">Удалить</button>
      </div>`).join("");
  }
  
  if (cartFoot) {
    cartFoot.innerHTML = `
      <div class="total"><span>Итого:</span><span>${total().toLocaleString("ru-RU")} грн</span></div>
      <button class="btn btn--primary btn--full" data-checkout>Оформить заказ</button>
      <button class="link" data-clear style="margin-top:.8rem">Очистить корзину</button>`;
  }
}

function openCart(){ $("#overlay").hidden=false; $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden","false"); }
function closeCart(){ $("#overlay").hidden=true; $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden","true"); }

/* ---------- Checkout ---------- */
function validate(form){
  const v = Object.fromEntries(new FormData(form));
  const e = {};
  if(!v.name.trim()) e.name="Введите ваше имя";
  if(!/^\+?[\d\s()-]{10,}$/.test(v.phone.trim())) e.phone="Введите корректный номер телефона";
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email="Введите корректный email";
  if(!v.city.trim()) e.city="Укажите город";
  if(!v.delivery) e.delivery="Выберите способ доставки";
  form.querySelectorAll(".err").forEach(el=>{
    const msg=e[el.dataset.for]||""; el.textContent=msg;
    if(form.elements[el.dataset.for]) form.elements[el.dataset.for].classList.toggle("invalid",!!msg);
  });
  return Object.keys(e).length===0;
}

function buildOrder(form){
  const v = Object.fromEntries(new FormData(form));
  return {
    customer_name: v.name.trim(), phone: v.phone.trim(), email: v.email.trim(),
    city: v.city.trim(), delivery_method: v.delivery, comment: v.comment.trim(),
    products: cart.map(i=>({name:i.name,quantity:i.quantity,price:i.price})),
    total: total()
  };
}

async function submitOrder(ev){
  ev.preventDefault();
  const form = ev.target;
  $("#formError").hidden = true;
  if(!cart.length || !validate(form)) return;
  const btn = $("#submitBtn"); if(btn) { btn.disabled = true; btn.textContent = "Отправляем…"; }
  try{
    const res = await fetch(WEBHOOK_URL,{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(buildOrder(form))
    });
    if(!res.ok) throw new Error("HTTP " + res.status);
    cart = []; renderCart(); form.reset();
    $("#checkoutModal").hidden = true; closeCart();
    $("#successModal").hidden = false;
  }catch(err){
    console.error("Ошибка отправки заказа в n8n:", err);
    $("#formError").hidden = false;
  }finally{
    if(btn) { btn.disabled = false; btn.textContent = "Отправить заказ"; }
  }
}

/* ---------- Init & events ---------- */
function init(){
  const cats = $("#cats");
  if (cats) cats.innerHTML = CATEGORIES.map(c=>`<button class="cat" data-catcard="${c}">${c}</button>`).join("");
  
  const faqList = $("#faqList");
  if (faqList) faqList.insertAdjacentHTML("beforeend", FAQ.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join(""));
  
  renderFilters(); renderProducts(); renderCart();

  document.addEventListener("click",e=>{
    const t = e.target.closest("button,a"); if(!t) return;
    const d = t.dataset;
    if(d.cat) setCategory(d.cat);
    if(d.catcard){ setCategory(d.catcard); $("#catalog").scrollIntoView(); }
    if(d.add) addToCart(+d.add);
    if(d.inc) changeQty(+d.inc,1);
    if(d.dec) changeQty(+d.dec,-1);
    if(d.rm) removeItem(+d.rm);
    if("clear" in d){ cart=[]; renderCart(); }
    if("tocatalog" in d){ closeCart(); $("#catalog").scrollIntoView(); }
    if("checkout" in d){ $("#formError").hidden=true; $("#checkoutModal").hidden=false; if($("#f-name")) $("#f-name").focus(); }
    if("close" in d) $("#checkoutModal").hidden = true;
    if(t.closest("#nav")){ $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded","false"); }
  });

  if($("#cartBtn")) $("#cartBtn").onclick = openCart; 
  if($("#closeCart")) $("#closeCart").onclick = closeCart; 
  if($("#overlay")) $("#overlay").onclick = closeCart;
  if($("#backBtn")) $("#backBtn").onclick = ()=>{ $("#successModal").hidden=true; $("#catalog").scrollIntoView(); };
  if($("#burger")) $("#burger").onclick = ()=>{ const o=$("#nav").classList.toggle("open"); $("#burger").setAttribute("aria-expanded",o); };
  
  const form = $("#orderForm");
  if(form) form.addEventListener("submit", submitOrder);
  
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeCart(); $("#checkoutModal").hidden=true; }});
  window.addEventListener("scroll",()=> {
    const header = $("#header");
    if(header) header.classList.toggle("small",window.scrollY>40);
  },{passive:true});
}

// Выполняем скрипт только после полной загрузки HTML
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
