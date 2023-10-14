import { prisma } from '@/prisma/client_instance'
import { Enterprise } from '@/types';
import EnterpriseLogics from './EnterpriseLogics';

const Enterprises = async () => {
    const enterpriseArray = await prisma.enterprises.findMany();

    return (
        <>
            <div>
                <EnterpriseLogics
                    enterprises={enterpriseArray as Enterprise[]}
                />
            </div>
        </>
    );
}

export default Enterprises