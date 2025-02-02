<template>
    <v-layout>
        <h1>Admin Dashboard</h1>
        <v-main>
            <v-row>
                <v-col cols="8">
                    <v-file-input accept=".xlsx" label="File input (xlsx)" outlined v-model="selectXlsx"
                        show-size></v-file-input>
                </v-col>

                <v-col cols="4">
                    <v-btn color="primary" @click="uploadXlsx" class="mt-3">
                        Upload
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="data.courses.length > 0">
                <v-col cols="12">
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th v-for="(header, index) in data.headers" :key="index">
                                    {{ header }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in data.courses" :key="index">
                                <td v-for="(cell, i) in row" :key="i">{{ cell }}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">
import { ImportData } from "@/types/Course";
import { ExcelFileHeaderToAddCourses, expectedHeaders } from "@/utils/constant";
import * as XLSX from "xlsx";

const selectXlsx = ref<File | null>(null);

const data = ref<ImportData>({
    headers: expectedHeaders,
    courses: [],
});
const showError = inject("showError") as (message: string) => void;
const uploadXlsx = () => {
    if (!selectXlsx.value) {
        showError("Please upload a xlsx file");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
        const bstr = e.target?.result as string;
        const wb = XLSX.read(bstr, { type: "binary" });

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!parsedData.length || parsedData.length === 1) {
            showError("Your file is empty or only contains header");
            return;
        }
        if (!arraysEqual(parsedData[0] as string[], expectedHeaders)) {
            showError(
                "Your column names are not correct: Course ID, Course Name, Credit, Professor Email, Student Email List"
            );
            return;
        }
        if (checkIfEmpty(parsedData as string[][])) {
            showError("Your file is empty or only contains header. Please check again");
            return;
        }

        const removeHeader = parsedData.slice(1);
        data.value.headers = parsedData[0] as ExcelFileHeaderToAddCourses;
        data.value.courses = convertToImportData(removeHeader as string[][]);
        console.log(data.value);
    };
    if (selectXlsx.value) {
        reader.readAsBinaryString(selectXlsx.value);
    }
    selectXlsx.value = null;
};
const arraysEqual = (
    headerFromExcelFile: string[],
    templateHeader: ExcelFileHeaderToAddCourses
) => {
    return (
        headerFromExcelFile.length === templateHeader.length &&
        headerFromExcelFile.every(
            (value, index) => value.trim() === templateHeader[index].trim()
        )
    );
};
const convertToImportData = (data: string[][]) => {
    return data.map((course: string[]) => {
        return {
            courseId: course[0],
            courseName: course[1],
            credit: parseInt(course[2]),
            professorEmail: course[3],
            studentEmailList: course[4].split(",").map((email) => email.trim()),
        };
    });
};
const checkIfEmpty = (data: string[][]) => {
    const removeHeader = data.slice(1);
    const removeEmptyRow = removeHeader.filter((row) => row.length > 0);
    return removeEmptyRow.length === 0;
};
</script>

<style scoped></style>