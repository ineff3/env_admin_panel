'use client';
import { rfcFactorDataType, rfcFactorType } from "@/types"
import { PassportType, PollutionDataType, PollutionType, TableColumns } from '@/types'
import { CustomInput, DynamicTable, SuccessfulToast, ErrorToast, CustomBtn, DynamicSearchTable } from '@/components';
import { AiOutlinePlus } from 'react-icons/ai'
import { BsFiletypeXlsx } from 'react-icons/bs'
import { useEffect, useState } from 'react';
import { Selection } from "@nextui-org/react";
import getDataFromXlsx from '@/actions/xlsx/xlsxParser';
import { toast } from 'react-hot-toast';
import { RfcFactorArraySchema, RfcFactorSchema } from '@/schemas';
import { MdEditNote } from 'react-icons/md';
import { addRfcFactor, createRfcFactorsFromXlsx, deleteRfcFactor, editRfcFactor } from "@/actions/rfcFactorsActions";

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
]

const RfcFactorsLogics = ({ rfcFactors }: { rfcFactors: rfcFactorType[] }) => {
    const [rfcFactorData, setRfcFactorData] = useState<rfcFactorDataType>({
        factor_Name: '',
        factor_value: '',
    })
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedRfcFactor = rfcFactors.find(rfcFactor => rfcFactor.id === +id);

            if (selectedRfcFactor !== undefined) {
                setRfcFactorData({
                    factor_Name: selectedRfcFactor.factor_Name,
                    factor_value: selectedRfcFactor.factor_value,
                })
            }
        } else {
            resetFieldState()
        }
    }, [selectedRow]);

    function resetFieldState() {
        setRfcFactorData({
            factor_Name: '',
            factor_value: '',
        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRfcFactorData({
            ...rfcFactorData,
            [e.target.name]: e.target.value
        })
    }

    const clientAddRfcFactor = async (formData: FormData) => {
        const factor_value = Number(formData.get('factor_value'))

        if (isNaN(factor_value)) {
            toast.custom((t) => <ErrorToast t={t} message={"amount is not a number"} />);
            return;
        }

        // client-side validation
        const result = RfcFactorSchema.safeParse({
            factor_Name: formData.get('factor_Name'),
            factor_value: factor_value,
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
        const response = await addRfcFactor(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='New RFC factor added successfully!' />, { duration: 2500 })
        }
    }

    const clientEditRfcFactor = async (formData: FormData) => {
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            toast.custom((t) => <ErrorToast t={t} message={"Row is not selected"} />);
            return;
        }
        const id: string = selectedRow.values().next().value;

        //client-side validation
        const factor_value = Number(formData.get('factor_value'))

        if (isNaN(factor_value)) {
            toast.custom((t) => <ErrorToast t={t} message={"amount is not a number"} />);
            return;
        }

        // client-side validation
        const result = RfcFactorSchema.safeParse({
            id: Number(id),
            factor_Name: formData.get('factor_Name'),
            factor_value: factor_value,
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
        const response = await editRfcFactor(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='RFC factor edited successfully!' />, { duration: 2500 })
        }
    }

    const clientDeleteRfcFactor = async (id: number) => {
        const response = await deleteRfcFactor(id);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='RFC factor deleted successfully!' />, { duration: 2500 })
        }
        resetFieldState();
        resetRow();
    }

    const clientAddManyRfcFactors = async () => {
        const rfcFactorArray = await getDataFromXlsx();
        //client-side validation
        const result = RfcFactorArraySchema.safeParse(rfcFactorArray)
        if (!result.success) {
            let errorMessage = '';
            result.error.issues.forEach((err) => {
                errorMessage += err.path[0] + ': ' + err.message + '. '
            })
            toast.custom((t) => <ErrorToast t={t} message={errorMessage} />);
            return
        }
        const response = await createRfcFactorsFromXlsx(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='RFC factors added successfuly!' />, { duration: 2500 })
        }

    }

    return (
        <div className=" flex flex-col  gap-5">
            <div className='flex justify-center'>
                <form className="max-w-[850px] flex flex-auto  " >
                    <div className='flex flex-col flex-auto gap-5 p-5'>
                        <div className=' flex gap-3'>
                            <CustomInput
                                title='Substance'
                                name='factor_Name'
                                handleChange={handleFormChange}
                                color='primary'
                                value={rfcFactorData.factor_Name}
                                required={true}
                            />
                            <CustomInput
                                title='Amount'
                                name='factor_value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={rfcFactorData.factor_value}
                                required={true}
                            />

                        </div>

                        <div className='flex gap-5 justify-center'>
                            <CustomBtn
                                title="Add RFC factor"
                                icon={<AiOutlinePlus size={30} />}
                                formActionFunction={clientAddRfcFactor}
                            />
                            <CustomBtn
                                title="Edit RFC factor"
                                icon={<MdEditNote size={30} />}
                                formActionFunction={clientEditRfcFactor}
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex justify-center">
                <div className=" max-w-[950px] flex flex-auto  ">
                    <DynamicTable
                        rowsLength={6}
                        tableItems={rfcFactors}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        deleteItem={clientDeleteRfcFactor}
                    />
                </div>
            </div>
            <p className=' text-center text-xl'>OR</p>
            <div className='flex justify-center '>
                <button
                    onClick={clientAddManyRfcFactors}
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

export default RfcFactorsLogics