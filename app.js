/* Tournée V7 — géocodage + ordre par distance à la mairie
   - Géocode "Mairie <Ville>" (cache local)
   - Géocode chaque adresse à l'ajout / modification
   - Bouton "Optimiser" : géocode les manquantes (avec biais autour de la mairie) + trie
*/

// ⚠️ LAISSE TON INITIAL_DATA EXACTEMENT COMME IL EST (inchangé)
const INITIAL_DATA = INITIAL_DATA; // <-- (ne pas mettre cette ligne chez toi : garde ton bloc INITIAL_DATA original)

const LS_KEY = "tournee_v7_data";
const LS_MAIRIES = "tournee_v7_mairies";
const LS_LAST_CITY = "tournee_v7_last_city";

// Choix navigation : "waze" (par défaut) ou "maps" (Google Maps en mode piéton)
const LS_NAV_APP = "tournee_v7_nav_app";

const LS_SEED_VERSION = "tournee_v7_seed_version";
const SEED_VERSION = "seed_2025-12-17_1";
const SEED_URL = "./data/adresses.csv";

// ✅ NOUVEAU : stockage position véhicule
const LS_VEHICLE_POS = "tournee_v7_vehicle_pos";

const citySelect = document.getElementById("citySelect");
const addrList = document.getElementById("addrList");
const statusEl = document.getElementById("status");
const cityMeta = document.getElementById("cityMeta");
const btnOptimize = document.getElementById("btnOptimize");
const btnAdd = document.getElementById("btnAdd");
const btnExportTxt = document.getElementById("btnExportTxt");

// Toggle navigation (en haut)
const navWazeBtn = document.getElementById("navWaze");
const navMapsBtn = document.getElementById("navMaps");

// ✅ NOUVEAU : boutons véhicule
const btnSaveVehiclePos = document.getElementById("btnSaveVehiclePos");
const btnFindVehiclePos = document.getElementById("btnFindVehiclePos");

// modal
const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");
const modalSave = document.getElementById("modalSave");
const modalCity = document.getElementById("modalCity");
const modalStreet = document.getElementById("modalStreet");
const modalPostcode = document.getElementById("modalPostcode");

let data = loadData();
let editContext = null; // {city, id}

registerSW();

function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
}

function loadData(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw) return sanitizeData(JSON.parse(raw));
  }catch(e){}
  // deep copy
  return sanitizeData(JSON.parse(JSON.stringify(INITIAL_DATA)));
}
function saveData(){
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function loadMairies(){
  try{
    return JSON.parse(localStorage.getItem(LS_MAIRIES) || "{}");
  }catch(e){ return {}; }
}
function saveMairies(m){ localStorage.setItem(LS_MAIRIES, JSON.stringify(m)); }


// ✅ NOUVEAU : helpers véhicule (GPS)
function getVehiclePos(){
  try{
    return JSON.parse(localStorage.getItem(LS_VEHICLE_POS) || "null");
  }catch(e){
    return null;
  }
}
function setVehiclePos(obj){
  localStorage.setItem(LS_VEHICLE_POS, JSON.stringify(obj));
}
function formatTs(ts){
  try{
    return new Date(ts).toLocaleString("fr-FR");
  }catch(_){
    return "";
  }
}
function getCurrentPositionP(options){
  return new Promise((resolve, reject)=>{
    if(!("geolocation" in navigator)){
      reject(new Error("Géolocalisation non supportée sur cet appareil."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}
function mapsWalkToCoordsUrl(lat, lon){
  // Google Maps : itinéraire à pied vers coords (destination)
  const dest = encodeURIComponent(`${lat},${lon}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
}
async function saveVehiclePosition(){
  try{
    setStatus("GPS véhicule… demande d'autorisation / localisation…");
    const pos = await getCurrentPositionP({
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    });

    const obj = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      ts: Date.now()
    };
    setVehiclePos(obj);
    setStatus(`Position véhicule enregistrée ✅ (±${Math.round(obj.accuracy)}m • ${formatTs(obj.ts)})`);
  }catch(e){
    const msg = (e && e.code === 1)
      ? "Refus GPS : autorise la localisation pour enregistrer le véhicule."
      : (e && e.code === 2)
        ? "GPS indisponible : réessaie dehors / active la localisation."
        : (e && e.code === 3)
          ? "GPS trop lent : réessaie."
          : (e && e.message ? e.message : "Erreur GPS.");
    setStatus(msg, true);
  }
}
async function findVehicle(){
  const v = getVehiclePos();
  if(!v || typeof v.lat !== "number" || typeof v.lon !== "number"){
    setStatus("Aucune position véhicule enregistrée. Clique d'abord sur « Enregistrer véhicule ».", true);
    return;
  }

  // Optionnel : petite confirmation si vieux
  const ageMin = Math.round((Date.now() - (v.ts||0)) / 60000);
  const infoAge = isFinite(ageMin) ? ` (enregistré il y a ~${ageMin} min)` : "";

  if(ageMin > 240){
    if(!confirm(`La position du véhicule est ancienne${infoAge}. Ouvrir Google Maps quand même ?`)){
      return;
    }
  }

  setStatus(`Ouverture Google Maps → véhicule${infoAge}…`);
  window.location.href = mapsWalkToCoordsUrl(v.lat, v.lon);
}


async function fetchText(url){
  const r = await fetch(url, {cache:"no-store"});
  if(!r.ok) throw new Error("HTTP " + r.status);
  return await r.text();
}

// CSV parser (gère guillemets)
function parseCSV(text){
  const rows = [];
  let row = [], cell = "", inQ = false;
  for(let i=0;i<text.length;i++){
    const ch = text[i];
    const next = text[i+1];
    if(inQ){
      if(ch === '"' && next === '"'){ cell += '"'; i++; continue; }
      if(ch === '"'){ inQ = false; continue; }
      cell += ch; continue;
    }else{
      if(ch === '"'){ inQ = true; continue; }
      if(ch === ','){ row.push(cell); cell=""; continue; }
      if(ch === '\n'){
        row.push(cell); cell="";
        if(row.some(v=>String(v).trim()!=="")) rows.push(row);
        row=[]; continue;
      }
      if(ch === '\r') continue;
      cell += ch;
    }
  }
  if(cell.length || row.length){
    row.push(cell);
    if(row.some(v=>String(v).trim()!=="")) rows.push(row);
  }
  return rows;
}

function seedDataFromCSVText(csvText){
  const rows = parseCSV(csvText.trim());
  if(!rows.length) return {};
  const header = rows[0].map(h=>String(h||"").trim().toLowerCase());
  const idxVille = header.indexOf("ville");
  const idxOrdre = header.indexOf("ordre");
  const idxAdr = header.indexOf("adresse");
  const idxStep = header.indexOf("km_depuis_precedente");
  const idxCum = header.indexOf("km_cumul");

  const byCity = {};
  for(let i=1;i<rows.length;i++){
    const r = rows[i];
    const ville = (r[idxVille] ?? "").trim() || "Perpignan";
    const ordre = parseInt((r[idxOrdre] ?? "0").trim(), 10) || 0;
    const full = (r[idxAdr] ?? "").trim();
    if(!full) continue;

    let postcode = "";
    const m = full.match(/\b(\d{5})\b/);
    if(m) postcode = m[1];

    let street = full;
    if(postcode){
      street = full.replace(new RegExp("\\s*"+postcode+"\\s+.*$"), "").trim();
      if(!street) street = full;
    }

    const item = {
      id: (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : (String(Date.now())+"_"+Math.random().toString(16).slice(2)),
      street,
      postcode: postcode || "",
      city: ville,
      lat: null,
      lon: null,
      done: false,
      _stepKm: idxStep >= 0 ? parseFloat(r[idxStep]) : null,
      _cumKm: idxCum >= 0 ? parseFloat(r[idxCum]) : null
    };

    if(!byCity[ville]) byCity[ville] = [];
    byCity[ville].push({ordre, item});
  }

  const out = {};
  Object.keys(byCity).forEach(v=>{
    out[v] = byCity[v].sort((a,b)=>a.ordre-b.ordre).map(x=>x.item);
  });
  return out;
}

async function ensureSeedLoaded(){
  const v = localStorage.getItem(LS_SEED_VERSION);
  if(v === SEED_VERSION) return;

  try{
    setStatus("Chargement des adresses (CSV)…");
    const txt = await fetchText(SEED_URL);
    const seeded = seedDataFromCSVText(txt);
    data = sanitizeData(seeded); // overwrite global
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    localStorage.setItem(LS_SEED_VERSION, SEED_VERSION);
    setStatus("Adresses chargées ✔");
  }catch(e){
    console.error(e);
    setStatus("Impossible de charger le CSV (vérifie data/adresses.csv).", true);
  }
}

function setStatus(msg, isError=false){
  statusEl.textContent = msg || "";
  statusEl.style.color = isError ? "var(--bad)" : "var(--muted)";
}

function stripAccents(s){
  // Compatible (évite les Unicode property escapes \p{…} qui plantent sur certains Android)
  return (s||"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normSpaces(s){ return (s||"").replace(/\s+/g," ").trim(); }

function normCommune(name){
  const raw = String(name||"");
  const low = normSpaces(stripAccents(raw.toLowerCase()
    .replace(/\bfrance\b/g,"")
    .replace(/\b66\b/g,"")
  ));

  // Exclusions (hors zone / incohérent)
  if(low.includes("marseille")) return "__DROP__";
  if(low.includes("le havre") || low==="havre") return "__DROP__";
  if(low.includes("beauvais")) return "__DROP__";
  if(low.includes("vingrau")) return "__DROP__";

  // Canonicalisations
  if(low.includes("argeles")) return "Argelès-sur-Mer";
  if(low.includes("torreil")) return "Torreilles";
  if(low.includes("villelongue")) return "Villelongue-de-la-Salanque";
  if(low.includes("sainte marie") || low.includes("ste marie")) return "Sainte-Marie-la-Mer";
  if(low.includes("perpignan")) return "Perpignan";
  if(low.includes("peyrestort") || low.includes("peyris")) return "Peyrestortes";
  if(low.includes("laurent") && low.includes("salanque")) return "Saint-Laurent-de-la-Salanque";

  // Canet variants: canet / canet plage / canet en rous(s)illon
  if(low.includes("canet")) return "Canet-en-Roussillon";

  // Espira de l'Agly variants
  if(low.includes("espira") && low.includes("agly")) return "Espira-de-l'Agly";
  if(low.includes("espira") && (low.includes("l agly") || low.includes("lagly"))) return "Espira-de-l'Agly";

  // Saint-Cyprien variants
  if(low.includes("saint cyprien") || low.includes("st cyprien")) return "Saint-Cyprien";

  // Saint-Féliu d'Avall variants (typos)
  if(low.includes("feliu") || low.includes("felyu")) return "Saint-Féliu-d'Avall";

  // Default: cleaned original (capitalisation kept roughly)
  return raw.trim() || "";
}

function normStreet(s){
  let x = stripAccents(String(s||"").toLowerCase());
  x = x.replace(/[,.;]/g," ");
  x = x.replace(/\b(france)\b/g,"");
  x = x.replace(/\bavenue\b/g,"av").replace(/\bboulevard\b/g,"bd").replace(/\bplace\b/g,"pl");
  x = normSpaces(x);
  return x;
}

function sanitizeData(input){
  // 1) Flatten and normalize entries
  const flat = [];
  for(const [cityKey, arr] of Object.entries(input||{})){
    const canonKey = normCommune(cityKey);
    if(!canonKey || canonKey==="__DROP__") continue;
    for(const a of (arr||[])){
      const street = String(a.street||"").trim();
      const postcode = String(a.postcode||"").trim();
      let city = normCommune(a.city || canonKey) || canonKey;
      if(!city || city==="__DROP__") continue;

      // Exclusions by postcode / department constraints
      if(postcode === "66250") continue; // demandé : exclure 66250
      if(postcode && !/^66\d{3}$/.test(postcode)) continue;

      flat.push({
        street,
        postcode,
        city,
        done: !!a.done,
        lat: (a.lat!=null ? Number(a.lat) : null),
        lon: (a.lon!=null ? Number(a.lon) : null)
      });
    }
  }

  // 2) Infer dominant city per postcode (to fix mismatches like "66530 Beauvais")
  const pcCount = {};
  for(const a of flat){
    if(!a.postcode) continue;
    const pc = a.postcode;
    pcCount[pc] ||= {};
    pcCount[pc][a.city] = (pcCount[pc][a.city]||0) + 1;
  }
  const dominantCityByPc = {};
  for(const [pc, counts] of Object.entries(pcCount)){
    let bestCity = null, best = -1;
    for(const [c, n] of Object.entries(counts)){
      if(n>best){ best=n; bestCity=c; }
    }
    if(bestCity) dominantCityByPc[pc] = bestCity;
  }

  // 3) Apply postcode->city correction
  for(const a of flat){
    if(a.postcode && dominantCityByPc[a.postcode]){
      a.city = dominantCityByPc[a.postcode];
    }
  }

  // 4) Rebuild buckets + strong dedupe (street+postcode+city)
  const out = {};
  const seen = new Set();
  for(const a of flat){
    const key = `${normStreet(a.street)}|${a.postcode}|${stripAccents(a.city.toLowerCase())}`;
    if(seen.has(key)) continue;
    seen.add(key);
    out[a.city] ||= [];
    out[a.city].push(a);
  }

  // 5) Remove any garbage city keys that look like postcodes
  for(const k of Object.keys(out)){
    if(/^\d{5}$/.test(k)) delete out[k];
  }
  return out;
}

function addrKey(a){
  const city = stripAccents(normCommune(a.city).toLowerCase());
  const pc = String(a.postcode||"").trim();
  const st = normStreet(a.street);
  return `${st}|${pc}|${city}`;
}

function genId(){
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getCities(){
  return Object.keys(data).sort((a,b)=>a.localeCompare(b,"fr"));
}

function fillCitySelect(){
  const cities = getCities();
  citySelect.innerHTML = "";
  modalCity.innerHTML = "";
  for(const c of cities){
    const opt1 = document.createElement("option");
    opt1.value = c; opt1.textContent = c;
    citySelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = c; opt2.textContent = c;
    modalCity.appendChild(opt2);
  }
  const last = localStorage.getItem(LS_LAST_CITY);
  if(last && cities.includes(last)) citySelect.value = last;
}

function haversineKm(lat1, lon1, lat2, lon2){
  const R = 6371;
  const toRad = d => d*Math.PI/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function nominatimSearch(params){
  const url = new URL("https://nominatim.openstreetmap.org/search");
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v);
  // Nominatim asks for a valid User-Agent; browser sets one, but we add accept-language.
  const res = await fetch(url.toString(), {
    headers: {
      "Accept":"application/json",
      "Accept-Language":"fr"
    }
  });
  if(!res.ok) throw new Error("Erreur réseau Nominatim");
  return await res.json();
}

function guessPostcodeForCity(city){
  try{
    const canon = normCommune(city);
    const arr = data[canon] || data[city] || [];
    const counts = {};
    for(const a of arr){
      if(a.postcode && /^66\d{3}$/.test(a.postcode) && a.postcode !== "66250"){
        counts[a.postcode] = (counts[a.postcode]||0) + 1;
      }
    }
    let bestPc=null, best=-1;
    for(const [pc,n] of Object.entries(counts)){
      if(n>best){ best=n; bestPc=pc; }
    }
    return bestPc;
  }catch(e){ return null; }
}

async function getMairie(city){
  const mairies = loadMairies();
  const key = stripAccents(city.toLowerCase());
  if(mairies[key]) return mairies[key];

  // 🔧 Fix ciblé : Bompas
  if(key === "bompas"){
    if(mairies["bompas"]) return mairies["bompas"];
    try{
      setStatus(`Géocodage de la mairie de ${city}…`);
      const resultsBompas = await nominatimSearch({
        q: "Mairie de Bompas, 12 avenue de la Salanque, 66430 Bompas, France",
        format:"jsonv2",
        addressdetails:"1",
        limit:"1",
        countrycodes:"fr"
      });
      if(resultsBompas.length){
        const r = resultsBompas[0];
        const mairie = {
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          display: r.display_name || "Mairie de Bompas"
        };
        mairies["bompas"] = mairie;
        mairies[key] = mairie;
        saveMairies(mairies);
        return mairie;
      }
    }catch(_){}
    const mairie = { lat: 42.730316, lon: 2.935614, display: "Mairie de Bompas (fallback)" };
    mairies["bompas"] = mairie;
    mairies[key] = mairie;
    saveMairies(mairies);
    return mairie;
  }

  setStatus(`Géocodage de la mairie de ${city}…`);
  const pcHint = guessPostcodeForCity(city);
  const base = city.match(/^\d{5}$/) ? String(city) : `${city}${pcHint?` ${pcHint}`:""}`;
  const q = `Mairie ${base}, Pyrénées-Orientales, France`;
  const results = await nominatimSearch({
    q,
    format:"jsonv2",
    addressdetails:"1",
    limit:"1",
    countrycodes:"fr"
  });
  if(!results.length) throw new Error("Mairie introuvable");
  const r = results[0];
  const mairie = {
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
    display: r.display_name || `Mairie ${city}`
  };
  mairies[key] = mairie;
  saveMairies(mairies);
  return mairie;
}

function isInPO(address){
  const pc = (address.postcode||"").trim();
  if(!pc.startsWith("66")) return false;
  const txt = stripAccents(JSON.stringify(address).toLowerCase());
  if(txt.includes("pyrenees-orientales") || txt.includes("pyrenees orientales")) return true;
  return true;
}

async function geocodeAddress(street, city, postcodeOpt){
  const mairie = await getMairie(city);
  const delta = 0.22; // degrees ~ 20-25km
  const left = (mairie.lon - delta).toFixed(6);
  const right = (mairie.lon + delta).toFixed(6);
  const top = (mairie.lat + delta).toFixed(6);
  const bottom = (mairie.lat - delta).toFixed(6);

  const pcPart = postcodeOpt ? ` ${postcodeOpt}` : "";
  const q = `${street},${pcPart} ${city}, France`;

  const results = await nominatimSearch({
    q,
    format:"jsonv2",
    addressdetails:"1",
    limit:"3",
    countrycodes:"fr",
    viewbox:`${left},${top},${right},${bottom}`,
    bounded:"1"
  });
  if(!results.length) return null;

  let best = null;
  let bestScore = Infinity;

  for(const r of results){
    const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
    const dist = haversineKm(mairie.lat, mairie.lon, lat, lon);
    const addr = r.address || {};
    const pc = (addr.postcode||"").trim();
    const okDept = isInPO(addr);
    if(!okDept) continue;
    if(dist > 20) continue;

    const score = dist;
    if(score < bestScore){
      bestScore = score;
      best = {
        lat, lon,
        postcode: pc || (postcodeOpt||""),
        display: r.display_name || "",
        address: addr
      };
    }
  }
  return best;
}

function ensureIds(){
  for(const city of Object.keys(data)){
    data[city] = data[city].map(a=>({
      id: a.id || genId(),
      street: a.street,
      postcode: String(a.postcode||"").replace(/\.0$/,""),
      city,
      lat: a.lat ?? null,
      lon: a.lon ?? null,
      done: !!a.done
    }));
  }
}

function dedupeCity(city){
  const arr = data[city] || [];
  const map = new Map();
  for(const a of arr){
    const key = addrKey(a);
    if(!map.has(key)) map.set(key,a);
  }
  data[city] = Array.from(map.values());
}

function currentCity(){ return citySelect.value; }

function getCityList(city){ return data[city] || []; }

function formatLine(a){
  const pc = a.postcode ? String(a.postcode).trim() : "";
  const city = a.city || "";
  return `${a.street}, ${pc} ${city}`.replace(/\s+/g," ").trim();
}

function getNavApp(){
  const v = (localStorage.getItem(LS_NAV_APP) || "waze").toLowerCase();
  return (v === "maps") ? "maps" : "waze";
}

function setNavApp(v){
  const val = (String(v||"").toLowerCase() === "maps") ? "maps" : "waze";
  localStorage.setItem(LS_NAV_APP, val);
  updateNavUI();
}

function updateNavUI(){
  const mode = getNavApp();
  if(navWazeBtn) navWazeBtn.classList.toggle("active", mode === "waze");
  if(navMapsBtn) navMapsBtn.classList.toggle("active", mode === "maps");
}

function exportAllTxt(){
  const lines = [];
  lines.push("EXPORT TOURNEE (TXT)");
  lines.push(`Date: ${new Date().toLocaleString("fr-FR")}`);
  lines.push("");

  const cities = Object.keys(data).sort((a,b)=> String(a).localeCompare(String(b),"fr"));
  for(const city of cities){
    const arr = data[city] || [];
    lines.push(`VILLE : ${city}`);
    lines.push("----------------------------------------");
    arr.forEach((a, idx)=>{
      const mark = a.done ? "✓" : " ";
      lines.push(`${String(idx+1).padStart(3,"0")}. [${mark}] ${formatLine(a)}`);
    });
    lines.push("");
  }

  const blob = new Blob([lines.join("\n")], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tournee-export.txt";
  a.click();
  URL.revokeObjectURL(url);
  setStatus("Export TXT téléchargé ✅");
}

function wazeUrl(a){
  const q = encodeURIComponent(formatLine(a));
  return {
    deep: `waze://?q=${q}&navigate=yes`,
    web: `https://waze.com/ul?q=${q}&navigate=yes`
  };
}

function mapsWalkUrl(a){
  const dest = encodeURIComponent(formatLine(a));
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
}

function render(){
  const city = currentCity();
  localStorage.setItem(LS_LAST_CITY, city);

  const arr = [...getCityList(city)];
  const total = arr.length;
  const done = arr.filter(a=>a.done).length;

  cityMeta.textContent = `${city} • ${done} / ${total} faits`;

  addrList.innerHTML = "";
  arr.forEach((a, idx)=>{
    const li = document.createElement("li");
    li.className = "addr";

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = String(idx+1);

    const main = document.createElement("div");
    main.className = "addrmain tapzone";

    const l1 = document.createElement("div");
    l1.className = "line1";
    l1.textContent = a.street;

    const l2 = document.createElement("div");
    l2.className = "line2";
    const b1 = document.createElement("span");
    b1.className = "badge";
    b1.textContent = `${a.postcode} • ${a.city}`;
    const b2 = document.createElement("span");
    b2.className = "badge ok";
    b2.innerHTML = a.done ? "✓ <strong>Fait</strong>" : "À faire";
    b2.style.cursor = "pointer";
    b2.addEventListener("click", (e)=>{
      e.stopPropagation();
      a.done = !a.done;
      saveData();
      render();
    });
    l2.appendChild(b1); l2.appendChild(b2);

    if(typeof a._stepKm === "number" && isFinite(a._stepKm)){
      const b3 = document.createElement("span");
      b3.className = "badge";
      b3.textContent = `+${a._stepKm.toFixed(1)} km`;
      l2.appendChild(b3);
    }
    if(typeof a._cumKm === "number" && isFinite(a._cumKm)){
      const b4 = document.createElement("span");
      b4.className = "badge";
      b4.textContent = `cumul ${a._cumKm.toFixed(1)} km`;
      l2.appendChild(b4);
    }

    main.appendChild(l1);
    main.appendChild(l2);

    main.addEventListener("click", ()=>{
      a.done = true;
      saveData();
      render();

      const mode = getNavApp();
      if(mode === "maps"){
        window.location.href = mapsWalkUrl(a);
        return;
      }

      const url = wazeUrl(a);
      window.location.href = url.deep;
      setTimeout(()=>{
        if(document.visibilityState === "visible"){
          if(confirm("Waze ne s'est pas ouvert. Ouvrir la version web ?")) window.open(url.web, "_blank");
        }
      }, 900);
    });

    const actions = document.createElement("div");
    actions.className = "actions";

    const btnEdit = document.createElement("button");
    btnEdit.className = "iconbtn";
    btnEdit.textContent = "✎";
    btnEdit.title = "Modifier";
    btnEdit.addEventListener("click",(e)=>{ e.stopPropagation(); openEdit(city, a.id); });

    const btnDel = document.createElement("button");
    btnDel.className = "iconbtn";
    btnDel.textContent = "🗑";
    btnDel.title = "Supprimer";
    btnDel.addEventListener("click",(e)=>{
      e.stopPropagation();
      if(confirm("Supprimer cette adresse ?")){
        data[city] = data[city].filter(x=>x.id !== a.id);
        saveData();
        render();
      }
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);

    li.appendChild(num);
    li.appendChild(main);
    li.appendChild(actions);
    addrList.appendChild(li);
  });
}

function getDefaultPostcode(city){
  const list = data?.[city] || [];
  const counts = {};
  for(const a of list){
    const cp = String(a.postcode || "").trim();
    if(/^66\d{3}$/.test(cp)) counts[cp] = (counts[cp] || 0) + 1;
  }
  let best = "";
  let bestN = -1;
  for(const [cp,n] of Object.entries(counts)){
    if(n > bestN){ bestN = n; best = cp; }
  }
  return best;
}

function openModal(mode, preset){
  editContext = preset?.editContext || null;
  modalTitle.textContent = mode === "edit" ? "Modifier une adresse" : "Ajouter une adresse";
  modalCity.value = preset?.city || currentCity();
  modalStreet.value = preset?.street || "";
  modalPostcode.value = (preset?.postcode || "") || getDefaultPostcode(modalCity.value);
  modal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
  setTimeout(()=>modalStreet.focus(), 60);
}

function closeModal(){
  modal.classList.add("hidden");
  modalBackdrop.classList.add("hidden");
  editContext = null;
}

async function saveModal(){
  const city = modalCity.value;
  const street = normSpaces(modalStreet.value);
  const pcOpt = normSpaces(modalPostcode.value).replace(/\D/g,"").slice(0,5);

  if(!street){
    setStatus("Adresse manquante.", true);
    return;
  }

  try{
    setStatus("Géocodage de l'adresse…");
    const g = await geocodeAddress(street, city, pcOpt);
    if(!g) {
      setStatus("Adresse introuvable (dans la zone autour de la mairie).", true);
      return;
    }

    const pc = (g.postcode||pcOpt||"").trim();
    if(!pc.startsWith("66")){
      setStatus("Refusé : cette adresse n'est pas dans le département 66.", true);
      return;
    }

    const obj = {
      id: editContext?.id || genId(),
      street,
      postcode: pc,
      city,
      lat: g.lat,
      lon: g.lon,
      done: false
    };

    if(!data[city]) data[city] = [];

    const key = addrKey(obj);
    const exists = data[city].some(a=>a.id !== obj.id && addrKey(a) === key);
    if(exists){
      setStatus("Doublon détecté : cette adresse existe déjà.", true);
      return;
    }

    if(editContext){
      data[city] = data[city].map(a=> a.id === obj.id ? {...a, ...obj} : a);
    } else {
      data[city].push(obj);
    }

    dedupeCity(city);
    saveData();

    await applyOrderForCity(city);

    closeModal();
    setStatus("OK ✅");
    fillCitySelect();
    citySelect.value = city;
    render();
  }catch(e){
    setStatus(e.message || "Erreur pendant le géocodage.", true);
  }
}

function openEdit(city, id){
  const a = (data[city]||[]).find(x=>x.id===id);
  if(!a) return;
  openModal("edit", {
    city,
    street: a.street,
    postcode: a.postcode,
    editContext: {city, id}
  });
}

async function applyOrderForCity(city){
  const mairie = await getMairie(city);
  const arr = getCityList(city);

  const ok = [];
  const ko = [];
  for(const a of arr){
    if(typeof a.lat === "number" && typeof a.lon === "number"){
      ok.push(a);
    }else{
      ko.push(a);
    }
  }

  let curLat = mairie.lat;
  let curLon = mairie.lon;
  let cum = 0;

  const ordered = [];
  while(ok.length){
    let bestIdx = 0;
    let bestD = Infinity;

    for(let i=0;i<ok.length;i++){
      const a = ok[i];
      const d = haversineKm(curLat, curLon, a.lat, a.lon);
      if(d < bestD){
        bestD = d;
        bestIdx = i;
      }
    }

    const next = ok.splice(bestIdx, 1)[0];
    next._stepKm = isFinite(bestD) ? bestD : null;
    if(next._stepKm != null) cum += next._stepKm;
    next._cumKm = next._stepKm != null ? cum : null;

    ordered.push(next);
    curLat = next.lat;
    curLon = next.lon;
  }

  for(const a of ko){
    a._stepKm = null;
    a._cumKm = null;
  }

  data[city] = [...ordered, ...ko];
  saveData();
}

async function optimizeCity(){
  const city = currentCity();
  try{
    await getMairie(city);
    const arr = data[city] || [];
    let missing = arr.filter(a=>!(typeof a.lat==="number" && typeof a.lon==="number")).length;

    if(missing === 0){
      setStatus("Déjà géocodé. Tri en cours…");
      await applyOrderForCity(city);
      render();
      setStatus("OK ✅");
      return;
    }

    setStatus(`Géocodage manquant : ${missing} adresse(s)…`);
    for(const a of arr){
      if(typeof a.lat==="number" && typeof a.lon==="number") continue;
      const pcOpt = (a.postcode||"").trim();
      const g = await geocodeAddress(a.street, city, pcOpt);
      if(g){
        a.lat = g.lat; a.lon = g.lon;
        a.postcode = (g.postcode||a.postcode||"").trim();
      }
      missing = arr.filter(x=>!(typeof x.lat==="number" && typeof x.lon==="number")).length;
      setStatus(`Géocodage… restant: ${missing}`);
      saveData();
      await sleep(1100);
    }

    data[city] = (data[city]||[]).filter(a=>String(a.postcode||"").startsWith("66"));
    dedupeCity(city);
    await applyOrderForCity(city);
    render();
    setStatus("Optimisation terminée ✅");
  }catch(e){
    setStatus(e.message || "Erreur optimisation.", true);
  }
}

async function wire(){
  await ensureSeedLoaded();

  fillCitySelect();
  ensureIds();
  for(const city of Object.keys(data)){
    data[city] = (data[city]||[]).filter(a=>String(a.postcode||"").startsWith("66"));
    dedupeCity(city);
  }
  saveData();

  citySelect.addEventListener("change", async ()=>{
    setStatus("");
    try{
      await applyOrderForCity(currentCity());
    }catch(_){}
    render();
  });

  btnOptimize.addEventListener("click", ()=>optimizeCity());
  btnAdd.addEventListener("click", ()=>openModal("add", {city: currentCity()}));
  btnExportTxt && btnExportTxt.addEventListener("click", exportAllTxt);

  // Toggle navigation (Waze / Maps piéton)
  if(navWazeBtn) navWazeBtn.addEventListener("click", ()=>setNavApp("waze"));
  if(navMapsBtn) navMapsBtn.addEventListener("click", ()=>setNavApp("maps"));
  updateNavUI();

  // ✅ NOUVEAU : boutons véhicule
  if(btnSaveVehiclePos) btnSaveVehiclePos.addEventListener("click", saveVehiclePosition);
  if(btnFindVehiclePos) btnFindVehiclePos.addEventListener("click", findVehicle);

  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  modalSave.addEventListener("click", saveModal);

  applyOrderForCity(currentCity()).then(()=>render()).catch(()=>render());
}

wire().catch(e=>{ console.error(e); });
