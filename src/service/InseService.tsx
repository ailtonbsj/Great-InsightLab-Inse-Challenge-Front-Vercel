export const InseService = {
    async getSchoolsData(): Promise<any[]> {
        const res = await fetch("/inse-2021-escolas.json");
        const data = await res.json();
        return data;//.slice(0, 30);
    },
    async getSchoolData(idSchool: string) {
        const data = await this.getSchoolsData();
        return data.find(d => d.ID_ESCOLA === idSchool);
    }
}