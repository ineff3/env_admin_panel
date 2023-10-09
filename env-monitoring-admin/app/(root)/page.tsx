'use client';

import { useState, useEffect } from "react";
import { CustomInput, DynamicTable } from "@/components";
import { TableColumns, User, UserData } from "@/types";
import { Selection } from "@nextui-org/react";
import CustomButtonSection from "@/components/CustomButtonSection";


//Keys should be as the passed items properties
const columns: TableColumns[] = [
    {
        name: 'ID',
        key: 'user_id'
    },
    {
        name: 'EMAIL',
        key: 'email'
    },
    {
        name: 'PASSWORD',
        key: 'password'
    },
]

const dynamicTableStyles = {
    table: ["font-sans"],
    th: ["text-md", "font-semibold"],
    td: ["text-md"]
}

export default function HomePage() {
    const [userData, setUserData] = useState<UserData>({
        email: '',
        password: ''
    })
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());

    //returns user object by id
    function getUserById(id: string): User | undefined {
        return users.find(user => user.user_id === +id);
    }
    //returns true if one of form inputs is empty
    function hasEmptyField(obj: UserData) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key as keyof UserData] === '') {
                return true;
            }
        }
        return false;
    }
    function fieldsCorrect() {
        if (hasEmptyField(userData)) {
            alert('Some fields are empty')
            return false;
        }
        return true;
    }

    function resetFieldsData() {
        setUserData({
            email: '',
            password: ''
        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }
    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedUser = getUserById(id)

            setUserData({
                email: selectedUser?.email,
                password: selectedUser?.password
            })
        } else {
            setUserData({
                email: '',
                password: ''
            })
        }
    }, [selectedRow]);
    //Fetching users array initially
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/users');

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();
                setIsLoading(false);
                setUsers(data);
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
                            title='Email'
                            handleChange={(e) => setUserData({ email: e.target.value, password: userData.password })}
                            color='primary'
                            value={userData.email}
                        />
                        <CustomInput
                            title='Password'
                            handleChange={(e) => setUserData({ email: userData.email, password: e.target.value })}
                            color='primary'
                            value={userData.password}
                        />
                    </div>
                    <CustomButtonSection
                        passedData={userData}
                        apiRoute="users"
                        fieldsCorrect={fieldsCorrect}
                        resetFieldsData={resetFieldsData}
                        setTableData={setUsers}
                        selectedRow={selectedRow}
                        resetRow={resetRow}
                    />
                </form>
            </div>

            <div className="flex flex-auto">
                <DynamicTable
                    styles={dynamicTableStyles}
                    tableItems={users}
                    tableColumns={columns}
                    isLoading={isLoading}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                />
            </div>
        </div>

    );
}

// const users = [
//     {
//         user_id: "1",
//         email: "Max",
//         password: "thisispassword"
//     },
//     {
//         user_id: "2",
//         email: "David",
//         password: "something new"
//     },
//     {
//         user_id: "3",
//         email: "George",
//         password: "another one"
//     },
//     {
//         user_id: "4",
//         email: "George",
//         password: "another one"
//     },
//     {
//         user_id: "5",
//         email: "George",
//         password: "another one"
//     }
// ]
