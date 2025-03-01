export function getJSONField(jsonString: string, field: string): any {
    try {
        const jsonObject = JSON.parse(jsonString);

        if (jsonObject.hasOwnProperty(field)) {
            return jsonObject[field];
        } else {
            console.warn(`Field "${field}" not found in JSON.`);
            return undefined;
        }
    } catch (error) {
        console.error("Invalid JSON string:", error);
        return undefined;
    }
}

export function updateJSONField(jsonString: string, field: string, newValue: any): string {
    try {
        const jsonObject = JSON.parse(jsonString);

        if (jsonObject.hasOwnProperty(field)) {
            jsonObject[field] = newValue;
        } else {
            console.warn(`Field "${field}" not found in JSON.`);
        }

        return JSON.stringify(jsonObject);
    } catch (error) {
        console.error("Invalid JSON string:", error);
        return jsonString;
    }
}