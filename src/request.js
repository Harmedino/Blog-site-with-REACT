import axios from "axios"

// local machine base url

export const BaseUrl = "https://gentle-rose-seal.cyclic.app/"
//  const BaseUrl = "http://localhost:5000/"

export const publicRequest = () => {
    return axios.create({
        baseURL:BaseUrl
    })
}

