/* eslint-disable @typescript-eslint/no-explicit-any */
export const getLevel = (status: string) => {
    switch (status) {
        case 'Nível I':
            return '#EF4444';
        case 'Nível II':
            return '#f97316';
        case 'Nível III':
            return '#ec4899';
        case 'Nível IV':
            return '#eab308';
        case 'Nível V':
            return '#a855f7';
        case 'Nível VI':
            return '#06b6d4';
        case 'Nível VII':
            return '#0ea5e9';
        case 'Nível VIII':
            return '#22C55E';
    }
};

export const typeNetNames: any = { '1': 'Federal', '2': 'Estadual', '3': 'Municipal' };

export const locationNames: any = { '1': 'Urbana', '2': 'Rural' };