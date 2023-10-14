'use client';
import { TableColumns, User, UserData } from '@/types';
import { CustomInput, DynamicTable } from '@/components';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { BsFiletypeXlsx } from 'react-icons/bs'
import { addUser, editUser, deleteUser, createFromXlsx } from '@/actions/userActions';
import { useEffect, useState } from 'react';
import { Selection } from "@nextui-org/react";
import getDataFromXlsx from '../xlsxHandler';


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

const Dashboard = ({ users }: { users: User[] }) => {
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());
    const [userData, setUserData] = useState<UserData>({
        email: '',
        password: ''
    })
    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedUser = users.find(user => user.user_id === +id);
            if (selectedUser !== undefined) {
                setUserData({
                    email: selectedUser.email,
                    password: selectedUser.password
                })
            }
        } else {
            setUserData({
                email: '',
                password: ''
            })
        }
    }, [selectedRow]);

    function resetFieldState() {
        setUserData({
            email: '',
            password: ''
        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }


    return (
        <div className=" flex flex-col gap-5">
            <form
                className="mx-auto max-w-[700px] flex flex-col gap-5 p-5" >
                <div className="flex gap-3 justify-center">
                    <CustomInput
                        title='Email'
                        color='primary'
                        name='email'
                        handleChange={(e) => setUserData({ email: e.target.value, password: userData.password })}
                        value={userData.email}
                    />
                    <CustomInput
                        title='Password'
                        color='primary'
                        name='password'
                        handleChange={(e) => setUserData({ email: userData.email, password: e.target.value })}
                        value={userData.password}
                    />
                </div>
                <div className='flex gap-5 justify-center'>
                    <button
                        formAction={async formData => {
                            resetFieldState();
                            await addUser(formData)
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
                            resetFieldState();
                            resetRow();
                            await editUser(formData, id);
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
                            await deleteUser(id);
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
                        tableItems={users}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                    />
                </div>
            </div>

            <div className='flex justify-center pt-3'>
                <button
                    onClick={async () => {
                        const usersArray = await getDataFromXlsx();
                        await createFromXlsx(usersArray as User[])
                    }}
                    className=" px-4 py-3 text-white bg-primary rounded-lg shadow-sm active:bg-opacity-70 font-medium"
                >
                    <div className='flex gap-3'>
                        <BsFiletypeXlsx color="white" size={30} />
                        <p>Insert data from a file</p>
                    </div>
                </button>
            </div>

        </div>
    )
}

export default Dashboard