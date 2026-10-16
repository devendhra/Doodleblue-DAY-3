import { useEffect, useState } from "react";

function Title({count}){
    console.log("render");
    useEffect(() =>{
        document.title = `Clicked ${count} times`;    
    }, [count]);    

    return (
        <h1>Title:{count}</h1>
    )
}

export default Title;