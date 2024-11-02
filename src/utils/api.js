import { fetchConnect } from "./fetch"

export async function api() {
    debugger
    try{
        let response = await fetchConnect('health', 'GET')
        if (response.status === true){
            return true
        }
        
    }catch(error){
        return false
    }
}