export default async function getApiData<T>(url: string): Promise<T[]>  {
    try {
        const response = await fetch(url);
    
        const data: ApiResponse<T> = await response.json();

        let results: T[] = data.results;

        if (data.next) {
            const additionalResults = await getApiData<T>(data.next);
            results = results.concat(additionalResults);
        }

        return results;
    } catch (e) {
        console.log(e)
    }
}