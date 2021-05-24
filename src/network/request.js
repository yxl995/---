import axios from "axios";

export function request(config) {
    //创建实例
    const instance = axios.create({
        baseURL: "https://api.shop.eduwork.cn",
        timeout: 5000
    })
    return instance(config)
}