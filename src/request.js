import axios from "axios"

// local machine base url

export const BaseUrl = "https://blog-backend-node-7kjl.onrender.com/"
//  export const BaseUrl = "http://localhost:5000/"

export const publicRequest = () => {
    return axios.create({
        baseURL:BaseUrl
    })
}

