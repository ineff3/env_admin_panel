'use client'
import { TableColumns, UserDataType, UserType } from "@/types"
import { useEffect, useState } from "react"
import { CustomInput, CustomTextArea, SuccessfulToast, ErrorToast, CustomBtn } from '@/components';
import { AiOutlinePlus } from 'react-icons/ai'
import { MdEditNote } from 'react-icons/md'
import { Selection } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { deleteUser, editUserRoles } from "@/actions/usersActions";
import DynamicUserTable from "./DynamicUserTable";
import { Select, SelectItem } from "@nextui-org/react";

//Keys should be as the passed items properties
const columns: TableColumns[] = [
    {
        name: 'USERNAME',
        key: 'userName'
    },
    {
        name: 'EMAIL',
        key: 'email'
    },
    {
        name: 'ROLE',
        key: 'role'
    }
]

interface UserRolesType {
    label: string
    value: string
}

const UsersLogics = ({ users, userRoles }: { users: UserType[], userRoles: UserRolesType[] }) => {
    const [userData, setUserData] = useState<UserDataType>({
        userName: '',
        email: '',
        role: ''
    })
    const [selectedRow, setSelectedRow] = useState<Selection>(new Set());
    const [selectedRoles, setSelectedRoles] = useState(new Set([]));

    //Executes whenever selectedRow changes to some actual row
    useEffect(() => {
        if (typeof selectedRow !== 'string' && selectedRow.size > 0) {
            const id: string = selectedRow.values().next().value;

            const selectedUser = users.find(user => user.id === id);

            if (selectedUser !== undefined) {
                setUserData({
                    userName: selectedUser.userName,
                    email: selectedUser.email,
                    role: selectedUser.role
                })
                if (selectedUser.role !== undefined) {
                    if (selectedUser.role !== '') {
                        const userRolesArray: any = selectedUser.role?.split(", ")
                        setSelectedRoles(new Set(userRolesArray))
                    }
                }
            }
        } else {
            resetFieldState()
            setSelectedRoles(new Set([]))
        }
    }, [selectedRow]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }
    const handleUserRolesChange = (e: any) => {
        if (e.target.value !== '') {
            setSelectedRoles(new Set(e.target.value.split(",")));
        } else {
            setSelectedRoles(new Set([]))
        }
    };

    function resetFieldState() {
        setUserData({
            userName: '',
            email: '',
            role: ''

        });
    }
    function resetRow() {
        setSelectedRow(new Set());
    }
    const clientEditUserRoles = async () => {
        if (typeof selectedRow === 'string' || selectedRow.size === 0) {
            toast.custom((t) => <ErrorToast t={t} message={"Row is not selected"} />);
            return;
        }
        const id: string = selectedRow.values().next().value;

        //server response + error handling
        const response = await editUserRoles(Array.from(selectedRoles), id)
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='User role edited successfully!' />, { duration: 2500 })
        }
    }
    const clientDeleteUser = async (id: string) => {
        const response = await deleteUser(id);
        if (response?.error) {
            toast.custom((t) => <ErrorToast t={t} message={response.error} />);
        } else {
            toast.custom((t) => <SuccessfulToast t={t} message='User deleted successfully!' />, { duration: 2500 })
        }
        resetFieldState();
        resetRow();
    }

    return (
        <div className=" flex flex-col  gap-5">
            <div className='flex justify-center'>
                <form className="max-w-[850px] flex flex-auto  " >
                    <div className='flex flex-col flex-auto gap-5 p-5'>
                        <div className=' flex gap-3'>
                            <CustomInput
                                title='Username'
                                name='userName'
                                handleChange={handleFormChange}
                                color='primary'
                                value={userData.userName}
                                required={true}
                                disabled
                            />
                            <CustomInput
                                title='Email'
                                name='email'
                                handleChange={handleFormChange}
                                color='primary'
                                value={userData.email}
                                required={true}
                                disabled
                            />
                        </div>
                        <div className=" flex justify-center">

                            <Select
                                size='md'
                                radius="md"
                                label="User Roles"
                                selectionMode="multiple"
                                placeholder="Select a user roles"
                                selectedKeys={selectedRoles}
                                className=" w-1/2 "
                                onChange={handleUserRolesChange}
                                classNames={{
                                    label: "",
                                    trigger: "bg-white rounded-md border-gray-300 border-2",
                                    listboxWrapper: "bg-white",
                                }}
                            >
                                {userRoles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='flex gap-5 justify-center'>
                            <CustomBtn
                                title="Edit User Role"
                                icon={<MdEditNote size={30} />}
                                formActionFunction={clientEditUserRoles}
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex justify-center">
                <div className=" max-w-[950px] flex flex-auto  ">
                    <DynamicUserTable
                        rowsLength={6}
                        tableItems={users}
                        tableColumns={columns}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        deleteItem={clientDeleteUser}
                    />
                </div>
            </div>
        </div>
    )
}

export default UsersLogics