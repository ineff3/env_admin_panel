'use client';
import { useState, useEffect } from "react";
import { CustomInput, CustomTextArea, DynamicTable, CustomButtonSection } from "@/components";
import { TableColumns, Enterpsise, EnterpriseData } from "@/types";
import { Selection } from "@nextui-org/react";

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
const dynamicTableStyles = {
    table: ["font-sans"],
    th: ["text-md", "font-semibold"],
    td: ["text-md"]
}

const Enterprises = () => {
    const [enterpriseData, setEnterpriseData] = useState<EnterpriseData>({
        name: '',
        description: '',
        location: ''
    })
    const [isLoading, setIsLoading] = useState(true);
    const [enterprises, setEnterprises] = useState<Enterpsise[]>([]);
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());
    //returns true if one of form inputs is empty
    function hasEmptyField(obj: EnterpriseData) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key as keyof EnterpriseData] === '') {
                return true;
            }
        }
        return false;
    }
    function fieldsCorrect() {
        if (hasEmptyField(enterpriseData)) {
            alert('Some fields are empty')
            return false;
        }
        return true;
    }

    function resetFieldsData() {
        setEnterpriseData({
            name: '',
            location: '',
            description: ''
        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedEnterprise: Enterpsise | undefined = enterprises.find(enterprise => enterprise.id === +id);

            if (selectedEnterprise !== undefined) {
                setEnterpriseData({
                    name: selectedEnterprise.name,
                    location: selectedEnterprise.location,
                    description: selectedEnterprise.description
                })
            }
        } else {
            setEnterpriseData({
                name: '',
                location: '',
                description: ''
            })
        }
    }, [selectedRow]);
    //Fetching users array initially
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/enterprises');

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();
                setIsLoading(false);
                setEnterprises(data);
            } catch (error) {
                console.error('Error during fetching', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className=" flex flex-col gap-5">
            <div>
                <form className="mx-auto max-w-[700px] flex flex-col gap-5 p-5" >
                    <div className="flex gap-3 justify-center">
                        <CustomInput
                            title='Name'
                            handleChange={(e) => setEnterpriseData({ name: e.target.value, location: enterpriseData.location, description: enterpriseData.description })}
                            color='primary'
                            value={enterpriseData.name}
                        />
                        <CustomInput
                            title='Location'
                            handleChange={(e) => setEnterpriseData({ name: enterpriseData.name, location: e.target.value, description: enterpriseData.description })}
                            color='primary'
                            value={enterpriseData.location}
                        />
                    </div>
                    <div className="flex flex-auto">
                        <CustomTextArea
                            title='Description'
                            handleChange={(e) => setEnterpriseData({ name: enterpriseData.name, location: enterpriseData.location, description: e.target.value })}
                            color='primary'
                            value={enterpriseData.description}
                        />
                    </div>
                    <CustomButtonSection
                        passedData={enterpriseData}
                        apiRoute="enterprises"
                        fieldsCorrect={fieldsCorrect}
                        resetFieldsData={resetFieldsData}
                        setTableData={setEnterprises}
                        selectedRow={selectedRow}
                        resetRow={resetRow}
                    />


                </form>
            </div>

            <div className="flex justify-center">
                <div className=" max-w-[850px] flex flex-auto  ">
                    <DynamicTable
                        styles={dynamicTableStyles}
                        tableItems={enterprises}
                        tableColumns={columns}
                        isLoading={isLoading}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                    />
                </div>
            </div>

        </div>

    );
}

export default Enterprises