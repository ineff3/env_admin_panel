import React from 'react'
import { getCompanies } from '@/actions/companiesActions'
import CompanyLogics from './CompanyLogics';
import { CompanyDataType, CompanyType } from '@/types';

const Comapnies = async () => {
    const companiesArray = await getCompanies();

    return (
        <div>
            <CompanyLogics
                companies={companiesArray as CompanyType[]}
            />
        </div>
    )
}

export default Comapnies