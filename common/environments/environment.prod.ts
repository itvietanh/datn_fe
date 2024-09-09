export const environment = {
  production: true,
  mfe: {
    system: '/system/remoteEntry.js',
    hospital: '/hospital/remoteEntry.js',
  },
  version: {
    shell: '1.0.1',
    accom: '1.0.1',
    system: '1.0.1',
    hospital: '1.0.1',
  },
  baseUrl: '/api/',
  vneid: {
    clientId: 'asm-app',
    authUrl: 'https://ssovneid.teca.vn/',
    logoutUrl: 'https://ssovneid.teca.vn/api/idp/sso/login-actions/logout',
  },
  asmScanner: 'http://localhost:16498/',
  files: {
    asmScanger:
      'https://drive.google.com/drive/folders/170-j6vCHGNgT_eiP6P5vpQp1JCgI0A3j',
    asmHDBarcode:
      'https://benhvien.dancuquocgia.gov.vn/api/files/download-work-file?name=huong-dan-cai-dat-thiet-bi.pdf',
    asmHDSD:
      'https://benhvien.dancuquocgia.gov.vn/api/files/download-work-file?name=ASM-HOSPITAL-HDSD.docx',
  },
};
