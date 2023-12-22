import { getCities, getCompanies } from '@/actions/companiesActions'
import CompanyLogics from './CompanyLogics';
import { CompanyType } from '@/types';

const Comapnies = async () => {
    const companies = await getCompanies();
    const cities = await getCities();

    const companiesWithCityNames = companies.map((comp) => {
        return {
            ...comp,
            city_name: cities.find((city) => comp.city_id === city.id).name
        }
    })
    const cityNames = cities.map((city) => city.name)

    return (
        <div>
            <CompanyLogics
                companies={companies as CompanyType[]}
                cities={cities}
                companiesWithCityNames={companiesWithCityNames}
                cityNames={cityNames}
            />
        </div>
    )
}

export default Comapnies