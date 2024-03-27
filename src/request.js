import axios from "axios"

// local machine base url

export const BaseUrl = "https://ill-gold-dog-coat.cyclic.app/"
//  export const BaseUrl = "http://localhost:5000/"

export const publicRequest = () => {
    return axios.create({
        baseURL:BaseUrl
    })
}

