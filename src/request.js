import axios from "axios"

// local machine base url

const BaseUrl = "http://localhost:5000/"

export const publicRequest = () => {
    return axios.create({
        baseURL:BaseUrl
    })
}

