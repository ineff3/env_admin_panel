'use client';
import { CompanyNamesArrayType, CompanyType, PassportDataType, PassportType } from "@/types"
import { TableColumns } from '@/types'
import { CustomInput, CustomDropdown, DynamicTable, SuccessfulToast, ErrorToast } from '@/components';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { useEffect, useState } from 'react';
import { Selection } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { PassportSchema } from '@/schemas';
import { addPassport, deletePassport, editPassport } from "@/actions/passportsActions";

const columns: TableColumns[] = [
    {
        name: 'PASSPORT ID',
        key: 'id'
    },
    {
        name: 'COMPANY NAME',
        key: 'company_name'
    },
    {
        name: 'YEAR',
        key: 'year'
    },
]

const PassportLogics = ({ companyNamesArray, passports, companies, passportsToShow }: {
    companyNamesArray: CompanyNamesArrayType, passports: PassportType[], companies: CompanyType[], passportsToShow: any
}) => {
    const [passportData, setPassportData] = useState<PassportDataType>({
        company_id: '',
        year: ''
    })
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedPassport = passports.find(passport => passport.id === +id);

            if (selectedPassport !== undefined) {
                const companyName = getCompanyNameById(Number(selectedPassport.company_id))
                setPassportData({
                    company_id: companyName as string,
                    year: selectedPassport.year
                })
            }
        } else {
            resetFieldState()
        }
    }, [selectedRow]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setPassportData({
            ...passportData,
            [e.target.name]: e.target.value
        })
    }

    function resetFieldState() {
        setPassportData({
            company_id: '',
            year: ''
        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }
    function getCompanyIdByName(companyName: string) {
        return companies.find(company => company.name === companyName)?.id;
    }
    function getCompanyNameById(companyId: number) {
        return companies.find(company => company.id === companyId)?.name;
    }

    const clientAddPassport = async (formData: FormData) => {
        const company_id = getCompanyIdByName(String(formData.get('company_id')));
        const year = Number(formData.get('year'));

        if (company_id === undefined || isNaN(company_id)) {
            toast.custom((t) => <ErrorToast t={t} message={"copany_id is not a number"} />);
            return;
        }
        if (isNaN(year)) {
            toast.custom((t) => <ErrorToast t={t} message={"year is not a number"} />);
            return;
        }
        // client-side validation
        const result = PassportSchema.safeParse({
            company_id: company_id,
            year: year
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
        const response = await addPassport(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='New passport added successfully!' />, { duration: 2500 })
        }
    }

    const clientEditPassport = async (formData: FormData) => {
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            toast.custom((t) => <ErrorToast t={t} message={"Row is not selected"} />);
            return;
        }
        const id: string = selectedRow.values().next().value;

        const company_id = getCompanyIdByName(String(formData.get('company_id')));
        const year = Number(formData.get('year'));

        if (company_id === undefined || isNaN(company_id)) {
            toast.custom((t) => <ErrorToast t={t} message={"copany_id is not a number"} />);
            return;
        }
        if (isNaN(year)) {
            toast.custom((t) => <ErrorToast t={t} message={"year is not a number"} />);
            return;
        }

        //client-side validation
        const result = PassportSchema.safeParse({
            id: id,
            company_id: company_id,
            year: year
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
        const response = await editPassport(result.data);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Passport edited successfully!' />, { duration: 2500 })
        }
    }

    const clientDeletePassport = async (formData: FormData) => {
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            alert("Row is not selected")
            return;
        }
        const id: string = selectedRow.values().next().value;

        resetFieldState();
        resetRow();

        const response = await deletePassport(id);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='Company deleted successfully!' />, { duration: 2500 })
        }
    }

    return (
        <div className=" flex flex-col  gap-5">
            <div className='flex justify-center'>
                <form className="max-w-[850px] flex flex-auto  " >
                    <div className='flex flex-col flex-auto gap-5 p-5'>
                        <div className="flex gap-3">
                            <CustomDropdown
                                name="company_id"
                                options={companyNamesArray}
                                value={passportData.company_id}
                                handleChange={handleFormChange}
                                color="primary"
                            />
                            <CustomInput
                                title='Year'
                                name='year'
                                handleChange={handleFormChange}
                                color='primary'
                                value={passportData.year}
                                required={true}
                            />
                        </div>
                        <div className='flex gap-5 justify-center'>
                            <button
                                formAction={clientAddPassport}
                                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                            >
                                <AiOutlinePlus color="white" size={30} />
                            </button>
                            <button
                                formAction={clientEditPassport}
                                className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                            >
                                <AiOutlineEdit color="white" size={30} />
                            </button>
                            <button
                                formAction={clientDeletePassport}
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
                        rowsLength={5}
                        tableItems={passportsToShow}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                    />
                </div>
            </div>
        </div>
    )
}

export default PassportLogics
