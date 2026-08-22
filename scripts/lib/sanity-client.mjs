import {SANITY_CONFIG} from './sanity-config.mjs'
export async function sanityQuery(query, params = {}) {
  const {projectId,dataset,apiVersion,perspective,useCdn}=SANITY_CONFIG
  const host=useCdn?`${projectId}.apicdn.sanity.io`:`${projectId}.api.sanity.io`
  const url=new URL(`https://${host}/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query',query); url.searchParams.set('perspective',perspective)
  for(const [key,value] of Object.entries(params)) url.searchParams.set(`$${key}`,JSON.stringify(value))
  let response
  try { response=await fetch(url,{headers:{Accept:'application/json'}}) } catch(error) { throw new Error(`Tidak dapat menghubungi Sanity Content Lake: ${error.message}`) }
  if(!response.ok) throw new Error(`Sanity query gagal (${response.status}): ${(await response.text()).slice(0,300)}`)
  const payload=await response.json()
  if(payload.error) throw new Error(`Sanity query error: ${payload.error.description||payload.error.type}`)
  return payload.result
}
