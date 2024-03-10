import { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ChatBotResponse } from '../../app/models/chatBotResponse';
import { BsRobot } from "react-icons/bs"
import { Button, Checkbox, FileInput, Label, Select, Table, Accordion, Modal, Tooltip } from 'flowbite-react';
import { AiOutlineSend, AiOutlineUser } from 'react-icons/ai';
import { chatApi } from '../../app/api/chatApi';
import { toast } from 'react-toastify';
import { SlCloudUpload } from 'react-icons/sl';

export default observer(function GenericDocSearch() {
    const botRef = useRef<any>(null);
    const [chatResponse, setChatResponse] = useState<ChatBotResponse[]>([
        {
            id: 1,
            text: `Hi! I am DocQuest. Your assistant to provide the information inside your documents. 
            How may I help you today?`,
            list: [],
            image: '',
            type: 'answer'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [filenames, setFilenames] = useState<any>([]);
    const [selFiles, setSelFiles] = useState<any>();
    const [allowPrevFilesDelete, setAllowPrevFilesDelete] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState(false);
    const [cdbIndex, setCdbIndex] = useState(20);
    // const [searchType, setSearchType] = useState('hybrid');

    //#region  Events
    const onMessageType = (e: any) => {
        setSearchText(e.target.value);
    }

    const onMessageEnter = async (e: any) => {
        if (e.keyCode === 13 && String(e.target.value).trim().length > 0) {
            await handleQnA();
        }
    }

    const onSendClick = async () => {
        await handleQnA();
    }
    //#endregion

    //#region  Helper Methods
    /**
 * Sends a query to the QnA API and updates the chat response.
 * 
 * @param {any} query - The query to send to the API.
 * @returns {Promise<void>} - A promise that resolves when the API response is received and the chat response is updated.
 */
    const handleAPI = async(query:any)=>{
        const request={
            query:query,
            type:'hybrid'
        }
        const response = await fetch('https://localhost:5001/api/QnA', {
          method: 'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body: JSON.stringify(request)
        });
        const data = await response.json();
        setChatResponse(data);
    }

    const handleQnA = async () => {

        let currentQnAList = chatResponse;
        currentQnAList.push({ id: currentQnAList.length + 1, text: searchText, type: 'question' })
        
        setChatResponse(currentQnAList);
        setIsLoading(true);
        
        setTimeout(() => {
            botRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);

        const request = {
            search_query: searchText,
        }

        const indx = cdbIndex +1;
        setCdbIndex(indx)

        try {
            const result = await chatApi.genericBotSearch(request);
            if (result) {
                let currentQnAList = chatResponse;
                currentQnAList.push({ id: currentQnAList.length + 1, text: result.result, type: 'answer' })
                setChatResponse(currentQnAList);
            }
        }
        catch (ex) {
            console.log(ex)
            let currentQnAList = chatResponse;
            currentQnAList.push({ id: currentQnAList.length + 1, text: 'Something went wrong, please try again', type: 'answer' })
            setChatResponse(currentQnAList);
        }
        finally {
            setIsLoading(false);
            setSearchText('');
            setTimeout(() => {
                botRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        }
    }

    function jsonEscape(str: string) {
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t").replace(/\bNaN\b/g, "null");
    }
    //#endregion
    const onCheckPrevFilesDelete = (e: any) => {
        setAllowPrevFilesDelete(e.target.checked)
    }

    const onDocumentUpload = (e: any) => {
        try {
            let filenames: any[] = []
            Array.from(e.target.files).forEach((file: any) => {
                if (String(file.type).toLowerCase().indexOf('pdf') > -1)
                    filenames.push(file.name)
            });
            setFilenames(filenames)
            setSelFiles(e.target.files)
        } catch (error) {
            // Handle errors
            console.error('Error uploading files:', error);
        }

    }
    const onDocumentSubmit = async () => {
        try {
            setIsFileLoading(true);
            if (selFiles && selFiles.length > 0) {
                const formData = new FormData();

                for (const file of selFiles)
                    formData.append('pdf_files', file);

                const response = await chatApi.uploadAdminDocs(formData, allowPrevFilesDelete)
                toast.success(`Files uploaded successfully`);
                setOpenModal(false);
                setFilenames([]);
                setSelFiles([]);
                setAllowPrevFilesDelete(false);
            }
            else {
                toast.warning('Please upload files')
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error(`Something went wrong in file upload, Try with another Pdf file`);
        }
        finally {
            setIsFileLoading(false);
        }
    }
    //#region FileUpload
    //#endregion
    return (
        <div>
            <div className='flex'>
                {/* <div className='w-full'>
                    <div onClick={() => setOpenModal(true)} className='flex text-sm cursor-pointer float-right bg-blue p-2 border rounded'>
                       
                        Upload
                        <SlCloudUpload className="ml-2 h-5 w-5" />
                    </div>
                </div> */}

                <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header>Upload Files <span className='text-sm'>(only PDF files allowed)</span></Modal.Header>
                    <Modal.Body>
                        <div className='flex flex-col w-full'>
                            <div className='flex flex-col gap-1  text-sm text-gray-800'>
                                <Label
                                    htmlFor="dropzone-file"
                                    className="dark:hover:bg-bray-800 flex h-10 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center p-1">
                                        <SlCloudUpload className='h-[16px] w-[16px] text-gray-500 mt-2' />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to select files</span>
                                        </p>
                                    </div>
                                    <FileInput id="dropzone-file" className="hidden" multiple onChange={(e: any) => onDocumentUpload(e)} />
                                </Label>
                                <div className='flex'>
                                    <Label htmlFor="allowcheck">Delete all existing files</Label>
                                    <Checkbox id="allowcheck" className='ml-1 mt-1' onChange={onCheckPrevFilesDelete} />
                                </div>
                            </div>
                            <div>
                                <span className=' text-gray-800'>Files uploaded:</span> {filenames.map((file: string) => <p className='mr-2 inline-block text-gray-400'>{file}, </p>)}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button color="gray" onClick={() => setOpenModal(false)}>
                            Close
                        </Button>
                        <Button isProcessing={isFileLoading} color={'dark'} onClick={onDocumentSubmit}>Upload</Button>
                    </Modal.Footer>
                </Modal>

            </div>
            <div className='bg-[#f3f6fc] border shadow-md rounded pb-2 mt-4'>
                <div className="w-100 h-20 bg-white items-center flex border-b-2">
                    <BsRobot className="h-10 w-10 ml-5" />
                    <div className="ml-5">
                        <p>DocQuest</p>
                        <p className="text-xs text-gray-400">Unlocking Knowledge in Every Page</p>
                    </div>
                </div>
                <div className='p-1 max-h-[465px] h-[465px] text-sm'>
                    <div className='max-h-[89%] h-[89%] overflow-x-auto overflow-x-hidden'>
                        <div ref={botRef} className='flex flex-col gap-3 font-normal p-4'>
                            {
                                chatResponse.map((row, index) => row.type === 'answer' ?
                                    <div className='flex items-center max-w-[75%]' key={`ques_${index}`}>
                                        <div className="relative flex rounded-full self-start items-center mr-4 p-2 bg-white">
                                            <BsRobot className=' w-7 h-7' />
                                        </div>
                                        <p className='bg-white flex p-3 shadow-sm rounded max-h-[1000px] overflow-auto'>{row.text}</p>
                                    </div>
                                    :
                                    <div className='flex my-2 items-center self-end' key={`ques_${index}`}>
                                        <p className='bg-gray-800 text-white flex p-3 shadow-sm rounded'>{row.text} </p>
                                        <div className="relative flex rounded-full items-center ml-4 p-2 bg-white">
                                            <AiOutlineUser className=' w-7 h-7' />
                                        </div>
                                    </div>
                                )
                            }
                            {isLoading ?
                                <div className='flex items-center'>
                                    <div className="relative flex rounded-full items-center mr-4 p-2 bg-white">
                                        <BsRobot className=' w-7 h-7' />
                                    </div>
                                    <p className='bg-white flex p-3 shadow-sm rounded'>
                                        <div className="flex justify-center items-center h-7">
                                            <div className="bg-[#13294b] h-2 w-2 rounded-full mr-2 animate-pulse"></div>
                                            <div className="bg-[#13294b] h-2 w-2 rounded-full mr-2 animate-pulse"></div>
                                            <div className="bg-[#13294b] h-2 w-2 rounded-full animate-pulse"></div>
                                        </div>
                                    </p>
                                </div> : null}
                        </div>
                    </div>
                    {/* <div className='w-full flex justify-center items-center'>
                        <div className='flex bg-white p-2 border rounded gap-[2px]'>
                            <div onClick={() => setSearchType('hybrid')} className={`py-2 text-center w-[100px]  ${searchType === 'hybrid' ? 'bg-[#13294b] text-white border rounded' : ''} text-sm p-1 items-center justify-space-between`}>
                                Hybrid
                            </div>
                            <div onClick={() => setSearchType('dense')} className={`py-2 text-center w-[100px]  ${searchType === 'dense' ? 'bg-[#13294b] text-white border rounded' : ''} text-sm p-1 items-center justify-space-between`}>
                                Semantic
                            </div>
                            <div onClick={() => setSearchType('sparse')} className={`py-2 text-center w-[100px]  ${searchType === 'sparse' ? 'bg-[#13294b] text-white border rounded' : ''} text-sm p-1 items-center justify-space-between`}>
                                Relevance
                            </div>
                        </div>
                    </div> */}
                    <div className='flex items-center mt-2'>
                        {/* <Tooltip content="Upload Files">
                            <div onClick={() => setOpenModal(true)} className='flex text-sm cursor-pointer float-right bg-white p-2 border rounded'>
                                <SlCloudUpload className="h-6 w-5" />
                            </div>
                        </Tooltip> */}


                        <input disabled={isLoading} className='flex-1 ml-1 p-2 mr-3 h-[40px]' style={{ background: 'white' }} value={searchText} placeholder='Type your query here...' onKeyUp={onMessageEnter} onChange={onMessageType} />
                        <button onClick={onSendClick} className="mr-3 flex items-center justify-space-between bg-[#13294b] py-2 px-3 rounded text-white" >Send <AiOutlineSend className="ml-1" /></button>
                    </div>
                </div>
            </div>
        </div >
    )
})