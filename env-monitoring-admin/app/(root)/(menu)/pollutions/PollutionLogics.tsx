'use client';
import { PassportType, PollutionDataType, PollutionType, TableColumns, rfcFactorType } from '@/types'
import { CustomInput, DynamicTable, SuccessfulToast, ErrorToast, CustomBtn, DynamicSearchTable, CustomSearchDropdown } from '@/components';
import { AiOutlinePlus } from 'react-icons/ai'
import { BsFiletypeXlsx } from 'react-icons/bs'
import { useEffect, useState } from 'react';
import { Selection } from "@nextui-org/react";
import getDataFromXlsx from '@/actions/xlsx/xlsxParser';
import { toast } from 'react-hot-toast';
import { PollutionArraySchema, PollutionSchema } from '@/schemas';
import { addPollution, createPollutionFromXlsx, deletePollution, editPollution } from '@/actions/pollutionsActions';
import { MdEditNote } from 'react-icons/md';

//Keys should be as the passed items properties
const columns: TableColumns[] = [
    {
        name: 'SUBSTANCE',
        key: 'name'
    },
    {
        name: 'AMOUNT',
        key: 'value'
    },
    {
        name: 'PASSPORT',
        key: 'passport_id'
    },
    {
        name: 'CA',
        key: 'cA_value'
    },
    {
        name: 'CH',
        key: 'cH_value'
    },
    {
        name: 'RFC',
        key: 'pollutant_name'

    }
]

const PollutionLogics = ({ pollutions, pollsWithRfcFactorsNames, rfcFactorsNames, rfcFactors }: { pollutions: PollutionType[], pollsWithRfcFactorsNames: any, rfcFactorsNames: string[], rfcFactors: rfcFactorType[] }) => {
    const [pollutionData, setPollutionData] = useState<PollutionDataType>({
        name: '',
        value: '',
        passport_id: '',
        cA_value: '',
        cH_value: '',
        pollutant_id: '',
    })
    const [selectedRfcFactor, setSelectedRfcFactor] = useState('')
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedPollution = pollutions.find(pollution => pollution.id === +id);

            if (selectedPollution !== undefined) {
                const companyName = getRfcFactorNameById(Number(selectedPollution.pollutant_id))
                setSelectedRfcFactor(companyName || '')
                setPollutionData({
                    name: selectedPollution.name,
                    value: selectedPollution.value,
                    passport_id: selectedPollution.passport_id,
                    cA_value: selectedPollution.cA_value,
                    cH_value: selectedPollution.cH_value,
                    pollutant_id: selectedPollution.pollutant_id
                })

            }
        } else {
            resetFieldState()
        }
    }, [selectedRow]);

    function resetFieldState() {
        setPollutionData({
            name: '',
            value: '',
            passport_id: '',
            cA_value: '',
            cH_value: '',
            pollutant_id: ''
        });
        setSelectedRfcFactor('')
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

    function getRfcFactorIdByName(rfcFactorName: string) {
        return rfcFactors.find(rfcFactor => rfcFactor.name === rfcFactorName)?.id;
    }
    function getRfcFactorNameById(rfcFactorId: number) {
        return rfcFactors.find(rfcFactor => rfcFactor.id === rfcFactorId)?.name;
    }

    const clientAddPollution = async (formData: FormData) => {
        if (selectedRfcFactor === '') {
            toast.custom((t) => <ErrorToast t={t} message={"Rfc Factor should be selected"} />);
            return
        }
        const rfcFactorId = getRfcFactorIdByName(selectedRfcFactor);
        // client-side validation
        const result = PollutionSchema.safeParse({
            name: formData.get('name'),
            value: formData.get('value'),
            passport_id: formData.get('passport_id'),
            cA_value: formData.get('cA_value'),
            cH_value: formData.get('cH_value'),
            pollutant_id: rfcFactorId

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
            toast.custom((t) => <ErrorToast t={t} message={"Row is not selected"} />);
            return;
        }
        const id: string = selectedRow.values().next().value;

        if (selectedRfcFactor === '') {
            toast.custom((t) => <ErrorToast t={t} message={"Rfc Factor should be selected"} />);
            return
        }
        const rfcFactorId = getRfcFactorIdByName(selectedRfcFactor);

        //client-side validation
        const result = PollutionSchema.safeParse({
            id: Number(id),
            name: formData.get('name'),
            value: formData.get('value'),
            passport_id: formData.get('passport_id'),
            cA_value: formData.get('cA_value'),
            cH_value: formData.get('cH_value'),
            pollutant_id: rfcFactorId
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

    const clientDeletePollution = async (id: number) => {
        const response = await deletePollution(id);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Pollution deleted successfully!' />, { duration: 2500 })
        }
        resetFieldState();
        resetRow();
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
                        <div className=' flex gap-3'>
                            <CustomInput
                                title='Substance'
                                name='name'
                                handleChange={handleFormChange}
                                color='primary'
                                value={pollutionData.name}
                                required={true}
                            />
                            <CustomSearchDropdown
                                title='Select RFC'
                                items={rfcFactorsNames}
                                selected={selectedRfcFactor}
                                setSelected={setSelectedRfcFactor}
                            />
                        </div>
                        <div className=' flex gap-3'>
                            <CustomInput
                                title='Amount'
                                name='value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={pollutionData.value}
                                required={true}
                            />
                            <CustomInput
                                title='Passport'
                                name='passport_id'
                                handleChange={handleFormChange}
                                color='primary'
                                value={pollutionData.passport_id}
                                required={true}
                            />
                            <CustomInput
                                title='CA'
                                name='cA_value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={pollutionData.cA_value}
                                required={true}
                            />
                            <CustomInput
                                title='CH'
                                name='cH_value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={pollutionData.cH_value}
                                required={true}
                            />
                        </div>

                        <div className='flex gap-5 justify-center'>
                            <CustomBtn
                                title="Add Pollution"
                                icon={<AiOutlinePlus size={30} />}
                                formActionFunction={clientAddPollution}
                            />
                            <CustomBtn
                                title="Edit Pollution"
                                icon={<MdEditNote size={30} />}
                                formActionFunction={clientEditPollution}
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex justify-center">
                <div className=" max-w-[1050px] flex flex-auto  ">
                    <DynamicTable
                        rowsLength={6}
                        tableItems={pollsWithRfcFactorsNames}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        deleteItem={clientDeletePollution}
                        withSearchBar
                        filterFunction={(items, filterValue) => {
                            return items.filter((item: PollutionType) =>
                                item.passport_id == filterValue)
                        }}
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