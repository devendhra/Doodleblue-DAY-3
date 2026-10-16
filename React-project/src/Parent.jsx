import { useState } from "react";
import Title from "./Title.jsx";


function Parent() {

    const [count,setCount] = useState(0)
 
    return (
        <div>
            <Title count = {count} />
            <button onClick={() => setCount(count + 1)}>Increment Count</button>
        </div>
    )
}

export default Parent;
