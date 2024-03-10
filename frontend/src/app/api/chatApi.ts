import { apiUrl } from "./config/apiUrl"
import { axiosRequest } from "./config/axiosRequest"

const getDataRequest = async (body: any) => {
    return await axiosRequest.post<any>(`${apiUrl.GetData}`, {})
}

const getChartRequest = async (body: any) => {
    return await axiosRequest.post<any>(`${apiUrl.GetChart}`, {})
}

const docQnaRequest = async(body:any)=>{
    return await axiosRequest.post<any>(`${apiUrl.GetQnA}`, body)
}


const uploadAdminDocs = async (body: any, allowDelete:boolean) => {
    return await axiosRequest.post<any>(`${apiUrl.Admin_docs}?allowdelete=${allowDelete}`, body)
}

const genericBotSearch = async (body: any) => {
    return await axiosRequest.post<any>(`${apiUrl.GenericBotSearch}`, body)
}

export const chatApi = {
    getDataRequest,
    getChartRequest,
    docQnaRequest,
    uploadAdminDocs,
    genericBotSearch
}