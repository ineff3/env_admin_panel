'use client';
import { TableColumns, Enterprise, EnterpriseData } from '@/types';
import { CustomInput, CustomTextArea, DynamicTable, SuccessfulToast, ErrorToast } from '@/components';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsFiletypeXlsx } from 'react-icons/bs'
import { addEnterprise, editEnterprise, deleteEnterprise, createFromXlsx } from '@/actions/enterpriseActions';
import { useEffect, useState } from 'react';
import { Selection } from "@nextui-org/react";
import getDataFromXlsx from '../xlsxHandler';
import { toast } from 'react-hot-toast';
import { EnterpriseSchema } from '@/schemas';

//Keys should be as the passed items properties
const columns: TableColumns[] = [
    {
        name: 'NAME',
        key: 'name'
    },
    {
        name: 'DESCRIPTION',
        key: 'description'
    },
    {
        name: 'LOCATION',
        key: 'location'
    }
]

const EnterpriseLogics = ({ enterprises }: { enterprises: Enterprise[] }) => {
    const [enterpriseData, setEnterpriseData] = useState<EnterpriseData>({
        name: '',
        description: '',
        location: ''
    })
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedEnterprise = enterprises.find(enterprise => enterprise.id === +id);

            if (selectedEnterprise !== undefined) {
                setEnterpriseData({
                    name: selectedEnterprise.name,
                    location: selectedEnterprise.location,
                    description: selectedEnterprise.description
                })
            }
        } else {
            resetFieldState()
        }
    }, [selectedRow]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEnterpriseData({
            ...enterpriseData,
            [e.target.name]: e.target.value
        })
    }

    function resetFieldState() {
        setEnterpriseData({
            name: '',
            location: '',
            description: ''
        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }

    return (
        <div className=" flex flex-col gap-5">
            <form className="mx-auto max-w-[700px] flex flex-col gap-5 p-5" >
                <div className="flex gap-3 justify-center">
                    <CustomInput
                        title='Name'
                        name='name'
                        handleChange={handleFormChange}
                        color='primary'
                        value={enterpriseData.name}
                    />
                    <CustomInput
                        title='Location'
                        name='location'
                        handleChange={handleFormChange}
                        color='primary'
                        value={enterpriseData.location}
                    />
                </div>
                <div className="flex flex-auto">
                    <CustomTextArea
                        title='Description'
                        name='description'
                        handleChange={handleFormChange}
                        color='primary'
                        value={enterpriseData.description}
                    />
                </div>
                <div className='flex gap-5 justify-center'>
                    <button
                        formAction={async formData => {
                            //client-side validation
                            const result = EnterpriseSchema.safeParse({
                                name: formData.get('name'),
                                location: formData.get('location'),
                                description: formData.get('description')
                            });
                            if (!result.success) {
                                let errorMessage = '';
                                result.error.issues.forEach((err) => {
                                    errorMessage += err.path[0] + ': ' + err.message + '. '
                                })
                                toast.custom((t) => <ErrorToast t={t} message={errorMessage} />);
                                return
                            }

                            resetFieldState();
                            resetRow();

                            //server response + error handling
                            const response = await addEnterprise(result.data);
                            if (response?.error) {
                                toast.custom((t) => <ErrorToast t={t} message={response.error} />);
                            } else {
                                toast.custom((t) => <SuccessfulToast t={t} message='New enterprise added successfully!' />, { duration: 2500 })
                            }
                        }}
                        className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                    >
                        <AiOutlinePlus color="white" size={30} />
                    </button>
                    <button
                        formAction={async formData => {
                            if (typeof selectedRow === 'string' || selectedRow.size === 0) {
                                alert("Row is not selected")
                                return;
                            }
                            const id: string = selectedRow.values().next().value;

                            //client-side validation
                            const result = EnterpriseSchema.safeParse({
                                id: id,
                                name: formData.get('name'),
                                location: formData.get('location'),
                                description: formData.get('description')
                            });
                            if (!result.success) {
                                let errorMessage = '';
                                result.error.issues.forEach((err) => {
                                    errorMessage += err.path[0] + ': ' + err.message + '. '
                                })
                                toast.custom((t) => <ErrorToast t={t} message={errorMessage} />);
                                return
                            }

                            resetFieldState();
                            resetRow();

                            //server response + error handling
                            const response = await editEnterprise(result.data);
                            if (response?.error) {
                                toast.custom((t) => <ErrorToast t={t} message={response.error} />);
                            } else {
                                toast.custom((t) => <SuccessfulToast t={t} message='Enterprise edited successfully!' />, { duration: 2500 })
                            }
                        }}
                        className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                    >
                        <AiOutlineEdit color="white" size={30} />
                    </button>
                    <button
                        formAction={async formData => {
                            if (typeof selectedRow === 'string' || selectedRow.size === 0) {
                                alert("Row is not selected")
                                return;
                            }
                            const id: string = selectedRow.values().next().value;
                            resetFieldState();
                            resetRow();
                            const response = await deleteEnterprise(id);
                            if (response?.error) {
                                toast.custom((t) => <ErrorToast t={t} message={response.error} />);
                            } else {
                                toast.custom((t) => <SuccessfulToast t={t} message='Enterprise deleted successfully!' />, { duration: 2500 })
                            }
                        }}
                        className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                    >
                        <AiOutlineDelete color="white" size={30} />
                    </button>
                </div>
            </form>

            <div className="flex justify-center">
                <div className=" max-w-[850px] flex flex-auto  ">
                    <DynamicTable
                        tableItems={enterprises}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                    />
                </div>
            </div>
            <p className=' text-center text-xl'>OR</p>
            <div className='flex justify-center '>
                <button
                    onClick={async () => {
                        const enterprisesArray = await getDataFromXlsx();
                        const response = await createFromXlsx(enterprisesArray as Enterprise[]);
                        if (response?.error) {
                            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
                        } else {
                            toast.custom((t) => <SuccessfulToast t={t} message='Enterprises added successfuly!' />, { duration: 2500 })
                        }
                    }}
                    className=" px-4 py-3 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                >
                    <div className='flex gap-3'>
                        <BsFiletypeXlsx color="white" size={30} />
                        <p className=' font-normal'>Insert data from a file</p>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default EnterpriseLogics