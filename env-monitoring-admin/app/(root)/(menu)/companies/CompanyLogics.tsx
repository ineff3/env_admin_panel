'use client';
import { CompanyDataType, CompanyType, TableColumns } from '@/types'
import { CustomInput, CustomTextArea, SuccessfulToast, ErrorToast, AdvancedDynamicTable } from '@/components';
import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai'
import { MdEditNote } from 'react-icons/md'
import { useEffect, useState } from 'react';
import { Selection } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { CompanySchema } from '@/schemas';
import { addCompany, deleteCompany, editCompany } from '@/actions/companiesActions';

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

const CompanyLogics = ({ companies }: { companies: CompanyType[] }) => {
    const [companyData, setCompanyData] = useState<CompanyDataType>({
        name: '',
        description: '',
        location: ''
    })
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedCompany = companies.find(company => company.id === +id);

            if (selectedCompany !== undefined) {
                setCompanyData({
                    name: selectedCompany.name,
                    description: selectedCompany.description,
                    location: selectedCompany.location
                })
            }
        } else {
            resetFieldState()
        }
    }, [selectedRow]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompanyData({
            ...companyData,
            [e.target.name]: e.target.value
        })
    }

    function resetFieldState() {
        setCompanyData({
            name: '',
            description: '',
            location: ''

        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }

    const clientAddCompany = async (formData: FormData) => {
        // client-side validation
        const result = CompanySchema.safeParse({
            name: formData.get('name'),
            description: formData.get('description'),
            location: formData.get('location')
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
        const response = await addCompany(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='New company added successfully!' />, { duration: 2500 })
        }

    }

    const clientEditCompany = async (formData: FormData) => {
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            toast.custom((t) => <ErrorToast t={t} message={"Row is not selected"} />);
            return;
        }
        const id: string = selectedRow.values().next().value;

        //client-side validation
        const result = CompanySchema.safeParse({
            id: Number(id),
            name: formData.get('name'),
            description: formData.get('description'),
            location: formData.get('location')
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
        const response = await editCompany(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Company edited successfully!' />, { duration: 2500 })
        }
    }

    const clientDeleteCompany = async (id: number) => {
        const response = await deleteCompany(id);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Company deleted successfully!' />, { duration: 2500 })
        }
        resetFieldState();
        resetRow();

    }


    return (
        <div className=" flex flex-col  gap-5">
            <div className='flex justify-center'>
                <form className="max-w-[850px] flex flex-auto  " >
                    <div className='flex flex-col flex-auto gap-5 p-5'>
                        <div className='flex gap-3'>
                            <CustomInput
                                title='Name'
                                name='name'
                                handleChange={handleFormChange}
                                color='primary'
                                value={companyData.name}
                                required={true}
                            />
                            <CustomInput
                                title='Location'
                                name='location'
                                handleChange={handleFormChange}
                                color='primary'
                                value={companyData.location}
                            />
                        </div>
                        <CustomTextArea
                            title='Description'
                            name='description'
                            handleChange={handleFormChange}
                            color='primary'
                            value={companyData.description}
                        />
                        <div className='flex gap-5 justify-center'>
                            <button
                                formAction={clientAddCompany}
                                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                            >
                                <div className='flex gap-1 justify-center items-center'>
                                    <p className=' hidden md:flex'>Create Company</p>
                                    <AiOutlinePlus size={30} />
                                </div>
                            </button>
                            <button
                                formAction={clientEditCompany}
                                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                            >
                                <div className='flex gap-1 justify-center items-center'>
                                    <p className=' hidden md:flex'>Edit Company</p>
                                    <MdEditNote size={30} />
                                </div>
                            </button>

                        </div>
                    </div>
                </form>
            </div>

            <div className="flex justify-center">
                <div className=" max-w-[950px] flex flex-auto  ">
                    <AdvancedDynamicTable
                        rowsLength={5}
                        tableItems={companies}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        deleteItem={clientDeleteCompany}
                    />
                </div>
            </div>
        </div>
    )
}

export default CompanyLogics