import React, { useEffect, useState } from "react";
import Shim from "./Shim";
import WebpagePlayer from "./webPagePlayer";
import axios from 'axios'

export default () => {
    const [url, setUrl] = useState("");
    const [lastModified, setLastModified] = useState(0)
    const resUrl = 'http://localhost:8000/'

    useEffect(() => {
        timestampCheck()
        const timer = setInterval(() => {
            timestampCheck()
        }, 2000);
        return () => clearInterval(timer)
    }, []);

    const timestampCheck = () => {
        axios.get(`${resUrl}timestamp`)
            .then((response) => {
                const timestamp = response.data
                setLastModified(timestamp)
            })
            .catch(() => { })
    }

    useEffect(() => {
        setUrl(`${resUrl}index.html?${Date.now()}`);
    }, [lastModified])

    return (
        <React.Fragment>
            {!url ? <Shim /> : <WebpagePlayer url={url} />}
        </React.Fragment>
    );
};