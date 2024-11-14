import CSVtype from "@/assets/fileType/CSVtype.vue";
import DefaultType from "@/assets/fileType/DefaultType.vue";
import DOCXtype from "@/assets/fileType/DOCXtype.vue";
import JPGtype from "@/assets/fileType/JPGtype.vue";
import PDFtype from "@/assets/fileType/PDFtype.vue";
import { DocumentType } from "../commonType";
import PPTtype from "@/assets/fileType/PPTtype.vue";
import XLStype from "@/assets/fileType/XLStype.vue";
import TXTtype from "@/assets/fileType/TXTtype.vue";
import MP4type from "@/assets/fileType/MP4type.vue";
import MP3type from "@/assets/fileType/MP3type.vue";
import PNGtype from "@/assets/fileType/PNGtype.vue";

export const renderFileTypeIcon = (fileType: DocumentType) => {
  switch (fileType) {
    case 'JPG':
      return JPGtype;
    case 'CSV':
      return CSVtype;
    case 'PDF':
      return PDFtype;
    case 'DOCX':
    case 'DOC':
      return DOCXtype;
    case 'PPT':
    case 'PPTX':
      return PPTtype;
    case 'XLS':
    case 'XLSX':
      return XLStype;
    case 'TXT':
      return TXTtype;
    case 'MP4':
      return MP4type;
    case 'MP3':
      return MP3type;
    case 'PNG':
      return PNGtype;
    case 'OTHER':
      return DefaultType;
    default:
      return DefaultType;
  }
}

export const renderStatusLabel = (status: string) => {
  switch (status) {
    case 'Ongoing':
      return 'secondary';
    case 'Completed':
      return 'success';
    case 'New':
      return 'primary';
    default:
      return 'primary';
  }
}
