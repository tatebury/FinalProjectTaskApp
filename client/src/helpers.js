export function titleCase(str){
    return str.toLowerCase().split(' ').map(
        (word)=> (word.charAt(0).toUpperCase()+word.slice(1))
        ).join(' ')
}

export function parseBool(val) { return val === true || val.toLowerCase() === "true" }

export function humanTime(seconds) { 
    
}
