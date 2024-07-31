import axios from 'axios'

const ip = '192.168.0.145'

export const api = axios.create({
    baseURL: `http://${ip}:3333`
})