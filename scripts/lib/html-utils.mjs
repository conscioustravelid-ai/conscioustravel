export function escapeHtml(value=''){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')}
export function escapeAttribute(value=''){return escapeHtml(value).replaceAll('`','&#96;')}
export function safeUrl(value,{allowRelative=false}={}){if(typeof value!=='string'||!value.trim())return null;const raw=value.trim();if(allowRelative&&/^\/(?!\/)/.test(raw))return raw;try{const parsed=new URL(raw);return ['http:','https:','mailto:','tel:'].includes(parsed.protocol)?parsed.href:null}catch{return null}}
export function safeJson(value){return JSON.stringify(value,null,2).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026')}
