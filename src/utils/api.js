import { fetchConnect } from "./fetch"

export async function api() {
    try{
        let response = await fetchConnect('health', 'GET')
        if (response.status === true){
            return true
        }
        
    }catch(error){
         return false
    }
}