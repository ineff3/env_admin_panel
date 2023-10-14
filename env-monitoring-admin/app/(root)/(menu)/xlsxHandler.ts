import * as XLSX from 'xlsx';

export default async function getDataFromXlsx() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx';

        input.onchange = (event) => {

            const inputElement = event.target as HTMLInputElement;
            const file = inputElement.files?.[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = async (e) => {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    //sheet_to_json converts a worksheet object to an array of JSON objects.
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
                    const headerRow = jsonData[0];
                    const dataRows = jsonData.slice(1);

                    const dataArray = dataRows.map((row: string[]) => {
                        const obj: { [key: string]: any } = {};
                        headerRow.forEach((header: string, index: number) => {
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