'use client';
import { PollutionDataType, PollutionType, TableColumns } from '@/types'
import { CustomInput, CustomTextArea, DynamicTable, SuccessfulToast, ErrorToast } from '@/components';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsFiletypeXlsx } from 'react-icons/bs'
import { useEffect, useState } from 'react';
import { Selection } from "@nextui-org/react";
import getDataFromXlsx from '@/actions/xlsx/xlsxParser';
import { toast } from 'react-hot-toast';
import { CompanyArraySchema, CompanySchema, PollutionArraySchema, PollutionSchema } from '@/schemas';
import { addCompany, deleteCompany, editCompany } from '@/actions/companiesActions';
import { addPollution, createPollutionFromXlsx, deletePollution, editPollution } from '@/actions/pollutionsActions';

//Keys should be as the passed items properties
const columns: TableColumns[] = [
    {
        name: 'SUBSTANCE',
        key: 'factor_Name'
    },
    {
        name: 'AMOUNT',
        key: 'factor_value'
    },
    {
        name: 'PASSPORT',
        key: 'passport_id'
    }
]

const PollutionLogics = ({ pollutions }: { pollutions: PollutionType[] }) => {
    const [pollutionData, setPollutionData] = useState<PollutionDataType>({
        factor_Name: '',
        factor_value: '',
        passport_id: ''
    })
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedPollution = pollutions.find(pollution => pollution.id === +id);

            if (selectedPollution !== undefined) {
                setPollutionData({
                    factor_Name: selectedPollution.factor_Name,
                    factor_value: selectedPollution.factor_value,
                    passport_id: selectedPollution.passport_id
                })
            }
        } else {
            resetFieldState()
        }
    }, [selectedRow]);

    function resetFieldState() {
        setPollutionData({
            factor_Name: '',
            factor_value: '',
            passport_id: ''
        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPollutionData({
            ...pollutionData,
            [e.target.name]: e.target.value
        })
    }

    const clientAddPollution = async (formData: FormData) => {
        const factor_value = Number(formData.get('factor_value'))
        const passport_id = Number(formData.get('passport_id'));

        if (isNaN(factor_value)) {
            toast.custom((t) => <ErrorToast t={t} message={"amount is not a number"} />);
            return;
        }
        if (isNaN(passport_id)) {
            toast.custom((t) => <ErrorToast t={t} message={"passport_id is not a number"} />);
            return;
        }
        // client-side validation
        const result = PollutionSchema.safeParse({
            factor_Name: formData.get('factor_Name'),
            factor_value: factor_value,
            passport_id: passport_id
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
        const response = await addPollution(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='New pollution added successfully!' />, { duration: 2500 })
        }
    }

    const clientEditPollution = async (formData: FormData) => {
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            alert("Row is not selected")
            return;
        }
        const id: string = selectedRow.values().next().value;

        //client-side validation
        const factor_value = Number(formData.get('factor_value'))
        const passport_id = Number(formData.get('passport_id'));

        if (isNaN(factor_value)) {
            toast.custom((t) => <ErrorToast t={t} message={"amount is not a number"} />);
            return;
        }
        if (isNaN(passport_id)) {
            toast.custom((t) => <ErrorToast t={t} message={"passport_id is not a number"} />);
            return;
        }
        // client-side validation
        const result = PollutionSchema.safeParse({
            id: id,
            factor_Name: formData.get('factor_Name'),
            factor_value: factor_value,
            passport_id: passport_id
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
        const response = await editPollution(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Pollution edited successfully!' />, { duration: 2500 })
        }
    }

    const clientDeletePollution = async (formData: FormData) => {
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            alert("Row is not selected")
            return;
        }
        const id: string = selectedRow.values().next().value;

        resetFieldState();
        resetRow();

        const response = await deletePollution(id);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Company deleted successfully!' />, { duration: 2500 })
        }
    }

    const clientAddManyCompanies = async () => {
        const pollutionArray = await getDataFromXlsx();
        //client-side validation
        const result = PollutionArraySchema.safeParse(pollutionArray)
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            toast.custom((t) => <ErrorToast t={t} message={errorMessage} />);
            return
        }
        const response = await createPollutionFromXlsx(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Enterprises added successfuly!' />, { duration: 2500 })
        }

    }


    return (
        <div className=" flex flex-col  gap-5">
            <div className='flex justify-center'>
                <form className="max-w-[850px] flex flex-auto  " >
                    <div className='flex flex-col flex-auto gap-5 p-5'>
                        <CustomInput
                            title='Substance'
                            name='factor_Name'
                            handleChange={handleFormChange}
                            color='primary'
                            value={pollutionData.factor_Name}
                        />
                        <div className=' flex gap-3'>
                            <CustomInput
                                title='Amount'
                                name='factor_value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={pollutionData.factor_value}
                            />
                            <CustomInput
                                title='Passport'
                                name='passport_id'
                                handleChange={handleFormChange}
                                color='primary'
                                value={pollutionData.passport_id}
                            />
                        </div>

                        <div className='flex gap-5 justify-center'>
                            <button
                                formAction={clientAddPollution}
                                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                            >
                                <AiOutlinePlus color="white" size={30} />
                            </button>
                            <button
                                formAction={clientEditPollution}
                                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                            >
                                <AiOutlineEdit color="white" size={30} />
                            </button>
                            <button
                                formAction={clientDeletePollution}
                                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                            >
                                <AiOutlineDelete color="white" size={30} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex justify-center">
                <div className=" max-w-[950px] flex flex-auto  ">
                    <DynamicTable
                        rowsLength={8}
                        tableItems={pollutions}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                    />
                </div>
            </div>
            <p className=' text-center text-xl'>OR</p>
            <div className='flex justify-center '>
                <button
                    onClick={clientAddManyCompanies}
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

export default PollutionLogics