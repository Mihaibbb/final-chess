import Button from "@mui/material/Button";
import { useEffect } from "react";

const Home = () => {

    const getData = async () => {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

            })
        };
        console.log(process.env.PORT)
       
       
    };

    useEffect(() => {
        (async () => {
            await getData();
        })();
    }, []);

    return (
        <div className="container">
            <Button variant="contained">hello</Button>
        </div>
        
    );
};

export default Home;