export function randomizeBetweenNumberToChar(){
    const array = ["char", "num"]
    const charOrNum = array[Math.floor(Math.random() * 2)];
    if (charOrNum === "char"){
        return String.fromCharCode((Math.random() * 26) + 97)
    } else {
        return (Math.floor(Math.random() * 10))        
    }
}

export function generateUUID(){
    let uuid = "";
    for (let i=0; i<32; i++){
        if( i === 8 || i === 12 || i === 16 || i === 20){
            uuid+="-"
        }
        uuid += randomizeBetweenNumberToChar()
    }
    // 8-4-4-4-12
    return uuid
}
