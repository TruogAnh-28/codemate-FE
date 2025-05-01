<template>
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="pt-6 px-6 text-h5">
          Export Users
        </v-card-title>
        <v-card-text class="px-6 pt-4">
          <v-form ref="form" @submit.prevent="exportData">
            <v-radio-group v-model="exportFormat" label="Export Format" class="mb-4">
              <v-radio label="CSV" value="csv"></v-radio>
              <v-radio label="Excel" value="excel"></v-radio>
            </v-radio-group>
            
            <v-checkbox
              v-model="exportOptions.includeHeaders"
              label="Include headers"
              hide-details
              class="mb-2"
            ></v-checkbox>
            
            <v-checkbox
              v-model="exportOptions.currentFilters"
              label="Apply current filters"
              hide-details
              class="mb-2"
            ></v-checkbox>
            
            <div class="text-caption text-text-secondary mt-4">
              <v-icon size="small" class="mr-1">mdi-information-outline</v-icon>
              {{ exportUsers.length }} users will be exported
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            variant="text"
            @click="closeDialog"
            class="rounded-lg"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="exportData"
            :loading="isExporting"
            class="rounded-lg ml-4"
          >
            Export
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, computed } from "vue";
  import { usersService } from "@/services/usersServices";
  import type { GetAllUsersResponse } from "@/types/User";
  import { utils, writeFile } from "xlsx";
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    users: {
      type: Array as () => GetAllUsersResponse[],
      default: () => [],
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
  });
  
  const emit = defineEmits(["update:show", "export-success", "export-error"]);
  
  const showDialog = computed({
    get: () => props.show,
    set: (value) => emit("update:show", value),
  });
  
  const exportFormat = ref("excel");
  const isExporting = ref(false);
  const form = ref(null);
  
  const exportOptions = ref({
    includeHeaders: true,
    currentFilters: true,
  });
  
  const exportUsers = computed(() => props.users || []);
  
  const closeDialog = () => {
    showDialog.value = false;
  };
  
  const exportData = async () => {
    isExporting.value = true;
    
    try {
      let data;
      
      if (exportOptions.value.currentFilters) {
        // Use the already filtered data from props
        data = exportUsers.value;
      } else {
        // Fetch all users without filters
        const response = await usersService.getAllUsers({});
        data = response.data || [];
      }
      
      // Transform data
      const exportData = data.map(user => ({
        Name: user.name,
        Email: user.email,
        "User ID": user.ms,
        Role: user.role,
        Status: user.status ? "Active" : "Inactive",
      }));
      
      // Export based on selected format
      if (exportFormat.value === "csv") {
        exportToCsv(exportData);
      } else {
        exportToExcel(exportData);
      }
      
      emit("export-success", {
        format: exportFormat.value,
        count: exportData.length,
      });
      
      closeDialog();
    } catch (error) {
      console.error("Error exporting users:", error);
      emit("export-error", error);
    } finally {
      isExporting.value = false;
    }
  };
  
  const exportToCsv = (data: any[]) => {
    // Create CSV content
    const headers = Object.keys(data[0]);
    
    let csvContent = exportOptions.value.includeHeaders
      ? headers.join(",") + "\n"
      : "";
    
    csvContent += data
      .map(row => {
        return headers
          .map(header => {
            // Handle commas in content
            const cellValue = String(row[header]).replace(/"/g, '""');
            return `"${cellValue}"`;
          })
          .join(",");
      })
      .join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, `users_export_${formatDate(new Date())}.csv`);
  };
  
  const exportToExcel = (data: any[]) => {
    // Create workbook and worksheet
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(data, {
      header: Object.keys(data[0]),
      skipHeader: !exportOptions.value.includeHeaders,
    });
    
    // Add worksheet to workbook
    utils.book_append_sheet(workbook, worksheet, "Users");
    
    // Generate and download file
    writeFile(workbook, `users_export_${formatDate(new Date())}.xlsx`);
  };
  
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };
  </script>
  
  <style scoped>
  .rounded-lg {
    border-radius: 12px;
  }
  
  .hover-scale {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .hover-scale:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(33, 55, 54, 0.15);
  }
  </style>