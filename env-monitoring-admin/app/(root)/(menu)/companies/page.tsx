import { getCompanies } from '@/actions/companiesActions'
import CompanyLogics from './CompanyLogics';
import { CompanyType } from '@/types';

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