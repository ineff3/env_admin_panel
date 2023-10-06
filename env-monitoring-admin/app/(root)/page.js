'use client';

import { useState, useEffect } from "react";
import { CustomInput, DynamicTable } from "@/components";
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsFiletypeXlsx } from 'react-icons/bs'
import * as XLSX from 'xlsx';

//Keys should be as the passed items properties
const columns = [
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

export default function HomePage() {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState(new Set());

    //returns user object by id
    function getUserById(id) {
        return users.find(user => user.user_id === +id);
    }
    //returns true if one of form inputs is empty
    function hasEmptyField(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] === '') {
                return true;
            }
        }
        return false;
    }
    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (selectedRow.size > 0) {
            const id = selectedRow.values().next().value;

            const selectedUser = getUserById(id)

            setUserData({
                email: selectedUser.email,
                password: selectedUser.password
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

    async function addNewUser(e) {
        e.preventDefault();
        if (hasEmptyField(userData)) {
            alert('Some fields are empty')
            return;
        }
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            const newUser = await response.json();
            if (!newUser.hasOwnProperty('exist')) {
                setUsers((prevUsers) => [...prevUsers, newUser]);
                // Clearing input fields
                setUserData({
                    email: '',
                    password: ''
                });
            } else {
                alert('Such user already exists')
            }

        }
        catch (error) {
            console.error('Error during fetching', error);
        }
    }

    async function editExistingUserData(e) {
        e.preventDefault();
        if (hasEmptyField(userData)) {
            alert('Some fields are empty')
            return;
        }
        if (selectedRow.size === 0) {
            alert("User is not selected")
            return;
        }
        const userId = selectedRow.values().next().value;
        const userDataWithId = userData;
        userDataWithId.id = userId;
        try {
            const response = await fetch('/api/users/edit', {
                method: 'POST',
                body: JSON.stringify(userDataWithId),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            setUsers(await fetch('api/users').then(res => res.json()));

            setUserData({
                email: '',
                password: ''
            });
            setSelectedRow(new Set());



        }
        catch (error) {
            console.error('Error during fetching', error);
        }
    }

    async function deleteUser(e) {
        e.preventDefault()
        if (hasEmptyField(userData)) {
            alert('Some fields are empty')
            return;
        }
        if (selectedRow.size === 0) {
            alert("User is not selected")
            return;
        }
        const userId = selectedRow.values().next().value;

        try {
            const response = await fetch('/api/users/delete', {
                method: 'POST',
                body: JSON.stringify({ id: userId }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            setUsers(await fetch('api/users').then(res => res.json()));

            setUserData({
                email: '',
                password: ''
            });
            setSelectedRow(new Set());
        }
        catch (error) {
            console.error('Error during fetching', error);
        }

    }

    async function handleXlsx(e) {
        e.preventDefault();
        const usersArray = await getDataFromXlsx();
        try {
            const response = await fetch('api/users/createMany', {
                method: 'POST',
                body: JSON.stringify(usersArray),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            setUsers(await fetch('api/users').then(res => res.json()));
            setUserData({
                email: '',
                password: ''
            });
            setSelectedRow(new Set());
        }
        catch (error) {
            console.error('Error during fetching', error);
        }
    }

    async function getDataFromXlsx() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xlsx';

            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();

                    reader.onload = async (e) => {
                        const data = e.target.result;
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];

                        //sheet_to_json converts a worksheet object to an array of JSON objects.
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        const headerRow = jsonData[0];
                        const dataRows = jsonData.slice(1);

                        const dataArray = dataRows.map((row) => {
                            const obj = {};
                            headerRow.forEach((header, index) => {
                                obj[header] = row[index];
                            });
                            return obj;
                        });

                        resolve(dataArray);
                    };

                    reader.readAsArrayBuffer(file);
                }
            };

            input.click();
        })
    }


    return (
        <div className=" flex flex-col lg:flex-row gap-5">
            <div>
                <form className="mx-auto flex flex-col gap-5 p-5" >
                    <CustomInput
                        title={'Email'}
                        handleChange={(e) => setUserData({ email: e.target.value, password: userData.password })}
                        color={'primary'}
                        value={userData.email}
                    />
                    <CustomInput
                        title={'Password'}
                        handleChange={(e) => setUserData({ email: userData.email, password: e.target.value })}
                        color={'primary'}
                        value={userData.password}
                    />
                    <div className="flex gap-5 justify-center">
                        <button
                            onClick={addNewUser}
                            type="submit"
                            className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                        >
                            <AiOutlinePlus color="white" size={30} />
                        </button>
                        <button
                            onClick={editExistingUserData}
                            type="submit"
                            className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                        >
                            <AiOutlineEdit color="white" size={30} />
                        </button>
                        <button
                            onClick={deleteUser}
                            type="submit"
                            className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                        >
                            <AiOutlineDelete color="white" size={30} />
                        </button>
                        <button
                            onClick={handleXlsx}
                            type="submit"
                            className="  px-3 py-2 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                        >
                            <BsFiletypeXlsx color="white" size={30} />
                        </button>

                    </div>

                </form>
            </div>

            <div className="flex flex-auto">
                <DynamicTable
                    users={users}
                    columns={columns}
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
