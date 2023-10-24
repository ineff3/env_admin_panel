import { CompanyNamesArrayType, CompanyType, PassportType } from "@/types";
import PassportLogics from "./PassportLogics"
import { getCompanies } from '@/actions/companiesActions'
import { getPassports } from "@/actions/passportsActions";


const Passports = async () => {
    const companiesArray = await getCompanies();

    const companyNamesArray = companiesArray.map(company => ({
        name: company.name
    }));

    const passportsArray = await getPassports();

    const companyMap: { [key: number]: string } = {};
    companiesArray.forEach(company => {
        companyMap[company.id] = company.name;
    });

    const passportWithCompaniesAray = passportsArray.map(passport => ({
        ...passport,
        company_name: companyMap[passport.company_id]
    }));


    return (
        <div>
            <PassportLogics
                companyNamesArray={companyNamesArray as CompanyNamesArrayType}
                passports={passportsArray as PassportType[]}
                companies={companiesArray as CompanyType[]}
                passportsToShow={passportWithCompaniesAray}
            />
        </div>
    )
}

export default Passports