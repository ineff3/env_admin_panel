'use client';
import { rfcFactorDataType, rfcFactorType } from "@/types"
import { TableColumns } from '@/types'
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
import { Select, SelectItem } from "@nextui-org/react";
import { damagedOrgansArray } from "./damagedOrgansData";

//Keys should be as the passed items properties
const columns: TableColumns[] = [
    {
        name: 'SUBSTANCE',
        key: 'name'
    },
    {
        name: 'AMOUNT',
        key: 'rfC_value'
    },
    {
        name: 'DAMAGED ORGANS',
        key: 'damaged_organs'
    },
    {
        name: 'SF',
        key: 'sF_value'
    },
    {
        name: 'GDK',
        key: 'gdK_value'
    },
    {
        name: 'MFR',
        key: 'mass_flow_rate'
    }
]

const RfcFactorsLogics = ({ rfcFactors }: { rfcFactors: rfcFactorType[] }) => {
    const [rfcFactorData, setRfcFactorData] = useState<rfcFactorDataType>({
        name: '',
        rfC_value: '',
        sF_value: '',
        gdK_value: '',
        mass_flow_rate: ''
    })
    const [damagedOrgans, setDamagedOrgans] = useState(new Set([]));

    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedRfcFactor = rfcFactors.find(rfcFactor => rfcFactor.id === +id);

            if (selectedRfcFactor !== undefined) {
                setRfcFactorData({
                    name: selectedRfcFactor.name,
                    rfC_value: selectedRfcFactor.rfC_value,
                    sF_value: selectedRfcFactor.sF_value,
                    gdK_value: selectedRfcFactor.gdK_value,
                    mass_flow_rate: selectedRfcFactor.mass_flow_rate
                })
                if (selectedRfcFactor.damaged_organs !== undefined) {
                    const damagedOrgansArray: any = selectedRfcFactor.damaged_organs?.split(", ")
                    setDamagedOrgans(new Set(damagedOrgansArray))
                }
            }
        } else {
            resetFieldState()
            setDamagedOrgans(new Set([]))
        }
    }, [selectedRow]);

    function resetFieldState() {
        setRfcFactorData({
            name: '',
            rfC_value: '',
            sF_value: '',
            gdK_value: '',
            mass_flow_rate: ''
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
    const handleDamagedOrgansChange = (e: any) => {
        setDamagedOrgans(new Set(e.target.value.split(",")));
    };

    const clientAddRfcFactor = async (formData: FormData) => {
        const damagedOragns = Array.from(damagedOrgans).join(", ");

        // client-side validation
        const result = RfcFactorSchema.safeParse({
            name: formData.get('name'),
            rfC_value: formData.get('rfC_value'),
            sF_value: formData.get('sF_value'),
            gdK_value: formData.get('gdK_value'),
            mass_flow_rate: formData.get('mass_flow_rate'),
            damaged_organs: damagedOragns
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
        const damagedOragns = Array.from(damagedOrgans).join(", ");

        // client-side validation
        const result = RfcFactorSchema.safeParse({
            id: Number(id),
            name: formData.get('name'),
            rfC_value: formData.get('rfC_value'),
            sF_value: formData.get('sF_value'),
            gdK_value: formData.get('gdK_value'),
            mass_flow_rate: formData.get('mass_flow_rate'),
            damaged_organs: damagedOragns
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
                                name='name'
                                handleChange={handleFormChange}
                                color='primary'
                                value={rfcFactorData.name}
                                required={true}
                            />
                            <CustomInput
                                title='Amount'
                                name='rfC_value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={rfcFactorData.rfC_value}
                                required={true}
                            />
                            <CustomInput
                                title='Sf'
                                name='sF_value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={rfcFactorData.sF_value}
                                required={true}
                            />
                            <CustomInput
                                title='Gdk'
                                name='gdK_value'
                                handleChange={handleFormChange}
                                color='primary'
                                value={rfcFactorData.gdK_value}
                                required={true}
                            />
                            <CustomInput
                                title='MFR'
                                name='mass_flow_rate'
                                handleChange={handleFormChange}
                                color='primary'
                                value={rfcFactorData.mass_flow_rate}
                                required={true}
                            />

                        </div>
                        <div className=" flex justify-center">

                            <Select
                                size='md'
                                radius="md"
                                label="Damaged Organs"
                                selectionMode="multiple"
                                placeholder="Select a damaged organ"
                                selectedKeys={damagedOrgans}
                                className=" w-1/2 "
                                onChange={handleDamagedOrgansChange}
                                classNames={{
                                    label: "",
                                    trigger: "bg-white rounded-md border-gray-300 border-2",
                                    listboxWrapper: "bg-white",
                                }}
                            >
                                {damagedOrgansArray.map((dmgOrgan) => (
                                    <SelectItem key={dmgOrgan.value} value={dmgOrgan.value}>
                                        {dmgOrgan.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        {/* <p className="text-small text-default-500">Selected: {Array.from(damagedOrgans).join(", ")}</p> */}



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