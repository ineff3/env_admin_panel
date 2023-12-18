import React from 'react'
import UsersLogics from './UsersLogics'
import { getUserRoles, getUsers } from '@/actions/usersActions'

const Users = async () => {
    const users = await getUsers();
    const updatedUsers = users.map((user) => {
        return {
            ...user,
            role: user.role.join(', '), // Перетворюємо масив у рядок
        };
    });
    const userRoles = await getUserRoles();

    const userRolesNames = userRoles.map((role) => {
        return {
            label: role.name as string,
            value: role.name as string
        }
    })

    return (
        <UsersLogics
            users={updatedUsers}
            userRoles={userRolesNames}
        />
    )
}

export default Users